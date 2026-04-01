"""
Tests NoMask — Suite complète
=============================
Vérifie la connectivité et le bon fonctionnement de :
  1. Supabase (tables + données)
  2. Backend Docker (API FastAPI)
  3. Tunnel Cloudflare (api.nomask.fr)
  4. Ollama (LLM local)
  5. YouTube scraper (récupération miniatures + titres)
  6. Pipeline frontend → Cloudflare → Docker → Ollama

Usage :
  cd C:\App\nomask
  python tests/run_all.py
"""
import asyncio
import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime

# Charger les variables d'env depuis .env.local
env_path = Path(__file__).resolve().parent.parent / ".env.local"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

# ─── Helpers ───
PASS = "\033[92m✓ PASS\033[0m"
FAIL = "\033[91m✗ FAIL\033[0m"
SKIP = "\033[93m- SKIP\033[0m"
results: list[tuple[str, str, str]] = []

# Headers réalistes pour éviter les blocages Cloudflare
BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "application/json, text/html, */*",
    "Accept-Language": "fr-FR,fr;q=0.9",
}


def report(name: str, status: str, detail: str = ""):
    results.append((name, status, detail))
    tag = PASS if status == "pass" else FAIL if status == "fail" else SKIP
    print(f"  {tag}  {name}" + (f"  ({detail})" if detail else ""))


# ═══════════════════════════════════════
# 1. SUPABASE
# ═══════════════════════════════════════
def test_supabase():
    print("\n═══ 1. SUPABASE ═══")
    try:
        from supabase import create_client
    except ImportError:
        report("supabase-import", "fail", "pip install supabase")
        return

    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        report("supabase-env", "fail", "Variables SUPABASE manquantes")
        return
    report("supabase-env", "pass", url[:40] + "...")

    sb = create_client(url, key)

    # Tables attendues (migrations 001-013)
    expected_tables = {
        "authors": "001",
        "categories": "002",
        "articles": "003",
        "tags": "004",
        "comments": "005",
        "newsletter_subscribers": "006",
        "pipeline_jobs": "012",
        "auto_scrape_config": "012",
        "youtube_sources": "013",
        "youtube_videos": "013",
        "youtube_config": "013",
    }

    for table, migration in expected_tables.items():
        try:
            res = sb.table(table).select("*", count="exact").limit(0).execute()
            count = res.count if hasattr(res, "count") and res.count is not None else "?"
            report(f"table-{table}", "pass", f"migration {migration}, {count} rows")
        except Exception as e:
            report(f"table-{table}", "fail", str(e)[:80])

    # Vérifier qu'il y a des articles
    try:
        res = sb.table("articles").select("id", count="exact").eq("status", "published").limit(0).execute()
        count = res.count or 0
        report("articles-published", "pass" if count > 0 else "fail", f"{count} articles publiés")
    except Exception as e:
        report("articles-published", "fail", str(e)[:80])

    # Vérifier les 3 sources YouTube
    try:
        res = sb.table("youtube_sources").select("name, enabled").execute()
        names = [s["name"] for s in (res.data or [])]
        report("youtube-sources-seed", "pass" if len(names) >= 3 else "fail", f"{len(names)} sources: {', '.join(names)}")
    except Exception as e:
        report("youtube-sources-seed", "fail", str(e)[:80])


# ═══════════════════════════════════════
# 2. BACKEND DOCKER
# ═══════════════════════════════════════
def test_backend_local():
    print("\n═══ 2. BACKEND DOCKER (localhost:8000) ═══")
    import urllib.request
    import urllib.error

    endpoints = {
        "/health": "GET",
        "/api/sources": "GET",
        "/api/youtube/sources": "GET",
        "/api/youtube/config": "GET",
        "/api/youtube/videos": "GET",
    }

    for path, method in endpoints.items():
        try:
            req = urllib.request.Request(f"http://localhost:8000{path}", method=method)
            req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                report(f"backend{path}", "pass", f"HTTP {resp.status}")
        except urllib.error.HTTPError as e:
            report(f"backend{path}", "fail", f"HTTP {e.code}")
        except Exception as e:
            report(f"backend{path}", "fail", str(e)[:80])


