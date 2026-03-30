#!/usr/bin/env node
// scripts/seed-guides.mjs — Insert buying guide subcategory + 4 articles
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

// Get tech category ID
const cats = await fetch(`${URL}/rest/v1/categories?select=id,slug&slug=eq.tech`, { headers }).then(r => r.json());
const techId = cats[0]?.id;
if (!techId) { console.error('Tech category not found!'); process.exit(1); }
console.log('Tech category ID:', techId);

// Get author
const auths = await fetch(`${URL}/rest/v1/authors?select=id,slug&slug=eq.marc-antoine-lefebvre`, { headers }).then(r => r.json());
const authorId = auths[0]?.id;
if (!authorId) { console.error('Author not found!'); process.exit(1); }
console.log('Author ID:', authorId);

// Create subcategory (upsert-like: check first)
let subRes = await fetch(`${URL}/rest/v1/subcategories?select=id&slug=eq.guides-achat&category_id=eq.${techId}`, { headers }).then(r => r.json());
let subId;
if (subRes.length > 0) {
  subId = subRes[0].id;
  console.log('Subcategory already exists:', subId);
} else {
  const createSub = await fetch(`${URL}/rest/v1/subcategories`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ category_id: techId, name: "Guides d'achat", slug: 'guides-achat' }),
  }).then(r => r.json());
  subId = createSub[0]?.id;
  console.log('Created subcategory:', subId);
}

const ha = (h) => new Date(Date.now() - h * 3600000).toISOString();

