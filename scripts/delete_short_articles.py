"""
Suppression définitive des articles — NoMask
=============================================
1. Supprime tous les articles en status=draft (les 329 dépubliés)
2. Supprime tous les articles publiés avec < 400 mots
"""
import re
import time
import requests

SUPABASE_URL = "https://rmhjnljlatmtlwilrvuz.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaGpubGpsYXRtdGx3aWxydnV6Iiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcxODkyMCwiZXhwIjoyMDkwMjk0OTIwfQ."
    "uqM5MUdBFxIlSSDIVl_D46bWK6P-zpV3UafZWaQCjt4"
)
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

def strip_html(html):
    return re.sub(r"<[^>]+>", " ", html or "")

def word_count(html):
    return len(strip_html(html).split())

def get_all(status):
    all_items = []
    offset = 0
    while True:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/articles",
            headers=HEADERS,
            params={
                "select": "id,title,content",
                "status": f"eq.{status}",
                "limit": 1000,
                "offset": offset,
            },
        )
        r.raise_for_status()
        batch = r.json()
        all_items.extend(batch)
        if len(batch) < 1000:
            break
        offset += 1000
    return all_items

def delete_article(article_id):
    r = requests.delete(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=HEADERS,
        params={"id": f"eq.{article_id}"},
    )
    return r.ok

print("=" * 60)
print("SUPPRESSION DEFINITIVE DES ARTICLES COURTS")
print("=" * 60)

# 1. Articles draft (les 329 depublies)
print("\n[1/2] Recuperation des articles en draft...")
drafts = get_all("draft")
print(f"  {len(drafts)} articles draft trouves")

deleted_drafts = 0
for i, a in enumerate(drafts):
    if delete_article(a["id"]):
        deleted_drafts += 1
    else:
        print(f"  ERREUR sur: {a['title'][:50]}")
    if (i + 1) % 50 == 0:
        print(f"  ... {i+1}/{len(drafts)} traites")
    time.sleep(0.03)

print(f"  OK: {deleted_drafts} articles draft supprimes")

# 2. Articles publies < 400 mots (au cas ou il en reste)
print("\n[2/2] Verification des articles publies < 400 mots...")
published = get_all("published")
short_published = [a for a in published if word_count(a.get("content", "")) < 400]
print(f"  {len(short_published)} articles publies < 400 mots trouves")

deleted_short = 0
for i, a in enumerate(short_published):
    wc = word_count(a.get("content", ""))
    if delete_article(a["id"]):
        deleted_short += 1
        print(f"  Supprime ({wc} mots): {a['title'][:60]}")
    time.sleep(0.03)

print(f"\n  OK: {deleted_short} articles courts publies supprimes")

# Rapport final
remaining = get_all("published")
print(f"\n{'=' * 60}")
print(f"RAPPORT FINAL")
print(f"{'=' * 60}")
print(f"  Articles draft supprimes    : {deleted_drafts}")
print(f"  Articles courts supprimes   : {deleted_short}")
print(f"  Articles restants publies   : {len(remaining)}")
wc_ok = sum(1 for a in remaining if word_count(a.get("content","")) >= 400)
print(f"  Articles >= 400 mots        : {wc_ok}")
print(f"  Articles >= 600 mots        : {sum(1 for a in remaining if word_count(a.get('content','')) >= 600)}")
