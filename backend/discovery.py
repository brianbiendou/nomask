"""Module de découverte — scrape un site d'actualité pour extraire les liens d'articles < 24h."""
import asyncio
import re
from datetime import datetime, timezone, timedelta
from urllib.parse import urljoin, urlparse
from dataclasses import dataclass, field

import aiohttp
from bs4 import BeautifulSoup
from dateutil import parser as dateparser

from config import SCRAPE_HEADERS


@dataclass
class DiscoveredArticle:
    """Lien d'article découvert sur un site source."""
    url: str
    title: str
    published_at: datetime | None = None
    section: str | None = None
    image_url: str | None = None
    is_trending: bool = False
    trending_rank: int | None = None
    comment_count: int | None = None


# ────────────────────────── PROFILS SITES ──────────────────────────

SITE_PROFILES = {
    "numerama.com": {
        "name": "Numerama",
        "feed_urls": [
            "https://www.numerama.com/feed/",
        ],
        "sitemap_urls": [
            "https://www.numerama.com/news-sitemap.xml",
        ],
        "article_pattern": r"numerama\.com/[a-z-]+/\d+-",
        "sections": ["tech", "sciences", "pop-culture", "cyberguerre", "vroom", "politique"],
        "trending_selectors": [
            {"container": "div.most-read, section.most-read, aside.most-read, [class*='plus-lu'], [class*='most-read'], [class*='populaire']", "link": "a"},
            {"container": "div.sidebar__trending, [class*='trending']", "link": "a"},
        ],
    },
    "lefigaro.fr": {
        "name": "Le Figaro",
        "feed_urls": [
            "https://www.lefigaro.fr/rss/figaro_actualites.xml",
            "https://www.lefigaro.fr/rss/figaro_sciences.xml",
            "https://www.lefigaro.fr/rss/figaro_tech.xml",
        ],
        "sitemap_urls": [],
        "article_pattern": r"lefigaro\.fr/.+/\d{8}\.",
        "sections": ["actualite", "sciences", "secteur/high-tech"],
        "trending_selectors": [
            {"container": "[class*='plus-lu'], [class*='most-read'], [class*='populaire'], [class*='tendance']", "link": "a"},
            {"container": ".fig-ranking, .fig-most-read", "link": "a"},
        ],
    },
    "lemonde.fr": {
        "name": "Le Monde",
        "feed_urls": [
            "https://www.lemonde.fr/rss/une.xml",
            "https://www.lemonde.fr/pixels/rss_full.xml",
            "https://www.lemonde.fr/sciences/rss_full.xml",
        ],
        "sitemap_urls": [],
        "article_pattern": r"lemonde\.fr/[a-z-]+/article/",
        "sections": ["une", "pixels", "sciences"],
        "trending_selectors": [
            {"container": "[class*='plus-lu'], [class*='most-read'], [class*='populaire'], [class*='trending']", "link": "a"},
            {"container": ".article__most-read, .most-read", "link": "a"},
        ],
    },
}


def _identify_site(url: str) -> dict | None:
    """Identifie le profil du site à partir de l'URL."""
    hostname = urlparse(url).hostname or ""
    for domain, profile in SITE_PROFILES.items():
        if domain in hostname:
            return profile
    return None


def _is_article_url(url: str, pattern: str) -> bool:
    """Vérifie si l'URL correspond à un article."""
    return bool(re.search(pattern, url))


