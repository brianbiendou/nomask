"""Module images — télécharge en parallèle + upload vers Supabase Storage."""
import asyncio
import hashlib
import mimetypes
from io import BytesIO
from urllib.parse import urlparse
from pathlib import PurePosixPath

import aiohttp
from PIL import Image as PILImage, ImageDraw, ImageFont
from supabase import create_client

from config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    STORAGE_BUCKET,
    SCRAPE_HEADERS,
    MAX_CONCURRENT_IMAGE_DOWNLOADS,
)

# ─── Watermark NM ───────────────────────────────────────────────────

_watermark_cache = None


def _find_bold_font(size: int):
    """Cherche une police bold disponible sur le système."""
    font_names = [
        "arialbd.ttf",
        "Arial Bold.ttf",
        "DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _get_watermark():
    """Crée et met en cache le watermark NM (RGBA)."""
    global _watermark_cache
    if _watermark_cache is not None:
        return _watermark_cache

    wm_w, wm_h = 80, 52
    wm = PILImage.new("RGBA", (wm_w, wm_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wm)

    # Fond arrondi semi-transparent
    draw.rounded_rectangle([0, 0, wm_w - 1, wm_h - 1], radius=8, fill=(0, 0, 0, 150))

    font = _find_bold_font(32)

    # "N" en rouge
    draw.text((10, 6), "N", fill=(220, 38, 38, 240), font=font)
    # "M" en blanc, juste après le N
    n_bbox = draw.textbbox((10, 6), "N", font=font)
    draw.text((n_bbox[2] - 2, 6), "M", fill=(255, 255, 255, 240), font=font)

    _watermark_cache = wm
    return wm


def apply_watermark(image_data: bytes, content_type: str = "image/jpeg") -> bytes:
    """Applique le watermark NM en haut à droite de l'image."""
    try:
        img = PILImage.open(BytesIO(image_data))
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        wm = _get_watermark()

        # Taille du watermark : ~6 % de la largeur de l'image
        target_w = max(40, int(img.width * 0.06))
        scale = target_w / wm.width
        target_h = int(wm.height * scale)
        wm_resized = wm.resize((target_w, target_h), PILImage.LANCZOS)

        # Position haut-droite avec marge
        margin = max(8, int(img.width * 0.015))
        pos = (img.width - target_w - margin, margin)

        img.paste(wm_resized, pos, wm_resized)

        # Sauvegarde dans le format original
        output = BytesIO()
        if "png" in content_type:
            img.save(output, "PNG")
            return output.getvalue()
        elif "webp" in content_type:
            img.save(output, "WEBP", quality=90)
            return output.getvalue()
        else:
            # JPEG ne supporte pas l'alpha
            rgb = PILImage.new("RGB", img.size, (255, 255, 255))
            rgb.paste(img, mask=img.split()[3])
            rgb.save(output, "JPEG", quality=90)
            return output.getvalue()
    except Exception as e:
        print(f"  [IMG] Erreur watermark: {e}")
        return image_data


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


def extract_content_images(content_html: str) -> list[str]:
    """Extrait les balises <figure> et <img> du contenu HTML original sous forme de blocs HTML."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(content_html, "html.parser")
    blocks = []

    for fig in soup.find_all("figure"):
        img = fig.find("img")
        if img:
            # Nettoyer les attributs width/height
            for attr in ["width", "height", "style", "loading", "decoding",
                         "data-src", "data-lazy-src", "srcset", "sizes", "class"]:
                if img.has_attr(attr):
                    del img[attr]
            # Résoudre data-src si pas de src
            if not img.get("src") and img.get("data-original"):
                img["src"] = img["data-original"]
            blocks.append(str(fig))

    # Images isolées (pas dans une figure)
    for img in soup.find_all("img"):
        if img.find_parent("figure"):
            continue
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if not src:
            continue
        # Filtrer les petites images / trackers
        if any(x in src.lower() for x in ["pixel", "tracker", "1x1", ".gif", "spacer",
                                            "icon", "logo", "avatar", "badge"]):
            continue
        # Nettoyer les attributs
        for attr in ["width", "height", "style", "loading", "decoding",
                     "data-src", "data-lazy-src", "srcset", "sizes", "class"]:
            if img.has_attr(attr):
                del img[attr]
        alt = img.get("alt", "")
        block = f'<figure><img src="{src}" alt="{alt}" />'
        if alt:
            block += f"<figcaption>{alt}</figcaption>"
        block += "</figure>"
        blocks.append(block)

    return blocks


def inject_images_into_content(rewritten_html: str, image_blocks: list[str]) -> str:
    """Insère les images extraites du contenu original dans le contenu réécrit,
    réparties entre les paragraphes."""
    if not image_blocks:
        return rewritten_html

    from bs4 import BeautifulSoup, NavigableString

    soup = BeautifulSoup(rewritten_html, "html.parser")

    # Trouver les éléments de niveau bloc (p, h2, h3...)
    block_elements = soup.find_all(["p", "h2", "h3"])
    if not block_elements:
        # Pas de structure, ajouter à la fin
        for block in image_blocks:
            soup.append(BeautifulSoup(block, "html.parser"))
        return str(soup)

    # Répartir les images uniformément entre les paragraphes
    n_blocks = len(block_elements)
    n_images = len(image_blocks)

    # Calculer les positions d'insertion (après tel élément)
    if n_images == 1:
        # Après le 2e paragraphe ou à mi-chemin
        positions = [min(2, n_blocks - 1)]
    else:
        step = max(1, n_blocks // (n_images + 1))
        positions = [min((i + 1) * step, n_blocks - 1) for i in range(n_images)]

    # Insérer de la fin vers le début pour ne pas décaler les indices
    for img_html, pos in reversed(list(zip(image_blocks, positions))):
        img_soup = BeautifulSoup(img_html, "html.parser")
        target = block_elements[pos]
        target.insert_after(img_soup)

    return str(soup)


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
