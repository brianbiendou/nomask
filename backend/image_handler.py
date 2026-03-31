"""Module images — télécharge en parallèle + upload vers Supabase Storage."""
import asyncio
import hashlib
import mimetypes
from io import BytesIO
from urllib.parse import urlparse
from pathlib import PurePosixPath

import aiohttp
from supabase import create_client

from config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    STORAGE_BUCKET,
    SCRAPE_HEADERS,
    MAX_CONCURRENT_IMAGE_DOWNLOADS,
)


def _get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def _make_storage_path(url: str, article_slug: str) -> str:
    """Génère un chemin propre dans le bucket: articles/{slug}/{hash}.{ext}"""
    parsed = urlparse(url)
    ext = PurePosixPath(parsed.path).suffix or ".jpg"
    # Nettoie l'extension
    ext = ext.split("?")[0].split("#")[0]
    if ext not in (".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"):
        ext = ".jpg"
    # Hash pour éviter les collisions
    url_hash = hashlib.md5(url.encode()).hexdigest()[:12]
    return f"articles/{article_slug}/{url_hash}{ext}"


async def download_image(url: str, session: aiohttp.ClientSession) -> tuple[bytes, str] | None:
    """Télécharge une image et retourne (bytes, content_type)."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=20)) as resp:
            if resp.status != 200:
                return None
            ct = resp.content_type or "image/jpeg"
            data = await resp.read()
            if len(data) < 1000:  # Trop petit = probablement un pixel
                return None
            return (data, ct)
    except Exception as e:
        print(f"  [IMG] Erreur download {url}: {e}")
        return None


def upload_to_supabase(data: bytes, storage_path: str, content_type: str) -> str | None:
    """Upload vers Supabase Storage et retourne l'URL publique."""
    sb = _get_supabase()

    try:
        # Supprime si existe déjà
        try:
            sb.storage.from_(STORAGE_BUCKET).remove([storage_path])
        except Exception:
            pass

        sb.storage.from_(STORAGE_BUCKET).upload(
            path=storage_path,
            file=data,
            file_options={"content-type": content_type, "upsert": "true"},
        )

        public_url = sb.storage.from_(STORAGE_BUCKET).get_public_url(storage_path)
        return public_url
    except Exception as e:
        print(f"  [IMG] Erreur upload {storage_path}: {e}")
        return None


async def process_images(
    image_urls: list[str],
    article_slug: str,
    max_concurrent: int = MAX_CONCURRENT_IMAGE_DOWNLOADS,
) -> dict[str, str]:
    """
    Télécharge et upload toutes les images d'un article.
    Retourne un dict {url_originale: url_supabase}.
    """
    if not image_urls:
        return {}

    sem = asyncio.Semaphore(max_concurrent)
    url_map: dict[str, str] = {}

    async def _process_one(url: str, session: aiohttp.ClientSession):
        async with sem:
            result = await download_image(url, session)
            if result is None:
                return
            data, ct = result
            storage_path = _make_storage_path(url, article_slug)
            # L'upload Supabase est synchrone, on le fait en executor
            loop = asyncio.get_event_loop()
            public_url = await loop.run_in_executor(
                None, upload_to_supabase, data, storage_path, ct
            )
            if public_url:
                url_map[url] = public_url

    async with aiohttp.ClientSession(headers=SCRAPE_HEADERS) as session:
        tasks = [_process_one(u, session) for u in image_urls]
        await asyncio.gather(*tasks)

    return url_map


def replace_image_urls(html: str, url_map: dict[str, str]) -> str:
    """Remplace les anciennes URLs images par les nouvelles dans le HTML."""
    for old_url, new_url in url_map.items():
        html = html.replace(old_url, new_url)
    return html


def ensure_bucket_exists():
    """Crée le bucket s'il n'existe pas."""
    sb = _get_supabase()
    try:
        sb.storage.get_bucket(STORAGE_BUCKET)
    except Exception:
        try:
            sb.storage.create_bucket(STORAGE_BUCKET, options={"public": True})
            print(f"[STORAGE] Bucket '{STORAGE_BUCKET}' créé.")
        except Exception as e:
            print(f"[STORAGE] Bucket existe peut-être déjà: {e}")
