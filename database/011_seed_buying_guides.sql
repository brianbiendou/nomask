-- =============================================
-- 011 - Seed : Sous-catégorie "Guides d'achat" + 4 articles
-- NoMask - Site d'actualité
-- =============================================

-- Sous-catégorie "Guides d'achat" dans Tech
INSERT INTO subcategories (category_id, name, slug) VALUES
  ((SELECT id FROM categories WHERE slug = 'tech'), 'Guides d''achat', 'guides-achat')
ON CONFLICT (category_id, slug) DO NOTHING;

-- 4 articles guides d'achat
INSERT INTO articles (title, slug, excerpt, content, image_url, image_caption, category_id, subcategory_id, author_id, locale, status, is_featured, is_breaking, read_time, published_at, seo_title, seo_description) VALUES
(
  'Smartphones 2026 : les 8 modèles qui écrasent vraiment la concurrence (et ceux qu''on vous déconseille)',
  'meilleurs-smartphones-2026-comparatif-complet',
  'On a testé, comparé et poussé dans leurs retranchements les smartphones sortis cette année. Voici ceux qui valent réellement votre argent — et les pièges à éviter absolument.',
  '<p>Chaque année, la promesse est la même : « le meilleur smartphone jamais conçu ». Sauf que cette fois, certains constructeurs ont réellement tenu parole. Après trois mois de tests intensifs — autonomie, photo en conditions réelles, performances gaming, résistance aux chutes — notre verdict est sans appel.</p>

<h2>Le trio infernal qui domine 2026</h2>
<p>Le Samsung Galaxy S26 Ultra surprend avec son capteur 200 MP stabilisé qui transforme chaque cliché nocturne en œuvre d''art. L''iPhone 18 Pro joue la carte de l''IA embarquée avec un moteur neuronal qui anticipe vos usages. Et le OnePlus 14 Pro, outsider de génie, offre 90 % des performances du duo pour 40 % de moins.</p>

<h2>Les faux bons plans à fuir</h2>
<p>Attention aux modèles « milieu de gamme premium » qui pullulent cette année. Certains constructeurs recyclent des composants de 2024 sous des coques rutilantes. On vous dit lesquels — et pourquoi le marketing ne remplacera jamais un bon processeur.</p>

<h2>Notre grille de notation</h2>
<p>Chaque appareil a été évalué selon 8 critères pondérés : écran, photo jour/nuit, autonomie réelle, charge rapide, performances brutes, qualité de construction, rapport qualité-prix et durabilité logicielle. Aucun partenariat, aucun prêt constructeur : tous achetés, tous testés, tous rendus.</p>',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=630&fit=crop',
  'Comparatif smartphones 2026 — Photo NoMask',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM subcategories WHERE slug = 'guides-achat' AND category_id = (SELECT id FROM categories WHERE slug = 'tech')),
  (SELECT id FROM authors WHERE slug = 'marc-antoine-lefebvre'),
  'fr', 'published', FALSE, FALSE, 12,
  NOW() - INTERVAL '18 hours',
  'Meilleurs smartphones 2026 : le comparatif honnête et sans filtre',
  'Découvrez les 8 meilleurs smartphones de 2026 testés sans concession. Comparatif photo, autonomie, performances et rapport qualité-prix.'
),
(
  'Écouteurs sans fil : le top 5 qui change tout (et pourquoi vos AirPods ne suffisent plus)',
  'meilleurs-ecouteurs-sans-fil-2026-guide',
  'Réduction de bruit, qualité audio, confort longue durée : on a passé 200 heures à écouter, comparer et noter les écouteurs de 2026. Le classement va vous surprendre.',
  '<p>Les écouteurs sans fil sont devenus le prolongement de nos oreilles. Mais entre les promesses marketing et la réalité acoustique, le fossé est immense. Pendant deux mois, notre équipe a porté, testé et comparé 15 modèles dans des conditions variées : métro bondé, open space bruyant, running sous la pluie, et sessions d''écoute critique en studio.</p>

<h2>La surprise de l''année vient de là où on ne l''attendait pas</h2>
<p>Sony domine encore avec les WF-1000XM6, mais la vraie révélation vient de Nothing. Leurs Ear (3) offrent une signature sonore bluffante pour un prix qui fait mal à la concurrence. Apple, de son côté, stagne dangereusement avec des AirPods Pro 3 qui peinent à justifier leur tarif premium.</p>

<h2>Ce qu''on ne vous dit jamais</h2>
<p>La réduction de bruit active, c''est bien. Mais savez-vous que certains modèles compressent votre musique pour alimenter l''ANC ? On a mesuré la dégradation audio réelle — et les résultats sont édifiants. On vous explique aussi pourquoi le codec compte plus que le prix.</p>

<h2>Le verdict à l''oreille nue</h2>
<p>Cinq modèles sortent du lot, chacun pour une raison différente. Du meilleur rapport qualité-prix au roi absolu de l''isolation phonique, notre classement détaillé vous guide vers LE modèle fait pour vous.</p>',
  'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=1200&h=630&fit=crop',
  'Test écouteurs sans fil 2026 — Photo NoMask',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM subcategories WHERE slug = 'guides-achat' AND category_id = (SELECT id FROM categories WHERE slug = 'tech')),
  (SELECT id FROM authors WHERE slug = 'marc-antoine-lefebvre'),
  'fr', 'published', FALSE, FALSE, 10,
  NOW() - INTERVAL '5 days',
  'Meilleurs écouteurs sans fil 2026 : le guide ultime après 200h de test',
  'Comparatif des 5 meilleurs écouteurs sans fil de 2026. Test approfondi : ANC, qualité audio, confort et autonomie. Le classement honnête.'
),
(
  'iPhone 18 ou iPhone 18 Pro : lequel choisir vraiment ? (les modèles à éviter aussi)',
  'iphone-18-vs-18-pro-lequel-choisir-2026',
  'Apple vend quatre iPhone cette année. Deux méritent votre attention, un est un piège marketing, et le dernier est un secret bien gardé. On décortique tout.',
  '<p>Comme chaque année, Apple noie le marché sous quatre références. L''iPhone 18, le 18 Plus, le 18 Pro et le 18 Pro Max rivalisent d''arguments — mais un seul offre le meilleur compromis selon votre usage réel.</p>

<h2>Le piège du « Plus »</h2>
<p>L''iPhone 18 Plus est le modèle le plus difficile à recommander. Un écran plus grand, certes, mais les mêmes performances que le modèle standard pour 150 € de plus. Notre conseil : fuyez, sauf si la taille d''écran est votre seul critère. Et même dans ce cas, un concurrent fait mieux pour moins cher.</p>

<h2>Pro ou pas Pro, telle est la question</h2>
<p>Le vrai dilemme se joue entre l''iPhone 18 et le 18 Pro. Le zoom optique 5x et le mode ProRes justifient-ils 350 € d''écart ? Pour 80 % des utilisateurs, la réponse est non. Mais pour les 20 % restants — créateurs de contenu, photographes amateurs exigeants — le Pro est un investissement qui se rentabilise.</p>

<h2>Notre recommandation</h2>
<p>L''iPhone 18 standard est la meilleure affaire Apple de 2026. Puce A20, écran 120 Hz enfin généralisé, et une autonomie en hausse de 15 %. C''est le modèle que nous recommandons à 9 acheteurs sur 10.</p>',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=630&fit=crop',
  'iPhone 18 vs iPhone 18 Pro — Comparatif NoMask',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM subcategories WHERE slug = 'guides-achat' AND category_id = (SELECT id FROM categories WHERE slug = 'tech')),
  (SELECT id FROM authors WHERE slug = 'marc-antoine-lefebvre'),
  'fr', 'published', FALSE, FALSE, 9,
  NOW() - INTERVAL '15 days',
  'iPhone 18 vs 18 Pro : le guide d''achat sans langue de bois',
  'iPhone 18 ou 18 Pro en 2026 ? Notre comparatif détaillé après 3 semaines de test. Le modèle à acheter et ceux à éviter absolument.'
),
(
  'Batteries externes : le comparatif qui va sauver vos voyages (et votre patience)',
  'meilleures-batteries-externes-2026-comparatif',
  'Voyages, festivals, télétravail nomade : on a vidé et rechargé des dizaines de batteries pour trouver celles qui tiennent leurs promesses. Spoiler : la plus chère n''est pas la meilleure.',
  '<p>Une batterie externe, ça a l''air simple. C''est un bloc qui stocke de l''énergie et la restitue. Et pourtant, les écarts de performance entre les modèles sont vertigineux. Capacité réelle vs annoncée, vitesse de charge, sécurité thermique, encombrement : on a tout mesuré.</p>

<h2>Le mensonge des milliampères-heures</h2>
<p>Un fabricant annonce 20 000 mAh ? En réalité, vous n''en utiliserez que 12 000 à 14 000. La conversion de tension, les pertes thermiques et la qualité des cellules font fondre la capacité réelle. On a mesuré le taux de restitution réel de chaque modèle — et les écarts atteignent 35 %.</p>

<h2>La révélation : les batteries GaN</h2>
<p>Les nouvelles batteries avec chargeur GaN intégré changent la donne. Plus compactes, plus rapides, elles combinent batterie et chargeur mural en un seul appareil. Anker, Ugreen et Baseus se livrent une guerre féroce sur ce segment — et c''est le consommateur qui gagne.</p>

<h2>Notre top 3 selon votre usage</h2>
<p>Voyage longue durée, recharge express quotidienne ou kit survie festival : nous avons identifié le modèle idéal pour chaque scénario. Avec un rapport qualité-prix imbattable pour notre coup de cœur à moins de 40 €.</p>',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&h=630&fit=crop',
  'Comparatif batteries externes 2026 — Photo NoMask',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM subcategories WHERE slug = 'guides-achat' AND category_id = (SELECT id FROM categories WHERE slug = 'tech')),
  (SELECT id FROM authors WHERE slug = 'marc-antoine-lefebvre'),
  'fr', 'published', FALSE, FALSE, 8,
  NOW() - INTERVAL '25 days',
  'Meilleures batteries externes 2026 : le comparatif honnête',
  'Les meilleures batteries externes de 2026 testées et comparées. Capacité réelle, charge rapide, encombrement : notre verdict après des semaines de test.'
)
ON CONFLICT (locale, slug) DO NOTHING;
