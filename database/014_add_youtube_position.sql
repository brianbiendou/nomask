-- ============================================
-- 014 : Ajout colonne position aux youtube_sources
-- ============================================
-- Le slot (main/bottom_left/bottom_right) est désormais déterminé par l'ordre.
-- Position 0 = Principal, 1 = Bas gauche, 2 = Bas droite, 3+ = Réserve

ALTER TABLE youtube_sources ADD COLUMN IF NOT EXISTS position INT NOT NULL DEFAULT 99;

-- Initialiser les positions à partir des slot_position actuels
UPDATE youtube_sources SET position = 0 WHERE slot_position = 'main';
UPDATE youtube_sources SET position = 1 WHERE slot_position = 'bottom_left';
UPDATE youtube_sources SET position = 2 WHERE slot_position = 'bottom_right';

CREATE INDEX IF NOT EXISTS idx_youtube_sources_position ON youtube_sources(position);
