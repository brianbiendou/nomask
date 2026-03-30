-- =============================================
-- 007 - Row Level Security (RLS) Policies
-- NoMask - Site d'actualité
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ===== LECTURE PUBLIQUE =====
-- Tout le monde peut lire les auteurs
CREATE POLICY "authors_read" ON authors
  FOR SELECT USING (true);

-- Tout le monde peut lire les catégories
CREATE POLICY "categories_read" ON categories
  FOR SELECT USING (true);

CREATE POLICY "subcategories_read" ON subcategories
  FOR SELECT USING (true);

-- Tout le monde peut lire les articles publiés
CREATE POLICY "articles_read_published" ON articles
  FOR SELECT USING (status = 'published');

-- Tout le monde peut lire les tags
CREATE POLICY "tags_read" ON tags
  FOR SELECT USING (true);

CREATE POLICY "article_tags_read" ON article_tags
  FOR SELECT USING (true);

-- Tout le monde peut lire les commentaires approuvés
CREATE POLICY "comments_read_approved" ON comments
  FOR SELECT USING (is_approved = true);

-- ===== INSERTION PUBLIQUE =====
-- Les visiteurs peuvent poster des commentaires
CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (true);

-- Les visiteurs peuvent s'abonner à la newsletter
CREATE POLICY "newsletter_insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
