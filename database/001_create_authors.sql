-- =============================================
-- 001 - Création de la table des auteurs
-- NoMask - Site d'actualité
-- =============================================

CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Journaliste',
  twitter_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche par slug
CREATE INDEX idx_authors_slug ON authors(slug);
