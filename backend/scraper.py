"""Module de scraping — extrait contenu + images d'un article web."""
import asyncio
import re
from urllib.parse import urljoin, urlparse
from dataclasses import dataclass, field

import aiohttp
from bs4 import BeautifulSoup
from readability import Document

from config import SCRAPE_HEADERS


@dataclass
class ScrapedArticle:
    """Résultat brut du scraping d'un article."""
    url: str
    title: str
    excerpt: str
    content_html: str
    content_text: str
    image_urls: list[str] = field(default_factory=list)
    main_image_url: str | None = None
    author: str | None = None
    published_date: str | None = None
    category_hint: str | None = None
    tags: list[str] = field(default_factory=list)


def _extract_meta(soup: BeautifulSoup, url: str) -> dict:
    """Extrait les métadonnées Open Graph et <meta> classiques."""
    meta = {}

    # Open Graph
    for prop in ["og:title", "og:description", "og:image", "article:published_time", "article:author", "article:tag", "article:section"]:
        tag = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
        if tag and tag.get("content"):
            meta[prop] = tag["content"]

    # Twitter card fallback
    for name in ["twitter:title", "twitter:description", "twitter:image"]:
        tag = soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            meta.setdefault(name.replace("twitter:", "og:"), tag["content"])

    # description classique
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta.setdefault("og:description", desc_tag["content"])

    return meta


def _extract_images(soup: BeautifulSoup, base_url: str, content_html: str) -> list[str]:
    """Extrait toutes les images de l'article (contenu + figure)."""
    seen = set()
    images = []

    content_soup = BeautifulSoup(content_html, "html.parser")

    for img in content_soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if not src:
            continue
        src = urljoin(base_url, src)
        # Filtre les trackers, pixels, icons
        if any(x in src.lower() for x in ["pixel", "tracker", "1x1", ".gif", "spacer", "icon", "logo", "avatar", "badge"]):
            continue
        if src not in seen:
            seen.add(src)
            images.append(src)

    # Aussi les <figure> dans l'article originel
    article_tag = soup.find("article") or soup.find("div", class_=re.compile(r"article|post|content|entry", re.I))
    if article_tag:
        for fig in article_tag.find_all("figure"):
            img = fig.find("img")
            if img:
                src = img.get("src") or img.get("data-src")
                if src:
                    src = urljoin(base_url, src)
                    if src not in seen:
                        seen.add(src)
                        images.append(src)

    return images


def _guess_category(url: str, meta: dict, title: str) -> str | None:
    """Devine la catégorie depuis l'URL ou les métadonnées."""
    section = meta.get("article:section", "").lower()

    # Mapping Numerama / sites FR communs
    mapping = {
        "tech": "tech",
        "cybersécurité": "tech",
        "cyberguerre": "tech",
        "sécurité informatique": "tech",
        "intelligence artificielle": "tech",
        "smartphones": "tech",
        "sciences": "science",
        "espace": "science",
        "pop-culture": "culture",
        "pop culture": "culture",
        "gaming": "culture",
        "jeux vidéo": "culture",
        "jeux video": "culture",
        "streaming": "culture",
        "svod": "culture",
        "vroom": "tech",
        "politique": "politique",
        "sport": "sport",
        "économie": "economie",
        "economie": "economie",
        "société": "societe",
        "societe": "societe",
        "international": "international",
        "style": "style",
    }

    if section and section in mapping:
        return mapping[section]

    # Depuis l'URL path
    path = urlparse(url).path.lower()
    for key, cat in mapping.items():
        if key.replace(" ", "-") in path or key.replace("é", "e") in path:
            return cat

    return None


async def scrape_article(url: str, session: aiohttp.ClientSession | None = None) -> ScrapedArticle:
    """Scrape un article depuis son URL. Retourne un ScrapedArticle."""
    own_session = session is None
    if own_session:
        session = aiohttp.ClientSession(headers=SCRAPE_HEADERS)

    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as resp:
            resp.raise_for_status()
            html = await resp.text()

        # Readability pour le contenu principal
        doc = Document(html)
        content_html = doc.summary()

        soup = BeautifulSoup(html, "html.parser")
        meta = _extract_meta(soup, url)

        # Titre
        title = meta.get("og:title") or doc.short_title() or ""
        title = title.strip()

        # Excerpt
        excerpt = meta.get("og:description", "")
        if not excerpt:
            content_soup = BeautifulSoup(content_html, "html.parser")
            first_p = content_soup.find("p")
            excerpt = first_p.get_text(strip=True)[:300] if first_p else ""

        # Texte brut
        content_soup = BeautifulSoup(content_html, "html.parser")
        content_text = content_soup.get_text(separator="\n", strip=True)

        # Images
        images = _extract_images(soup, url, content_html)
        main_image = meta.get("og:image")
        if main_image:
            main_image = urljoin(url, main_image)
            if main_image not in images:
                images.insert(0, main_image)

        # Catégorie
        category_hint = _guess_category(url, meta, title)

        # Tags
        tags = []
        for tag_meta in soup.find_all("meta", property="article:tag"):
            if tag_meta.get("content"):
                tags.append(tag_meta["content"])

        # Date de publication
        published = meta.get("article:published_time")
        if not published:
            time_tag = soup.find("time", attrs={"datetime": True})
            if time_tag:
                published = time_tag["datetime"]

        return ScrapedArticle(
            url=url,
            title=title,
            excerpt=excerpt,
            content_html=content_html,
            content_text=content_text,
            image_urls=images,
            main_image_url=main_image or (images[0] if images else None),
            author=meta.get("article:author"),
            published_date=published,
            category_hint=category_hint,
            tags=tags,
        )
    finally:
        if own_session and session:
            await session.close()


async def scrape_batch(urls: list[str], max_concurrent: int = 5) -> list[ScrapedArticle]:
    """Scrape plusieurs articles en parallèle."""
    sem = asyncio.Semaphore(max_concurrent)

    async def _scrape_one(url: str, session: aiohttp.ClientSession) -> ScrapedArticle | None:
        async with sem:
            try:
                return await scrape_article(url, session)
            except Exception as e:
                print(f"[ERREUR] Scraping {url}: {e}")
                return None

    async with aiohttp.ClientSession(headers=SCRAPE_HEADERS) as session:
        tasks = [_scrape_one(u, session) for u in urls]
        results = await asyncio.gather(*tasks)

    return [r for r in results if r is not None]
