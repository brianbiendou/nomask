"""Détection sémantique de similarité — évite les doublons de sujets dans le pipeline.

Principe :
- Avant de traiter un article, on le compare sémantiquement aux articles récents publiés.
- Un seul appel Ollama par article : on envoie les N titres existants en batch.
- Si le score de similarité max dépasse SIMILARITY_THRESHOLD → article rejeté comme doublon.
"""
import json
import re
import asyncio
from datetime import datetime, timezone, timedelta

import aiohttp

from config import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT, SIMILARITY_THRESHOLD

# Cache des articles récents (titre + excerpt) — rechargé au début de chaque run pipeline
_recent_articles_cache: list[dict] = []


def set_recent_articles(articles: list[dict]) -> None:
    """Charge le cache des articles récents pour la session pipeline."""
    global _recent_articles_cache
    _recent_articles_cache = articles
    print(f"  [SIMILARITY] Cache chargé: {len(articles)} articles récents")


def get_recent_articles() -> list[dict]:
    """Retourne le cache des articles récents."""
    return _recent_articles_cache


SYSTEM_SIMILARITY = """Tu es un détecteur de doublons d'articles de presse. On te donne un NOUVEL article et une liste d'articles déjà publiés.

Ton objectif : déterminer si le nouvel article couvre le MÊME SUJET/ÉVÉNEMENT qu'un article existant.

Critères de similarité :
- Même événement précis, même annonce, même actualité → score 80-100 (DOUBLON)
- Même sujet général mais angle différent ou mise à jour significative → score 40-70 (ACCEPTABLE)
- Thème connexe mais événements clairement distincts → score 20-40 (OK)
- Sujets complètement différents → score 0-20 (OK)

IMPORTANT : deux articles sur "l'IA en général" ne sont PAS des doublons. Mais deux articles sur "le lancement de GPT-5 par OpenAI" SONT des doublons.

Réponds UNIQUEMENT avec ce JSON (rien d'autre) :
{"max_score": <0-100>, "similar_title": "<titre le plus similaire, ou null>", "reason": "<explication en 1 phrase>"}"""


async def check_topic_similarity(
    new_title: str,
    new_excerpt: str,
    recent_articles: list[dict] | None = None,
    threshold: int = SIMILARITY_THRESHOLD,
) -> tuple[bool, int, str]:
    """
    Compare le nouvel article avec les articles récents.

    Args:
        new_title: Titre de l'article à vérifier
        new_excerpt: Extrait de l'article à vérifier
        recent_articles: Liste de dicts {title, excerpt} des articles existants.
                         Si None, utilise le cache global.
        threshold: Score (0-100) au-delà duquel c'est un doublon.

    Returns:
        (is_duplicate, score, similar_title_or_reason)
    """
    articles = recent_articles if recent_articles is not None else _recent_articles_cache

    if not articles:
        return False, 0, ""

    # Construire la liste des titres existants (max 80 pour garder le prompt court)
    sample = articles[:80]
    articles_list = "\n".join(
        f"{i+1}. {a['title']}" + (f" — {a['excerpt'][:80]}" if a.get("excerpt") else "")
        for i, a in enumerate(sample)
    )

    user_prompt = f"""NOUVEL ARTICLE :
Titre : {new_title}
Extrait : {new_excerpt[:200]}

ARTICLES DÉJÀ PUBLIÉS ({len(sample)}) :
{articles_list}

Est-ce que le nouvel article est un doublon d'un article existant ? Réponds avec le JSON demandé."""

    try:
        timeout = aiohttp.ClientTimeout(total=OLLAMA_TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "system": SYSTEM_SIMILARITY,
                    "prompt": user_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "num_predict": 256,
                    },
                },
            ) as resp:
                resp.raise_for_status()
                data = await resp.json()
                raw = data.get("response", "").strip()
    except Exception as e:
        print(f"  [SIMILARITY] Erreur Ollama: {e} — similarité ignorée (on continue)")
        return False, 0, ""

    # Parser le JSON de la réponse
    try:
        # Extraire le JSON même si Ollama ajoute du texte autour
        json_match = re.search(r'\{[^{}]+\}', raw, re.DOTALL)
        if not json_match:
            print(f"  [SIMILARITY] Réponse JSON invalide: {raw[:100]}")
            return False, 0, ""

        parsed = json.loads(json_match.group())
        score = int(parsed.get("max_score", 0))
        similar_title = parsed.get("similar_title") or ""
        reason = parsed.get("reason", "")

        is_dup = score >= threshold
        return is_dup, score, similar_title or reason

    except (json.JSONDecodeError, ValueError) as e:
        print(f"  [SIMILARITY] Parse JSON échoué ({e}): {raw[:100]}")
        return False, 0, ""


async def check_topic_similarity_safe(
    new_title: str,
    new_excerpt: str,
    recent_articles: list[dict] | None = None,
    threshold: int = SIMILARITY_THRESHOLD,
) -> tuple[bool, int, str]:
    """Version sécurisée : ne bloque jamais le pipeline en cas d'erreur."""
    try:
        return await check_topic_similarity(new_title, new_excerpt, recent_articles, threshold)
    except Exception as e:
        print(f"  [SIMILARITY] Erreur inattendue: {e} — on continue sans vérification")
        return False, 0, ""
