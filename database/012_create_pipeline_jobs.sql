-- Table des jobs du pipeline (historique des workflows)
CREATE TABLE IF NOT EXISTS pipeline_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source
  source_url TEXT NOT NULL,
  source_name TEXT,
  
  -- Status global
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'discovering', 'scraping', 'rewriting', 'publishing', 'completed', 'failed', 'cancelled')),
  
  -- Mode
  mode TEXT NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'auto')),
  perspective TEXT DEFAULT 'neutre et factuel',
  
  -- Résultats discovery
  discovered_urls JSONB DEFAULT '[]'::jsonb,
  discovered_count INT DEFAULT 0,
  
  -- Résultats pipeline
  processed_count INT DEFAULT 0,
  published_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  
  -- Détails par article (étapes du workflow)
  articles_detail JSONB DEFAULT '[]'::jsonb,
  -- Format: [{url, title, steps: [{name, status, started_at, completed_at, error}], result_slug}]
  
  -- Erreur globale
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- User qui a lancé
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour le dashboard
CREATE INDEX IF NOT EXISTS idx_pipeline_jobs_status ON pipeline_jobs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_jobs_created_at ON pipeline_jobs(created_at DESC);

-- Table de configuration auto-scraping
CREATE TABLE IF NOT EXISTS auto_scrape_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  interval_hours INT DEFAULT 2,
  perspective TEXT DEFAULT 'neutre et factuel',
  max_articles_per_run INT DEFAULT 10,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE pipeline_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_scrape_config ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read
CREATE POLICY "Authenticated users can read pipeline_jobs" 
  ON pipeline_jobs FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert pipeline_jobs" 
  ON pipeline_jobs FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pipeline_jobs" 
  ON pipeline_jobs FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read auto_scrape_config" 
  ON auto_scrape_config FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can manage auto_scrape_config" 
  ON auto_scrape_config FOR ALL 
  TO authenticated 
  USING (true);

-- Service role can do everything (pour le backend Python)
CREATE POLICY "Service role full access pipeline_jobs"
  ON pipeline_jobs FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role full access auto_scrape_config"
  ON auto_scrape_config FOR ALL
  TO service_role
  USING (true);
