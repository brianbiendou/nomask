# Mission 06 — Exécution des migrations Supabase

## Objectif
Exécuter les fichiers SQL du dossier `database/` dans Supabase pour créer les tables et insérer les données initiales.

## Ordre d'exécution (IMPORTANT)

Les fichiers doivent être exécutés **dans l'ordre numérique** :

1. `001_create_authors.sql` — Table des auteurs
2. `002_create_categories.sql` — Tables des catégories et sous-catégories
3. `003_create_articles.sql` — Table des articles (dépend de authors et categories)
4. `004_create_tags.sql` — Tables des tags et liaison articles-tags
5. `005_create_comments.sql` — Table des commentaires
6. `006_create_newsletter.sql` — Table des abonnés newsletter
7. `007_create_rls_policies.sql` — Politiques de sécurité RLS
8. `008_seed_categories.sql` — Données initiales des catégories
9. `009_seed_authors.sql` — Données initiales des auteurs
10. `010_seed_articles.sql` — 27 articles de démarrage

## Méthode 1 — Via l'interface Supabase (recommandé)

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet NoMask
3. Aller dans **SQL Editor**
4. Pour chaque fichier (dans l'ordre) :
   - Cliquer sur « New query »
   - Copier-coller le contenu du fichier SQL
   - Cliquer sur **Run**
   - Vérifier qu'il n'y a pas d'erreurs
5. Après le dernier fichier, vérifier dans **Table Editor** que les données sont bien présentes

## Méthode 2 — Via la CLI Supabase

```bash
# Installer la CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref <project-ref>

# Exécuter chaque migration
supabase db push
```

## Vérification

Après exécution, vérifier dans Supabase :
- [ ] Table `authors` : 6 auteurs
- [ ] Table `categories` : 9 catégories
- [ ] Table `subcategories` : 31 sous-catégories
- [ ] Table `articles` : 27 articles
- [ ] Table `tags` : vide (sera remplie au fur et à mesure)
- [ ] Table `comments` : vide
- [ ] Table `newsletter_subscribers` : vide
- [ ] RLS activé sur toutes les tables
