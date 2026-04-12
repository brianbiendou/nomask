"""
Script d'enrichissement des articles 400-600 mots — NoMask
===========================================================
Lit la liste générée par fix_adsense_content.py,
enrichit chaque article via Ollama (backend local),
puis met à jour Supabase.

Prérequis : backend Python (FastAPI) lancé sur localhost:8000
"""

import json
import re
import time
import requests

SUPABASE_URL = "https://rmhjnljlatmtlwilrvuz.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaGpubGpsYXRtdGx3aWxydnV6Iiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcxODkyMCwiZXhwIjoyMDkwMjk0OTIwfQ."
    "uqM5MUdBFxIlSSDIVl_D46bWK6P-zpV3UafZWaQCjt4"
)
OLLAMA_URL = "http://localhost:11434"
OLLAMA_MODEL = "gemma3:12b"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

ENRICH_SYSTEM = """Tu es un rédacteur journalistique francophone expert pour le site NoMask.
Tu reçois un article existant en HTML et tu dois l'ENRICHIR sans modifier les faits.

RÈGLES STRICTES :
- Ne modifie pas le contenu existant, AJOUTE seulement du contenu
- Développe les paragraphes existants avec plus de détails et de contexte
- AJOUTE obligatoirement à la fin :
  1. Une section <h2>Contexte et enjeux</h2> : 2-3 paragraphes qui replacent le sujet dans son contexte historique, ses implications politiques/économiques/sociales, et les tendances de fond
  2. Une section <h2>Ce qu'il faut retenir</h2> : liste <ul><li> de 4-5 points clés synthétiques
- Le texte final doit dépasser 700 mots
- Écris UNIQUEMENT en français
- Aucun caractère chinois/japonais/coréen
- Commence directement par le HTML enrichi"""


def strip_html(html: str) -> str:
    return re.sub(r"<[^>]+>", " ", html or "")


def word_count(html: str) -> int:
    return len(strip_html(html).split())


def call_ollama(content_html: str, title: str) -> str | None:
    content_text = strip_html(content_html)[:5000]
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "system": ENRICH_SYSTEM,
                "prompt": f"Titre : {title}\n\nArticle à enrichir :\n{content_html[:8000]}\n\nEnrichis cet article en ajoutant du contexte et les deux sections obligatoires.",
                "stream": False,
                "options": {"temperature": 0.6, "num_predict": 3000, "top_p": 0.9},
            },
            timeout=180,
        )
        resp.raise_for_status()
        result = resp.json().get("response", "").strip()
        # Nettoyer les blocs markdown si présents
        result = re.sub(r"^```html?\s*\n?", "", result)
        result = re.sub(r"\n?```\s*$", "", result)
        return result.strip() if result else None
    except Exception as e:
        print(f"    Erreur Ollama: {e}")
        return None


def supabase_get_article(article_id: str) -> dict | None:
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        params={"select": "id,title,content", "id": f"eq.{article_id}"},
    )
    resp.raise_for_status()
    data = resp.json()
    return data[0] if data else None


def supabase_update_article(article_id: str, content: str) -> bool:
    resp = requests.patch(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        json={"content": content},
        params={"id": f"eq.{article_id}"},
    )
    return resp.ok


# ─── Main ───────────────────────────────────────────────────

print("\n" + "=" * 60)
print("Enrichissement des articles 400-600 mots")
print("=" * 60)

# Vérifier Ollama
try:
    r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
    if r.status_code != 200:
        raise Exception("Ollama non disponible")
    print(f"\n  ✅ Ollama disponible ({OLLAMA_URL})")
except Exception as e:
    print(f"\n  ❌ Ollama non disponible: {e}")
    print("  Lance d'abord : docker-compose up -d  (ou démarre Ollama manuellement)")
    exit(1)

# Charger la liste
try:
    with open("scripts/articles_to_enrich.json", encoding="utf-8") as f:
        articles_list = json.load(f)
except FileNotFoundError:
    print("  ❌ scripts/articles_to_enrich.json introuvable")
    print("  Lance d'abord fix_adsense_content.py")
    exit(1)

print(f"  Articles à traiter : {len(articles_list)}")

enriched = 0
skipped = 0
errors = 0

for i, item in enumerate(articles_list):
    article_id = item["id"]
    title = item["title"]
    print(f"\n  [{i+1}/{len(articles_list)}] {title[:60]}")

    # Récupérer le contenu actuel
    article = supabase_get_article(article_id)
    if not article:
        print("    ⚠️  Article introuvable en DB")
        skipped += 1
        continue

    current_content = article.get("content", "")
    current_words = word_count(current_content)

    # Si déjà 600+ mots, passer
    if current_words >= 600:
        print(f"    ✅ Déjà {current_words} mots, ignoré")
        skipped += 1
        continue

    print(f"    {current_words} mots → enrichissement...")

    # Appel Ollama
    enriched_content = call_ollama(current_content, title)
    if not enriched_content:
        print("    ❌ Échec Ollama")
        errors += 1
        continue

    new_words = word_count(enriched_content)
    if new_words < current_words:
        print(f"    ⚠️  Résultat plus court ({new_words} mots), ignoré")
        errors += 1
        continue

    # Mettre à jour en DB
    if supabase_update_article(article_id, enriched_content):
        print(f"    ✅ {current_words} → {new_words} mots")
        enriched += 1
    else:
        print("    ❌ Erreur mise à jour Supabase")
        errors += 1

    # Pause pour ne pas surcharger Ollama
    time.sleep(2)

print("\n" + "=" * 60)
print(f"  Enrichis    : {enriched}")
print(f"  Ignorés     : {skipped}")
print(f"  Erreurs     : {errors}")
print("=" * 60)
