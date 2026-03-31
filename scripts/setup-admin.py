"""Script de setup — crée les tables pipeline + compte admin."""
import os
import sys
from pathlib import Path

# Config
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

from supabase import create_client

from dotenv import load_dotenv
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(env_path)


def setup():
    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 1. Exécuter la migration pipeline_jobs
    sql_path = Path(__file__).resolve().parent.parent / "database" / "012_create_pipeline_jobs.sql"
    sql = sql_path.read_text(encoding="utf-8")
    
    print("[SETUP] Création des tables pipeline_jobs et auto_scrape_config...")
    try:
        sb.postgrest.rpc("exec_sql", {"query": sql}).execute()
        print("  [OK] Tables créées via RPC")
    except Exception as e:
        # RPC exec_sql n'existe probablement pas, on utilise la méthode directe
        print(f"  [INFO] RPC non disponible, exécution via REST...")
        # On va créer via des requêtes individuelles
        try:
            # Test si les tables existent déjà
            sb.table("pipeline_jobs").select("id").limit(1).execute()
            print("  [OK] Table pipeline_jobs existe déjà")
        except Exception:
            print("  [WARN] Créez les tables manuellement dans Supabase SQL Editor:")
            print(f"  Fichier: {sql_path}")

        try:
            sb.table("auto_scrape_config").select("id").limit(1).execute()
            print("  [OK] Table auto_scrape_config existe déjà")
        except Exception:
            print("  [WARN] Créez auto_scrape_config dans Supabase SQL Editor")

    # 2. Créer le compte admin
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    
    if not admin_email or not admin_password:
        print("\n[ERREUR] ADMIN_EMAIL et ADMIN_PASSWORD requis dans .env.local")
        return

    print(f"\n[SETUP] Création du compte admin: {admin_email}")
    try:
        result = sb.auth.admin.create_user({
            "email": admin_email,
            "password": admin_password,
            "email_confirm": True,
            "user_metadata": {
                "role": "admin",
                "name": "Brian Biendou",
            },
        })
        print(f"  [OK] Compte créé: {result.user.id}")
    except Exception as e:
        error_msg = str(e)
        if "already" in error_msg.lower() or "duplicate" in error_msg.lower():
            print(f"  [OK] Le compte admin existe déjà")
        else:
            print(f"  [ERREUR] {e}")


if __name__ == "__main__":
    setup()
