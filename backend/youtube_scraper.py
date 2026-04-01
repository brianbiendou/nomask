"""Scraper YouTube — récupère titres + miniatures des dernières vidéos d'une chaîne."""
import re
import json
import logging
from dataclasses import dataclass

import aiohttp

logger = logging.getLogger(__name__)

YOUTUBE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
}


@dataclass
class YouTubeVideo:
    video_id: str
    title: str
    thumbnail_url: str
    published_at: str | None = None


async def fetch_channel_videos(channel_url: str, max_videos: int = 10) -> list[YouTubeVideo]:
    """Récupère les N dernières vidéos d'une chaîne YouTube (scraping HTML).

    On parse le JSON initial embarqué dans la page /videos pour extraire
    les videoId, title et thumbnail sans API key.
    """
    # S'assurer qu'on tape la page /videos
    url = channel_url.rstrip("/")
    if not url.endswith("/videos"):
        url += "/videos"

    try:
        async with aiohttp.ClientSession(headers=YOUTUBE_HEADERS) as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=20)) as resp:
                if resp.status != 200:
                    logger.warning("YouTube returned %d for %s", resp.status, url)
                    return []
                html = await resp.text()
    except Exception as e:
        logger.error("Erreur fetch YouTube %s : %s", url, e)
        return []

    return _parse_videos_from_html(html, max_videos)


def _parse_videos_from_html(html: str, max_videos: int) -> list[YouTubeVideo]:
    """Extrait les vidéos du JSON ytInitialData embarqué dans le HTML."""
    # Trouver le blob JSON ytInitialData
    match = re.search(r"var ytInitialData\s*=\s*(\{.*?\});\s*</script>", html, re.DOTALL)
    if not match:
        # Essayer variante sans var
        match = re.search(r"ytInitialData\s*=\s*(\{.*?\});\s*</script>", html, re.DOTALL)
    if not match:
        logger.warning("ytInitialData introuvable dans le HTML YouTube")
        return []

    try:
        data = json.loads(match.group(1))
    except json.JSONDecodeError as e:
        logger.error("Erreur parsing ytInitialData : %s", e)
        return []

    videos: list[YouTubeVideo] = []

    # Naviguer dans la structure JSON pour trouver les vidéos
    try:
        tabs = data["contents"]["twoColumnBrowseResultsRenderer"]["tabs"]
        videos_tab = None
        for tab in tabs:
            tr = tab.get("tabRenderer", {})
            if tr.get("selected") and tr.get("content"):
                videos_tab = tr
                break

        if not videos_tab:
            logger.warning("Onglet vidéos introuvable")
            return []

        rich_grid = videos_tab["content"]["richGridRenderer"]["contents"]

        for item in rich_grid:
            if len(videos) >= max_videos:
                break

            renderer = (
                item.get("richItemRenderer", {})
                .get("content", {})
                .get("videoRenderer")
            )
            if not renderer:
                continue

            video_id = renderer.get("videoId", "")
            if not video_id:
                continue

            # Titre
            title_runs = renderer.get("title", {}).get("runs", [])
            title = title_runs[0]["text"] if title_runs else "Sans titre"

            # Miniature — on utilise le format standard YouTube haute qualité
            thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

            # Date de publication (texte relatif, ex: "il y a 2 jours")
            published_text = None
            pub_renderer = renderer.get("publishedTimeText", {})
            if pub_renderer:
                published_text = pub_renderer.get("simpleText")

            videos.append(YouTubeVideo(
                video_id=video_id,
                title=title,
                thumbnail_url=thumbnail_url,
                published_at=published_text,
            ))

    except (KeyError, IndexError, TypeError) as e:
        logger.error("Erreur navigation JSON YouTube : %s", e)

    logger.info("YouTube: %d vidéos extraites", len(videos))
    return videos
