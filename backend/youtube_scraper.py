"""Scraper YouTube — récupère titres + miniatures via le flux RSS Atom natif."""
import re
import logging
from dataclasses import dataclass
from xml.etree import ElementTree

import aiohttp

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9",
    "Cookie": "SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjUwMzMwLjA4X3AxGgJmciACGgYIgOCstgY; CONSENT=PENDING+987",
}

# Namespace Atom utilisé par YouTube
ATOM_NS = "{http://www.w3.org/2005/Atom}"
MEDIA_NS = "{http://search.yahoo.com/mrss/}"


@dataclass
class YouTubeVideo:
    video_id: str
    title: str
    thumbnail_url: str
    published_at: str | None = None


async def _resolve_channel_id(channel_url: str) -> str | None:
    """Extrait le channel_id depuis la page HTML de la chaîne (meta tag)."""
    url = channel_url.rstrip("/").split("/videos")[0]  # page principale
    try:
        async with aiohttp.ClientSession(headers=HEADERS) as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                if resp.status != 200:
                    logger.warning("Channel page %d for %s", resp.status, url)
                    return None
                html = await resp.text()
    except Exception as e:
        logger.error("Erreur fetch channel page %s : %s", url, e)
        return None

    # Chercher dans les meta tags : <meta itemprop="channelId" content="UC...">
    m = re.search(r'<meta\s[^>]*itemprop="channelId"[^>]*content="([^"]+)"', html)
    if m:
        return m.group(1)

    # Fallback : chercher dans le lien canonical ou externalId dans le JSON
    m = re.search(r'"externalId"\s*:\s*"(UC[^"]+)"', html)
    if m:
        return m.group(1)

    # Fallback 2 : chercher channel_id dans <link rel="alternate" ... href="...channel_id=...">
    m = re.search(r'channel_id=([A-Za-z0-9_-]+)', html)
    if m:
        return m.group(1)

    logger.warning("channel_id introuvable pour %s", url)
    return None


async def fetch_channel_videos(channel_url: str, max_videos: int = 10) -> list[YouTubeVideo]:
    """Récupère les N dernières vidéos d'une chaîne via le flux RSS Atom.

    Étapes :
    1. Résoudre channel_id depuis la page de la chaîne
    2. Fetch le flux RSS : https://www.youtube.com/feeds/videos.xml?channel_id=...
    3. Parser le XML Atom → titres + video_id → miniatures
    """
    # 1. Résoudre le channel_id
    channel_id = await _resolve_channel_id(channel_url)
    if not channel_id:
        logger.error("Impossible de résoudre channel_id pour %s", channel_url)
        return []

    logger.info("[YT] channel_id résolu : %s pour %s", channel_id, channel_url)

    # 2. Fetch le flux RSS Atom
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    try:
        async with aiohttp.ClientSession(headers=HEADERS) as session:
            async with session.get(rss_url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                if resp.status != 200:
                    logger.warning("RSS feed %d for %s", resp.status, rss_url)
                    return []
                xml_text = await resp.text()
    except Exception as e:
        logger.error("Erreur fetch RSS %s : %s", rss_url, e)
        return []

    # 3. Parser le XML
    return _parse_rss(xml_text, max_videos)


def _parse_rss(xml_text: str, max_videos: int) -> list[YouTubeVideo]:
    """Parse le flux Atom YouTube et retourne les vidéos."""
    try:
        root = ElementTree.fromstring(xml_text)
    except ElementTree.ParseError as e:
        logger.error("Erreur XML parse : %s", e)
        return []

    videos: list[YouTubeVideo] = []

    for entry in root.findall(f"{ATOM_NS}entry"):
        if len(videos) >= max_videos:
            break

        # video_id depuis <yt:videoId>
        vid_el = entry.find("{http://www.youtube.com/xml/schemas/2015}videoId")
        if vid_el is None or not vid_el.text:
            continue
        video_id = vid_el.text.strip()

        # Titre
        title_el = entry.find(f"{ATOM_NS}title")
        title = title_el.text.strip() if title_el is not None and title_el.text else "Sans titre"

        # Miniature haute qualité (format standard YouTube)
        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

        # Date de publication
        pub_el = entry.find(f"{ATOM_NS}published")
        published_at = pub_el.text.strip() if pub_el is not None and pub_el.text else None

        videos.append(YouTubeVideo(
            video_id=video_id,
            title=title,
            thumbnail_url=thumbnail_url,
            published_at=published_at,
        ))

    logger.info("[YT] RSS : %d vidéos extraites", len(videos))
    return videos
