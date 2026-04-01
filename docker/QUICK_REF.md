# ⚡ Quick Reference — Commandes les plus courantes

## 📌 Au quotidien

```powershell
# Démarrer le backend (première fois)
docker compose up -d --build

# Relancer après une pause
docker compose up -d

# Voir les logs en direct
docker compose logs -f backend

# Redémarrer après une modif
docker compose restart backend

# Arrêter complètement
docker compose down
```

## 🔧 Après une modif

| Tu as modifié | Commande |
|---------------|----------|
| `backend/.env` | `docker compose restart backend` |
| `backend/server.py` | `docker compose restart backend` |
| `backend/requirements.txt` | `docker compose up -d --build` |
| `Dockerfile` | `docker compose up -d --build --no-cache` |
| `docker-compose.yml` | `docker compose down && docker compose up -d` |

## 🧹 Nettoyage

```powershell
# Supprimer juste le container
docker compose down

# Supprimer tout (nucléaire)
docker compose down -v --rmi all && docker builder prune -a

# Rebuild de zéro
docker compose up -d --build --no-cache
```

## 🩺 Santé du backend

```powershell
# Vérifier l'état
docker compose ps

# Vérifier que l'API répond
Invoke-RestMethod -Uri "http://localhost:8000/health"

# Voir les erreurs
docker compose logs backend --tail=50
```

---

📖 Pour plus de détails → voir `docker/COMMANDS.md`
