-- ============================================
-- 013 : YouTube video sources & cached videos
-- ============================================

-- Table des chaînes YouTube suivies
CREATE TABLE IF NOT EXISTS youtube_sources (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  channel_url   TEXT NOT NULL,
  channel_id    TEXT,                            -- résolu automatiquement
  slot_position TEXT NOT NULL DEFAULT 'main',    -- 'main' | 'bottom_left' | 'bottom_right'
  video_count   INT  NOT NULL DEFAULT 10,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Vidéos mises en cache (titre + miniature)
CREATE TABLE IF NOT EXISTS youtube_videos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id     UUID NOT NULL REFERENCES youtube_sources(id) ON DELETE CASCADE,
  video_id      TEXT NOT NULL,                   -- ID YouTube (ex: dQw4w9WgXcQ)
  title         TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  published_at  TIMESTAMPTZ,
  position      INT  NOT NULL DEFAULT 0,         -- ordre dans la liste (0 = plus récent)
  fetched_at    TIMESTAMPTZ DEFAULT now()
);

-- Index pour requêtes fréquentes
CREATE INDEX idx_youtube_videos_source ON youtube_videos(source_id, position);

-- Config du processus auto-refresh vidéos
CREATE TABLE IF NOT EXISTS youtube_config (
  id              INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- singleton
  enabled         BOOLEAN NOT NULL DEFAULT false,
  refresh_hours   INT[] NOT NULL DEFAULT '{6,21}',           -- heures UTC de refresh
  rotation_minutes INT NOT NULL DEFAULT 120,                 -- rotation toutes les N minutes
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Insérer la config par défaut
INSERT INTO youtube_config (id, enabled, refresh_hours, rotation_minutes)
VALUES (1, false, '{6,21}', 120)
ON CONFLICT (id) DO NOTHING;

-- Seed les 3 sources initiales
INSERT INTO youtube_sources (name, channel_url, slot_position, video_count) VALUES
  ('Le Monde',  'https://www.youtube.com/@lemondefr/videos',  'main',         10),
  ('Frandroid', 'https://www.youtube.com/@frandroid/videos',   'bottom_left',  10),
  ('Konbini',   'https://www.youtube.com/@konbini/videos',     'bottom_right', 10)
ON CONFLICT DO NOTHING;

-- RLS policies (lecture publique, écriture service_role)
ALTER TABLE youtube_sources  ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_config   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "youtube_sources_public_read"  ON youtube_sources FOR SELECT USING (true);
CREATE POLICY "youtube_videos_public_read"   ON youtube_videos  FOR SELECT USING (true);
CREATE POLICY "youtube_config_public_read"   ON youtube_config  FOR SELECT USING (true);

CREATE POLICY "youtube_sources_service_write" ON youtube_sources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "youtube_videos_service_write"  ON youtube_videos  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "youtube_config_service_write"  ON youtube_config  FOR ALL USING (true) WITH CHECK (true);
