# Étapes manuelles — Plateformes externes

Tout le code est prêt côté technique. Voici ce que tu dois faire toi-même sur les différentes plateformes.

---

## 1. Google Search Console (DÉJÀ FAIT ✅)
Ta vérification est active : `kFB0UwSG_KWqN1fjX-e5n5eNQXHcag9mcZCJ0sEc16s`

**Actions post-déploiement :**
- Va dans Google Search Console → Sitemaps
- Soumets `https://www.nomask.fr/sitemap.xml` (il inclut maintenant auteurs, pages légales)
- Soumets `https://www.nomask.fr/rss.xml` comme flux RSS

---

## 2. Google News Publisher Center (PRIORITÉ #1)
**URL :** https://publishercenter.google.com

1. Connecte-toi avec ton compte Google
2. Clique "Ajouter une publication"
3. Remplis :
   - **Nom :** NoMask
   - **URL :** https://www.nomask.fr
   - **Langue :** Français
   - **Pays :** France
4. Section "Flux RSS" → Ajoute : `https://www.nomask.fr/rss.xml`
5. Section "Labels Google News" → Catégories : Politique, Économie, Tech, International, etc.
6. Soumets pour validation (peut prendre 1-4 semaines)

---

## 3. IndexNow (Bing, Yandex, Naver)
**URL :** https://www.indexnow.org/getstarted

1. Va sur https://www.bing.com/indexnow et génère une clé API
2. Copie la clé (ex: `a1b2c3d4e5f6...`)
3. Ajoute dans `.env.local` :
   ```
   INDEXNOW_KEY=ta-cle-ici
   ```
4. Crée le fichier `public/ta-cle-ici.txt` contenant juste la clé
5. Redéploie sur Vercel
6. Le pipeline pingera automatiquement IndexNow à chaque article publié

---

## 4. Bing Webmaster Tools / Bing News PubHub
**URL :** https://www.bing.com/webmasters

1. Connecte-toi avec un compte Microsoft
2. Ajoute `https://www.nomask.fr`
3. Vérifie via DNS ou fichier
4. Soumets le sitemap : `https://www.nomask.fr/sitemap.xml`
5. Pour **Bing News** : https://www.bing.com/news/publisher
   - Soumets la même publication avec le RSS Google News

---

## 5. Google AdSense
**URL :** https://www.google.com/adsense

1. Inscris-toi avec ton compte Google
2. Ajoute `nomask.fr`
3. Google te donnera un script `<script>` à ajouter → dis-moi et je l'intègre dans le layout
4. Attente de validation (1-2 semaines, requiert contenu suffisant)

---

## 6. Flipboard
**URL :** https://share.flipboard.com

1. Crée un compte Flipboard
2. Va dans "Create Magazine"
3. Ajoute le flux RSS : `https://www.nomask.fr/rss.xml`
4. Tu peux aussi ajouter les RSS par catégorie :
   - `https://www.nomask.fr/rss/politique`
   - `https://www.nomask.fr/rss/tech`
   - `https://www.nomask.fr/rss/international`
   - etc.

---

## 7. Apple News
**URL :** https://developer.apple.com/news-publisher/

1. Nécessite un compte Apple Developer ($99/an)
2. Soumets `nomask.fr` + le flux RSS
3. Processus de validation similaire à Google News

---

## 8. NewsBreak
**URL :** https://creators.newsbreak.com

1. Crée un compte créateur
2. Soumets le flux RSS : `https://www.nomask.fr/rss.xml`
3. Validation rapide (quelques jours)

---

## 9. Analytics (recommandé : Plausible ou Umami)

### Option A — Plausible (payant, simple)
**URL :** https://plausible.io
- 9€/mois, tracking léger, pas de cookies, RGPD natif
- Tu ajouteras un script dans le layout → dis-moi

### Option B — Umami (gratuit, self-hosted)
**URL :** https://umami.is
- Self-hosted sur Vercel ou autre
- Même avantages que Plausible

### Option C — Vercel Analytics (DÉJÀ ACTIF ✅)
- Tu as déjà `<Analytics />` de Vercel dans le layout

---

## 10. Réseaux sociaux (tu gères toi-même)
Quand tu crées tes comptes, donne-moi les URLs et je les ajoute dans :
- Le footer (icônes sociale)
- Les profils auteurs Supabase (twitter_url, linkedin_url)
- Le JSON-LD Organization

Réseaux à créer :
- [ ] X (Twitter) : @nomask_fr
- [ ] Instagram : @nomask_fr
- [ ] TikTok : @nomask_fr
- [ ] YouTube : NoMask
- [ ] Facebook : NoMask
- [ ] Threads : @nomask_fr
- [ ] Telegram Canal public : @nomask_fr (tu as déjà le bot alertes)

---

## 11. Logo PNG (optionnel)
Le RSS et JSON-LD référencent `/logo.png`. Next.js génère dynamiquement `/icon` (512x512).
Si tu veux un logo PNG personnalisé :
1. Crée un fichier `logo.png` (600x60 pour Google News, 512x512 carré)
2. Place-le dans `public/`

---

## Résumé des priorités

| # | Action | Urgence | Temps |
|---|--------|---------|-------|
| 1 | Google Publisher Center | 🔴 Critique | 15 min + attente |
| 2 | IndexNow clé | 🔴 Critique | 5 min |
| 3 | Bing Webmaster + News | 🟠 Fort | 10 min |
| 4 | Flipboard | 🟡 Moyen | 5 min |
| 5 | NewsBreak | 🟡 Moyen | 5 min |
| 6 | Réseaux sociaux | 🟡 Moyen | Ongoing |
| 7 | Logo PNG | 🟢 Bonus | 5 min |
| 8 | Apple News | 🟢 Bonus | 15 min + $99 |
| 9 | Google AdSense | 🟢 Bonus | 10 min + attente |
