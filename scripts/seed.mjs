#!/usr/bin/env node
// scripts/seed.mjs — Insert 45 real articles into Supabase via PostgREST
import { readFileSync } from 'fs';

// Load .env.local
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
};

const ha = (h) => new Date(Date.now() - h * 3600000).toISOString();

// Fetch IDs
const [cats, auths] = await Promise.all([
  fetch(`${URL}/rest/v1/categories?select=id,slug`, { headers }).then((r) => r.json()),
  fetch(`${URL}/rest/v1/authors?select=id,slug`, { headers }).then((r) => r.json()),
]);
const C = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
const A = Object.fromEntries(auths.map((a) => [a.slug, a.id]));

console.log('Categories:', Object.keys(C).join(', '));
console.log('Authors:', Object.keys(A).join(', '));

// Pick authors by short alias
const au = {
  jmv: A['jean-marc-valois'],
  sd: A['sophie-durand'],
  mal: A['marc-antoine-lefebvre'],
  ec: A['emilie-chen'],
  tm: A['thomas-martin'],
  cd: A['clara-dubois'],
};

function art(title, slug, excerpt, content, img, caption, cat, auth, opts = {}) {
  return {
    title, slug, excerpt, content,
    image_url: img,
    image_caption: caption,
    category_id: C[cat],
    author_id: auth,
    locale: 'fr',
    status: 'published',
    is_featured: opts.f || false,
    is_breaking: opts.b || false,
    read_time: opts.rt || 5,
    published_at: ha(opts.h || 1),
    seo_title: opts.st || title,
    seo_description: opts.sd || excerpt,
  };
}

