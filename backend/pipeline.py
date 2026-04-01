"""Orchestrateur parallèle — pipeline complet de scraping → publication."""
import asyncio
from datetime import datetime, timezone, timedelta

from scraper import ScrapedArticle, scrape_batch
from image_handler import process_images, replace_image_urls, ensure_bucket_exists, extract_content_images, inject_images_into_content
from rewriter import rewrite_content, rewrite_title, rewrite_excerpt, generate_slug
from publisher import (
    get_categories,
    get_authors,
    get_subcategories,
    publish_article,
    article_exists,
    delete_article_by_slug,
    estimate_read_time,
)
from config import MAX_CONCURRENT_SCRAPES


# Mapping catégories scrappées → slug catégorie Supabase
CATEGORY_MAP = {
    "tech": "tech",
    "science": "science",
    "culture": "culture",
    "politique": "politique",
    "economie": "economie",
    "international": "international",
    "societe": "societe",
    "sport": "sport",
    "style": "style",
}

# Sous-catégorie hints depuis l'URL ou tags
SUBCATEGORY_HINTS = {
    "cybersecurite": "cybersecurite",
    "cyberguerre": "cybersecurite",
    "intelligence-artificielle": "intelligence-artificielle",
    "smartphones": "smartphones",
    "espace": "espace",
    "reseaux-sociaux": "reseaux-sociaux",
    "streaming": None,
    "svod": None,
    "jeux-video": None,
}


async def process_single_article(
    scraped: ScrapedArticle,
    categories: dict[str, str],
    authors: dict[str, str],
    subcategories: dict[str, dict],
    perspective: str,
    publish_offset_hours: float = 0,
    force: bool = False,
) -> dict | None:
    """Traite un article scrappé : images → réécriture → publication."""

    print(f"\n{'='*60}")
    print(f"[PIPELINE] {scraped.title[:70]}...")
    print(f"  URL: {scraped.url}")

    # 1. Déterminer la catégorie
    cat_slug = CATEGORY_MAP.get(scraped.category_hint or "", "tech")
    if cat_slug not in categories:
        cat_slug = "tech"  # Fallback
    category_id = categories[cat_slug]
    print(f"  Catégorie: {cat_slug}")

    # 2. Réécrire titre et contenu via Ollama
    print(f"  [IA] Réécriture du titre...")
    new_title, title_ollama = rewrite_title(scraped.title, perspective)
    new_slug = generate_slug(new_title)

    # Vérifier si existe déjà
    if article_exists(new_slug):
        if force:
            print(f"  [FORCE] Suppression de l'ancien article: {new_slug}")
            delete_article_by_slug(new_slug)
        else:
            print(f"  [SKIP] Article déjà publié: {new_slug}")
            return None

    print(f"  [IA] Réécriture de l'extrait...")
    new_excerpt, excerpt_ollama = rewrite_excerpt(scraped.excerpt, perspective)
    print(f"  [IA] Réécriture du contenu (peut prendre ~1min)...")
    # Extraire les images du contenu original AVANT la réécriture
    original_image_blocks = extract_content_images(scraped.content_html)
    print(f"  {len(original_image_blocks)} images trouvées dans le contenu original")
    new_content, content_ollama = rewrite_content(scraped.content_html, scraped.content_text, perspective)
    # Réinjecter les images originales dans le contenu réécrit
    if original_image_blocks:
        new_content = inject_images_into_content(new_content, original_image_blocks)
        print(f"  Images réinjectées dans le contenu réécrit")
    print(f"  Nouveau titre: {new_title[:70]}...")

    # 3. Traiter les images en parallèle
    print(f"  Traitement de {len(scraped.image_urls)} images...")
    url_map = await process_images(scraped.image_urls, new_slug)
    print(f"  {len(url_map)} images uploadées sur Supabase Storage")

    # 4. Remplacer les URLs d'images dans le contenu
    new_content = replace_image_urls(new_content, url_map)

    # Image principale
    main_image = None
    if scraped.main_image_url and scraped.main_image_url in url_map:
        main_image = url_map[scraped.main_image_url]
    elif url_map:
        main_image = next(iter(url_map.values()))

    # 5. Choisir un auteur (rotation)
    author_slugs = list(authors.keys())
    if author_slugs:
        import hashlib
        h = int(hashlib.md5(new_slug.encode()).hexdigest()[:8], 16)
        author_id = authors[author_slugs[h % len(author_slugs)]]
    else:
        author_id = next(iter(authors.values()))

    # 6. Sous-catégorie
    subcategory_id = None
    for tag in scraped.tags:
        tag_slug = tag.lower().replace(" ", "-").replace("é", "e").replace("è", "e")
        if tag_slug in subcategories:
            sub = subcategories[tag_slug]
            if sub["category_id"] == category_id:
                subcategory_id = sub["id"]
                break

    # 7. Temps de lecture
    read_time = estimate_read_time(scraped.content_text)

    # 8. Date de publication (décalée pour l'ordre)
    pub_date = datetime.now(timezone.utc) - timedelta(hours=publish_offset_hours)

    # 9. Publier !
    result = publish_article(
        title=new_title,
        slug=new_slug,
        excerpt=new_excerpt,
        content=new_content,
        image_url=main_image,
        image_caption=None,
        category_id=category_id,
        author_id=author_id,
        subcategory_id=subcategory_id,
        tags=scraped.tags,
        seo_title=new_title,
        seo_description=new_excerpt[:160],
        seo_keywords=scraped.tags[:5] if scraped.tags else None,
        read_time=read_time,
        published_at=pub_date.isoformat(),
    )

    # Ajouter les infos Ollama au résultat
    ollama_used = title_ollama and excerpt_ollama and content_ollama
    result["ollamaUsed"] = ollama_used
    result["ollamaDetail"] = {
        "title": title_ollama,
        "excerpt": excerpt_ollama,
        "content": content_ollama,
    }

    return result