const articles = [
  {
    title: "Smartphones 2026 : les 8 modèles qui écrasent vraiment la concurrence (et ceux qu'on vous déconseille)",
    slug: 'meilleurs-smartphones-2026-comparatif-complet',
    excerpt: "On a testé, comparé et poussé dans leurs retranchements les smartphones sortis cette année. Voici ceux qui valent réellement votre argent — et les pièges à éviter absolument.",
    content: `<h2>Le trio infernal qui domine 2026</h2><p>Le Samsung Galaxy S26 Ultra surprend avec son capteur 200 MP stabilisé qui transforme chaque cliché nocturne en œuvre d'art. L'iPhone 18 Pro joue la carte de l'IA embarquée avec un moteur neuronal qui anticipe vos usages. Et le OnePlus 14 Pro, outsider de génie, offre 90 % des performances du duo pour 40 % de moins.</p><h2>Les faux bons plans à fuir</h2><p>Attention aux modèles « milieu de gamme premium » qui pullulent cette année. Certains constructeurs recyclent des composants de 2024 sous des coques rutilantes. On vous dit lesquels — et pourquoi le marketing ne remplacera jamais un bon processeur.</p><h2>Notre grille de notation</h2><p>Chaque appareil a été évalué selon 8 critères pondérés : écran, photo jour/nuit, autonomie réelle, charge rapide, performances brutes, qualité de construction, rapport qualité-prix et durabilité logicielle. Aucun partenariat, aucun prêt constructeur : tous achetés, tous testés, tous rendus.</p>`,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=630&fit=crop',
    image_caption: 'Comparatif smartphones 2026 — Photo NoMask',
    category_id: techId,
    subcategory_id: subId,
    author_id: authorId,
    locale: 'fr',
    status: 'published',
    is_featured: false,
    is_breaking: false,
    read_time: 12,
    published_at: ha(18),
    seo_title: 'Meilleurs smartphones 2026 : le comparatif honnête et sans filtre',
    seo_description: 'Découvrez les 8 meilleurs smartphones de 2026 testés sans concession.',
  },
  {
    title: "Écouteurs sans fil : le top 5 qui change tout (et pourquoi vos AirPods ne suffisent plus)",
    slug: 'meilleurs-ecouteurs-sans-fil-2026-guide',
    excerpt: "Réduction de bruit, qualité audio, confort longue durée : on a passé 200 heures à écouter, comparer et noter les écouteurs de 2026.",
    content: `<h2>La surprise de l'année</h2><p>Sony domine encore avec les WF-1000XM6, mais la vraie révélation vient de Nothing. Leurs Ear (3) offrent une signature sonore bluffante pour un prix qui fait mal à la concurrence. Apple stagne avec des AirPods Pro 3 qui peinent à justifier leur tarif premium.</p><h2>Ce qu'on ne vous dit jamais</h2><p>La réduction de bruit active compresse parfois votre musique. On a mesuré la dégradation audio réelle — les résultats sont édifiants. Le codec compte plus que le prix.</p><h2>Le verdict</h2><p>Cinq modèles sortent du lot, chacun pour une raison différente. Du meilleur rapport qualité-prix au roi de l'isolation phonique, notre classement vous guide vers LE modèle fait pour vous.</p>`,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=1200&h=630&fit=crop',
    image_caption: 'Test écouteurs sans fil 2026 — Photo NoMask',
    category_id: techId,
    subcategory_id: subId,
    author_id: authorId,
    locale: 'fr',
    status: 'published',
    is_featured: false,
    is_breaking: false,
    read_time: 10,
    published_at: ha(120),
    seo_title: "Meilleurs écouteurs sans fil 2026 : le guide ultime après 200h de test",
    seo_description: "Comparatif des 5 meilleurs écouteurs sans fil de 2026. Test approfondi.",
  },
  {
    title: "iPhone 18 ou iPhone 18 Pro : lequel choisir vraiment ? (les modèles à éviter aussi)",
    slug: 'iphone-18-vs-18-pro-lequel-choisir-2026',
    excerpt: "Apple vend quatre iPhone cette année. Deux méritent votre attention, un est un piège marketing, et le dernier est un secret bien gardé.",
    content: `<h2>Le piège du « Plus »</h2><p>L'iPhone 18 Plus est le modèle le plus difficile à recommander. Un écran plus grand, certes, mais les mêmes performances pour 150 € de plus. Notre conseil : fuyez.</p><h2>Pro ou pas Pro ?</h2><p>Le vrai dilemme se joue entre l'iPhone 18 et le 18 Pro. Le zoom 5x et le ProRes justifient-ils 350 € d'écart ? Pour 80 % des utilisateurs, non. Mais pour les créateurs de contenu, le Pro est un investissement qui se rentabilise.</p><h2>Notre recommandation</h2><p>L'iPhone 18 standard est la meilleure affaire Apple de 2026. Puce A20, 120 Hz, autonomie en hausse de 15 %. C'est le modèle que nous recommandons à 9 acheteurs sur 10.</p>`,
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=630&fit=crop',
    image_caption: 'iPhone 18 vs iPhone 18 Pro — Comparatif NoMask',
    category_id: techId,
    subcategory_id: subId,
    author_id: authorId,
    locale: 'fr',
    status: 'published',
    is_featured: false,
    is_breaking: false,
    read_time: 9,
    published_at: ha(360),
    seo_title: "iPhone 18 vs 18 Pro : le guide d'achat sans langue de bois",
    seo_description: "iPhone 18 ou 18 Pro en 2026 ? Notre comparatif après 3 semaines de test.",
  },
  {
    title: "Batteries externes : le comparatif qui va sauver vos voyages (et votre patience)",
    slug: 'meilleures-batteries-externes-2026-comparatif',
    excerpt: "Voyages, festivals, télétravail nomade : on a vidé et rechargé des dizaines de batteries pour trouver celles qui tiennent leurs promesses.",
    content: `<h2>Le mensonge des mAh</h2><p>Un fabricant annonce 20 000 mAh ? En réalité, vous n'en utiliserez que 12 000. La conversion de tension et les pertes thermiques font fondre la capacité réelle. Les écarts atteignent 35 %.</p><h2>La révélation GaN</h2><p>Les nouvelles batteries GaN combinent batterie et chargeur mural en un seul appareil. Anker, Ugreen et Baseus se livrent une guerre féroce — et c'est le consommateur qui gagne.</p><h2>Notre top 3</h2><p>Voyage longue durée, recharge express ou kit festival : nous avons identifié le modèle idéal pour chaque scénario. Avec un rapport qualité-prix imbattable pour notre coup de cœur à moins de 40 €.</p>`,
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&h=630&fit=crop',
    image_caption: 'Comparatif batteries externes 2026 — Photo NoMask',
    category_id: techId,
    subcategory_id: subId,
    author_id: authorId,
    locale: 'fr',
    status: 'published',
    is_featured: false,
    is_breaking: false,
    read_time: 8,
    published_at: ha(600),
    seo_title: "Meilleures batteries externes 2026 : le comparatif honnête",
    seo_description: "Les meilleures batteries externes de 2026 testées et comparées.",
  },
];

// Check for existing articles to avoid duplicates
for (const a of articles) {
  const existing = await fetch(`${URL}/rest/v1/articles?select=id&slug=eq.${a.slug}&locale=eq.fr`, { headers }).then(r => r.json());
  if (existing.length > 0) {
    console.log(`Article already exists: "${a.title.slice(0, 50)}..."`);
    continue;
  }
  const res = await fetch(`${URL}/rest/v1/articles`, {
    method: 'POST',
    headers,
    body: JSON.stringify(a),
  });
  if (res.ok) {
    const data = await res.json();
    console.log(`✓ Created: "${a.title.slice(0, 60)}..."`);
  } else {
    const err = await res.text();
    console.error(`✗ Failed: "${a.title.slice(0, 50)}..." — ${err}`);
  }
}

console.log('\nDone!');
