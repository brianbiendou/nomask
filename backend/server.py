"""
NoMask Backend — Serveur API FastAPI.

Expose le pipeline (découverte, scraping, réécriture IA, publication)
via des endpoints HTTP pour le frontend Next.js.

  uvicorn server:app --host 0.0.0.0 --port 8000
"""
import asyncio
import sys
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging pour voir les logs async
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger("nomask")

# Fix Windows asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from pipeline import run_pipeline, process_single_article, is_url_already_processed, clear_processed_urls
from discovery import discover_and_return_urls, discover_trending, discover_trending_multi, SITE_PROFILES
from config import DEFAULT_PERSPECTIVE, OLLAMA_MODEL, OLLAMA_BASE_URL, OLLAMA_TIMEOUT
from scraper import scrape_batch
from rewriter import ping_ollama
import telegram as tg

app = FastAPI(title="NoMask Backend", version="1.0.0")

# CORS — autorise le frontend nomask.fr et le dev local
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nomask.fr",
        "https://www.nomask.fr",
        "https://brett-unauthorised-extortionately.ngrok-free.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────
# Persistent job store (JSON file)
# ────────────────────────────────────────
import json as _json
from pathlib import Path as _Path

_JOBS_FILE = _Path(__file__).parent / "jobs.json"
_MAX_JOBS = 50


def _load_jobs() -> dict[str, dict]:
    """Charge les jobs depuis le fichier JSON."""
    if _JOBS_FILE.exists():
        try:
            data = _json.loads(_JOBS_FILE.read_text(encoding="utf-8"))
            return {j["id"]: j for j in data}
        except (Exception):
            pass
    return {}


