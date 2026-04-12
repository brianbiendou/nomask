"""Module Supabase — pousse les articles en base de données."""
from datetime import datetime, timezone

from supabase import create_client

from config import SUPABASE_URL, SUPABASE_SERVICE_KEY, SITE_URL

# Nombre maximum d'articles en base — les plus anciens sont purgés automatiquement
MAX_ARTICLES = 500


def _get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_categories() -> dict[str, str]:
    """Retourne un dict {slug: id} des catégories."""
    sb = _get_supabase()
    result = sb.table("categories").select("id, slug").execute()
    return {r["slug"]: r["id"] for r in result.data}


def get_authors() -> dict[str, str]:
    """Retourne un dict {slug: id} des auteurs."""
    sb = _get_supabase()
    result = sb.table("authors").select("id, slug").execute()
    return {r["slug"]: r["id"] for r in result.data}


def get_subcategories() -> dict[str, dict]:
    """Retourne les sous-catégories {slug: {id, category_id}}."""
    sb = _get_supabase()
    result = sb.table("subcategories").select("id, slug, category_id").execute()
    return {r["slug"]: {"id": r["id"], "category_id": r["category_id"]} for r in result.data}


def article_exists(slug: str, locale: str = "fr") -> bool:
    """Vérifie si un article avec ce slug existe déjà."""
    sb = _get_supabase()
    result = sb.table("articles").select("id").eq("slug", slug).eq("locale", locale).execute()
    return len(result.data) > 0


def delete_article_by_slug(slug: str, locale: str = "fr") -> bool:
    """Supprime un article par slug pour permettre la republication."""
    sb = _get_supabase()
    try:
        result = sb.table("articles").delete().eq("slug", slug).eq("locale", locale).execute()
        if result.data:
            print(f"  [DEL] Article supprimé: {slug}")
            return True
        return False
    except Exception as e:
        print(f"  [ERREUR] Suppression '{slug}': {e}")
        return False


def publish_article(
    title: str,
    slug: str,
    excerpt: str,
    content: str,
    image_url: str | None,
    image_caption: str | None,
    category_id: str,
    author_id: str,
    subcategory_id: str | None = None,
    tags: list[str] | None = None,
    seo_title: str | None = None,
    seo_description: str | None = None,
    seo_keywords: list[str] | None = None,
    is_featured: bool = False,
    is_breaking: bool = False,
    read_time: int = 5,
    published_at: str | None = None,
) -> dict | None:
    """Insère un article dans Supabase et retourne l'article créé."""
    sb = _get_supabase()

    if article_exists(slug):
        print(f"  [SKIP] Article '{slug}' existe déjà.")
        return None

    now = published_at or datetime.now(timezone.utc).isoformat()

    article_data = {
        "title": title,
        "slug": slug,
        "excerpt": excerpt,
        "content": content,
        "image_url": image_url,
        "image_caption": image_caption,
        "category_id": category_id,
        "author_id": author_id,
        "subcategory_id": subcategory_id,
        "locale": "fr",
        "status": "published",
        "is_featured": is_featured,
        "is_breaking": is_breaking,
        "read_time": read_time,
        "published_at": now,
        "seo_title": seo_title or title,
        "seo_description": seo_description or excerpt[:160],
        "seo_keywords": seo_keywords or tags or [],
    }

    try:
        result = sb.table("articles").insert(article_data).execute()
        if result.data:
            print(f"  [OK] Article publié: {title[:60]}...")
            # Ping IndexNow pour indexation rapide
            try:
                import asyncio
                from indexnow import ping_indexnow
                article_url = f"{SITE_URL}/{slug}"
                loop = asyncio.get_event_loop()
                loop.create_task(ping_indexnow(article_url))
            except RuntimeError:
                # Pas de boucle active — lancer dans un thread
                import asyncio
                from indexnow import ping_indexnow
                article_url = f"{SITE_URL}/{slug}"
                asyncio.run(ping_indexnow(article_url))
            except Exception:
                pass  # Ne jamais bloquer la publication
            # Purge automatique des plus anciens si on dépasse le cap
            enforce_max_articles()
            return result.data[0]
        return None
    except Exception as e:
        print(f"  [ERREUR] Publication '{slug}': {e}")
        return None


def estimate_read_time(text: str) -> int:
    """Estime le temps de lecture en minutes."""
    words = len(text.split())
    return max(2, round(words / 200))


def enforce_max_articles(locale: str = "fr") -> int:
    """
    Supprime les articles les plus anciens si le total dépasse MAX_ARTICLES.
    Retourne le nombre d'articles supprimés.
    """
    sb = _get_supabase()

    # Compter le nombre total d'articles publiés
    count_result = sb.table("articles").select("id", count="exact").eq("locale", locale).eq("status", "published").execute()
    total = count_result.count if count_result.count is not None else len(count_result.data)

    if total <= MAX_ARTICLES:
        return 0

    overflow = total - MAX_ARTICLES
    print(f"  [PURGE] {total} articles en base (max {MAX_ARTICLES}), suppression des {overflow} plus anciens...")

    # Récupérer les IDs des articles les plus anciens à supprimer
    oldest = sb.table("articles") \
        .select("id, slug, published_at") \
        .eq("locale", locale) \
        .eq("status", "published") \
        .order("published_at", desc=False) \
        .limit(overflow) \
        .execute()

    deleted = 0
    for article in oldest.data:
        try:
            sb.table("articles").delete().eq("id", article["id"]).execute()
            print(f"  [PURGE] Supprimé: {article['slug']}")
            deleted += 1
        except Exception as e:
            print(f"  [PURGE] Erreur suppression {article['slug']}: {e}")

    print(f"  [PURGE] {deleted}/{overflow} articles anciens supprimés")
    return deleted