# ═══════════════════════════════════════
# 3. TUNNEL CLOUDFLARE
# ═══════════════════════════════════════
def test_cloudflare_tunnel():
    print("\n═══ 3. TUNNEL CLOUDFLARE (api.nomask.fr) ═══")
    import urllib.request
    import urllib.error

    try:
        req = urllib.request.Request("https://api.nomask.fr/health")
        for k, v in BROWSER_HEADERS.items():
            req.add_header(k, v)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            status = data.get("status")
            report("tunnel-health", "pass" if status == "ok" else "fail", json.dumps(data))
    except urllib.error.HTTPError as e:
        report("tunnel-health", "fail", f"HTTP {e.code}")
    except Exception as e:
        report("tunnel-health", "fail", str(e)[:100])

    # Test un endpoint YouTube via le tunnel
    try:
        req = urllib.request.Request("https://api.nomask.fr/api/youtube/sources")
        for k, v in BROWSER_HEADERS.items():
            req.add_header(k, v)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            count = len(data.get("sources", []))
            report("tunnel-youtube-sources", "pass", f"{count} sources")
    except Exception as e:
        report("tunnel-youtube-sources", "fail", str(e)[:100])


# ═══════════════════════════════════════
# 4. OLLAMA
# ═══════════════════════════════════════
def test_ollama():
    print("\n═══ 4. OLLAMA (LLM local) ═══")
    import urllib.request
    import urllib.error

    ollama_url = os.environ.get("OLLAMA_URL", "http://localhost:11434")

    # Test connexion
    try:
        req = urllib.request.Request(f"{ollama_url}/api/tags")
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            models = [m["name"] for m in data.get("models", [])]
            report("ollama-connection", "pass", f"{len(models)} modèle(s)")
    except Exception as e:
        report("ollama-connection", "fail", str(e)[:80])
        return

    # Test génération courte — on détecte le modèle réellement disponible
    model = os.environ.get("OLLAMA_MODEL", "qwen2.5:7b")
    # Vérifier que le modèle est installé, sinon prendre le premier dispo
    try:
        req_tags = urllib.request.Request(f"{ollama_url}/api/tags")
        with urllib.request.urlopen(req_tags, timeout=10) as resp_tags:
            tag_data = json.loads(resp_tags.read().decode())
            installed = [m["name"] for m in tag_data.get("models", [])]
            if model not in installed and installed:
                model = installed[0]
                report("ollama-model-fallback", "pass", f"Modèle env ({os.environ.get('OLLAMA_MODEL')}) absent, utilise {model}")
    except Exception:
        pass

    try:
        payload = json.dumps({
            "model": model,
            "prompt": "Bonjour",
            "stream": False,
            "options": {"num_predict": 10},
        }).encode()
        req = urllib.request.Request(f"{ollama_url}/api/generate", data=payload, method="POST")
        req.add_header("Content-Type", "application/json")
        start = time.time()
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
            answer = data.get("response", "")[:50]
            elapsed = time.time() - start
            report("ollama-generate", "pass", f"'{answer.strip()}' en {elapsed:.1f}s ({model})")
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:100] if hasattr(e, "read") else ""
        report("ollama-generate", "fail", f"HTTP {e.code} — {body}")
    except Exception as e:
        report("ollama-generate", "fail", str(e)[:80])


# ═══════════════════════════════════════
# 5. YOUTUBE SCRAPER
# ═══════════════════════════════════════
def test_youtube_scraper():
    print("\n═══ 5. YOUTUBE SCRAPER ═══")

    # Ajouter le dossier backend au path
    backend_dir = str(Path(__file__).resolve().parent.parent / "backend")
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    try:
        from youtube_scraper import fetch_channel_videos
    except ImportError as e:
        report("youtube-import", "fail", str(e)[:80])
        return
    report("youtube-import", "pass")

    channels = {
        "Le Monde": "https://www.youtube.com/@lemondefr/videos",
        "Frandroid": "https://www.youtube.com/@frandroid/videos",
        "Konbini": "https://www.youtube.com/@konbini/videos",
    }

    async def _test():
        for name, url in channels.items():
            try:
                start = time.time()
                videos = await fetch_channel_videos(url, 10)
                elapsed = time.time() - start
                if videos and len(videos) > 0:
                    first = videos[0]
                    report(
                        f"youtube-{name.lower().replace(' ', '_')}",
                        "pass",
                        f"{len(videos)} vidéos en {elapsed:.1f}s — \"{first.title[:50]}\"",
                    )
                else:
                    report(f"youtube-{name.lower().replace(' ', '_')}", "fail", "0 vidéos retournées")
            except Exception as e:
                report(f"youtube-{name.lower().replace(' ', '_')}", "fail", str(e)[:80])

    asyncio.run(_test())


