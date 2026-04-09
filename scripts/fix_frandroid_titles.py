import os, sys, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client

sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
r = sb.table('articles').select('id, title').ilike('source_domain', '%frandroid%').execute()

for a in r.data:
    old_title = a['title']
    # Supprimer "- Frandroid", "- Smartphones - Frandroid", etc.
    new_title = re.sub(r'\s*-\s*(?:Smartphones|Actualités|Tests?|Bons Plans?)\s*-\s*Frandroid\s*$', '', old_title, flags=re.IGNORECASE)
    new_title = re.sub(r'\s*-\s*Frandroid\s*$', '', new_title, flags=re.IGNORECASE)
    new_title = new_title.strip()
    
    if new_title != old_title:
        sb.table('articles').update({'title': new_title}).eq('id', a['id']).execute()
        print(f"FIXED: {old_title[:60]} -> {new_title[:60]}")
    else:
        print(f"OK: {old_title[:70]}")
