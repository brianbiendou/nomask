-- =============================================
-- 015 - Add source_domain column to articles
-- Tracks which source website the article came from
-- =============================================

ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_domain TEXT;

-- Index pour filtrer par source
CREATE INDEX IF NOT EXISTS idx_articles_source_domain ON articles (source_domain);