const articles = [
  // ===== INTERNATIONAL (5) =====
  art(
    "Guerre au Moyen-Orient : l'Iran menace de prendre pour cible le porte-avions USS Abraham Lincoln",
    'guerre-moyen-orient-iran-menace-porte-avions-uss-abraham-lincoln',
    "L'Iran intensifie ses menaces contre les forces américaines dans le Golfe, ciblant désormais directement le porte-avions USS Abraham Lincoln.",
    `<h2>Tensions maximales dans le Golfe</h2><p>Un mois après le début de l'offensive américaine, les tensions au Moyen-Orient atteignent un nouveau palier. L'Iran a explicitement menacé de prendre pour cible le porte-avions USS Abraham Lincoln, déployé dans la région du Golfe. Environ 850 missiles Tomahawk auraient été tirés selon le Washington Post.</p><p>Le Pentagone envisagerait des opérations terrestres en Iran. Les Houthis du Yémen ont revendiqué leur première attaque directe contre Israël, ouvrant un nouveau front. La Russie apporte un soutien croissant à l'Iran, renforçant les craintes d'internationalisation du conflit.</p>`,
    'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=1200&h=630&fit=crop',
    'Porte-avions en opération dans le Golfe (illustration)',
    'international', au.jmv, { f: true, b: true, rt: 7, h: 1 }
  ),
  art(
    'Manifestations « No Kings » : des millions d\'Américains dans les rues contre Donald Trump',
    'manifestations-no-kings-millions-americains-contre-trump',
    "Plusieurs millions de manifestants ont défilé à travers les États-Unis pour protester contre la politique de Donald Trump, dans un mouvement baptisé « No Kings ».",
    `<h2>La plus grande mobilisation depuis les droits civiques</h2><p>Le mouvement « No Kings » a rassemblé ce week-end plusieurs millions de personnes dans les rues des grandes villes américaines. Les manifestants dénoncent la gestion du conflit au Moyen-Orient, les atteintes aux libertés et la concentration des pouvoirs exécutifs.</p><p>Fait notable, cette mobilisation a rassemblé bien au-delà de la base démocrate. Des républicains modérés et des primo-manifestants ont rejoint les cortèges, témoignant d'une inquiétude transpartisane face à la dérive autoritaire.</p>`,
    'https://images.unsplash.com/photo-1591848478625-de43268e6fb8?w=1200&h=630&fit=crop',
    'Manifestants « No Kings » aux États-Unis (illustration)',
    'international', au.sd, { f: true, h: 3, rt: 6 }
  ),
  art(
    "Zelensky en Jordanie : l'Ukraine signe des accords de défense avec les pays du Golfe",
    'zelensky-jordanie-ukraine-accords-defense-pays-golfe',
    "Volodymyr Zelensky s'est rendu en Jordanie après avoir conclu des accords de défense majeurs avec l'Arabie saoudite, les Émirats et le Qatar.",
    `<h2>Une coopération sur dix ans</h2><p>Le président ukrainien a annoncé se trouver en Jordanie pour des discussions sur la « sécurité ». Ces accords prévoient une coopération sur 10 ans et des chaînes de production conjointes, notamment sur les drones.</p><p>Alors que la guerre avec la Russie se poursuit, l'Ukraine diversifie ses alliances au-delà de l'Occident. Les accords avec les monarchies du Golfe représentent un tournant dans la politique étrangère de Kiev.</p>`,
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=630&fit=crop',
    'Diplomatie internationale (illustration)',
    'international', au.jmv, { h: 5 }
  ),
  art(
    "Jérusalem : la police israélienne empêche le patriarche latin de célébrer les Rameaux",
    'jerusalem-police-israelienne-empeche-patriarche-latin-rameaux',
    "Pour la première fois depuis des siècles, le patriarche latin de Jérusalem a été empêché de célébrer les Rameaux par la police israélienne.",
    `<h2>Un événement sans précédent</h2><p>Israël a fermé tous les lieux saints de Jérusalem-Est. Le patriarche latin et le père du Saint-Sépulcre auraient été arrêtés en chemin. Macron a apporté son « plein soutien » au patriarche.</p><p>Les catholiques de Damas ont aussi annulé leurs processions face aux violences contre les chrétiens à Souqaylabiya. La liberté de culte dans la région est de plus en plus menacée.</p>`,
    'https://images.unsplash.com/photo-1547483238-2cbf881a5edb?w=1200&h=630&fit=crop',
    'Vieille ville de Jérusalem (illustration)',
    'international', au.tm, { b: true, h: 7 }
  ),
  art(
    "Finlande : deux drones non identifiés s'écrasent sur le territoire, la zone bouclée",
    'finlande-drones-non-identifies-ecrasent-zone-bouclee',
    "Deux drones d'origine inconnue se sont écrasés en Finlande. Le Premier ministre évoque la possibilité de drones ukrainiens victimes de brouillages russes.",
    `<h2>L'hypothèse de drones ukrainiens</h2><p>Le Premier ministre Petteri Orpo a avancé qu'il était « probable qu'il s'agissait de drones ukrainiens », potentiellement victimes de brouillages russes qui auraient dévié leur trajectoire.</p><p>La Finlande partage 1 340 km de frontière avec la Russie. Ce nouvel épisode relance le débat sur la menace des drones et le renforcement des défenses anti-aériennes européennes.</p>`,
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=630&fit=crop',
    'Drone militaire (illustration)',
    'international', au.mal, { h: 9, rt: 4 }
  ),

  // ===== POLITIQUE (5) =====
  art(
    "Emmanuel Grégoire officiellement élu maire de Paris, succède à Anne Hidalgo",
    'emmanuel-gregoire-elu-maire-paris-succede-hidalgo',
    "L'ancien premier adjoint d'Anne Hidalgo a été proclamé maire de Paris avec 103 voix sur 163 au Conseil de Paris.",
    `<h2>Le périscolaire comme premier combat</h2><p>Emmanuel Grégoire est officiellement devenu le nouveau maire de Paris ce dimanche. Il a promis de faire du périscolaire son « premier combat » pour protéger les enfants. Le Parc des Princes sera au menu du Conseil de Paris exceptionnel de mi-avril.</p><p>L'élection intervient dans un paysage municipal où LFI et le RN sont sortis renforcés. « Nous sommes dans le temps des radicalités », analyse le politologue Brice Soccol.</p>`,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop',
    "Hôtel de Ville de Paris (illustration)",
    'politique', au.sd, { f: true, h: 2, rt: 6 }
  ),
  art(
    "Présidentielle 2027 : 90 personnalités de droite et du centre appellent à une candidature unique",
    'presidentielle-2027-90-personnalites-droite-centre-candidature-unique',
    "Une semaine après les municipales, 90 personnalités dont Maud Bregeon et Vincent Jeanbrun appellent à « un sursaut d'unité » pour 2027.",
    `<h2>Le spectre d'une victoire du RN</h2><p>Un nouveau sondage donne le RN gagnant dans tous les cas de figure, sauf face à Édouard Philippe. Jordan Bardella ferait plus de 70% face à Mélenchon.</p><p>L'ancien Premier ministre reste le seul à pouvoir battre le RN. Le temps presse pour le camp modéré, à un an du scrutin.</p>`,
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop',
    'Assemblée nationale (illustration)',
    'politique', au.sd, { f: true, h: 4, rt: 6 }
  ),
  art(
    "Carburants : Thomas Ménagé chiffre la baisse de TVA à « 12 milliards sur l'année »",
    'carburants-thomas-menage-baisse-tva-12-milliards',
    "Le député RN estime que la baisse de TVA sur les carburants est « la seule mesure juste » face à la flambée des prix.",
    `<h2>Les mesures ciblées du gouvernement</h2><p>Le gouvernement a annoncé des mesures « ciblées » pour le transport, jugées insuffisantes par l'opposition. Marine Tondelier réclame « une aide ciblée selon les revenus ».</p><p>Le prix des carburants est devenu l'un des enjeux politiques les plus brûlants à un an de la présidentielle 2027.</p>`,
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=630&fit=crop',
    'Station-service (illustration)',
    'politique', au.cd, { h: 6 }
  ),
  art(
    "Benoît Payan réinstallé maire de Marseille, Amine Kessaci nommé 4e adjoint",
    'benoit-payan-reinstalle-maire-marseille-amine-kessaci-adjoint',
    "Le maire de Marseille a remis l'écharpe tricolore au militant antinarcotrafic Amine Kessaci, devenu 4e adjoint.",
    `<h2>Le symbole Kessaci</h2><p>Amine Kessaci, militant emblématique de la lutte contre le narcotrafic dont le frère Mehdi a été assassiné, incarne la mobilisation citoyenne. Sa nomination envoie un message puissant.</p><p>Payan devra faire face à une ville toujours en proie aux règlements de comptes liés au narcotrafic, tout en poursuivant la transformation urbaine engagée.</p>`,
    'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=1200&h=630&fit=crop',
    'Marseille, le Vieux-Port (illustration)',
    'politique', au.mal, { h: 10 }
  ),
  art(
    "Mairie de Fresnes saccagée : Jeanbrun dénonce « la France McDo » face à la délinquance",
    'mairie-fresnes-saccagee-jeanbrun-france-mcdo-delinquance',
    "Le ministre de la Ville Vincent Jeanbrun appelle à « changer de méthode » après le saccage de la mairie de Fresnes.",
    `<h2>Un appel à la fermeté</h2><p>La mairie de Fresnes a été saccagée par des individus utilisant des mortiers d'artifice. « Je n'aime pas la France McDo, "venez comme vous êtes" », déclare le ministre.</p><p>La vice-présidente de l'Association des Maires de France alerte : « Ces six dernières années, jamais les maires n'ont subi tant d'incivilités. »</p>`,
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=630&fit=crop',
    'Mairie française (illustration)',
    'politique', au.cd, { h: 12, rt: 4 }
  ),

  // ===== SOCIÉTÉ (5) =====
  art(
    "Attentat déjoué à Paris : une bombe artisanale visait le siège de la Bank of America",
    'attentat-dejoue-paris-bombe-artisanale-bank-of-america',
    "Trois suspects, dont un mineur de 17 ans, ont été interpellés après la tentative d'attentat contre la Bank of America, avec une possible connexion iranienne.",
    `<h2>Trois interpellations, l'ombre de l'Iran</h2><p>Un adolescent de 17 ans a été interpellé tentant de mettre le feu à un engin explosif artisanal devant la Bank of America, rue La Boétie. Le Parquet antiterroriste a annoncé deux autres arrestations.</p><p>Le ministre de l'Intérieur a évoqué une « suspicion importante » de lien avec l'Iran. Des actions similaires se sont produites en Belgique, aux Pays-Bas et au Royaume-Uni.</p>`,
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=630&fit=crop',
    'Paris, opération de police (illustration)',
    'societe', au.mal, { f: true, b: true, h: 1, rt: 6 }
  ),
  art(
    "Tests de féminité aux JO 2028 : Caster Semenya dénonce « un manque de respect envers les femmes »",
    'tests-feminite-jo-2028-caster-semenya-manque-respect-femmes',
    "La double championne olympique s'élève contre les tests de féminité prévus pour les JO de Los Angeles 2028.",
    `<h2>Un combat de longue date</h2><p>Caster Semenya a dénoncé les tests de féminité prévus pour les JO 2028, qualifiant cette pratique de « manque de respect envers les femmes ». Son cas suscite un vif débat depuis des années.</p><p>Le CIO fait face à des pressions contradictoires entre inclusion des athlètes et séparation stricte des catégories.</p>`,
    'https://images.unsplash.com/photo-1461896836934-bd45ba8fcff7?w=1200&h=630&fit=crop',
    'Athlétisme, stade olympique (illustration)',
    'societe', au.tm, { h: 5 }
  ),
  art(
    "Disneyland Paris inaugure un monde « La Reine des Neiges » et renomme son parc",
    'disneyland-paris-inaugure-reine-des-neiges-disney-adventure-world',
    "Le parc Walt Disney Studios devient Disney Adventure World avec l'ouverture d'une zone dédiée à La Reine des Neiges.",
    `<h2>Une extension ambitieuse</h2><p>Disneyland Paris inaugure une zone consacrée à La Reine des Neiges avec une avenue thématique, un lac de trois hectares et deux nouvelles attractions. Le parc est renommé Disney Adventure World.</p><p>L'investissement vise à attirer de nouveaux visiteurs et prolonger la durée des séjours. Le parc reste la première destination touristique privée d'Europe.</p>`,
    'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=1200&h=630&fit=crop',
    "Parc d'attractions (illustration)",
    'societe', au.cd, { h: 8 }
  ),
  art(
    "Paris, nouvelle capitale mondiale des demandes en mariage spectaculaires",
    'paris-capitale-mondiale-demandes-mariage-spectaculaires',
    "Mises en scène devant la Tour Eiffel, calèches et musiciens : Paris s'impose comme la destination pour les demandes en mariage.",
    `<h2>Un marché en plein essor</h2><p>Les agences parisiennes spécialisées rapportent +40% d'activité en un an. Les budgets vont de quelques centaines d'euros à des dizaines de milliers pour les demandes les plus extravagantes.</p><p>La mairie de Paris voit ce phénomène d'un bon œil, estimant qu'il contribue à l'attractivité touristique et à l'image romantique de la capitale.</p>`,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop',
    'Tour Eiffel, Paris (illustration)',
    'societe', au.tm, { h: 14, rt: 4 }
  ),
  art(
    "Passage à l'heure d'été : le changement d'heure est-il encore utile ?",
    'passage-heure-ete-changement-heure-encore-utile',
    "Instauré après le premier choc pétrolier, le passage à l'heure d'été suscite chaque année le même débat sur son utilité.",
    `<h2>Un dispositif contesté</h2><p>Les économies d'énergie ne représentent plus que 0,5% de la consommation nationale. En revanche, les effets sur la santé sont de mieux en mieux documentés : troubles du sommeil, risques cardiovasculaires accrus.</p><p>Le Parlement européen avait voté en 2019 la suppression du changement d'heure, mais la décision n'a jamais été appliquée faute d'accord entre États membres.</p>`,
    'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200&h=630&fit=crop',
    'Horloge (illustration)',
    'societe', au.ec, { h: 18, rt: 4 }
  ),

  // ===== ÉCONOMIE (5) =====
  art(
    "Hausse des carburants : les routiers bloquent l'A7, les mesures du gouvernement jugées insuffisantes",
    'hausse-carburants-routiers-bloquent-a7-mesures-insuffisantes',
    "Les transporteurs routiers se mobilisent sur l'A7 pour protester contre la flambée des prix du carburant.",
    `<h2>Des mesures insuffisantes</h2><p>Des routiers ont provoqué de « forts ralentissements » sur l'A7. Le prix du gazole dépasse 2,20 euros. Les mesures « ciblées » du gouvernement sont jugées insuffisantes.</p><p>Les gendarmes alertent sur la recrudescence des vols de carburant à travers le pays. Exploitants agricoles et transporteurs en sont les principales victimes.</p>`,
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=630&fit=crop',
    'Poids lourds sur autoroute (illustration)',
    'economie', au.cd, { f: true, h: 3, rt: 6 }
  ),
  art(
    "Détroit d'Ormuz bloqué : l'Inde manque de gaz, le choc énergétique s'étend",
    'detroit-ormuz-bloque-inde-manque-gaz-choc-energetique',
    "La fermeture du détroit d'Ormuz par l'Iran provoque des pénuries de gaz en Inde et menace l'approvisionnement mondial.",
    `<h2>Un goulet d'étranglement mondial</h2><p>Le détroit d'Ormuz voit transiter 20% de la consommation mondiale de pétrole. Son blocage a propulsé le Brent au-delà de 130 dollars. Aluminium Bahrain réduit sa production de 19%.</p><p>En Europe, la hausse des prix de l'énergie ravive le spectre de l'inflation. Les gouvernements multiplient les mesures de soutien tandis que la BCE surveille la situation.</p>`,
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop',
    'Raffinerie pétrolière (illustration)',
    'economie', au.jmv, { f: true, b: true, h: 6 }
  ),
  art(
    "Voitures électriques : l'aide pour les bornes de recharge en copropriété bondit de 56%",
    'voitures-electriques-aide-bornes-recharge-copropriete-hausse-56-pourcent',
    "À partir du 1er avril, le plafond de la prime passera de 8 000 à 12 500 euros par immeuble.",
    `<h2>Accélérer la transition</h2><p>La prime pour les bornes de recharge en copropriété augmente de 56%, passant de 8 000 à 12 500 euros. Seules 7% des copropriétés sont actuellement équipées.</p><p>Cette mesure intervient dans un contexte paradoxal où la crise renchérit les carburants fossiles, rendant l'électrique attractif, mais l'électricité aussi sous pression.</p>`,
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=630&fit=crop',
    'Borne de recharge électrique (illustration)',
    'economie', au.ec, { h: 10, rt: 4 }
  ),
  art(
    "Tourisme : Chypre et la Grèce durement touchés par la guerre au Moyen-Orient",
    'tourisme-chypre-grece-touches-guerre-moyen-orient',
    "Rues vides et hôtels désertés : le conflit grève le démarrage de la saison touristique à Chypre et en Grèce.",
    `<h2>Des annulations massives</h2><p>De nombreux voyageurs annulent leurs séjours, considérant ces pays comme trop proches du conflit. Les compagnies aériennes réduisent leurs fréquences vers Larnaca et Athènes.</p><p>En revanche, l'Espagne s'attend à bénéficier largement : les réservations pour les Baléares et Canaries sont en forte hausse.</p>`,
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop',
    'Côtes méditerranéennes (illustration)',
    'economie', au.tm, { h: 14 }
  ),
  art(
    "Le gouvernement met en vente 60 Millions de consommateurs",
    'gouvernement-vente-60-millions-consommateurs',
    "La dissolution de l'Institut national de la consommation est officialisée, le gouvernement cherche un repreneur pour le magazine.",
    `<h2>Une liquidation controversée</h2><p>Le magazine, qui compte plus de 400 000 abonnés, est une référence indépendante en matière de tests de produits depuis 1970. Plusieurs groupes de presse auraient manifesté leur intérêt.</p><p>Les associations de consommateurs s'inquiètent d'une perte de crédibilité et d'indépendance éditoriale une fois le titre passé dans des mains privées.</p>`,
    'https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=1200&h=630&fit=crop',
    'Presse magazine (illustration)',
    'economie', au.cd, { h: 16, rt: 4 }
  ),

  // ===== TECH (5) =====
  art(
    "« On ne sait plus quelle photo croire » : l'IA envahit les annonces immobilières",
    'ia-envahit-annonces-immobilieres-photos-generees',
    "De plus en plus d'agences utilisent l'IA pour embellir ou générer intégralement les photos de leurs annonces.",
    `<h2>Du home staging virtuel au faux intégral</h2><p>L'IA générative permet de transformer un appartement vétuste en un bien de luxe en quelques secondes. Les plateformes commencent à imposer un marquage obligatoire des images retouchées.</p><p>Aucune réglementation spécifique n'encadre l'utilisation de l'IA dans les annonces immobilières. Des associations demandent des obligations de transparence.</p>`,
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop',
    'Appartement et écran numérique (illustration)',
    'tech', au.ec, { f: true, h: 2, rt: 6 }
  ),
  art(
    "Peut-on faire confiance à l'IA pour s'informer ? Le grand débat",
    'confiance-ia-information-grand-debat',
    "Alors que de plus en plus de Français utilisent l'IA pour s'informer, les experts alertent sur les risques de désinformation.",
    `<h2>Un potentiel libérateur mais risqué</h2><p>Damien Hontang, PDG de Cobl.ai, estime que « l'IA a un potentiel libérateur incroyable ». Pourtant, les hallucinations restent un problème majeur dans le domaine de l'actualité.</p><p>Certains médias développent leurs propres outils d'IA pour enrichir leur offre, tout en maintenant la vérification humaine comme dernier rempart contre la désinformation.</p>`,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    'Intelligence artificielle (illustration)',
    'tech', au.ec, { h: 6 }
  ),
  art(
    "Fake news à 150 km/h : quand l'IA piège plusieurs médias français",
    'fake-news-150-kmh-ia-piege-medias-francais',
    "Une fausse proposition de loi sur la vitesse a trompé plusieurs médias, révélant la vulnérabilité de la presse face à la désinformation.",
    `<h2>L'effet cascade de la désinformation</h2><p>Depuis l'automne 2025, la rumeur d'une limitation à 150 km/h circule. En voulant la démentir, plusieurs médias ont fabriqué une seconde fausse info : une proposition de loi inexistante attribuée au sénateur Louis Vogel.</p><p>Les outils d'IA utilisés pour la rédaction rapide ont contribué à cette propagation. Le sénateur a dû publier un démenti officiel.</p>`,
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=630&fit=crop',
    'Autoroute et médias (illustration)',
    'tech', au.mal, { h: 10 }
  ),
  art(
    "Drones militaires : l'Ukraine exporte son expertise vers les pays du Golfe",
    'drones-militaires-ukraine-exporte-expertise-pays-du-golfe',
    "Forte de son expérience de combat, l'Ukraine vend son savoir-faire en drones aux pays du Golfe engagés dans le conflit.",
    `<h2>De Shahed capturés à l'innovation offensive</h2><p>Les Ukrainiens ont appris à contrer les drones iraniens Shahed et développé leurs propres plateformes offensives. Cette expertise est une monnaie d'échange diplomatique précieuse.</p><p>Les armées occidentales modernisent leurs systèmes anti-drones, un marché estimé à 30 milliards de dollars d'ici 2030.</p>`,
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=630&fit=crop',
    'Drone en vol (illustration)',
    'tech', au.jmv, { h: 12 }
  ),
  art(
    "La menace invisible : les missiles à combustible solide de la Corée du Nord",
    'menace-invisible-drones-combustible-solide-coree-du-nord',
    "Kim Jong-un a supervisé un nouvel essai de moteur à combustible solide, rendant la détection des lancements quasiment impossible.",
    `<h2>Pourquoi le combustible solide change la donne</h2><p>Contrairement aux missiles à propulsion liquide, les missiles à combustible solide peuvent être lancés en quelques minutes. Kim Jong-un déclare une « phase importante de changement » des capacités nord-coréennes.</p><p>Cette avancée intervient alors que le monde est focalisé sur le Moyen-Orient, offrant une fenêtre d'opportunité à Pyongyang pour accélérer son programme.</p>`,
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&h=630&fit=crop',
    'Technologies militaires (illustration)',
    'tech', au.mal, { h: 16 }
  ),

  // ===== CULTURE (5) =====
  art(
    "Série Harry Potter : insultes racistes contre l'acteur noir incarnant Severus Rogue",
    'serie-harry-potter-insultes-racistes-acteur-severus-rogue',
    "L'incarnation de Rogue par un comédien noir dans la série HBO déclenche une vague de réactions racistes.",
    `<h2>Des réactions d'une violence inédite</h2><p>L'acteur et ses proches ont reçu des centaines de messages haineux. HBO a condamné « avec fermeté » ces attaques et renforcé les dispositifs de sécurité.</p><p>Ce n'est pas la première controverse liée à la diversité dans le casting d'adaptations. Des fans rappellent que Rowling n'avait jamais spécifié la couleur de peau de Rogue.</p>`,
    'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1200&h=630&fit=crop',
    'Plateau de tournage (illustration)',
    'culture', au.tm, { f: true, h: 4 }
  ),
  art(
    "« Yellow Letters » : İlker Çatak dissèque la dictature turque dans un film puissant",
    'yellow-letters-ilker-catak-dictature-turque-film',
    "Après « La Salle des profs », le réalisateur revient avec un film inspiré par les purges du régime d'Erdoğan.",
    `<h2>L'intime comme miroir du politique</h2><p>Yellow Letters suit un couple d'universitaires frappés par les purges post-tentative de coup d'État. Çatak explore les mécanismes de contrôle et de destruction psychologique de la dictature.</p><p>Après son Oscar pour La Salle des profs, İlker Çatak confirme son statut de cinéaste majeur du cinéma européen.</p>`,
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=630&fit=crop',
    'Cinéma (illustration)',
    'culture', au.cd, { h: 8 }
  ),
  art(
    "Henri Matisse : l'œuvre foisonnante de sa « deuxième vie » exposée au Grand Palais",
    'henri-matisse-deuxieme-vie-exposition-grand-palais',
    "Le Grand Palais accueille une exposition majeure consacrée à la période tardive d'Henri Matisse.",
    `<h2>La révolution des ciseaux</h2><p>L'exposition retrace la période des années 1940, quand Matisse, contraint par la maladie, invente les papiers découpés. La Tristesse du roi, L'Escargot et les panneaux de Vence sont présentés.</p><p>Les commissaires établissent des parallèles avec les artistes contemporains qui transforment les limitations en opportunités créatives.</p>`,
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=630&fit=crop',
    "Exposition d'art (illustration)",
    'culture', au.tm, { h: 12 }
  ),
  art(
    "Kevin Costner et Jake Gyllenhaal réunis pour le film Honeymoon with Harry",
    'kevin-costner-jake-gyllenhaal-honeymoon-with-harry',
    "Adaptée du roman de Bart Baker, la comédie dramatique réunit les deux stars pour un tournage en Australie.",
    `<h2>Deux générations d'Hollywood</h2><p>Le film marque la rencontre entre Kevin Costner, légende en plein renouveau depuis ses westerns Horizon, et Jake Gyllenhaal, acteur polymorphe de Prisoners et Nightcrawler.</p><p>Le roman de Bart Baker mêle humour, road-trip et émotion dans une histoire intergénérationnelle parfaite pour le duo.</p>`,
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=630&fit=crop',
    'Cinéma hollywoodien (illustration)',
    'culture', au.ec, { h: 16, rt: 4 }
  ),
  art(
    "Le British Museum détrôné : le Natural History Museum le plus visité de Londres",
    'british-museum-detrone-natural-history-museum-plus-visite-londres',
    "Avec 7,1 millions de visiteurs en 2025, le Natural History Museum établit un record et détrône le British Museum.",
    `<h2>Les raisons d'un succès</h2><p>Des expositions temporaires à succès sur les dinosaures et le changement climatique, et une galerie Hintze avec son squelette de baleine bleue devenue iconique sur les réseaux sociaux.</p><p>Le British Museum souffre du scandale du vol d'objets par un conservateur en 2023 et de la polémique des marbres du Parthénon.</p>`,
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=630&fit=crop',
    "Musée d'histoire naturelle (illustration)",
    'culture', au.cd, { h: 20, rt: 4 }
  ),

  // ===== SCIENCE (5) =====
  art(
    "Mission Artemis : un rover suisse bientôt sur la Lune",
    'mission-artemis-rover-suisse-bientot-sur-la-lune',
    "Dans le cadre du programme Artemis de la NASA, un rover développé en Suisse se prépare pour la Lune.",
    `<h2>La technologie suisse au service de l'exploration</h2><p>Le rover, compact et léger, est équipé de capteurs capables d'analyser le régolithe lunaire et de détecter la glace d'eau. Il s'inscrit dans la stratégie de la NASA pour une présence humaine durable sur la Lune.</p><p>Le programme Artemis mobilise l'ESA, le Japon et le Canada pour préparer à terme des missions habitées vers Mars.</p>`,
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=630&fit=crop',
    'Surface lunaire (illustration)',
    'science', au.ec, { f: true, h: 3 }
  ),
  art(
    "Myllokunmingia : un ancêtre à quatre yeux éclaire notre compréhension du sommeil",
    'myllokunmingia-ancetre-quatre-yeux-sommeil',
    "La découverte d'un ancien vertébré doté de quatre yeux donne de nouvelles perspectives sur l'évolution du sommeil.",
    `<h2>Quatre yeux contre les prédateurs</h2><p>Myllokunmingia, vieux de 500 millions d'années, avait deux yeux latéraux et deux yeux pariétaux sur le crâne servant de sentinelles contre les prédateurs venant du dessus.</p><p>Les chercheurs établissent un lien avec l'organe pinéal qui régule la mélatonine chez les vertébrés actuels, vestige de ces yeux primitifs.</p>`,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
    'Recherche scientifique (illustration)',
    'science', au.ec, { h: 7 }
  ),
  art(
    "Piton de la Fournaise : l'éruption reprend à La Réunion avec des coulées spectaculaires",
    'piton-fournaise-eruption-reprend-reunion-coulees-lave',
    "Le volcan réunionnais est reparti en éruption ce dimanche, avec de la lave visible dans les Grandes Pentes.",
    `<h2>Un volcan hyperactif</h2><p>Le Piton de la Fournaise connaît une à deux éruptions par an. Les volcanologues de l'OVPF monitrent l'activité sismique et les déformations du sol en continu.</p><p>Les coulées de lave s'écoulent dans l'Enclos Fouqué, zone inhabitée. L'accès au volcan est interdit mais le trafic aérien n'est pas perturbé.</p>`,
    'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&h=630&fit=crop',
    'Éruption volcanique (illustration)',
    'science', au.mal, { h: 10, rt: 4 }
  ),
  art(
    "Allemagne : une baleine échouée en mer Baltique parvient à regagner le large",
    'allemagne-baleine-echouee-baltique-regagne-large',
    "Après plusieurs jours d'échouage sur la côte allemande, une baleine a réussi à regagner la mer Baltique.",
    `<h2>Un sauvetage complexe</h2><p>Des dizaines de volontaires ont travaillé jour et nuit pour maintenir l'animal hydraté et le guider vers le large à la marée favorable.</p><p>Les scientifiques notent une augmentation des échouages liée au changement climatique, à la pollution sonore sous-marine et aux perturbations des courants.</p>`,
    'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&h=630&fit=crop',
    'Baleine en mer (illustration)',
    'science', au.tm, { h: 14, rt: 4 }
  ),
  art(
    "Requins positifs à la cocaïne aux Bahamas : une découverte inquiétante",
    'requins-positifs-cocaine-bahamas-decouverte-inquietante',
    "Des chercheurs ont détecté des traces de cocaïne dans le sang de requins, révélant l'ampleur de la pollution narcotique des océans.",
    `<h2>Comment la cocaïne arrive dans l'océan</h2><p>Les trafiquants jettent régulièrement des cargaisons à la mer pour échapper aux autorités. Les eaux usées des zones côtières constituent une autre source de contamination.</p><p>Les effets de cette exposition chronique sur les requins et l'écosystème marin restent largement inconnus.</p>`,
    'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=1200&h=630&fit=crop',
    'Requin en eaux tropicales (illustration)',
    'science', au.ec, { h: 18 }
  ),

  // ===== SPORT (5) =====
  art(
    "F1 : Kimi Antonelli récidive au Japon et devient le plus jeune leader de l'histoire à 19 ans",
    'f1-kimi-antonelli-victoire-japon-plus-jeune-leader-19-ans',
    "Le pilote Mercedes signe une deuxième victoire consécutive à Suzuka et prend la tête du championnat du monde.",
    `<h2>Un surdoué qui apprend vite</h2><p>Kimi Antonelli remporte le GP du Japon à Suzuka, sa deuxième victoire consécutive. À 19 ans, il devient le plus jeune leader du championnat F1. Gasly a résisté brillamment aux assauts de Verstappen.</p><p>Confronté à un début de saison difficile, Max Verstappen a laissé entendre qu'il pourrait quitter la F1. « Est-ce que ça vaut le coup ? » aurait-il confié à son entourage.</p>`,
    'https://images.pexels.com/photos/12801330/pexels-photo-12801330.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    'Voiture de Formule 1 en course (illustration)',
    'sport', au.mal, { f: true, b: true, h: 1, rt: 6 }
  ),
  art(
    "Cyclisme : Vingegaard écrase le Tour de Catalogne, Lenny Martinez sur le podium",
    'cyclisme-vingegaard-ecrase-tour-catalogne-lenny-martinez-podium',
    "Jonas Vingegaard remporte le Tour de Catalogne tandis que le Français Lenny Martinez prend la deuxième place.",
    `<h2>Vingegaard en forme olympique</h2><p>Le Danois de Visma-Lease a Bike a contrôlé la course de bout en bout. L'Américain Brady Gilmore remporte la dernière étape devant le Français Dorian Godon.</p><p>La deuxième place de Lenny Martinez confirme la montée en puissance du jeune coureur qui ambitionne le Tour de France à 22 ans.</p>`,
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=630&fit=crop',
    'Cyclisme professionnel (illustration)',
    'sport', au.mal, { h: 3 }
  ),
  art(
    "Patinage : Cizeron et Fournier Beaudry sacrés champions du monde à Prague",
    'patinage-cizeron-fournier-beaudry-champions-monde-prague',
    "Un mois et demi après l'or olympique, Guillaume Cizeron et Laurence Fournier Beaudry décrochent le titre mondial.",
    `<h2>« On a réussi à être sur notre petite planète »</h2><p>Le couple franco-canadien a dominé la compétition de bout en bout, battant son propre record mondial en danse rythmique. Leur libre est qualifié de « performance irréelle ».</p><p>Cizeron démontre qu'il est le plus grand danseur sur glace de l'histoire. Adam Siao Him Fa n'a pas réussi à monter sur le podium en individuel.</p>`,
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=630&fit=crop',
    'Patinage artistique (illustration)',
    'sport', au.tm, { f: true, h: 6, rt: 6 }
  ),
  art(
    "Tennis : Aryna Sabalenka réussit le « Sunshine Double » en dominant Gauff à Miami",
    'tennis-sabalenka-sunshine-double-gauff-miami',
    "La Bélarusse remporte Miami après Indian Wells, devenant la cinquième joueuse à réaliser le « Sunshine Double ».",
    `<h2>Sabalenka, la reine soleil</h2><p>Sabalenka domine Gauff (6-4, 2-6, 6-3) et s'offre le Sunshine Double en enchaînant Indian Wells et Miami. « Je vois clairement où je peux m'améliorer », déclare Gauff.</p><p>Chez les hommes, Sinner affrontera Lehecka en finale. Le Français Arthur Fils a impressionné malgré son élimination en demi.</p>`,
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=630&fit=crop',
    'Court de tennis (illustration)',
    'sport', au.mal, { h: 8 }
  ),
  art(
    "NBA : les Spurs de Wembanyama écrasent Milwaukee et s'installent au sommet de l'Ouest",
    'nba-spurs-wembanyama-ecrasent-milwaukee-sommet-ouest',
    "San Antonio corrige Milwaukee 127-95 et confirme sa place top 2 de la Conférence Ouest grâce à Wembanyama.",
    `<h2>Wembanyama, le patron</h2><p>Les Spurs corrigent les Bucks 127-95. Victor Wembanyama signe un double-double impressionnant. Maxime Raynaud poursuit aussi sa belle dynamique à Sacramento.</p><p>Luka Doncic (Lakers) a été suspendu un match pour accumulation de fautes techniques, résumant sa saison tumultueuse à Los Angeles.</p>`,
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=630&fit=crop',
    'Match de basket NBA (illustration)',
    'sport', au.ec, { h: 10 }
  ),

  // ===== STYLE (5) =====
  art(
    "Le pape Léon XIV à Monaco : les images marquantes d'une visite historique",
    'pape-leon-xiv-monaco-visite-historique-images',
    "Pour la première fois en 500 ans, un souverain pontife s'est rendu en visite officielle dans la principauté.",
    `<h2>Des images d'une élégance rare</h2><p>Le pape Léon XIV a été reçu par le prince Albert II et la princesse Charlène dans le cadre somptueux du Palais princier. Il a appelé à la « paix » et au « partage ».</p><p>Monaco, dont le catholicisme est la religion d'État, a vécu cette visite comme un événement majeur. Des milliers de fidèles se sont rassemblés.</p>`,
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200&h=630&fit=crop',
    'Monaco, Palais princier (illustration)',
    'style', au.tm, { f: true, h: 4 }
  ),
  art(
    "Butter run : fabriquer du beurre en courant, la nouvelle tendance fitness venue des États-Unis",
    'butter-run-fabriquer-beurre-courant-tendance-fitness',
    "Le « butter run » enflamme les réseaux sociaux : courir avec un bocal de crème pour fabriquer du beurre.",
    `<h2>Une vidéo vue des millions de fois</h2><p>La tendance lancée par la créatrice Libby Claire consiste à emporter un bocal de crème fraîche pendant son jogging. Les secousses fabriquent du beurre en 30 minutes.</p><p>Si la tendance fait sourire, les diététiciens rappellent que le beurre artisanal reste à 750 calories pour 100 grammes.</p>`,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop',
    'Jogging et tendance fitness (illustration)',
    'style', au.cd, { h: 8, rt: 4 }
  ),
  art(
    "Marie Kondo : « Le rangement est une source de joie, pas une corvée »",
    'marie-kondo-rangement-source-joie-pas-corvee',
    "La reine du rangement revient avec des conseils adaptés aux petits espaces urbains.",
    `<h2>L'évolution de la méthode KonMari</h2><p>Marie Kondo assume une approche plus souple : « La perfection n'est pas l'objectif. L'objectif est de s'entourer uniquement de ce qui apporte de la joie. »</p><p>Son nouveau livre, attendu en France en mai, aborde le rangement vertical, la rotation saisonnière et le désencombrement numérique.</p>`,
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&fit=crop',
    'Intérieur minimaliste (illustration)',
    'style', au.tm, { h: 12, rt: 4 }
  ),
  art(
    "Guirec Soudée dans la légende : premier tour du monde à l'envers en multicoque",
    'guirec-soudee-legende-premier-tour-monde-envers-multicoque',
    "Le marin breton a bouclé en 95 jours le premier tour de la planète en multicoque contre les vents dominants.",
    `<h2>Un défi jugé impossible</h2><p>Naviguer d'est en ouest, contre les vents dominants et le courant circumpolaire, était considéré comme quasi impossible en multicoque. Guirec Soudée a affronté des tempêtes terrifiantes dans les mers du Sud.</p><p>À 33 ans, le Breton cumule les exploits : traversée de l'Arctique avec sa poule Monique, Vendée Globe, et maintenant ce record historique.</p>`,
    'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=1200&h=630&fit=crop',
    'Voilier en haute mer (illustration)',
    'style', au.ec, { f: true, h: 2, rt: 6 }
  ),
  art(
    "Tiger Woods, la chute sans fin : nouvel accident de voiture et arrestation",
    'tiger-woods-chute-sans-fin-accident-voiture-arrestation',
    "Le golfeur a été impliqué dans un nouvel accident et arrêté pour conduite sous l'emprise de substances à Jupiter Island.",
    `<h2>Le crash de trop ?</h2><p>Tiger Woods a été arrêté à Jupiter Island, Floride, après un nouvel accident de voiture. Sa voiture s'est retournée dans des circonstances rappelant ses précédents incidents.</p><p>Plusieurs figures du golf appellent à respecter sa vie privée, tandis que d'autres estiment qu'il est temps d'accepter une retraite définitive.</p>`,
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=630&fit=crop',
    'Parcours de golf (illustration)',
    'style', au.cd, { h: 16 }
  ),
];

// Insert articles via PostgREST
console.log(`\nInserting ${articles.length} articles...`);

// Batch in groups of 10
for (let i = 0; i < articles.length; i += 10) {
  const batch = articles.slice(i, i + 10);
  const res = await fetch(`${URL}/rest/v1/articles`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(batch),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Batch ${Math.floor(i / 10) + 1} failed:`, res.status, err);
    process.exit(1);
  }
  console.log(`  Batch ${Math.floor(i / 10) + 1}: ${batch.length} articles inserted`);
}

console.log(`\nDone! ${articles.length} articles inserted successfully.`);
