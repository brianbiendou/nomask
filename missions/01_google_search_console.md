# Mission 01 — Google Search Console

## Objectif
Enregistrer nomask.fr dans Google Search Console pour indexer le site et suivre les performances SEO.

## Étapes

### 1. Accéder à Google Search Console
- Aller sur https://search.google.com/search-console
- Se connecter avec le compte Google du projet

### 2. Ajouter la propriété
- Cliquer sur « Ajouter une propriété »
- Choisir **Propriété de domaine** et entrer `nomask.fr`
- Vérifier via enregistrement DNS TXT chez le registrar du domaine

### 3. Soumettre le sitemap
- Dans le menu latéral : **Sitemaps**
- Ajouter l'URL : `https://nomask.fr/sitemap.xml`
- Le sitemap est généré dynamiquement par Next.js

### 4. Demander l'indexation
- Aller dans **Inspection d'URL**
- Entrer `https://nomask.fr`
- Cliquer sur « Demander l'indexation »
- Répéter pour les pages de catégorie principales

### 5. Suivi régulier
- Vérifier les erreurs d'indexation chaque semaine
- Surveiller les Core Web Vitals
- Vérifier les pages exclues et corriger si nécessaire
- Surveiller les requêtes de recherche dans l'onglet **Performances**
