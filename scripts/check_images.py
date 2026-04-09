import sys, os, re
sys.path.insert(0, 'backend')
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client
sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
r = sb.table('articles').select('slug,content').ilike('slug', '%artemis%').order('published_at', desc=True).limit(1).execute()
if r.data:
    content = r.data[0]['content']
    imgs = re.findall(r'<img[^>]+src="([^"]+)"', content)
    print("slug:", r.data[0]['slug'])
    print(len(imgs), "images dans content:")
    for img in imgs:
        print("  ", img[:150])
    figs = re.findall(r'<figure.*?</figure>', content, re.DOTALL)
    print(len(figs), "figures")
    for f in figs[:3]:
        print("  FIG:", f[:250])
else:
    print("Aucun article trouvé")
