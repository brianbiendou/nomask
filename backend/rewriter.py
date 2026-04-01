"""Module de réécriture — réécrit un article via Ollama local.

Utilise le modèle configuré (OLLAMA_MODEL) via l'API Ollama pour :
1. Réécrire le contenu complet de l'article
2. Réécrire le titre
3. Réécrire l'extrait/chapô

Le point de vue (perspective) est injecté dans le prompt système.
"""
import json
import re

import requests
from slugify import slugify
from bs4 import BeautifulSoup

from config import (
    DEFAULT_PERSPECTIVE,
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    OLLAMA_TIMEOUT,
)


def _call_ollama(system_prompt: str, user_prompt: str, temperature: float = 0.7) -> tuple[str, bool]:
    """Appelle Ollama et retourne (réponse texte, True si Ollama a répondu)."""
    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "system": system_prompt,
                "prompt": user_prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": 4096,
                    "top_p": 0.9,
                },
            },
            timeout=OLLAMA_TIMEOUT,
        )
        resp.raise_for_status()
        text = resp.json().get("response", "").strip()
        return (text, True) if text else ("", False)
    except requests.exceptions.ConnectionError:
        print("  [WARN] Ollama non disponible, réécriture structurelle utilisée.")
        return "", False
    except Exception as e:
        print(f"  [WARN] Erreur Ollama: {e}")
        return "", False


# ────────────────────────── PROMPTS ──────────────────────────

SYSTEM_REWRITE_CONTENT = """Tu es un rédacteur journalistique francophone expert. Tu dois RÉÉCRIRE INTÉGRALEMENT un article pour le site NoMask.

RÈGLES STRICTES :
- Réécris TOUT le texte avec tes propres mots, ne copie AUCUNE phrase telle quelle
- Garde TOUTES les informations factuelles (noms, chiffres, dates, lieux)
- Le texte final doit faire une longueur similaire à l'original
- Écris en HTML avec des balises <h2>, <h3>, <p>, <strong>, <em>
- Commence directement par le contenu HTML, PAS de ```html ni de commentaires
- N'invente AUCUNE information
- Utilise un français impeccable, riche et varié
- SUPPRIME TOUTE mention d'un autre média ou journal (Numerama, Le Monde, Frandroid, Les Échos, Le Figaro, BFM, TF1, 01net, Clubic, etc.)
- SUPPRIME tout texte promotionnel du site source (ex: "Installer Numerama", "Découvrez notre comparateur", "Retrouvez-nous sur…", liens vers d'autres médias)
- Si l'article cite un autre média comme source, remplace par "selon nos informations" ou "d'après les dernières informations disponibles"
- Le seul site mentionné doit être NoMask
- Point de vue : {perspective}"""

SYSTEM_REWRITE_TITLE = """Tu es un rédacteur de titres d'articles expert en français. Tu dois réécrire le titre donné.

RÈGLES :
- Garde toutes les informations clés (noms, chiffres, dates)
- Rends le titre accrocheur et unique
- Maximum 100 caractères
- Ne mets PAS de guillemets autour du titre
- Réponds UNIQUEMENT avec le nouveau titre, rien d'autre
- Point de vue : {perspective}"""

SYSTEM_REWRITE_EXCERPT = """Tu es un rédacteur journalistique francophone. Tu dois réécrire le chapô (extrait) d'un article.

RÈGLES :
- Réécris avec tes propres mots
- Garde les infos clés
- Maximum 250 caractères
- 1 à 2 phrases maximum
- Réponds UNIQUEMENT avec le nouveau chapô
- Point de vue : {perspective}"""


# ────────────────────────── FONCTIONS PUBLIQUES ──────────────────────────

def rewrite_content(
    content_html: str,
    content_text: str,
    perspective: str = DEFAULT_PERSPECTIVE,
) -> tuple[str, bool]:
    """Réécrit le contenu HTML via Ollama. Retourne (contenu, used_ollama)."""
    system = SYSTEM_REWRITE_CONTENT.format(perspective=perspective)

    # On envoie le texte brut pour éviter la confusion avec le HTML source
    user_prompt = f"""Voici l'article original à réécrire :

{content_text[:6000]}

Réécris cet article INTÉGRALEMENT en HTML (h2, h3, p, strong, em). Garde toutes les infos factuelles mais reformule tout avec tes propres mots."""

    result, used_ollama = _call_ollama(system, user_prompt, temperature=0.7)

    if not result:
        # Fallback : retourne le contenu original nettoyé
        return content_html, False

    # Nettoie le résultat (enlève les blocs code markdown si présents)
    result = re.sub(r'^```html?\s*\n?', '', result)
    result = re.sub(r'\n?```\s*$', '', result)
    result = result.strip()

    # Vérifie que c'est bien du HTML
    if not any(tag in result for tag in ["<p>", "<h2>", "<h3>", "<div>"]):
        # Wrappe en paragraphes si c'est du texte brut
        paragraphs = result.split("\n\n")
        result = "".join(f"<p>{p.strip()}</p>" for p in paragraphs if p.strip())

    return result, True


