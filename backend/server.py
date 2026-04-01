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

from pipeline import run_pipeline, process_single_article
from discovery import discover_and_return_urls, discover_trending, discover_trending_multi, SITE_PROFILES
from config import DEFAULT_PERSPECTIVE, OLLAMA_MODEL, OLLAMA_BASE_URL
from scraper import scrape_batch

app = FastAPI(title="NoMask Backend", version="1.0.0")

# CORS — autorise le frontend nomask.fr et le dev local
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nomask.fr",
        "https://www.nomask.fr",
        "https://api.nomask.fr",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────
# In-memory job store
# ────────────────────────────────────────
jobs: dict[str, dict] = {}


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
    intervalMinutes: int = 15
    perspective: str = DEFAULT_PERSPECTIVE
    maxArticles: int = 2
    hoursLookback: int = 24


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


async def _auto_loop():
    global _auto_last_run, _auto_next_run
    while _auto_config.enabled:
        delay = _auto_config.intervalMinutes * 60
        _auto_next_run = datetime.fromtimestamp(
            datetime.now(timezone.utc).timestamp() + delay, tz=timezone.utc
        ).isoformat()
        logger.info(f"[AUTO] Prochaine exécution dans {_auto_config.intervalMinutes} min")
        await asyncio.sleep(delay)

        _auto_last_run = datetime.now(timezone.utc).isoformat()
        # Lire les sources activées depuis sources.json
        all_sources = _load_sources()
        enabled_sources = [s for s in all_sources if s.get("enabled", True)]
        if not enabled_sources:
            logger.warning("[AUTO] Aucune source activée, skip")
            continue
        logger.info(f"[AUTO] Exécution avec {len(enabled_sources)} sources activées")
        for source in enabled_sources:
            source_url = source.get("url", "")
            source_name = source.get("name", source_url)
            source_max = source.get("maxArticles", _auto_config.maxArticles)
            try:
                urls = await discover_and_return_urls(source_url, _auto_config.hoursLookback)
                if urls:
                    urls = urls[: source_max]
                    job = _new_job(source_url, _auto_config.perspective, "auto")
                    job["discoveredUrls"] = urls
                    logger.info(f"[AUTO] {source_name}: {len(urls)} articles découverts (max {source_max}), pipeline lancé (job {job['id']})")
                    asyncio.create_task(
                        _run_pipeline_job(job["id"], urls, _auto_config.perspective, False)
                    )
                else:
                    logger.info(f"[AUTO] {source_name}: aucun nouvel article trouvé")
            except Exception as e:
                logger.error(f"[AUTO] Erreur {source_name}: {e}")


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
        for i, res in enumerate(results):
            if i < len(job["articles"]):
                job["articles"][i]["newTitle"] = res.get("title", "")
                job["articles"][i]["status"] = "published"
                published_count += 1
                logger.debug(f"[JOB {job_id}] Article {i+1}: {res.get('title', 'N/A')[:60]}...")

        # Mark non-published articles
        for art in job["articles"]:
            if art["status"] == "processing":
                art["status"] = "skipped"
                logger.warning(f"[JOB {job_id}] Article skippé: {art['title'][:60]}...")

        job["steps"][4]["detail"] = f"{published_count}/{len(urls)} publiés"
        job["status"] = "completed"
        logger.info(f"[JOB {job_id}] ✓ COMPLÉTÉ: {published_count}/{len(urls)} publiés")

        job["completedAt"] = datetime.now(timezone.utc).isoformat()

    except Exception as e:
        logger.error(f"[JOB {job_id}] ✗ ERREUR: {type(e).__name__}: {str(e)}", exc_info=True)
        job["status"] = "failed"
        job["error"] = str(e)
        job["completedAt"] = datetime.now(timezone.utc).isoformat()


# ────────────────────────────────────────
# Routes
# ────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "model": OLLAMA_MODEL, "ollama": OLLAMA_BASE_URL}


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


@app.get("/api/auto")
async def auto_get():
    """Lire la config auto-scrape."""
    return {
        "config": _auto_config.model_dump(),
        "lastRun": _auto_last_run,
        "nextRun": _auto_next_run,
        "running": _auto_task is not None and not _auto_task.done() if _auto_task else False,
    }


@app.post("/api/auto")
async def auto_set(config: AutoConfig):
    """Mettre à jour la config auto-scrape."""
    global _auto_config
    _auto_config = config
    _restart_auto()
    return {
        "success": True,
        "config": _auto_config.model_dump(),
        "lastRun": _auto_last_run,
        "nextRun": _auto_next_run,
        "running": _auto_task is not None and not _auto_task.done() if _auto_task else False,
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
