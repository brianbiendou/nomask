# 🏗️ Architecture Docker — NoMask Backend

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│           Ton ordinateur (Windows)                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Docker Desktop (HyperV ou WSL2)             │   │
│  │  └────────────────────────────────────────┐  │   │
│  │     Container: nomask-backend             │  │   │
│  │     ├── Python 3.11 slim                  │  │   │
│  │     ├── FastAPI server                    │  │   │
│  │     ├── Port 8000:8000                    │  │   │
│  │     └── Scraping, IA, Images              │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                  ↓ (TCP)                             │
│  ┌──────────────────────────────────────────────┐   │
│  │  http://localhost:8000                       │   │
│  │  (Accessible de ton navigateur/apps)        │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Ollama (machine hôte, non-Docker)                  │
│  └── http://localhost:11434                        │
│      (Docker y accède via host.docker.internal)    │
│                                                      │
│  Supabase (cloud)    ←── API Backend                │
│  (base de données)                                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Les composants

### 1️⃣ Container Docker (`nomask-backend`)

**Rôle :** Isole le backend Python dans une boîte hermétique.

**Contenu :**
- `Python 3.11 slim` (OS minimaliste)
- `FastAPI` (framework web)
- `uvicorn` (serveur HTTP)
- Toutes les dépendances de `requirements.txt`

**Avantages :**
- ✅ Isolé du système Windows
- ✅ Redémarre automatiquement
- ✅ Ressources limite (CPU/RAM)
- ✅ Logs centralisés

**Ports exposés :**
```
0.0.0.0:8000 → 8000 (HTTP API)
```

---

### 2️⃣ Dockerfile

**Rôle :** La "recette" pour construire l'image Docker.

**Étapes :**
```dockerfile
FROM python:3.11-slim          # Image de base avec Python
RUN apt-get install ...         # Installe les dépendances système (lxml, etc.)
COPY requirements.txt .         # Copie les dépendances Python
RUN pip install ...             # Installe les packages Python
COPY . .                        # Copie tout le code backend
EXPOSE 8000                     # Expose le port 8000
CMD ["uvicorn", ...]            # Commande au démarrage
```

**Quand on rebuild :**
- Si tu modifies `requirements.txt`
- Si tu modifies le `Dockerfile` lui-même

---

### 3️⃣ docker-compose.yml

**Rôle :** Orchestre les containers (démarrage, config, réseau, volumes).

**Config importante :**
```yaml
services:
  backend:
    build:
      context: ./backend         # Où trouver le Dockerfile
    container_name: nomask-backend
    restart: unless-stopped      # Redémarre auto sauf si arrêté manuellement
    ports:
      - "8000:8000"              # Expose le port 8000
    env_file:
      - ./backend/.env           # Charge les variables d'env
    environment:
      OLLAMA_URL: http://host.docker.internal:11434  # Accès à Ollama sur l'hôte
    deploy:
      resources:
        limits:
          cpus: "4.0"            # Max 4 cœurs
          memory: 2G             # Max 2 GB RAM
    healthcheck:                 # Vérifie la santé toutes les 30s
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
```

**Quand tu modifies :**
- `ports` ou `environment` → `docker compose down && docker compose up -d`
- `resources` → `docker compose down && docker compose up -d`

---

### 4️⃣ backend/.env

**Rôle :** Les variables d'environnement secrètes (clés API, config).

**Exemple :**
```env
SUPABASE_SERVICE_ROLE_KEY=...  # Secret pour publier
OLLAMA_URL=http://host.docker.internal:11434
MAX_CONCURRENT_SCRAPES=10
```

**Sécurité :**
- ✅ Dans `.gitignore` (pas poussé sur GitHub)
- ✅ Chargé au démarrage du container
- ⚠️  Ne jamais commiter les vraies clés

**Quand tu modifies :** `docker compose restart backend`

---

## Flux d'exécution

### Démarrage complet (`docker compose up -d --build`)

```
1. Docker lit docker-compose.yml
2. Docker cherche le Dockerfile dans ./backend
3. Docker construit l'image (exécute chaque ligne du Dockerfile)
4. Docker crée un container à partir de l'image
5. Docker démarre le container
6. Le container exécute : uvicorn server:app --host 0.0.0.0 --port 8000
7. FastAPI écoute sur 0.0.0.0:8000
8. Le container est accessible via http://localhost:8000
```

### Au démarrage du container

```
1. Les variables d'env du backend/.env sont chargées
2. Python importe server.py
3. FastAPI crée l'app
4. CORS est configuré
5. uvicorn démarre et écoute le port 8000
6. Le healthcheck ping toutes les 30s
```

### Quand une requête arrive

```
Client → http://localhost:8000/api/pipeline/run
    ↓
Windows forwarde au port 8000 du container
    ↓
uvicorn reçoit la requête
    ↓
FastAPI routage → server.py
    ↓
Exécution async (scraping, IA, images en parallèle)
    ↓
Réponse JSON au client
```

---

## Optimisations appliquées

### 1. Parallélisme Async
- Scraping, download d'images, IA tournent **en parallèle**
- Pas de workers multiples (job store en mémoire)
- asyncio gère la concurrence

### 2. Ressources Docker
- **CPU limit** : 4 cœurs (scrapage + IA usage)
- **RAM limit** : 2 GB (assez pour les batches d'images)
- **Reservation** : 1 CPU + 512 MB (priorité minimale)

### 3. Uvicorn Settings
- `--limit-concurrency 100` : Max 100 requêtes simultanées
- `--timeout-keep-alive 120` : Garder les connections 2 min
- `--backlog 2048` : File d'attente TCP large

### 4. Reconnexion Ollama
- `host.docker.internal` = ta machine hôte
- Le container peut parler à Ollama sans problème

---

## Debugging

### Le container crash

```powershell
docker compose logs backend --tail=100
```

Cherche les erreurs. Les problèmes courants :

| Erreur | Cause | Solution |
|--------|-------|----------|
| `ModuleNotFoundError: No module named 'fastapi'` | Dépendances pas installées | `docker compose up -d --build` |
| `Connection refused: ollama` | Ollama n'est pas lancé | Lance Ollama sur ta machine |
| `NEXT_PUBLIC_SUPABASE_URL not set` | `.env` manque | Copie `.env` → `backend/.env` |
| `Address already in use :8000` | Port 8000 utilisé | Change le port dans `docker-compose.yml` |

---

## Limites actuelles

❌ **Pas de persistence** : Si le container crash, les jobs en mémoire sont perdus
- **Solution future** : Ajouter une DB (PostgreSQL dans Docker)

❌ **Pas de scaling** : 1 seul container backend
- **Solution future** : Nginx + plusieurs containers + load balancer

❌ **Logs non archivés** : Les vieux logs sont perdus après `docker compose down`
- **Solution future** : ELK Stack ou Loki pour centraliser les logs

---

## Prochaines étapes

Si tu veux améliorer l'infra :

1. **Ajouter une DB PostgreSQL** dans docker-compose
2. **Ajouter Redis** pour les jobs persistants
3. **Ajouter Nginx** pour reverse proxy + cache
4. **Ajouter un worker asynchrone** (Celery) pour les longs jobs

---

## 📚 Ressources

- **Docker :** https://docs.docker.com/
- **Docker Compose :** https://docs.docker.com/compose/
- **FastAPI :** https://fastapi.tiangolo.com/
- **Uvicorn :** https://www.uvicorn.org/
