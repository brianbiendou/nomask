FROM python:3.11-slim

WORKDIR /app

# Dépendances système pour lxml
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libxml2-dev libxslt1-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Le .env sera monté en volume ou passé via env_file
# Ollama doit être accessible depuis le conteneur (host.docker.internal ou IP réseau)

EXPOSE 8000

# NOTE : 1 seul worker car le job store est en mémoire (dict Python).
# Le parallélisme réel vient d'asyncio (scraping, images, IA en concurrent).
# --limit-concurrency : max requêtes simultanées traitées
# --timeout-keep-alive : garde les connexions ouvertes plus longtemps
# --backlog : file d'attente de connexions TCP
CMD ["uvicorn", "server:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--limit-concurrency", "100", \
     "--timeout-keep-alive", "120", \
     "--backlog", "2048", \
     "--no-access-log"]