# ═══════════════════════════════════════
# 6. PIPELINE Frontend → Cloudflare → Docker → Ollama
# ═══════════════════════════════════════
def test_pipeline_e2e():
    print("\n═══ 6. PIPELINE E2E (Frontend → Tunnel → Backend → Ollama) ═══")
    import urllib.request
    import urllib.error

    # Test 1 : Backend health via tunnel (Frontend → Cloudflare → Docker)
    try:
        req = urllib.request.Request("https://api.nomask.fr/health")
        for k, v in BROWSER_HEADERS.items():
            req.add_header(k, v)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            ollama_ok = "ollama" in data
            model_ok = "model" in data
            report(
                "e2e-tunnel-backend",
                "pass" if data.get("status") == "ok" else "fail",
                f"model={data.get('model')}, ollama_declared={'yes' if ollama_ok else 'no'}",
            )
    except Exception as e:
        report("e2e-tunnel-backend", "fail", str(e)[:80])
        return  # Si le tunnel ne marche pas, pas la peine de continuer

    # Test 2 : YouTube refresh via tunnel (Frontend → Cloudflare → Docker → YouTube)
    try:
        payload = json.dumps({"channel_url": "https://www.youtube.com/@lemondefr/videos", "count": 3}).encode()
        req = urllib.request.Request("https://api.nomask.fr/api/youtube/test", data=payload, method="POST")
        req.add_header("Content-Type", "application/json")
        for k, v in BROWSER_HEADERS.items():
            req.add_header(k, v)
        start = time.time()
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            elapsed = time.time() - start
            count = data.get("count", 0)
            report(
                "e2e-youtube-via-tunnel",
                "pass" if data.get("success") and count > 0 else "fail",
                f"{count} vidéos en {elapsed:.1f}s via tunnel",
            )
    except Exception as e:
        report("e2e-youtube-via-tunnel", "fail", str(e)[:80])

    # Test 3 : Pipeline discovery via le backend local (pour ne pas lancer un vrai rewrite)
    try:
        req = urllib.request.Request("http://localhost:8000/api/sources")
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            sources = data if isinstance(data, list) else data.get("sources", [])
            report("e2e-sources-loaded", "pass" if len(sources) > 0 else "fail", f"{len(sources)} sources configurées")
    except Exception as e:
        report("e2e-sources-loaded", "fail", str(e)[:80])


# ═══════════════════════════════════════
# RAPPORT FINAL
# ═══════════════════════════════════════
def print_summary():
    print("\n" + "=" * 60)
    print(f"  RAPPORT — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    passed = sum(1 for _, s, _ in results if s == "pass")
    failed = sum(1 for _, s, _ in results if s == "fail")
    skipped = sum(1 for _, s, _ in results if s == "skip")
    total = len(results)

    print(f"\n  Total: {total}  |  {PASS}: {passed}  |  {FAIL}: {failed}  |  {SKIP}: {skipped}")

    if failed > 0:
        print(f"\n  Tests en échec :")
        for name, status, detail in results:
            if status == "fail":
                print(f"    • {name}: {detail}")

    print()
    return 0 if failed == 0 else 1


# ═══════════════════════════════════════
# MAIN
# ═══════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("  NoMask — Suite de tests complète")
    print("=" * 60)

    test_supabase()
    test_backend_local()
    test_cloudflare_tunnel()
    test_ollama()
    test_youtube_scraper()
    test_pipeline_e2e()

    exit_code = print_summary()
    sys.exit(exit_code)
