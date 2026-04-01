# 🔐 Variables d'environnement Docker

Ce fichier explique chaque variable du `backend/.env`.

---

## Supabase (Nécessaire pour la publication)

```env
NEXT_PUBLIC_SUPABASE_URL=https://rmhjnljlatmtlwilrvuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | L'URL de ton projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (côté client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur (côté backend, **secrète**) — publie les articles |

**Où les trouver :**
1. Va sur https://app.supabase.com
2. Sélectionne ton projet
3. Settings → API → Copie les URL et clés

---

## Ollama (LLM pour la réécriture IA)

```env
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=gemma3:12b
OLLAMA_TIMEOUT=120
```

| Variable | Rôle | Valeur |
|----------|------|--------|
| `OLLAMA_URL` | URL de ton serveur Ollama | `http://host.docker.internal:11434` (en Docker sur Windows) |
| `OLLAMA_MODEL` | Modèle IA pour réécrire | `gemma3:12b` (recommandé) ou `llama2`, `mistral`, etc. |
| `OLLAMA_TIMEOUT` | Timeout max par requête IA (en sec) | `120` (2 min, raisonnable) |

**Note:** En Docker Windows, `host.docker.internal` = ta machine hôte. Olllama doit tourner sur ta machine.

---

## Parallélisme (Performance)

```env
MAX_CONCURRENT_SCRAPES=10
MAX_CONCURRENT_IMAGE_DOWNLOADS=20
MAX_CONCURRENT_REWRITES=3
```

| Variable | Rôle | Valeur par défaut |
|----------|------|-------------------|
| `MAX_CONCURRENT_SCRAPES` | Nb de pages à scraper en parallèle | `10` |
| `MAX_CONCURRENT_IMAGE_DOWNLOADS` | Nb d'images à télécharger en parallèle | `20` |
| `MAX_CONCURRENT_REWRITES` | Nb d'articles à réécrire en parallèle (IA lente) | `3` |

**Conseil :** 
- ↑ Les nombres si tu as beaucoup de CPU/RAM
- ↓ Les nombres si tu as des timeouts

---

## Comment modifier les variables

### Option 1 : Édite `backend/.env` directement
```powershell
code C:\App\nomask\backend\.env
```
Sauvegarde, puis :
```powershell
docker compose restart backend
```

### Option 2 : Modifie dans `docker-compose.yml`
```yaml
environment:
  MAX_CONCURRENT_SCRAPES: "15"
  OLLAMA_MODEL: "mistral"
```
Puis :
```powershell
docker compose down && docker compose up -d
```

---

## ⚠️ Secrets à ne pas commiter

```bash
SUPABASE_SERVICE_ROLE_KEY  # ✗ Jamais pousser sur GitHub
NEXT_PUBLIC_SUPABASE_URL    # ✓ OK, publique mais propres à ton projet
```

Le `.env` est dans `.gitignore`, donc c'est sauf.

---

## Variables avancées (optionnel)

Tu peux aussi ajouter dans `backend/.env` :

```env
# Logs verbose du scraping
LOG_LEVEL=DEBUG

# Nombre max d'articles par batch
MAX_ARTICLES_PER_BATCH=10

# URL de proxy (si derrière un proxy d'entreprise)
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
```

Mais les valeurs par défaut suffisent.

---

## 🔗 Docs

- **Supabase API Keys :** https://app.supabase.com → Settings → API
- **Ollama Models :** https://ollama.ai/library
- **Ollama Server :** https://ollama.ai/