async def run_pipeline(
    urls: list[str],
    perspective: str = "neutre et factuel",
    force: bool = False,
) -> list[dict]:
    """
    Pipeline complet :
    1. Scrape tous les articles en parallèle
    2. Traite chaque article (images + réécriture + publication)
    Les articles les plus récents dans la liste auront le published_at le plus récent.
    """
    print(f"\n{'#'*60}")
    print(f"# NoMask Pipeline — {len(urls)} articles")
    print(f"# Perspective: {perspective}")
    print(f"{'#'*60}")

    # S'assurer que le bucket existe
    ensure_bucket_exists()

    # Charger les référentiels Supabase
    print("\n[INIT] Chargement des catégories et auteurs...")
    categories = get_categories()
    authors = get_authors()
    subcategories = get_subcategories()
    print(f"  {len(categories)} catégories, {len(authors)} auteurs, {len(subcategories)} sous-catégories")

    # Étape 1 : Scraping parallèle
    print(f"\n[SCRAPE] Scraping de {len(urls)} articles...")
    scraped_articles = await scrape_batch(urls, max_concurrent=MAX_CONCURRENT_SCRAPES)
    print(f"  {len(scraped_articles)} articles scrappés avec succès")

    # Étape 2 : Traitement séquentiel pour respecter l'ordre de publication
    # L'article en position 0 = le plus récent (published_at NOW)
    # L'article en position N = le plus ancien (published_at NOW - N*0.5h)
    results = []
    for i, scraped in enumerate(scraped_articles):
        offset = i * 0.5  # 30 min d'écart entre chaque article
        result = await process_single_article(
            scraped=scraped,
            categories=categories,
            authors=authors,
            subcategories=subcategories,
            perspective=perspective,
            publish_offset_hours=offset,
            force=force,
        )
        if result:
            results.append(result)

    print(f"\n{'#'*60}")
    print(f"# TERMINÉ — {len(results)}/{len(urls)} articles publiés")
    print(f"{'#'*60}\n")

    return results
