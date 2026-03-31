"""Execute SQL migration on Supabase via the REST API."""
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# Read SQL
sql_path = Path(__file__).resolve().parent.parent / "database" / "012_create_pipeline_jobs.sql"
sql = sql_path.read_text(encoding="utf-8")

# Execute via Supabase REST SQL endpoint
# Using the pg_net-compatible approach via PostgREST RPC
# Alternative: use psycopg2 or the management API

# Method: POST to /rest/v1/rpc with a custom function, or use the /sql endpoint
# Supabase has a /pg endpoint for direct SQL via service role

headers = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# Split by statements and execute individually via PostgREST
# Actually, let's use the Supabase Management API or just create a helper function

# The easiest way is to create the tables via individual API calls
from supabase import create_client
sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Try using rpc to execute raw SQL
# First create a helper function
create_helper = """
CREATE OR REPLACE FUNCTION exec_raw_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
"""

print("Creating tables via direct SQL statements...")

# We'll use the postgrest-py raw RPC approach
import json

# Use the Supabase /rest/v1/rpc endpoint
rpc_url = f"{SUPABASE_URL}/rest/v1/rpc/exec_raw_sql"

# First create the helper function
resp = requests.post(
    f"{SUPABASE_URL}/rest/v1/rpc/query",
    headers=headers,
    json={"query": sql}
)

if resp.status_code == 404:
    print("RPC not available. Trying individual table creation...")
    
    # Create pipeline_jobs table
    statements = [
        # pipeline_jobs
        """
        CREATE TABLE IF NOT EXISTS pipeline_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_url TEXT NOT NULL,
          source_name TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          mode TEXT NOT NULL DEFAULT 'manual',
          perspective TEXT DEFAULT 'neutre et factuel',
          discovered_urls JSONB DEFAULT '[]'::jsonb,
          discovered_count INT DEFAULT 0,
          processed_count INT DEFAULT 0,
          published_count INT DEFAULT 0,
          failed_count INT DEFAULT 0,
          articles_detail JSONB DEFAULT '[]'::jsonb,
          error_message TEXT,
          created_at TIMESTAMPTZ DEFAULT now(),
          started_at TIMESTAMPTZ,
          completed_at TIMESTAMPTZ,
          created_by UUID
        )
        """,
        # auto_scrape_config
        """
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
        )
        """
    ]
    
    for stmt in statements:
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_raw_sql",
            headers=headers,
            json={"query": stmt.strip()}
        )
        print(f"  Status: {r.status_code} — {r.text[:100] if r.text else 'OK'}")

    # Alternative: use psycopg2 directly
    print("\n[INFO] Si les tables ne sont pas créées, exécutez le SQL dans Supabase Dashboard > SQL Editor")
    print(f"  Fichier: {sql_path}")
else:
    print(f"  Result: {resp.status_code} — {resp.text[:200]}")
