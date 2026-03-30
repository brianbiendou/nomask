# Mission 03 — Google AdSense

## Objectif
Configurer Google AdSense pour monétiser le trafic du site.

## Prérequis
- Site en production avec contenu original (minimum 20-30 articles)
- Mentions légales et politique de confidentialité publiées
- Trafic régulier (pas de seuil minimum officiel, mais du contenu de qualité)

## Étapes

### 1. Créer un compte AdSense
- Aller sur https://www.google.com/adsense
- Se connecter et ajouter le site `nomask.fr`

### 2. Vérification du site
- Google fournira un code `<script>` à ajouter dans le `<head>`
- Ajouter ce code dans `src/app/layout.tsx` via la balise `<Script>` de Next.js :
```tsx
import Script from 'next/script';

// Dans le <head> du layout :
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### 3. Attendre la validation
- Google examine le site (quelques jours à 2 semaines)
- Le site doit respecter les règles de contenu d'AdSense

### 4. Configurer les emplacements publicitaires
Emplacements recommandés :
- **Header** : bannière en haut de page (leaderboard 728×90)
- **Sidebar** : rectangle dans la barre latérale (300×250)
- **In-article** : entre les paragraphes d'un article
- **Fin d'article** : avant les commentaires

### 5. Créer des composants d'annonces
Créer un composant `AdUnit.tsx` réutilisable qui intègre les blocs publicitaires.

### 6. Optimisation
- Tester différents placements avec les rapports AdSense
- Ne pas dépasser 3-4 annonces visibles par page
- Respecter les Core Web Vitals (lazy loading des annonces)