def _parse_date_safe(date_str: str | None) -> datetime | None:
    """Parse une date de manière robuste."""
    if not date_str:
        return None
    try:
        dt = dateparser.parse(date_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


# ────────────────────────── DISCOVERY VIA RSS ──────────────────────────

async def _discover_from_rss(feed_url: str, session: aiohttp.ClientSession) -> list[DiscoveredArticle]:
    """Parse un flux RSS/Atom et extrait les articles."""
    articles = []
    try:
        async with session.get(feed_url, timeout=aiohttp.ClientTimeout(total=20)) as resp:
            if resp.status != 200:
                print(f"  [RSS] Erreur {resp.status} pour {feed_url}")
                return []
            text = await resp.text()

        soup = BeautifulSoup(text, "xml")

        # RSS 2.0
        for item in soup.find_all("item"):
            link = item.find("link")
            title = item.find("title")
            pub_date = item.find("pubDate")
            description = item.find("description")
            enclosure = item.find("enclosure")
            category = item.find("category")

            url = link.get_text(strip=True) if link else ""
            if not url:
                continue

            dt = _parse_date_safe(pub_date.get_text(strip=True) if pub_date else None)
            img = enclosure.get("url") if enclosure else None

            articles.append(DiscoveredArticle(
                url=url,
                title=title.get_text(strip=True) if title else "",
                published_at=dt,
                section=category.get_text(strip=True) if category else None,
                image_url=img,
            ))

        # Atom
        for entry in soup.find_all("entry"):
            link = entry.find("link")
            title = entry.find("title")
            published = entry.find("published") or entry.find("updated")

            url = link.get("href", "") if link else ""
            if not url:
                continue

            dt = _parse_date_safe(published.get_text(strip=True) if published else None)

            articles.append(DiscoveredArticle(
                url=url,
                title=title.get_text(strip=True) if title else "",
                published_at=dt,
            ))

    except Exception as e:
        print(f"  [RSS] Erreur {feed_url}: {e}")

    return articles


# ────────────────────────── DISCOVERY VIA SITEMAP ──────────────────────────

async def _discover_from_sitemap(sitemap_url: str, session: aiohttp.ClientSession) -> list[DiscoveredArticle]:
    """Parse un sitemap XML (news) pour trouver les articles récents."""
    articles = []
    try:
        async with session.get(sitemap_url, timeout=aiohttp.ClientTimeout(total=20)) as resp:
            if resp.status != 200:
                return []
            text = await resp.text()

        soup = BeautifulSoup(text, "xml")

        for url_tag in soup.find_all("url"):
            loc = url_tag.find("loc")
            lastmod = url_tag.find("lastmod")
            news_title = url_tag.find("news:title") or url_tag.find("title")
            news_date = url_tag.find("news:publication_date") or url_tag.find("publication_date")

            if not loc:
                continue

            url = loc.get_text(strip=True)
            dt = _parse_date_safe(
                (news_date or lastmod).get_text(strip=True) if (news_date or lastmod) else None
            )

            articles.append(DiscoveredArticle(
                url=url,
                title=news_title.get_text(strip=True) if news_title else "",
                published_at=dt,
            ))

    except Exception as e:
        print(f"  [SITEMAP] Erreur {sitemap_url}: {e}")

    return articles


# ────────────────────────── DISCOVERY VIA HOMEPAGE ──────────────────────────

async def _discover_from_homepage(base_url: str, article_pattern: str, session: aiohttp.ClientSession) -> list[DiscoveredArticle]:
    """Scrape la homepage et extrait les liens d'articles."""
    articles = []
    try:
        async with session.get(base_url, timeout=aiohttp.ClientTimeout(total=20)) as resp:
            if resp.status != 200:
                return []
            html = await resp.text()

        soup = BeautifulSoup(html, "html.parser")
        seen = set()

        for a in soup.find_all("a", href=True):
            href = urljoin(base_url, a["href"])
            # Normalise
            href = href.split("?")[0].split("#")[0]

            if href in seen:
                continue
            if not _is_article_url(href, article_pattern):
                continue
            seen.add(href)

            title = a.get_text(strip=True)
            if len(title) < 15:
                # Cherche un titre dans un parent ou enfant
                h = a.find(["h1", "h2", "h3", "h4", "span"])
                if h:
                    title = h.get_text(strip=True)

            img = None
            img_tag = a.find("img")
            if img_tag:
                img = img_tag.get("src") or img_tag.get("data-src")
                if img:
                    img = urljoin(base_url, img)

            if title and len(title) > 15:
                articles.append(DiscoveredArticle(
                    url=href,
                    title=title[:200],
                    image_url=img,
                ))

    except Exception as e:
        print(f"  [HOMEPAGE] Erreur {base_url}: {e}")

    return articles


# ────────────────────────── DISCOVERY VIA TRENDING / LES PLUS LUS ──────────────────────────

# Patterns CSS/classes génériques qu'on retrouve souvent sur les sites d'actu FR
_GENERIC_TRENDING_SELECTORS = [
    # Classes typiques
    "[class*='plus-lu']",
    "[class*='most-read']",
    "[class*='populaire']",
    "[class*='tendance']",
    "[class*='trending']",
    "[class*='top-article']",
    "[class*='ranking']",
    # Headings/sections contenant ces mots
    "section:has(h2:-soup-contains('plus lu'))",
    "section:has(h2:-soup-contains('populaire'))",
    "div:has(h2:-soup-contains('plus lu'))",
    "div:has(h3:-soup-contains('tendance'))",
]

# Mots-clés dans les headings qui signalent une section trending
_TRENDING_KEYWORDS = [
    "plus lu", "les plus lus", "plus consulté", "plus partagé",
    "populaire", "tendance", "trending", "most read", "most popular",
    "top article", "à la une", "buzz", "viral",
]


async def _discover_trending_from_page(
    page_url: str,
    article_pattern: str,
    session: aiohttp.ClientSession,
    trending_selectors: list[dict] | None = None,
) -> list[DiscoveredArticle]:
    """
    Scrape la page pour trouver les articles les plus lus / trending.
    Stratégie :
    1. Tente les selectors CSS spécifiques au site (trending_selectors)
    2. Tente les selectors CSS génériques (_GENERIC_TRENDING_SELECTORS)
    3. En fallback, cherche les headings contenant des mots-clés trending
       et récupère les liens dans leur section parent.
    """
    articles = []
    try:
        async with session.get(page_url, timeout=aiohttp.ClientTimeout(total=25)) as resp:
            if resp.status != 200:
                return []
            html = await resp.text()

        soup = BeautifulSoup(html, "html.parser")
        seen = set()
        rank = 0

        def _extract_articles_from_container(container) -> list[DiscoveredArticle]:
            nonlocal rank
            results = []
            for a in container.find_all("a", href=True):
                href = urljoin(page_url, a["href"])
                href = href.split("?")[0].split("#")[0]
                if href in seen:
                    continue
                if not _is_article_url(href, article_pattern):
                    continue
                seen.add(href)
                rank += 1

                title = a.get_text(strip=True)
                if len(title) < 10:
                    h = a.find(["h1", "h2", "h3", "h4", "span"])
                    if h:
                        title = h.get_text(strip=True)

                if title and len(title) > 10:
                    results.append(DiscoveredArticle(
                        url=href,
                        title=title[:200],
                        is_trending=True,
                        trending_rank=rank,
                    ))
            return results

        # 1) Selectors spécifiques au site
        if trending_selectors:
            for sel in trending_selectors:
                try:
                    containers = soup.select(sel["container"])
                    for container in containers:
                        articles.extend(_extract_articles_from_container(container))
                except Exception:
                    pass

        # 2) Selectors génériques
        if not articles:
            for selector in _GENERIC_TRENDING_SELECTORS:
                try:
                    containers = soup.select(selector)
                    for container in containers:
                        articles.extend(_extract_articles_from_container(container))
                except Exception:
                    pass

        # 3) Fallback: chercher headings avec mots-clés trending
        if not articles:
            for heading in soup.find_all(["h2", "h3", "h4"]):
                heading_text = heading.get_text(strip=True).lower()
                if any(kw in heading_text for kw in _TRENDING_KEYWORDS):
                    # Prend la section parente
                    parent = heading.parent
                    if parent:
                        articles.extend(_extract_articles_from_container(parent))
                    break  # On prend la première section trending trouvée

        # 4) Dernier fallback: chercher <ol> ou listes numérotées dans les sidebars
        if not articles:
            for sidebar in soup.select("aside, [class*='sidebar'], [role='complementary']"):
                for ol in sidebar.find_all("ol"):
                    articles.extend(_extract_articles_from_container(ol))

        if articles:
            print(f"  [TRENDING] {len(articles)} articles trending trouvés sur {page_url}")
        else:
            print(f"  [TRENDING] Aucune section trending détectée sur {page_url}")

    except Exception as e:
        print(f"  [TRENDING] Erreur {page_url}: {e}")

    return articles


async def _extract_comment_count(url: str, session: aiohttp.ClientSession) -> int | None:
    """Tente d'extraire le nombre de commentaires d'un article."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status != 200:
                return None
            html = await resp.text()

        soup = BeautifulSoup(html, "html.parser")

        # Patterns courants pour les compteurs de commentaires
        # 1) Meta ou data attributes
        for tag in soup.find_all(attrs={"data-comment-count": True}):
            try:
                return int(tag["data-comment-count"])
            except (ValueError, TypeError):
                pass

        # 2) Texte contenant "X commentaire(s)"
        comment_pattern = re.compile(r'(\d+)\s*(?:commentaire|réaction|comment)', re.I)
        for tag in soup.find_all(["span", "a", "div", "p"], string=comment_pattern):
            match = comment_pattern.search(tag.get_text())
            if match:
                return int(match.group(1))

        # 3) Classe contenant "comment-count"
        for tag in soup.select("[class*='comment-count'], [class*='nb-comment'], [class*='reaction-count']"):
            text = tag.get_text(strip=True)
            nums = re.findall(r'\d+', text)
            if nums:
                return int(nums[0])

    except Exception:
        pass
    return None


# ────────────────────────── FILTER < 24H ──────────────────────────

def _filter_recent(articles: list[DiscoveredArticle], hours: int = 24) -> list[DiscoveredArticle]:
    """Garde uniquement les articles publiés dans les N dernières heures."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    recent = []

    for a in articles:
        if a.published_at and a.published_at >= cutoff:
            recent.append(a)
        elif a.published_at is None:
            # Pas de date → on inclut quand même (découverte via homepage)
            recent.append(a)

    return recent


def _deduplicate(articles: list[DiscoveredArticle]) -> list[DiscoveredArticle]:
    """Déduplique par URL."""
    seen = set()
    unique = []
    for a in articles:
        normalized = a.url.split("?")[0].rstrip("/")
        if normalized not in seen:
            seen.add(normalized)
            unique.append(a)
    return unique


# ────────────────────────── API PUBLIQUE ──────────────────────────

async def discover_articles(
    site_url: str,
    max_hours: int = 24,
) -> list[DiscoveredArticle]:
    """
    Découvre les articles publiés dans les dernières `max_hours` heures
    sur le site donné. Combine RSS + sitemap + homepage.

    Args:
        site_url: URL du site (ex: "https://www.numerama.com")
        max_hours: Nombre d'heures max depuis la publication

    Returns:
        Liste de DiscoveredArticle triée par date (plus récent en premier)
    """
    profile = _identify_site(site_url)

    # Si profil inconnu, on tente la homepage directement
    if not profile:
        print(f"[DISCOVERY] Site inconnu, scraping homepage: {site_url}")
        profile = {
            "name": urlparse(site_url).hostname or "Inconnu",
            "feed_urls": [],
            "sitemap_urls": [],
            "article_pattern": r"/\d{4}/|/article/|/\d+-[a-z]",
            "sections": [],
        }

    print(f"\n[DISCOVERY] {profile['name']} — recherche articles < {max_hours}h")

    all_articles = []

    async with aiohttp.ClientSession(headers=SCRAPE_HEADERS) as session:
        tasks = []

        # RSS
        for feed_url in profile.get("feed_urls", []):
            print(f"  [RSS] {feed_url}")
            tasks.append(_discover_from_rss(feed_url, session))

        # Sitemaps
        for sitemap_url in profile.get("sitemap_urls", []):
            print(f"  [SITEMAP] {sitemap_url}")
            tasks.append(_discover_from_sitemap(sitemap_url, session))

        # Homepage
        print(f"  [HOMEPAGE] {site_url}")
        tasks.append(_discover_from_homepage(site_url, profile["article_pattern"], session))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for r in results:
            if isinstance(r, list):
                all_articles.extend(r)
            elif isinstance(r, Exception):
                print(f"  [ERREUR] {r}")

    # Déduplique
    all_articles = _deduplicate(all_articles)
    print(f"  {len(all_articles)} articles uniques trouvés")

    # Filtre < 24h
    recent = _filter_recent(all_articles, max_hours)
    print(f"  {len(recent)} articles < {max_hours}h")

    # Trie par date (plus récent en premier)
    recent.sort(key=lambda a: a.published_at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)

    return recent


async def discover_and_return_urls(site_url: str, max_hours: int = 24) -> list[str]:
    """Découvre les articles et retourne juste les URLs."""
    articles = await discover_articles(site_url, max_hours)
    return [a.url for a in articles]


# ────────────────────────── TRENDING API ──────────────────────────

async def discover_trending(
    site_url: str,
    max_articles: int = 10,
    include_comments: bool = False,
) -> list[DiscoveredArticle]:
    """
    Découvre les articles les plus populaires / trending d'un site.

    Args:
        site_url: URL du site (ex: "https://www.numerama.com")
        max_articles: Nombre max d'articles à retourner
        include_comments: Si True, scrape aussi le nombre de commentaires (plus lent)

    Returns:
        Liste de DiscoveredArticle triée par trending_rank
    """
    profile = _identify_site(site_url)

    if not profile:
        profile = {
            "name": urlparse(site_url).hostname or "Inconnu",
            "feed_urls": [],
            "sitemap_urls": [],
            "article_pattern": r"/\d{4}/|/article/|/\d+-[a-z]",
            "sections": [],
            "trending_selectors": None,
        }

    print(f"\n[TRENDING] {profile['name']} — recherche articles populaires")

    # Headers enrichis avec cookies de consentement pour passer les murs de cookies
    consent_headers = {
        **SCRAPE_HEADERS,
        "Cookie": "euconsent-v2=true; didomi_token=1; consentUUID=1; _sp_v1_consent=1:1:1; OptanonAlertBoxClosed=2024-01-01T00:00:00.000Z",
    }

    async with aiohttp.ClientSession(headers=consent_headers) as session:
        articles = await _discover_trending_from_page(
            site_url,
            profile["article_pattern"],
            session,
            profile.get("trending_selectors"),
        )

        # Fallback RSS si le scraping trending n'a rien trouvé
        if not articles and profile.get("feed_urls"):
            print(f"  [TRENDING] Scraping échoué, fallback RSS pour {profile['name']}")
            for feed_url in profile["feed_urls"]:
                rss_articles = await _discover_from_rss(feed_url, session)
                for i, art in enumerate(rss_articles):
                    art.is_trending = True
                    art.trending_rank = i + 1
                articles.extend(rss_articles)
                if articles:
                    break  # Un seul feed suffit

        # Limiter
        articles = articles[:max_articles]

        # Optionnel: enrichir avec le nombre de commentaires
        if include_comments and articles:
            print(f"  [TRENDING] Extraction des commentaires pour {len(articles)} articles...")
            sem = asyncio.Semaphore(3)

            async def _get_comments(art: DiscoveredArticle):
                async with sem:
                    art.comment_count = await _extract_comment_count(art.url, session)

            await asyncio.gather(*[_get_comments(a) for a in articles])

    print(f"  [TRENDING] {len(articles)} articles trending retournés")
    return articles


async def discover_trending_multi(
    site_urls: list[str],
    max_per_site: int = 5,
    include_comments: bool = False,
) -> dict[str, list[DiscoveredArticle]]:
    """
    Découvre les articles trending de plusieurs sites en parallèle.

    Returns:
        Dict {site_url: [DiscoveredArticle, ...]}
    """
    results = {}

    async def _discover_one(url: str):
        arts = await discover_trending(url, max_per_site, include_comments)
        results[url] = arts

    await asyncio.gather(*[_discover_one(u) for u in site_urls])
    return results
