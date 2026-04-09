import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client

sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
r = sb.table('articles').select('title, source_domain').ilike('source_domain', '%frandroid%').execute()
print(f"{len(r.data)} articles Frandroid")
for a in r.data:
    print(f"  {a['title'][:80]}")

print()
r2 = sb.table('articles').select('source_domain').not_.is_('source_domain', 'null').execute()
print(f"{len(r2.data)} articles avec source_domain (tous)")
domains = set(a['source_domain'] for a in r2.data)
for d in domains:
    count = sum(1 for a in r2.data if a['source_domain'] == d)
    print(f"  {d}: {count}")
