"""Module IndexNow — ping Bing/Yandex/Naver pour une indexation rapide."""
import asyncio
import httpx

from config import INDEXNOW_KEY, SITE_URL


async def ping_indexnow(article_url: str) -> bool:
    """Ping IndexNow avec l'URL d'un article nouvellement publié.
    Retourne True si le ping a réussi, False sinon.
    """
    if not INDEXNOW_KEY:
        print("  [INDEXNOW] Clé non configurée, skip")
        return False

    host = SITE_URL.replace("https://", "").replace("http://", "").rstrip("/")
    api_url = "https://api.indexnow.org/indexnow"
    params = {
        "url": article_url,
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(api_url, params=params)
            if resp.status_code in (200, 202):
                print(f"  [INDEXNOW] OK — {article_url}")
                return True
            else:
                print(f"  [INDEXNOW] {resp.status_code} — {article_url}")
                return False
    except Exception as e:
        print(f"  [INDEXNOW] Erreur: {e}")
        return False


async def ping_indexnow_batch(urls: list[str]) -> int:
    """Ping IndexNow pour plusieurs URLs. Retourne le nombre de succès."""
    if not INDEXNOW_KEY or not urls:
        return 0

    api_url = "https://api.indexnow.org/indexnow"
    host = SITE_URL.replace("https://", "").replace("http://", "").rstrip("/")
    payload = {
        "host": host,
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
        "urlList": urls,
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(api_url, json=payload)
            if resp.status_code in (200, 202):
                print(f"  [INDEXNOW] Batch OK — {len(urls)} URLs")
                return len(urls)
            else:
                print(f"  [INDEXNOW] Batch {resp.status_code}")
                return 0
    except Exception as e:
        print(f"  [INDEXNOW] Batch erreur: {e}")
        return 0
