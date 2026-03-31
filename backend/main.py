#!/usr/bin/env python3
"""
NoMask Backend CLI — Scrape, réécrit et publie des articles automatiquement.

Usage:
    python main.py <url1> <url2> ...
    python main.py --file urls.txt
    python main.py --discover https://www.numerama.com
    python main.py --perspective "critique et analytique" <url1> ...
"""
import sys
import asyncio
import argparse

# Fix Windows asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from pipeline import run_pipeline
from discovery import discover_and_return_urls
from config import DEFAULT_PERSPECTIVE


def main():
    parser = argparse.ArgumentParser(
        description="NoMask — Scrape, réécrit et publie des articles",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  python main.py https://example.com/article1 https://example.com/article2
  python main.py --file urls.txt --perspective "analyse critique"
  python main.py --discover https://www.numerama.com --hours 24
  python main.py --perspective "neutre, factuel et informatif" URL1 URL2

Points de vue disponibles:
  - neutre et factuel (défaut)
  - analyse critique
  - vulgarisation accessible
  - opinion engagée
  - tech enthusiast
        """,
    )
    parser.add_argument("urls", nargs="*", help="URLs des articles à traiter")
    parser.add_argument(
        "--file", "-f",
        help="Fichier texte contenant les URLs (une par ligne)",
    )
    parser.add_argument(
        "--discover", "-d",
        help="URL du site à scanner pour découvrir les articles récents",
    )
    parser.add_argument(
        "--hours",
        type=int,
        default=24,
        help="Nombre d'heures max pour la découverte (défaut: 24)",
    )
    parser.add_argument(
        "--perspective", "-p",
        default=DEFAULT_PERSPECTIVE,
        help=f"Point de vue pour la réécriture (défaut: {DEFAULT_PERSPECTIVE})",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Forcer la republication (supprime l'ancien article si existant)",
    )
    parser.add_argument(
        "--max-articles", "-m",
        type=int,
        default=10,
        help="Nombre max d'articles à traiter (défaut: 10)",
    )

    args = parser.parse_args()

    # Collecter les URLs
    urls = list(args.urls)
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and line.startswith("http"):
                    urls.append(line)

    # Mode découverte automatique
    if args.discover:
        print(f"\n[NoMask] Mode découverte: {args.discover}")
        print(f"[NoMask] Articles des {args.hours} dernières heures\n")
        discovered = asyncio.run(discover_and_return_urls(args.discover, args.hours))
        if not discovered:
            print("\n[INFO] Aucun article récent trouvé.")
            sys.exit(0)
        urls.extend(discovered[:args.max_articles])

    if not urls:
        parser.print_help()
        print("\n[ERREUR] Aucune URL fournie.")
        sys.exit(1)

    # Limiter le nombre d'articles
    urls = urls[:args.max_articles]

    if not urls:
        parser.print_help()
        print("\n[ERREUR] Aucune URL fournie.")
        sys.exit(1)

    print(f"\n[NoMask] {len(urls)} articles à traiter")
    print(f"[NoMask] Perspective: {args.perspective}")
    if args.force:
        print("[NoMask] Mode FORCE activé — les articles existants seront remplacés")
    print()

    # Lancer le pipeline
    results = asyncio.run(run_pipeline(urls, perspective=args.perspective, force=args.force))

    # Résumé
    print(f"\n{'='*40}")
    print(f"  Articles publiés: {len(results)}/{len(urls)}")
    for r in results:
        print(f"  ✓ {r.get('title', '?')[:60]}")
    print(f"{'='*40}")


if __name__ == "__main__":
    main()
