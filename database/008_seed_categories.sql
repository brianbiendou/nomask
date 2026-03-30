-- =============================================
-- 008 - Seed : Catégories et sous-catégories
-- NoMask - Site d'actualité
-- =============================================

-- Catégories principales (9)
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
  ('International', 'international', 'Actualités internationales et géopolitique', '#2563EB', 1),
  ('Politique', 'politique', 'Politique française et européenne', '#DC2626', 2),
  ('Société', 'societe', 'Faits de société, éducation, santé', '#9333EA', 3),
  ('Économie', 'economie', 'Économie, finance, marchés, entreprises', '#16A34A', 4),
  ('Tech', 'tech', 'Technologies, numérique, innovation', '#0891B2', 5),
  ('Culture', 'culture', 'Art, cinéma, musique, littérature, médias', '#D97706', 6),
  ('Science', 'science', 'Science, espace, environnement, recherche', '#4F46E5', 7),
  ('Sport', 'sport', 'Football, basketball, tennis, JO et plus', '#EA580C', 8),
  ('Style', 'style', 'Mode, lifestyle, tendances, design', '#DB2777', 9);

-- Sous-catégories
INSERT INTO subcategories (category_id, name, slug) VALUES
  -- International
  ((SELECT id FROM categories WHERE slug = 'international'), 'Europe', 'europe'),
  ((SELECT id FROM categories WHERE slug = 'international'), 'États-Unis', 'etats-unis'),
  ((SELECT id FROM categories WHERE slug = 'international'), 'Moyen-Orient', 'moyen-orient'),
  ((SELECT id FROM categories WHERE slug = 'international'), 'Afrique', 'afrique'),
  ((SELECT id FROM categories WHERE slug = 'international'), 'Asie', 'asie'),
  -- Politique
  ((SELECT id FROM categories WHERE slug = 'politique'), 'Élections', 'elections'),
  ((SELECT id FROM categories WHERE slug = 'politique'), 'Parlement', 'parlement'),
  ((SELECT id FROM categories WHERE slug = 'politique'), 'Gouvernement', 'gouvernement'),
  -- Société
  ((SELECT id FROM categories WHERE slug = 'societe'), 'Éducation', 'education'),
  ((SELECT id FROM categories WHERE slug = 'societe'), 'Santé', 'sante'),
  ((SELECT id FROM categories WHERE slug = 'societe'), 'Environnement', 'environnement'),
  -- Économie
  ((SELECT id FROM categories WHERE slug = 'economie'), 'Finance', 'finance'),
  ((SELECT id FROM categories WHERE slug = 'economie'), 'Entreprises', 'entreprises'),
  ((SELECT id FROM categories WHERE slug = 'economie'), 'Emploi', 'emploi'),
  -- Tech
  ((SELECT id FROM categories WHERE slug = 'tech'), 'Intelligence Artificielle', 'intelligence-artificielle'),
  ((SELECT id FROM categories WHERE slug = 'tech'), 'Smartphones', 'smartphones'),
  ((SELECT id FROM categories WHERE slug = 'tech'), 'Réseaux sociaux', 'reseaux-sociaux'),
  ((SELECT id FROM categories WHERE slug = 'tech'), 'Cybersécurité', 'cybersecurite'),
  -- Culture
  ((SELECT id FROM categories WHERE slug = 'culture'), 'Cinéma', 'cinema'),
  ((SELECT id FROM categories WHERE slug = 'culture'), 'Musique', 'musique'),
  ((SELECT id FROM categories WHERE slug = 'culture'), 'Littérature', 'litterature'),
  -- Science
  ((SELECT id FROM categories WHERE slug = 'science'), 'Espace', 'espace'),
  ((SELECT id FROM categories WHERE slug = 'science'), 'Climat', 'climat'),
  ((SELECT id FROM categories WHERE slug = 'science'), 'Recherche', 'recherche'),
  -- Sport
  ((SELECT id FROM categories WHERE slug = 'sport'), 'Football', 'football'),
  ((SELECT id FROM categories WHERE slug = 'sport'), 'Basketball', 'basketball'),
  ((SELECT id FROM categories WHERE slug = 'sport'), 'Tennis', 'tennis'),
  ((SELECT id FROM categories WHERE slug = 'sport'), 'Jeux Olympiques', 'jeux-olympiques'),
  -- Style
  ((SELECT id FROM categories WHERE slug = 'style'), 'Mode', 'mode'),
  ((SELECT id FROM categories WHERE slug = 'style'), 'Design', 'design'),
  ((SELECT id FROM categories WHERE slug = 'style'), 'Tendances', 'tendances');
