FROM python:3.11-slim

WORKDIR /app

# Dépendances système pour lxml
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libxml2-dev libxslt1-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Le .env.local sera monté en volume ou passé via --env-file
# Ollama doit être accessible depuis le conteneur (host.docker.internal ou IP réseau)

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
