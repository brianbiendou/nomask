"""Tests éphémères pour la détection sémantique de similarité.

Lance avec : python test_similarity.py
Nécessite qu'Ollama soit actif.

Ces tests vérifient que le système distingue correctement :
  - Articles clairement doublons (score > 75)
  - Articles connexes mais distincts (score 30-70)
  - Articles sans rapport (score < 30)
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from similarity import check_topic_similarity


# ─── PAIRES DE TEST ─────────────────────────────────────────────────────────

EXISTING_ARTICLES_SAMPLE = [
    {
        "title": "OpenAI lance GPT-5 avec des capacités multimodales inédites",
        "excerpt": "OpenAI a annoncé GPT-5, son nouveau modèle de langage capable de traiter texte, images et audio simultanément.",
    },
    {
        "title": "Apple dévoile l'iPhone 17 avec une nouvelle puce A19",
        "excerpt": "Apple a présenté l'iPhone 17 lors de sa keynote annuelle, équipé de la puce A19 et d'une caméra 200MP.",
    },
    {
        "title": "La France vote une loi pour réguler les réseaux sociaux pour les mineurs",
        "excerpt": "L'Assemblée nationale a adopté un texte obligeant les plateformes à vérifier l'âge des utilisateurs.",
    },
    {
        "title": "Tesla rappelle 500 000 véhicules en raison d'un défaut logiciel",
        "excerpt": "Tesla procède à un rappel massif après la découverte d'un bug dans le système de freinage automatique.",
    },
    {
        "title": "Google publie Gemini Ultra 2.0, rivalisant avec GPT-4",
        "excerpt": "Google DeepMind annonce Gemini Ultra 2.0, un modèle multimodal qui surpasse GPT-4 sur plusieurs benchmarks.",
    },
]

TEST_CASES = [
    # --- CAS 1 : DOUBLON ÉVIDENT ---
    {
        "name": "DOUBLON — même événement GPT-5",
        "new_title": "GPT-5 : OpenAI annonce son modèle le plus puissant avec multimodalité avancée",
        "new_excerpt": "Le nouveau modèle GPT-5 d'OpenAI arrive avec des fonctionnalités multimodales révolutionnaires.",
        "expected": "duplicate",
        "expected_score_min": 75,
    },
    # --- CAS 2 : DOUBLON ÉVIDENT ---
    {
        "name": "DOUBLON — même événement iPhone 17",
        "new_title": "iPhone 17 : tout ce qu'Apple a présenté lors de la keynote",
        "new_excerpt": "Retour sur les annonces d'Apple concernant le nouvel iPhone 17 et sa puce A19.",
        "expected": "duplicate",
        "expected_score_min": 75,
    },
    # --- CAS 3 : CONNEXE MAIS DISTINCT ---
    {
        "name": "CONNEXE — GPT-4o (différent de GPT-5)",
        "new_title": "OpenAI met à jour GPT-4o avec une meilleure compréhension du code",
        "new_excerpt": "Une mise à jour de GPT-4o améliore ses performances sur les tâches de programmation.",
        "expected": "related",
        "expected_score_max": 74,
    },
    # --- CAS 4 : CONNEXE MAIS DISTINCT ---
    {
        "name": "CONNEXE — autre loi réseaux sociaux (différent pays)",
        "new_title": "L'Union européenne renforce le DSA contre la désinformation sur les réseaux",
        "new_excerpt": "Bruxelles impose de nouvelles obligations aux grandes plateformes pour lutter contre les fake news.",
        "expected": "related",
        "expected_score_max": 74,
    },
    # --- CAS 5 : SANS RAPPORT ---
    {
        "name": "SANS RAPPORT — actualité sport",
        "new_title": "Kylian Mbappé marque un hat-trick en Ligue des Champions",
        "new_excerpt": "L'attaquant français a inscrit trois buts pour qualifier son club en demi-finale.",
        "expected": "unrelated",
        "expected_score_max": 35,
    },
    # --- CAS 6 : SANS RAPPORT — tech mais événement différent ---
    {
        "name": "SANS RAPPORT — cybersécurité (aucun lien)",
        "new_title": "Une cyberattaque paralyse les hôpitaux de la région parisienne",
        "new_excerpt": "Un ransomware a chiffré les données de plusieurs établissements hospitaliers en Île-de-France.",
        "expected": "unrelated",
        "expected_score_max": 40,
    },
]


async def run_tests():
    print("=" * 70)
    print("TEST SIMILARITÉ SÉMANTIQUE — NoMask Pipeline")
    print("=" * 70)
    print(f"Threshold de production : {os.environ.get('SIMILARITY_THRESHOLD', '75')}")
    print()

    passed = 0
    failed = 0

    for tc in TEST_CASES:
        print(f"[TEST] {tc['name']}")
        print(f"       Titre: {tc['new_title'][:70]}")

        is_dup, score, reason = await check_topic_similarity(
            tc["new_title"],
            tc["new_excerpt"],
            recent_articles=EXISTING_ARTICLES_SAMPLE,
            threshold=75,
        )

        result_label = "DOUBLON" if is_dup else "OK"
        print(f"       Score: {score}/100 | Résultat: {result_label} | Raison: {reason[:60]}")

        # Vérifier l'attente
        ok = True
        if tc["expected"] == "duplicate":
            ok = score >= tc.get("expected_score_min", 75)
            verdict = "PASS" if ok else f"FAIL (attendu score >= {tc.get('expected_score_min', 75)}, obtenu {score})"
        elif tc["expected"] in ("related", "unrelated"):
            ok = score <= tc.get("expected_score_max", 74)
            verdict = "PASS" if ok else f"FAIL (attendu score <= {tc.get('expected_score_max', 74)}, obtenu {score})"
        else:
            verdict = "SKIP"

        print(f"       → {verdict}")
        print()

        if ok:
            passed += 1
        else:
            failed += 1

    print("=" * 70)
    print(f"RÉSULTATS : {passed}/{passed+failed} tests réussis")
    if failed > 0:
        print(f"⚠ {failed} test(s) échoué(s) — ajuste SIMILARITY_THRESHOLD dans config.py")
        print("  Suggestion : si les doublons ne sont pas détectés, baisse le seuil à 65")
        print("               si trop de faux positifs, monte le seuil à 80")
    else:
        print("✓ Tous les tests passent — la détection est opérationnelle")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(run_tests())
