# 🐳 NoMask — Commandes Docker

Ce fichier documente toutes les commandes Docker pour gérer le backend.

Commandes utiles:
  Get-Service cloudflared          # VÃ©rifier le statut
  Restart-Service cloudflared      # RedÃ©marrer
  Stop-Service cloudflared         # ArrÃªter
  cloudflared service uninstall    # DÃ©sinstaller

---

## 📋 Table des matières

1. [Démarrage & Arrêt](#démarrage--arrêt)
2. [Logs & Monitoring](#logs--monitoring)
3. [Rebuild & Reset](#rebuild--reset)
4. [Modifications Spécifiques](#modifications-spécifiques)
5. [Nettoyage Complet](#nettoyage-complet)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Démarrage & Arrêt

### Démarrer pour la première fois
```powershell
cd C:\App\nomask
docker compose up -d --build
```
**Rôle :** Lance le container backend, le construit s'il n'existe pas, tourne en arrière-plan (`-d`).

**État attendu :**
```
✓ nomask-backend    Up (healthy)
```

---

### Démarrer (sans rebuild)
```powershell
docker compose up -d
```
**Rôle :** Relance les containers. Utilise l'image existante (plus rapide).

---

### Arrêter les containers
```powershell
docker compose down
```
**Rôle :** Arrête et enlève les containers (mais garde les images et volumes).

---

### Redémarrer les containers
```powershell
docker compose restart
```
**Rôle :** Arrête puis relance les containers. Utile pour appliquer certaines changements sans rebuild.

---

## 📊 Logs & Monitoring

### Voir les logs en direct (derniers 50 lignes)
```powershell
docker compose logs -f backend
```
**Rôle :** Affiche les logs du backend en temps réel. Appuie sur `Ctrl+C` pour quitter.

---

### Voir les logs (dernières 100 lignes, sans suivre)
```powershell
docker compose logs backend --tail=100
```
**Rôle :** Affiche les 100 dernières lignes de log et quitte.

---

### Vérifier l'état des containers
```powershell
docker compose ps
```
**Rôle :** Affiche le statut (Up, Exited, etc.) et les ports.

---

### Tester l'API santé
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health"
```
**Rôle :** Vérifie que le backend répond. Retourne : `{status: "ok", model: "gemma3:12b", ollama: "http://..."}`.

---

## 🔨 Rebuild & Reset

### Rebuild du container (mais garder les données)
```powershell
docker compose up -d --build
```
**Rôle :** Reconstruit l'image Docker en lisant le Dockerfile, puis relance.

**Utilise si :**
- Tu as modifié le `Dockerfile`
- Tu as modifié `backend/requirements.txt`
- Tu veux appliquer les dernières dépendances

---

### Rebuild sans cache (reconstruit tous les layers)
```powershell
docker compose up -d --build --no-cache
```
**Rôle :** Force la reconstruction depuis zéro, ignore le cache Docker.

**Utilise si :**
- Tu as un problème bizarre de cache
- Tu veux une construction "vraiment" propre

---

### Rebuild que du code Python (sans redémarrer)
Si tu as seulement modifié `backend/server.py`, `backend/pipeline.py`, etc., **tu n'as PAS besoin de rebuild**. Le fichier `.py` est copié dans le container au build, mais le container redémarre automatiquement avec le changement.

**Simplement fais :**
```powershell
docker compose down
docker compose up -d
```

---

## ⚙️ Modifications Spécifiques

### J'ai modifié `backend/.env`
```powershell
docker compose restart backend
```
**Rôle :** Les variables d'env `env_file` sont relues au redémarrage. Pas besoin de rebuild.

---

### J'ai modifié `backend/server.py` ou autre `.py`
```powershell
docker compose down
docker compose up -d
```
Ou plus simple :
```powershell
docker compose restart backend
```
**Rôle :** Le container relit le code. Le code `.py` a été copié au build du Dockerfile, donc le redémarrage suffit.

---

### J'ai modifié `backend/requirements.txt`
```powershell
docker compose up -d --build
```
**Rôle :** Rebuild nécessaire pour installer les nouvelles dépendances.

---

### J'ai modifié le `Dockerfile`
```powershell
docker compose up -d --build --no-cache
```
**Rôle :** Rebuild du Dockerfile.

---

### J'ai modifié `docker-compose.yml`
```powershell
docker compose down
docker compose up -d
```
**Rôle :** Les nouvelles config (ports, env, ressources) prennent effet.

---

## 🧹 Nettoyage Complet

### Supprimer le container
```powershell
docker compose down
```
**Rôle :** Arrête et supprime les containers (pas les images, pas les volumes).

---

### Supprimer le container + le volume
```powershell
docker compose down -v
```
**Rôle :** Supprime aussi les volumes Docker (données persistantes si j'en avais).

---

### Supprimer l'image
```powershell
docker rmi nomask-backend
```
**Rôle :** Supprime l'image Docker de nomask-backend.

---

### Supprimer container + image + volume
```powershell
docker compose down -v --rmi all
```
**Rôle :** Supprime **tout** : containers, volumes, images.

---

### Nettoyer le cache Docker complet
```powershell
docker builder prune -a
```
**Rôle :** Supprime tout le cache Docker. La prochaine build sera **très lente** mais complètement propre.

---

### Rebuild de zéro (nucléaire)
```powershell
docker compose down -v --rmi all
docker builder prune -a
docker compose up -d --build --no-cache
```
**Rôle :** Supprime tout, nettoie le cache, rebuild complètement from scratch.

**Utilise si :**
- Des problèmes majeurs persistent
- Tu veux être 100% sûr que c'est propre
- Tu veux tester une configuration complètement neuve

---

## 🐛 Troubleshooting

### Le container crash / démarre mais s'arrête
```powershell
docker compose logs backend
```
Cherche les erreurs dans les logs. Les erreurs communes :

**❌ `NEXT_PUBLIC_SUPABASE_URL not found`**
→ `backend/.env` manque ou mal configuré.
```powershell
# Copie depuis .env racine
Copy-Item .env ..\backend\.env
```

**❌ `Connection refused: http://host.docker.internal:11434`**
→ Ollama ne tourne pas sur la machine hôte.
```powershell
# En Windows, lance Ollama séparément
ollama serve
```

---

### Le backend répond très lentement
```powershell
docker compose ps
docker stats nomask-backend
```
Vérifie que CPU/RAM ne sont pas saturés. Si c'est le cas, augmente dans `docker-compose.yml` :
```yaml
limits:
  cpus: "4.0"
  memory: 2G
```
Puis `docker compose up -d`.

---

### Rebuild but le container ne voit pas mes changements
```powershell
# Rebuild sans cache
docker compose up -d --build --no-cache
```

---

### Je veux voir l'intérieur du container
```powershell
docker exec -it nomask-backend bash
```
Tu entres dans un shell bash du container. Tape `exit` pour quitter.

---

## 📝 Résumé des commandes

| Action | Commande |
|--------|----------|
| Démarrer tout | `docker compose up -d` |
| Démarrer + rebuild | `docker compose up -d --build` |
| Arrêter | `docker compose down` |
| Redémarrer | `docker compose restart backend` |
| Voir les logs | `docker compose logs -f backend` |
| Vérifier statut | `docker compose ps` |
| Reset complet | `docker compose down -v --rmi all && docker builder prune -a && docker compose up -d --build --no-cache` |
| Modifié `.env` | `docker compose restart backend` |
| Modifié `.py` | `docker compose restart backend` |
| Modifié `requirements.txt` | `docker compose up -d --build` |
| Modifié `Dockerfile` | `docker compose up -d --build --no-cache` |

---

## 🔗 Ressources

- **Docker Compose docs :** https://docs.docker.com/compose/
- **Docker CLI docs :** https://docs.docker.com/engine/reference/commandline/
- **Logs du backend :** `docker compose logs -f backend`
