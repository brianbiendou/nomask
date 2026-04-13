#!/usr/bin/env python3
"""
Test d'intégration complet : vérifie que tout fonctionne ensemble
- Backend Docker ✓
- Ollama (via backend)
- Frontend nomask.fr (optionnel)
"""

import asyncio
import sys
import json
from pathlib import Path
from datetime import datetime

# Ajouter le backend au path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

import aiohttp
from typing import Optional

class IntegrationTester:
    def __init__(self):
        self.results = []
        self.backend_url = "http://localhost:8000"
        self.frontend_url = "https://nomask.fr"
        self.start_time = datetime.now()

    async def test_backend_health(self) -> bool:
        """Vérifie que le backend Docker répond."""
        print("\n" + "="*70)
        print("[TEST 1] Backend Docker — Health Check")
        print("="*70)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.backend_url}/health", timeout=aiohttp.ClientTimeout(total=5)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        print(f"✅ Backend actif")
                        print(f"   Status: {data.get('status')}")
                        print(f"   Model Ollama: {data.get('model')}")
                        print(f"   Ollama URL: {data.get('ollama')}")
                        self.results.append(("Backend Health", "PASS"))
                        return True
                    else:
                        print(f"❌ Backend réponse invalide: {resp.status}")
                        self.results.append(("Backend Health", "FAIL"))
                        return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            self.results.append(("Backend Health", "FAIL"))
            return False

    async def test_ollama_test_endpoint(self) -> bool:
        """Teste l'endpoint /api/ollama/test du backend."""
        print("\n" + "="*70)
        print("[TEST 2] Backend — Endpoint /api/ollama/test")
        print("="*70)
        
        payload = {
            "prompt": "Dis hello en une phrase courte.",
            "model": "mistral:7b"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.backend_url}/api/ollama/test",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        response = data.get('response', '')[:100] if isinstance(data, dict) else str(data)[:100]
                        print(f"✅ Endpoint /api/ollama/test répond")
                        print(f"   Réponse Ollama: {response}...")
                        self.results.append(("Ollama Test Endpoint", "PASS"))
                        return True
                    else:
                        print(f"❌ Réponse invalide: {resp.status}")
                        text = await resp.text()
                        print(f"   Détails: {text[:200]}")
                        self.results.append(("Ollama Test Endpoint", "FAIL"))
                        return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            self.results.append(("Ollama Test Endpoint", "FAIL"))
            return False

    async def test_discover_endpoint(self) -> bool:
        """Teste l'endpoint de découverte du backend."""
        print("\n" + "="*70)
        print("[TEST 3] Backend — Endpoint /api/discover (Trending)")
        print("="*70)
        
        payload = {
            "url": "medium.com",  # Singulier!
            "hours": 24
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.backend_url}/api/discover",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        discovered = data.get('urls', []) if isinstance(data, dict) else []
                        print(f"✅ Endpoint /api/discover répond")
                        print(f"   Source: {data.get('source', 'N/A')}")
                        print(f"   Articles découverts: {len(discovered)}")
                        if discovered:
                            print(f"   Premier article: {discovered[0][:60]}...")
                        self.results.append(("Discover Endpoint", "PASS"))
                        return True
                    else:
                        print(f"❌ Réponse invalide: {resp.status}")
                        text = await resp.text()
                        print(f"   Détails: {text[:200]}")
                        self.results.append(("Discover Endpoint", "FAIL"))
                        return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            self.results.append(("Discover Endpoint", "FAIL"))
            return False

    async def test_frontend_dns(self) -> bool:
        """Teste la résolution DNS et l'accessibilité de nomask.fr"""
        print("\n" + "="*70)
        print("[TEST 4] Frontend nomask.fr — DNS & Accessibility")
        print("="*70)
        
        try:
            async with aiohttp.ClientSession() as session:
                # Avec SSL vérifié
                async with session.get(
                    self.frontend_url,
                    timeout=aiohttp.ClientTimeout(total=10),
                    allow_redirects=False
                ) as resp:
                    print(f"✅ nomask.fr accessible")
                    print(f"   Status: {resp.status}")
                    print(f"   URL: {resp.url}")
                    self.results.append(("Frontend Access", "PASS"))
                    return True
        except aiohttp.ClientSSLError as e:
            print(f"⚠️  Problème SSL: {str(e)[:100]}")
            print(f"   (Peut être acceptable en dev)")
            self.results.append(("Frontend SSL", "WARNING"))
            return True
        except aiohttp.ClientConnectorError as e:
            print(f"❌ Impossible de joindre nomask.fr: {e}")
            self.results.append(("Frontend Access", "FAIL"))
            return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            self.results.append(("Frontend Access", "FAIL"))
            return False

    async def test_pipeline_job_list(self) -> bool:
        """Teste l'accès à la liste des jobs du pipeline."""
        print("\n" + "="*70)
        print("[TEST 5] Backend — Pipeline Jobs (/api/pipeline/jobs)")
        print("="*70)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.backend_url}/api/pipeline/jobs",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        jobs = data if isinstance(data, list) else []
                        print(f"✅ Endpoint /api/pipeline/jobs répond")
                        print(f"   Jobs actuels: {len(jobs)}")
                        if jobs:
                            print(f"   Premier job: {jobs[0].get('id', 'N/A')[:8]}... - Status: {jobs[0].get('status', 'N/A')}")
                        self.results.append(("Pipeline Jobs", "PASS"))
                        return True
                    else:
                        print(f"❌ Réponse invalide: {resp.status}")
                        text = await resp.text()
                        print(f"   Détails: {text[:200]}")
                        self.results.append(("Pipeline Jobs", "FAIL"))
                        return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            self.results.append(("Pipeline Jobs", "FAIL"))
            return False

    async def run_all_tests(self):
        """Lance tous les tests."""
        print("\n" + "╔" + "="*68 + "╗")
        print("║" + " "*15 + "TEST D'INTÉGRATION COMPLET - NoMask" + " "*19 + "║")
        print("╚" + "="*68 + "╝")
        
        # Tests
        await self.test_backend_health()
        await self.test_ollama_test_endpoint()
        await self.test_discover_endpoint()
        await self.test_frontend_dns()
        await self.test_pipeline_job_list()
        
        # Résumé
        self.print_summary()

    def print_summary(self):
        """Affiche un résumé des résultats."""
        print("\n" + "="*70)
        print("RÉSUMÉ DES TESTS")
        print("="*70)
        
        passed = sum(1 for _, status in self.results if status == "PASS")
        failed = sum(1 for _, status in self.results if status == "FAIL")
        warnings = sum(1 for _, status in self.results if status == "WARNING")
        
        for test_name, status in self.results:
            icon = "✅" if status == "PASS" else ("⚠️ " if status == "WARNING" else "❌")
            print(f"{icon} {test_name:<35} — {status}")
        
        print("\n" + "-"*70)
        print(f"✅ PASSED: {passed} | ❌ FAILED: {failed} | ⚠️  WARNINGS: {warnings}")
        
        elapsed = (datetime.now() - self.start_time).total_seconds()
        print(f"Durée: {elapsed:.1f}s")
        
        if failed == 0:
            print("\n🎉 TOUT EST OPÉRATIONNEL!")
        else:
            print(f"\n⚠️  {failed} test(s) échoué(s) — vérifier les logs ci-dessus")
        
        print("="*70 + "\n")

async def main():
    tester = IntegrationTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
