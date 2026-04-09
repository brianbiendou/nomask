-- =============================================
-- 013 - Seed Brian BIENDOU + compléter URLs auteurs
-- NoMask - Site d'actualité
-- =============================================

-- 1. Ajouter Brian BIENDOU (fondateur & directeur de publication)
INSERT INTO authors (name, slug, bio, avatar_url, role)
VALUES (
  'Brian Biendou',
  'brian-biendou',
  'Fondateur et directeur de publication de NoMask. Convaincu que l''information doit être libre, accessible et sans filtre, il a créé ce média pour offrir une alternative indépendante dans le paysage médiatique français et international.',
  'https://rmhjnljlatmtlwilrvuz.supabase.co/storage/v1/object/public/article-images/authors/brian-biendou.jpeg',
  'Fondateur & Directeur de publication'
)
ON CONFLICT (slug) DO NOTHING;