def _save_jobs() -> None:
    """Persiste les jobs dans le fichier JSON (max 50 plus récents)."""
    sorted_list = sorted(
        jobs.values(),
        key=lambda j: j["createdAt"],
        reverse=True,
    )[:_MAX_JOBS]
    _JOBS_FILE.write_text(
        _json.dumps(sorted_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# Charger les jobs au démarrage
jobs: dict[str, dict] = _load_jobs()


def _new_job(source_url: str, perspective: str, mode: str) -> dict:
    job_id = str(uuid.uuid4())
    job = {
        "id": job_id,
        "status": "pending",
        "sourceUrl": source_url,
        "perspective": perspective,
        "mode": mode,
        "discoveredUrls": [],
        "steps": [
            {"name": "Découverte des articles", "status": "pending"},
            {"name": "Scraping du contenu", "status": "pending"},
            {"name": "Réécriture IA (qwen2.5:7b)", "status": "pending"},
            {"name": "Upload des images", "status": "pending"},
            {"name": "Publication Supabase", "status": "pending"},
        ],
        "articles": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "completedAt": None,
        "error": None,
    }
    jobs[job_id] = job
    _save_jobs()
    return job


# ────────────────────────────────────────
# Schemas
# ────────────────────────────────────────
class DiscoverRequest(BaseModel):
    url: str
    hours: int = 24


class PipelineRequest(BaseModel):
    urls: list[str] = []
    sourceUrl: Optional[str] = None
    perspective: str = DEFAULT_PERSPECTIVE
    force: bool = False
    mode: str = "manual"
    maxArticles: int = 10
    hours: int = 24


class AutoConfig(BaseModel):
    enabled: bool = False
    perspective: str = DEFAULT_PERSPECTIVE
    hoursLookback: int = 24
    forceByDefault: bool = False


class TrendingRequest(BaseModel):
    url: Optional[str] = None
    urls: list[str] = []
    maxPerSite: int = 10
    includeComments: bool = False


# ────────────────────────────────────────
# Auto-scrape state
# ────────────────────────────────────────
_auto_config = AutoConfig()
_auto_task: Optional[asyncio.Task] = None
_auto_last_run: Optional[str] = None
_auto_next_run: Optional[str] = None
_source_last_run: dict[str, float] = {}  # source_id → timestamp dernière exécution
_ollama_status: str = "unknown"  # "ok", "unreachable", "unknown"

_AUTO_TICK_SECONDS = 30  # Vérifie les sources toutes les 30 sec


async def _double_ping_ollama() -> bool:
    """Ping Ollama 2 fois pour être sûr. Retourne True si au moins 1 ping réussit."""
    ok1 = await ping_ollama()
    if ok1:
        return True
    logger.warning("[OLLAMA] Premier ping échoué, retry dans 3s...")
    await asyncio.sleep(3)
    ok2 = await ping_ollama()
    if ok2:
        return True
    logger.error("[OLLAMA] Deuxième ping échoué — Ollama injoignable")
    return False


async def _notify_ollama_down():
    """Fire-and-forget Telegram notification."""
    try:
        await tg.notify_ollama_down()
    except Exception:
        pass


async def _notify_ollama_back():
    """Fire-and-forget Telegram notification."""
    try:
        await tg.notify_ollama_back()
    except Exception:
        pass


async def _auto_loop():
    global _auto_last_run, _auto_next_run, _auto_config, _ollama_status
    _was_unreachable = False
    logger.info("[AUTO] Boucle démarrée — vérification toutes les %ds", _AUTO_TICK_SECONDS)
    while _auto_config.enabled:
        await asyncio.sleep(_AUTO_TICK_SECONDS)

        # Ping Ollama avant chaque cycle
        if not await _double_ping_ollama():
            _ollama_status = "unreachable"
            if not _was_unreachable:
                _was_unreachable = True
                asyncio.create_task(_notify_ollama_down())
            logger.warning("[AUTO] Ollama injoignable — cycle auto en pause")
            continue

        # Ollama est de retour après une panne
        if _was_unreachable:
            _was_unreachable = False
            asyncio.create_task(_notify_ollama_back())
        _ollama_status = "ok"

        now = datetime.now(timezone.utc).timestamp()
        all_sources = _load_sources()
        enabled_sources = [s for s in all_sources if s.get("enabled", True)]
        if not enabled_sources:
            continue

        for source in enabled_sources:
            source_id = source.get("id", source.get("url", ""))
            source_url = source.get("url", "")
            source_name = source.get("name", source_url)
            source_interval = source.get("intervalMinutes", 15) * 60  # en secondes
            source_max = source.get("maxArticles", 2)

            last = _source_last_run.get(source_id, 0)
            if now - last < source_interval:
                continue  # pas encore le moment pour cette source

            _source_last_run[source_id] = now
            _auto_last_run = datetime.now(timezone.utc).isoformat()
            logger.info(f"[AUTO] {source_name}: intervalle {source.get('intervalMinutes', 15)} min écoulé, lancement...")

            try:
                urls = await discover_and_return_urls(source_url, _auto_config.hoursLookback)
                if urls:
                    # Filtrer les URLs déjà traitées (anti-doublon)
                    new_urls = [u for u in urls if not is_url_already_processed(u)]
                    if not new_urls:
                        logger.info(f"[AUTO] {source_name}: {len(urls)} découverts mais tous déjà traités")
                        continue
                    new_urls = new_urls[:source_max]
                    job = _new_job(source_url, _auto_config.perspective, "auto")
                    job["discoveredUrls"] = new_urls
                    logger.info(f"[AUTO] {source_name}: {len(new_urls)} nouveaux articles (max {source_max}), job {job['id']}")
                    asyncio.create_task(
                        _run_pipeline_job(job["id"], new_urls, _auto_config.perspective, _auto_config.forceByDefault)
                    )
                else:
                    logger.info(f"[AUTO] {source_name}: aucun nouvel article")
            except Exception as e:
                logger.error(f"[AUTO] Erreur {source_name}: {e}")

        # Calculer la prochaine exécution (la source la plus proche)
        next_ts = None
        for source in enabled_sources:
            sid = source.get("id", source.get("url", ""))
            interval = source.get("intervalMinutes", 15) * 60
            last = _source_last_run.get(sid, 0)
            nxt = last + interval
            if next_ts is None or nxt < next_ts:
                next_ts = nxt
        if next_ts:
            _auto_next_run = datetime.fromtimestamp(next_ts, tz=timezone.utc).isoformat()


def _restart_auto():
    global _auto_task
    if _auto_task and not _auto_task.done():
        _auto_task.cancel()
    if _auto_config.enabled:
        _auto_task = asyncio.create_task(_auto_loop())


# ────────────────────────────────────────
# Background pipeline runner
# ────────────────────────────────────────
async def _run_pipeline_job(
    job_id: str,
    urls: list[str],
    perspective: str,
    force: bool,
):
    job = jobs.get(job_id)
    if not job:
        return

    logger.info(f"[JOB {job_id}] Démarrage du pipeline pour {len(urls)} articles")

    try:
        # Step 1 — Scraping
        logger.info(f"[JOB {job_id}] Step 1: Scraping...")
        job["status"] = "scraping"
        job["steps"][1]["status"] = "running"
        job["steps"][1]["startedAt"] = datetime.now(timezone.utc).isoformat()

        scraped = await scrape_batch(urls)
        logger.info(f"[JOB {job_id}] ✓ {len(scraped)} articles scrappés")
        job["steps"][1]["status"] = "completed"
        job["steps"][1]["completedAt"] = datetime.now(timezone.utc).isoformat()
        job["steps"][1]["detail"] = f"{len(scraped)} articles scrappés"

        # Init article tracking
        for art in scraped:
            job["articles"].append({
                "url": art.url,
                "title": art.title,
                "newTitle": None,
                "status": "processing",
                "steps": [],
            })

        # Step 2-4 — Pipeline complet (rewrite + images + publish)
        logger.info(f"[JOB {job_id}] Step 2-4: Réécriture IA + Images + Publication...")
        job["status"] = "rewriting"
        job["steps"][2]["status"] = "running"
        job["steps"][2]["startedAt"] = datetime.now(timezone.utc).isoformat()

        results = await run_pipeline(urls, perspective=perspective, force=force)
        logger.info(f"[JOB {job_id}] ✓ Pipeline complété: {len(results)} résultats")

        job["steps"][2]["status"] = "completed"
        job["steps"][2]["completedAt"] = datetime.now(timezone.utc).isoformat()
        job["steps"][3]["status"] = "completed"
        job["steps"][3]["completedAt"] = datetime.now(timezone.utc).isoformat()
        job["steps"][4]["status"] = "completed"
        job["steps"][4]["completedAt"] = datetime.now(timezone.utc).isoformat()

        # Update articles with results
        published_count = 0
        ollama_failures = 0
        for i, res in enumerate(results):
            if i < len(job["articles"]):
                job["articles"][i]["newTitle"] = res.get("title", "")
                job["articles"][i]["status"] = "published"
                job["articles"][i]["ollamaUsed"] = res.get("ollamaUsed", None)
                job["articles"][i]["ollamaDetail"] = res.get("ollamaDetail", None)
                published_count += 1
                logger.debug(f"[JOB {job_id}] Article {i+1}: {res.get('title', 'N/A')[:60]}...")

        # Mark non-published articles (Ollama failures)
        for art in job["articles"]:
            if art["status"] == "processing":
                art["status"] = "ollama_failed"
                ollama_failures += 1
                logger.warning(f"[JOB {job_id}] Article non réécrit (Ollama): {art['title'][:60]}...")

        job["steps"][4]["detail"] = f"{published_count}/{len(urls)} publiés"
        job["status"] = "completed"
        logger.info(f"[JOB {job_id}] ✓ COMPLÉTÉ: {published_count}/{len(urls)} publiés")

        job["completedAt"] = datetime.now(timezone.utc).isoformat()
        _save_jobs()

        # Notification Telegram (fire & forget)
        source_url = job.get("sourceUrl", "?")
        asyncio.create_task(tg.notify_pipeline_complete(
            source=source_url,
            published=published_count,
            total=len(urls),
            ollama_failures=ollama_failures,
        ))

    except Exception as e:
        logger.error(f"[JOB {job_id}] ✗ ERREUR: {type(e).__name__}: {str(e)}", exc_info=True)
        job["status"] = "failed"
        job["error"] = str(e)
        job["completedAt"] = datetime.now(timezone.utc).isoformat()
        _save_jobs()


# ────────────────────────────────────────
# Routes
# ────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "model": OLLAMA_MODEL, "ollama": OLLAMA_BASE_URL}


class OllamaTestRequest(BaseModel):
    prompt: str = "Dis bonjour en une phrase."
    model: str | None = None


@app.post("/api/ollama/test")
async def ollama_test(req: OllamaTestRequest):
    """Test direct Ollama depuis le conteneur Docker."""
    import aiohttp
    model = req.model or OLLAMA_MODEL
    url = f"{OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": req.prompt,
        "stream": False,
        "options": {"num_predict": 20},
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, timeout=aiohttp.ClientTimeout(total=OLLAMA_TIMEOUT)) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    raise HTTPException(status_code=resp.status, detail=body[:200])
                data = await resp.json()
                return {
                    "success": True,
                    "model": model,
                    "response": data.get("response", ""),
                    "ollama_url": OLLAMA_BASE_URL,
                }
    except aiohttp.ClientConnectorError:
        raise HTTPException(status_code=503, detail=f"Ollama injoignable à {OLLAMA_BASE_URL}")


@app.post("/api/discover")
async def discover(req: DiscoverRequest):
    """Découvrir les articles récents d'un site."""
    try:
        urls = await discover_and_return_urls(req.url, req.hours)
        return {
            "success": True,
            "source": req.url,
            "count": len(urls),
            "urls": urls,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/pipeline/run")
async def pipeline_run(req: PipelineRequest):
    """Lancer le pipeline (découverte optionnelle + scraping + IA + publication)."""
    urls = list(req.urls)

    job = _new_job(req.sourceUrl or "", req.perspective, req.mode)

    # Mode découverte
    if req.sourceUrl and not urls:
        job["status"] = "discovering"
        job["steps"][0]["status"] = "running"
        job["steps"][0]["startedAt"] = datetime.now(timezone.utc).isoformat()
        try:
            discovered = await discover_and_return_urls(req.sourceUrl, req.hours)
            urls = discovered[: req.maxArticles]
            job["discoveredUrls"] = urls
            job["steps"][0]["status"] = "completed"
            job["steps"][0]["completedAt"] = datetime.now(timezone.utc).isoformat()
            job["steps"][0]["detail"] = f"{len(urls)} articles trouvés"
        except Exception as e:
            job["steps"][0]["status"] = "failed"
            job["status"] = "failed"
            job["error"] = f"Découverte échouée: {e}"
            return {"success": False, "jobId": job["id"], "error": str(e)}
    else:
        job["steps"][0]["status"] = "skipped"
        job["discoveredUrls"] = urls

    if not urls:
        job["status"] = "completed"
        job["steps"][0]["detail"] = "Aucun article trouvé"
        job["completedAt"] = datetime.now(timezone.utc).isoformat()
        return {"success": True, "jobId": job["id"], "message": "Aucun article trouvé"}

    # Lancer le pipeline en background
    asyncio.create_task(
        _run_pipeline_job(job["id"], urls, req.perspective, req.force)
    )

    return {"success": True, "jobId": job["id"], "message": "Pipeline lancé"}


@app.get("/api/pipeline/jobs")
async def pipeline_jobs():
    """Lister tous les jobs."""
    sorted_jobs = sorted(
        jobs.values(),
        key=lambda j: j["createdAt"],
        reverse=True,
    )
    return {"jobs": sorted_jobs[:50]}


@app.get("/api/pipeline/job/{job_id}")
async def pipeline_job(job_id: str):
    """Détails d'un job."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job non trouvé")
    return {"job": job}


@app.delete("/api/pipeline/job/{job_id}")
async def delete_pipeline_job(job_id: str):
    """Supprimer un job."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job non trouvé")
    del jobs[job_id]
    _save_jobs()
    return {"success": True}


@app.get("/api/auto")
async def auto_get():
    """Lire la config auto-scrape."""
    return {
        "config": _auto_config.model_dump(),
        "lastRun": _auto_last_run,
        "nextRun": _auto_next_run,
        "running": _auto_task is not None and not _auto_task.done() if _auto_task else False,
        "ollamaStatus": _ollama_status,
        "ollama": {
            "url": OLLAMA_BASE_URL,
            "model": OLLAMA_MODEL,
            "timeout": OLLAMA_TIMEOUT,
        },
    }


@app.post("/api/auto")
async def auto_set(config: AutoConfig):
    """Mettre à jour la config auto-scrape."""
    global _auto_config, _ollama_status

    # Si on active le mode auto → double ping Ollama d'abord
    if config.enabled and not _auto_config.enabled:
        if not await _double_ping_ollama():
            _ollama_status = "unreachable"
            return {
                "success": False,
                "error": "Ollama est injoignable. Impossible d'activer la publication automatique.",
                "ollamaStatus": _ollama_status,
                "config": _auto_config.model_dump(),
            }
        _ollama_status = "ok"

    _auto_config = config
    _restart_auto()
    return {
        "success": True,
        "config": _auto_config.model_dump(),
        "lastRun": _auto_last_run,
        "nextRun": _auto_next_run,
        "running": _auto_task is not None and not _auto_task.done() if _auto_task else False,
        "ollamaStatus": _ollama_status,
    }


# ────────────────────────────────────────
# Trending / Articles populaires
# ────────────────────────────────────────

@app.post("/api/trending")
async def trending(req: TrendingRequest):
    """Récupérer les articles les plus populaires / trending d'un ou plusieurs sites."""
    try:
        # Multi-sites
        if req.urls:
            site_urls = req.urls
        elif req.url:
            site_urls = [req.url]
        else:
            # Par défaut, tous les sites connus
            site_urls = [f"https://www.{domain}" for domain in SITE_PROFILES.keys()]

        results = await discover_trending_multi(
            site_urls,
            max_per_site=req.maxPerSite,
            include_comments=req.includeComments,
        )

        formatted = {}
        for url, articles in results.items():
            formatted[url] = [
                {
                    "url": a.url,
                    "title": a.title,
                    "rank": a.trending_rank,
                    "commentCount": a.comment_count,
                    "section": a.section,
                    "imageUrl": a.image_url,
                    "publishedAt": a.published_at.isoformat() if a.published_at else None,
                }
                for a in articles
            ]

        total = sum(len(arts) for arts in formatted.values())
        return {
            "success": True,
            "totalTrending": total,
            "sites": formatted,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/trending/sources")
async def trending_sources():
    """Liste les sources disponibles pour le trending."""
    sources = []
    for domain, profile in SITE_PROFILES.items():
        sources.append({
            "domain": domain,
            "name": profile["name"],
            "url": f"https://www.{domain}",
        })
    return {"sources": sources}


@app.post("/api/pipeline/clear-cache")
async def pipeline_clear_cache():
    """Vide le registre des URLs déjà traitées (processed_urls.json)."""
    count = clear_processed_urls()
    return {"success": True, "cleared": count}


# ────────────────────────────────────────
# Gestion des sources (persistance JSON)
# ────────────────────────────────────────
import json
from pathlib import Path

_SOURCES_FILE = Path(__file__).parent / "sources.json"


def _load_sources() -> list[dict]:
    """Charge les sources depuis le fichier JSON."""
    if _SOURCES_FILE.exists():
        try:
            return json.loads(_SOURCES_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    # Sources par défaut
    return [
        {"id": "numerama", "name": "Numerama", "url": "https://www.numerama.com", "enabled": True, "intervalMinutes": 15, "maxArticles": 2},
        {"id": "lemonde", "name": "Le Monde Pixels", "url": "https://www.lemonde.fr/pixels/", "enabled": True, "intervalMinutes": 15, "maxArticles": 2},
        {"id": "figaro", "name": "Le Figaro Tech", "url": "https://www.lefigaro.fr/secteur/high-tech", "enabled": False, "intervalMinutes": 30, "maxArticles": 4},
    ]


def _save_sources(sources: list[dict]) -> None:
    """Persiste les sources dans le fichier JSON."""
    _SOURCES_FILE.write_text(json.dumps(sources, ensure_ascii=False, indent=2), encoding="utf-8")


@app.get("/api/sources")
async def get_sources():
    """Récupérer la liste des sources."""
    return {"sources": _load_sources()}


class SourcesPayload(BaseModel):
    sources: list[dict]


@app.post("/api/sources")
async def save_sources(payload: SourcesPayload):
    """Sauvegarder la liste des sources."""
    _save_sources(payload.sources)
    return {"success": True, "sources": payload.sources}


# ────────────────────────────────────────
# YouTube Videos — sources, cache, rotation
# ────────────────────────────────────────
from youtube_scraper import fetch_channel_videos
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

_yt_supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
_yt_refresh_task: Optional[asyncio.Task] = None


# --- Schemas ---
class YouTubeSourceCreate(BaseModel):
    name: str
    channel_url: str
    slot_position: str = "main"          # main | bottom_left | bottom_right
    video_count: int = 10


class YouTubeSourceUpdate(BaseModel):
    name: Optional[str] = None
    channel_url: Optional[str] = None
    slot_position: Optional[str] = None
    video_count: Optional[int] = None
    enabled: Optional[bool] = None


class YouTubeConfigUpdate(BaseModel):
    enabled: Optional[bool] = None
    refresh_hours: Optional[list[int]] = None
    rotation_minutes: Optional[int] = None


# --- Config ---
@app.get("/api/youtube/config")
async def yt_config_get():
    """Lire la config YouTube."""
    res = _yt_supabase.table("youtube_config").select("*").eq("id", 1).execute()
    cfg = res.data[0] if res.data else {"enabled": False, "refresh_hours": [6, 21], "rotation_minutes": 120}
    return {
        "config": cfg,
        "refreshRunning": _yt_refresh_task is not None and not _yt_refresh_task.done() if _yt_refresh_task else False,
    }


@app.post("/api/youtube/config")
async def yt_config_set(body: YouTubeConfigUpdate):
    """Mettre à jour la config YouTube."""
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    _yt_supabase.table("youtube_config").upsert({"id": 1, **updates}).execute()
    # Redémarrer la boucle si nécessaire
    _restart_yt_refresh()
    res = _yt_supabase.table("youtube_config").select("*").eq("id", 1).execute()
    return {"success": True, "config": res.data[0] if res.data else {}}


# --- Sources CRUD ---
SLOT_ORDER = ["main", "bottom_left", "bottom_right"]

@app.get("/api/youtube/sources")
async def yt_sources_list():
    """Lister les sources YouTube, triées par slot puis created_at."""
    res = _yt_supabase.table("youtube_sources").select("*").order("created_at").execute()
    # Trier : slots assignés d'abord (main=0, bottom_left=1, bottom_right=2), puis le reste
    sources = res.data or []
    def sort_key(s):
        pos = s.get("slot_position", "")
        return (SLOT_ORDER.index(pos) if pos in SLOT_ORDER else 100, s.get("created_at", ""))
    sources.sort(key=sort_key)
    return {"sources": sources}


@app.post("/api/youtube/sources")
async def yt_sources_create(body: YouTubeSourceCreate):
    """Ajouter une source YouTube."""
    payload = body.model_dump()
    payload["created_at"] = datetime.now(timezone.utc).isoformat()
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    # slot_position par défaut : "reserve" pour les nouvelles sources
    if payload.get("slot_position") not in SLOT_ORDER:
        payload["slot_position"] = "reserve"
    res = _yt_supabase.table("youtube_sources").insert(payload).execute()
    return {"success": True, "source": res.data[0] if res.data else payload}


@app.post("/api/youtube/sources/reorder")
async def yt_sources_reorder(body: dict):
    """Réordonner les sources YouTube. Body: { order: [id1, id2, id3, ...] }."""
    order = body.get("order", [])
    if not order:
        raise HTTPException(status_code=400, detail="order est requis")

    for i, source_id in enumerate(order):
        slot = SLOT_ORDER[i] if i < len(SLOT_ORDER) else "reserve"
        _yt_supabase.table("youtube_sources").update({
            "slot_position": slot,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", source_id).execute()

    return {"success": True}


@app.put("/api/youtube/sources/{source_id}")
async def yt_sources_update(source_id: str, body: YouTubeSourceUpdate):
    """Modifier une source YouTube."""
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = _yt_supabase.table("youtube_sources").update(updates).eq("id", source_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Source introuvable")
    return {"success": True, "source": res.data[0]}


@app.delete("/api/youtube/sources/{source_id}")
async def yt_sources_delete(source_id: str):
    """Supprimer une source YouTube (+ vidéos cascade)."""
    _yt_supabase.table("youtube_sources").delete().eq("id", source_id).execute()
    return {"success": True}


# --- Test / Preview d'une chaîne YouTube ---
class YouTubeTestRequest(BaseModel):
    channel_url: str
    count: int = 10

@app.post("/api/youtube/test")
async def yt_test_channel(body: YouTubeTestRequest):
    """Tester une chaîne YouTube : renvoie les N dernières vidéos (titre + miniature)."""
    try:
        videos = await fetch_channel_videos(body.channel_url, body.count)
        if not videos:
            return {"success": False, "error": "Aucune vidéo trouvée", "videos": []}
        return {
            "success": True,
            "count": len(videos),
            "videos": [
                {
                    "video_id": v.video_id,
                    "title": v.title,
                    "thumbnail_url": v.thumbnail_url,
                    "published_at": v.published_at,
                }
                for v in videos
            ],
        }
    except Exception as e:
        logger.error("[YT] Erreur test channel %s : %s", body.channel_url, e)
        return {"success": False, "error": str(e), "videos": []}


# --- Refresh vidéos ---
@app.post("/api/youtube/refresh")
async def yt_refresh_now():
    """Forcer un refresh immédiat de toutes les sources YouTube."""
    results = await _yt_do_refresh()
    return {"success": True, "results": results}


@app.get("/api/youtube/videos")
async def yt_videos_current():
    """Renvoie les vidéos actuelles avec l'index de rotation calculé."""
    cfg_res = _yt_supabase.table("youtube_config").select("*").eq("id", 1).execute()
    cfg = cfg_res.data[0] if cfg_res.data else {"rotation_minutes": 120}
    rotation_min = cfg.get("rotation_minutes", 120)

    sources_res = _yt_supabase.table("youtube_sources").select("*").eq("enabled", True).order("created_at").execute()
    sources = sources_res.data or []

    # Calculer l'index de rotation actuel
    now_ts = datetime.now(timezone.utc).timestamp()
    rotation_index = int(now_ts / (rotation_min * 60))

    result = {}
    for src in sources:
        vids_res = (
            _yt_supabase.table("youtube_videos")
            .select("*")
            .eq("source_id", src["id"])
            .order("position")
            .execute()
        )
        videos = vids_res.data or []
        if videos:
            idx = rotation_index % len(videos)
            current_video = videos[idx]
        else:
            current_video = None

        result[src["slot_position"]] = {
            "source": {
                "id": src["id"],
                "name": src["name"],
                "channel_url": src["channel_url"],
            },
            "current_video": current_video,
            "total_videos": len(videos),
            "rotation_index": rotation_index % len(videos) if videos else 0,
        }

    return {"slots": result, "rotation_minutes": rotation_min}


# --- Logique de refresh ---
async def _yt_do_refresh() -> list[dict]:
    """Fetch les dernières vidéos de chaque source active et met à jour le cache."""
    sources_res = _yt_supabase.table("youtube_sources").select("*").eq("enabled", True).execute()
    sources = sources_res.data or []
    results = []

    for src in sources:
        source_id = src["id"]
        channel_url = src["channel_url"]
        video_count = src.get("video_count", 10)

        logger.info("[YT] Refresh %s (%s) — %d vidéos demandées", src["name"], channel_url, video_count)

        try:
            videos = await fetch_channel_videos(channel_url, video_count)
            if not videos:
                logger.warning("[YT] Aucune vidéo trouvée pour %s — conservation du cache", src["name"])
                results.append({"source": src["name"], "status": "no_new", "count": 0})
                continue

            # Supprimer les anciennes vidéos de cette source
            _yt_supabase.table("youtube_videos").delete().eq("source_id", source_id).execute()

            # Insérer les nouvelles
            rows = [
                {
                    "source_id": source_id,
                    "video_id": v.video_id,
                    "title": v.title,
                    "thumbnail_url": v.thumbnail_url,
                    "published_at": v.published_at,
                    "position": i,
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                }
                for i, v in enumerate(videos)
            ]
            _yt_supabase.table("youtube_videos").insert(rows).execute()

            logger.info("[YT] ✓ %s : %d vidéos mises en cache", src["name"], len(videos))
            results.append({"source": src["name"], "status": "ok", "count": len(videos)})

        except Exception as e:
            logger.error("[YT] Erreur refresh %s : %s", src["name"], e)
            results.append({"source": src["name"], "status": "error", "error": str(e)})

    return results


# --- Boucle auto-refresh YouTube ---
async def _yt_refresh_loop():
    """Boucle en arrière-plan : vérifie chaque minute si c'est l'heure de refresh."""
    logger.info("[YT] Boucle auto-refresh démarrée")
    last_refresh_hour: int | None = None

    consecutive_errors = 0
    while True:
        await asyncio.sleep(300)  # Check toutes les 5 min
        try:
            cfg_res = _yt_supabase.table("youtube_config").select("*").eq("id", 1).execute()
            cfg = cfg_res.data[0] if cfg_res.data else {}
            consecutive_errors = 0  # Reset on success
            if not cfg.get("enabled", False):
                continue

            now = datetime.now(timezone.utc)
            current_hour = now.hour
            refresh_hours = cfg.get("refresh_hours", [6, 21])

            # Éviter de refresh 2× dans la même heure
            if current_hour in refresh_hours and current_hour != last_refresh_hour:
                logger.info("[YT] Heure de refresh programmé (%dh UTC)", current_hour)
                last_refresh_hour = current_hour
                await _yt_do_refresh()

        except Exception as e:
            consecutive_errors += 1
            if consecutive_errors <= 3:
                logger.error("[YT] Erreur boucle refresh : %s", e)
            elif consecutive_errors == 4:
                logger.error("[YT] Erreurs répétées — logs réduits jusqu'à reconnexion")
            # Back off: wait longer on repeated failures (max 30 min)
            backoff = min(consecutive_errors * 60, 1800)
            await asyncio.sleep(backoff)


def _restart_yt_refresh():
    global _yt_refresh_task
    if _yt_refresh_task and not _yt_refresh_task.done():
        _yt_refresh_task.cancel()
    _yt_refresh_task = asyncio.create_task(_yt_refresh_loop())


@app.on_event("startup")
async def startup_yt_refresh():
    """Démarre la boucle YouTube au démarrage du serveur."""
    _restart_yt_refresh()
