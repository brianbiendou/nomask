"""Configuration centralisée du backend NoMask."""
import os
from dotenv import load_dotenv
from pathlib import Path

# 1) Charge .env dans le dossier backend (Docker)
local_env = Path(__file__).resolve().parent / ".env"
if local_env.exists():
    load_dotenv(local_env)

# 2) Fallback : .env.local du projet Next.js parent (dev local sans Docker)
parent_env = Path(__file__).resolve().parent.parent / ".env.local"
if parent_env.exists():
    load_dotenv(parent_env, override=False)

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

# Bucket Supabase Storage pour les images d'articles
STORAGE_BUCKET = "article-images"

# Point de vue par défaut pour la réécriture
DEFAULT_PERSPECTIVE = (
    "analyse critique et tech savvy — décrypte les implications cachées, "
    "questionne les narratifs officiels, révèle ce que la presse mainstream oublie, "
    "avec une plume directe et engagée pour un lecteur curieux et exigeant"
)

# Seuil de similarité sémantique (0-100) au-delà duquel un article est considéré doublon
SIMILARITY_THRESHOLD = int(os.environ.get("SIMILARITY_THRESHOLD", "75"))

# Ollama (LLM local)
# En Docker : OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_BASE_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral:7b")
OLLAMA_TIMEOUT = int(os.environ.get("OLLAMA_TIMEOUT", "300"))  # secondes par requête (CPU mode = plus lent)

# Headers pour le scraping
SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
}

# Limites parallélisme
MAX_CONCURRENT_SCRAPES = int(os.environ.get("MAX_CONCURRENT_SCRAPES", "10"))
MAX_CONCURRENT_IMAGE_DOWNLOADS = int(os.environ.get("MAX_CONCURRENT_IMAGE_DOWNLOADS", "20"))
MAX_CONCURRENT_REWRITES = int(os.environ.get("MAX_CONCURRENT_REWRITES", "3"))

# Telegram Bot
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

# IndexNow
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "")
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://www.nomask.fr")