def rewrite_title(title: str, perspective: str = DEFAULT_PERSPECTIVE) -> tuple[str, bool]:
    """Réécrit le titre via Ollama. Retourne (titre, used_ollama)."""
    system = SYSTEM_REWRITE_TITLE.format(perspective=perspective)
    user_prompt = f"Titre original : {title}"

    result, used_ollama = _call_ollama(system, user_prompt, temperature=0.8)

    if not result:
        return title, False

    result = result.strip().strip('"').strip("'").strip("«").strip("»")
    result = result.split("\n")[0].strip()

    if len(result) > 150 or len(result) < 10:
        return title, False

    return result, True


def rewrite_excerpt(excerpt: str, perspective: str = DEFAULT_PERSPECTIVE) -> tuple[str, bool]:
    """Réécrit l'extrait via Ollama. Retourne (extrait, used_ollama)."""
    system = SYSTEM_REWRITE_EXCERPT.format(perspective=perspective)
    user_prompt = f"Chapô original : {excerpt}"

    result, used_ollama = _call_ollama(system, user_prompt, temperature=0.7)

    if not result:
        return excerpt, False

    result = result.strip().strip('"').strip("'")
    result = result.split("\n")[0].strip()

    if len(result) > 300:
        result = result[:297] + "..."

    if len(result) < 20:
        return excerpt, False

    return result, True


def generate_slug(title: str) -> str:
    """Génère un slug unique à partir du titre."""
    base_slug = slugify(title, max_length=80)
    return base_slug


# ────────────────────────── CLASSIFICATION IA ──────────────────────────

SYSTEM_CLASSIFY = """Tu es un classificateur d'articles de presse francophone. Tu dois déterminer la catégorie d'un article parmi cette liste EXACTE :

- politique (politique française, internationale, diplomatie, lois, gouvernement)
- economie (entreprises, marchés, finance, emploi, immobilier, commerce)
- societe (fait divers, justice, éducation, santé, environnement, immigration)
- tech (technologie, smartphones, cybersécurité, IA, informatique, internet, réseaux sociaux)
- culture (cinéma, musique, jeux vidéo, livres, art, streaming, séries, divertissement)
- science (espace, recherche, astronomie, physique, biologie, médecine)
- sport (football, tennis, F1, JO, basket, rugby, tous les sports)
- style (mode, beauté, luxe, lifestyle, gastronomie, voyage, tendances)

RÈGLES :
- Réponds UNIQUEMENT avec le slug de la catégorie (un seul mot, en minuscules)
- Si tu hésites entre deux catégories, choisis la plus spécifique
- Un article sur TotalEnergies et Washington = economie (accord commercial)
- Un article sur une loi tech = politique (c'est législatif)
- Un article sur l'IA DeepMind = tech (technologie)
- Un article sur SpaceX / fusée = science (espace)"""


def classify_article(title: str, excerpt: str, content_text: str = "") -> tuple[str, bool]:
    """Classifie un article via Ollama. Retourne (slug_catégorie, used_ollama).

    Le content_text peut être tronqué pour limiter le contexte.
    """
    VALID_CATEGORIES = {"politique", "economie", "societe", "tech", "culture", "science", "sport", "style"}

    user_prompt = f"""Classe cet article dans une catégorie :

Titre : {title}
Extrait : {excerpt[:300]}
Début du contenu : {content_text[:500]}

Catégorie (un seul mot) :"""

    result, used_ollama = _call_ollama(SYSTEM_CLASSIFY, user_prompt, temperature=0.1)

    if not result:
        return "", False

    # Nettoyer la réponse
    cat = result.strip().lower().split("\n")[0].strip().strip('"').strip("'")
    # Enlever tout ce qui n'est pas le slug
    cat = re.sub(r'[^a-z]', '', cat)

    if cat in VALID_CATEGORIES:
        return cat, True

    # Tentative de matching partiel
    for valid in VALID_CATEGORIES:
        if valid in cat or cat in valid:
            return valid, True

    return "", False
