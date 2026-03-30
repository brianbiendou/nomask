-- =============================================
-- 010 - Seed : Articles (5+ par catégorie = 45+)
-- NoMask - Site d'actualité
-- Sources : Le Monde, France Info, Le Figaro, L'Équipe
-- Date de référence : 29 mars 2026
-- =============================================

-- ========================
-- INTERNATIONAL (5 articles)
-- ========================
INSERT INTO articles (title, slug, excerpt, content, image_url, image_caption, category_id, author_id, locale, status, is_featured, is_breaking, read_time, published_at, seo_title, seo_description) VALUES
(
  'Guerre au Moyen-Orient : l''Iran menace de prendre pour cible le porte-avions USS Abraham Lincoln',
  'guerre-moyen-orient-iran-menace-porte-avions-uss-abraham-lincoln',
  'L''Iran intensifie ses menaces contre les forces américaines dans le Golfe, ciblant désormais directement le porte-avions USS Abraham Lincoln déployé dans la région.',
  '<p>Un mois après le début de l''offensive américaine, les tensions au Moyen-Orient atteignent un nouveau palier. L''Iran a explicitement menacé de prendre pour cible le porte-avions USS Abraham Lincoln, l''un des plus puissants navires de guerre de la marine américaine, actuellement déployé dans la région du Golfe.</p>

<h2>Une stratégie d''épuisement</h2>
<p>Selon les analystes, l''Iran maintient la pression sur les États-Unis et Israël en adoptant une « stratégie d''épuisement ». Malgré les frappes massives de missiles Tomahawk — environ 850 auraient été tirés depuis un mois selon le Washington Post — l''Iran continue de défier la puissance militaire américaine.</p>
<p>Le Pentagone envisagerait désormais des opérations sur le terrain en Iran, selon la presse américaine, bien que Donald Trump n''ait pas encore tranché sur cette option. L''arrivée du navire d''assaut amphibie Tripoli dans la zone renforce la posture des États-Unis.</p>

<h2>Les Houthis revendiquent leur première attaque contre Israël</h2>
<p>Dans ce contexte explosif, les Houthis du Yémen ont revendiqué leur première attaque directe contre le territoire israélien, ouvrant un nouveau front dans un conflit qui s''étend à toute la région. Le détroit d''Ormuz, artère vitale du commerce pétrolier mondial, reste bloqué par l''Iran, provoquant un choc énergétique mondial.</p>

<h2>La Russie dans l''ombre</h2>
<p>La Russie apporte un soutien croissant à l''Iran dans cette guerre, selon les informations de France Télévisions. Cette implication renforce les craintes d''une internationalisation du conflit bien au-delà du Moyen-Orient.</p>',
  'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=1200&h=630&fit=crop',
  'Photo d''illustration - Porte-avions en opération dans le Golfe (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'international'),
  (SELECT id FROM authors WHERE slug = 'jean-marc-valois'),
  'fr', 'published', TRUE, TRUE, 7,
  NOW() - INTERVAL '1 hour',
  'Guerre Iran-USA : l''Iran menace le porte-avions Abraham Lincoln',
  'Tensions maximales au Moyen-Orient : l''Iran menace le porte-avions USS Abraham Lincoln tandis que le Pentagone prépare des opérations terrestres.'
),
(
  'Manifestations « No Kings » : des millions d''Américains dans les rues contre Donald Trump',
  'manifestations-no-kings-millions-americains-contre-trump',
  'Plusieurs millions de manifestants ont défilé à travers les États-Unis ce week-end pour protester contre la politique de Donald Trump, dans un mouvement baptisé « No Kings ».',
  '<p>Le mouvement « No Kings » a rassemblé ce week-end plusieurs millions de personnes dans les rues des grandes villes américaines, de New York à Los Angeles en passant par Washington, Chicago et San Francisco. Cette mobilisation historique exprime un rejet massif de la politique menée par l''administration Trump.</p>

<h2>« La situation n''est pas normale »</h2>
<p>Les organisateurs qualifient cette mobilisation de « plus grande manifestation depuis les marches pour les droits civiques ». Dans les cortèges, les pancartes faisant référence à la démocratie menacée et à l''autoritarisme présidentiel étaient omniprésentes.</p>
<p>Les manifestants dénoncent notamment la gestion du conflit au Moyen-Orient, les atteintes aux libertés individuelles et la concentration croissante des pouvoirs exécutifs. Le slogan « No Kings » fait directement référence aux valeurs fondatrices de la République américaine.</p>

<h2>Une colère qui dépasse les clivages partisans</h2>
<p>Fait notable, cette mobilisation a rassemblé bien au-delà de la base démocrate traditionnelle. Des républicains modérés, des indépendants et de nombreux primo-manifestants ont rejoint les cortèges, témoignant d''une inquiétude transpartisane.</p>
<p>La Maison Blanche n''a pas commenté officiellement l''ampleur des manifestations, tandis que Donald Trump a ironisé sur les réseaux sociaux en évoquant le « détroit de Trump » — avant de se corriger et de parler du détroit d''Ormuz.</p>',
  'https://images.unsplash.com/photo-1591848478625-de43268e6fb8?w=1200&h=630&fit=crop',
  'Manifestants américains lors des rassemblements « No Kings » (illustration)',
  (SELECT id FROM categories WHERE slug = 'international'),
  (SELECT id FROM authors WHERE slug = 'sophie-durand'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '3 hours',
  'Manifestations No Kings USA : millions de personnes contre Trump',
  'Des millions d''Américains manifestent dans les rues contre Donald Trump lors du mouvement historique « No Kings ».'
),
(
  'Zelensky en Jordanie : l''Ukraine signe des accords de défense avec les pays du Golfe',
  'zelensky-jordanie-ukraine-accords-defense-pays-golfe',
  'Le président ukrainien Volodymyr Zelensky s''est rendu en Jordanie après avoir conclu des accords de défense majeurs avec l''Arabie saoudite, les Émirats et le Qatar.',
  '<p>Le président ukrainien Volodymyr Zelensky a annoncé se trouver en Jordanie pour des discussions sur la « sécurité ». Cette visite fait suite à une tournée diplomatique dans les pays du Golfe, durant laquelle l''Ukraine a conclu des accords de défense historiques avec l''Arabie saoudite, les Émirats arabes unis et le Qatar.</p>

<h2>Une coopération sur dix ans</h2>
<p>Selon le président ukrainien, ces accords prévoient « une coopération sur 10 ans » ainsi que la mise en place de chaînes de production conjointes. L''Ukraine apporte notamment son expertise en matière de drones, notamment les Shahed capturés sur le champ de bataille, aux pays du Golfe engagés dans la guerre au Moyen-Orient.</p>

<h2>Un repositionnement stratégique</h2>
<p>Alors que la guerre avec la Russie se poursuit — au moins quatre morts ont été signalés dans des frappes russes ce week-end — l''Ukraine diversifie ses alliances au-delà de l''Occident. Les accords avec les monarchies du Golfe représentent un tournant dans la politique étrangère de Kiev.</p>
<p>La Jordanie, pays-hôte de cette visite, joue un rôle pivot dans la stabilité régionale alors que le conflit au Moyen-Orient redessine les équilibres de toute la zone.</p>',
  'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=630&fit=crop',
  'Photo d''illustration - Diplomatie internationale (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'international'),
  (SELECT id FROM authors WHERE slug = 'jean-marc-valois'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '5 hours',
  'Zelensky en Jordanie : accords de défense Ukraine-pays du Golfe',
  'Volodymyr Zelensky conclut des accords de défense sur 10 ans avec l''Arabie saoudite, les EAU et le Qatar avant une visite en Jordanie.'
),
(
  'Jérusalem : la police israélienne empêche le patriarche latin de célébrer les Rameaux',
  'jerusalem-police-israelienne-empeche-patriarche-latin-rameaux',
  'Pour la première fois depuis des siècles, le patriarche latin de Jérusalem a été empêché de célébrer la messe du dimanche des Rameaux par la police israélienne.',
  '<p>Israël a fermé tous les lieux saints de la vieille ville de Jérusalem-Est, empêchant le patriarche latin de Jérusalem de célébrer la messe du dimanche des Rameaux au Saint-Sépulcre. Le patriarche ainsi que le père de l''église du Saint-Sépulcre auraient été arrêtés en chemin et contraints de rebrousser chemin, selon le Patriarcat.</p>

<h2>Un événement sans précédent</h2>
<p>Les autorités israéliennes invoquent des « raisons de sécurité » pour justifier cette fermeture, dans un contexte de guerre régionale. Cette décision est cependant inédite et provoque l''indignation de la communauté chrétienne internationale.</p>
<p>Le président Emmanuel Macron a apporté son « plein soutien » au patriarche latin de Jérusalem, qualifiant cette situation d''inacceptable.</p>

<h2>Tensions religieuses croissantes</h2>
<p>Cet incident survient alors que les catholiques de Damas, en Syrie, ont eux aussi annulé leurs processions des Rameaux face aux violences contre les chrétiens dans la ville de Souqaylabiya. La liberté de culte dans toute la région est de plus en plus menacée par le climat de guerre.</p>',
  'https://images.unsplash.com/photo-1547483238-2cbf881a5edb?w=1200&h=630&fit=crop',
  'Photo d''illustration - Vieille ville de Jérusalem (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'international'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, TRUE, 5,
  NOW() - INTERVAL '7 hours',
  'Jérusalem : patriarche latin empêché de célébrer les Rameaux',
  'La police israélienne bloque l''accès au Saint-Sépulcre et empêche le patriarche latin de célébrer les Rameaux pour la première fois depuis des siècles.'
),
(
  'Finlande : deux drones non identifiés s''écrasent sur le territoire, la zone bouclée',
  'finlande-drones-non-identifies-ecrasent-zone-bouclee',
  'Deux drones d''origine inconnue se sont écrasés en Finlande. Le Premier ministre Petteri Orpo évoque la possibilité de drones ukrainiens victimes de brouillages russes.',
  '<p>Deux drones non identifiés se sont écrasés sur le territoire finlandais, provoquant une intervention immédiate des autorités. La zone a été « bouclée » par les enquêteurs, selon les autorités locales.</p>

<h2>L''hypothèse de drones ukrainiens</h2>
<p>Le Premier ministre finlandais Petteri Orpo a avancé, dimanche, qu''il était « probable qu''il s''agissait de drones ukrainiens », potentiellement victimes de brouillages électroniques russes qui auraient dévié leur trajectoire vers le territoire finlandais.</p>
<p>L''Ukraine envoie des dizaines de drones chaque nuit vers la Russie en riposte aux bombardements quotidiens visant son territoire depuis plus de quatre ans. Ces incidents soulèvent des questions sur la sécurité de l''espace aérien des pays nordiques voisins de la Russie.</p>

<h2>Les pays baltes et nordiques en alerte</h2>
<p>La Finlande, qui partage 1 340 kilomètres de frontière avec la Russie, est particulièrement exposée à ce type d''incident. Ce nouvel épisode relance le débat sur la menace des drones et le renforcement des défenses anti-aériennes européennes.</p>',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Drone militaire (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'international'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '9 hours',
  'Finlande : drones non identifiés s''écrasent, enquête ouverte',
  'Deux drones non identifiés s''écrasent en Finlande, probablement des drones ukrainiens déviés par des brouillages russes selon le Premier ministre.'
),

-- ========================
-- POLITIQUE (5 articles)
-- ========================
(
  'Emmanuel Grégoire officiellement élu maire de Paris, succède à Anne Hidalgo',
  'emmanuel-gregoire-elu-maire-paris-succede-hidalgo',
  'L''ancien premier adjoint d''Anne Hidalgo a été proclamé maire de Paris ce dimanche, recueillant 103 voix sur 163 au Conseil de Paris.',
  '<p>Emmanuel Grégoire est officiellement devenu le nouveau maire de Paris ce dimanche 29 mars 2026. L''édile socialiste a été élu à l''issue d''un vote au Conseil de Paris, recueillant 103 voix sur les 163 possibles. Il succède à Anne Hidalgo qui dirigeait la capitale depuis 2014.</p>

<h2>Le périscolaire comme « premier combat »</h2>
<p>Dans son discours d''investiture, le nouveau maire a promis de faire du périscolaire son « premier combat » pour « protéger nos enfants ». À la question de savoir s''il romprait avec la politique de sa prédécesseure, les observateurs notent qu''Emmanuel Grégoire est « davantage dans la proximité » qu''Anne Hidalgo.</p>

<h2>Le Parc des Princes au menu</h2>
<p>Parmi les dossiers brûlants qui l''attendent, le nouveau maire a promis que la question du Parc des Princes serait « au menu du Conseil de Paris exceptionnel de mi-avril ». Le PSG attend depuis des mois une réponse sur le rachat de son stade historique.</p>

<h2>Un contexte politique tendu</h2>
<p>L''élection intervient dans un paysage municipal marqué par les résultats des municipales 2026, où LFI et le RN sont sortis renforcés selon le politologue Brice Soccol, qui analyse : « Nous sommes dans le temps des radicalités. »</p>',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop',
  'L''Hôtel de Ville de Paris (photo d''illustration Unsplash)',
  (SELECT id FROM categories WHERE slug = 'politique'),
  (SELECT id FROM authors WHERE slug = 'sophie-durand'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '2 hours',
  'Emmanuel Grégoire élu maire de Paris : ce qu''il faut savoir',
  'Emmanuel Grégoire succède officiellement à Anne Hidalgo à la mairie de Paris avec 103 voix. Périscolaire, Parc des Princes : ses priorités.'
),
(
  'Présidentielle 2027 : 90 personnalités de droite et du centre appellent à une candidature unique',
  'presidentielle-2027-90-personnalites-droite-centre-candidature-unique',
  'Une semaine après les municipales, 90 personnalités dont Maud Bregeon et Vincent Jeanbrun lancent un appel à « un sursaut d''unité » pour 2027.',
  '<p>Quelque 90 personnalités politiques de droite et du centre, dont Maud Bregeon et Vincent Jeanbrun, ont publié un appel dans La Tribune dimanche pour « un sursaut d''unité » et « une candidature unique » à l''élection présidentielle de 2027.</p>

<h2>Le spectre d''une victoire du RN</h2>
<p>Cet appel intervient dans un contexte où un nouveau sondage donne le Rassemblement national gagnant dans tous les cas de figure, sauf face à Édouard Philippe. Jordan Bardella l''emporterait dans toutes les autres configurations, et ferait même plus de 70% en cas de duel face à Jean-Luc Mélenchon.</p>

<h2>Les leçons des municipales</h2>
<p>Les résultats des municipales 2026 ont constitué un électrochoc pour la droite et le centre, avec la progression conjointe de La France Insoumise et du Rassemblement national. « Il y a une dynamique, c''est celle de la gauche de rupture », estimeManuel Bompard, coordinateur de LFI.</p>

<h2>Édouard Philippe, l''homme providentiel ?</h2>
<p>L''ancien Premier ministre reste le seul à pouvoir battre le RN selon les sondages, mais il n''a pas encore officialisé sa candidature. Le temps presse pour le camp modéré, à un an du scrutin.</p>',
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop',
  'Photo d''illustration - Assemblée nationale (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'politique'),
  (SELECT id FROM authors WHERE slug = 'sophie-durand'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '4 hours',
  'Présidentielle 2027 : appel à la candidature unique à droite',
  '90 personnalités de droite et du centre appellent à une candidature unique pour 2027 face à la menace d''une victoire du RN.'
),
(
  'Carburants : Thomas Ménagé chiffre la baisse de TVA à « 12 milliards sur l''année »',
  'carburants-thomas-menage-baisse-tva-12-milliards',
  'Le député RN estime que la baisse de la TVA sur les carburants est « la seule mesure juste » face à la flambée des prix liée au conflit au Moyen-Orient.',
  '<p>Alors que les prix des carburants continuent de flamber en raison de la fermeture du détroit d''Ormuz par l''Iran, Thomas Ménagé, député du Rassemblement national, a affirmé que « la baisse de la TVA est la seule mesure juste », chiffrant cette mesure à « 12 milliards sur l''année ».</p>

<h2>Les mesures « ciblées » du gouvernement</h2>
<p>Le gouvernement a annoncé des mesures « ciblées » pour le transport, l''agriculture et la pêche, jugées insuffisantes par l''opposition et les professionnels. La patronne des Écologistes, Marine Tondelier, réclame quant à elle « une aide ciblée selon les revenus » pour aider les particuliers.</p>

<h2>Un enjeu politique majeur</h2>
<p>Le député LR Philippe Ballard a également pris position sur le sujet, tandis que le RN affirme que l''État profite de la crise pour « s''en mettre plein les poches ». Le prix des carburants est devenu l''un des enjeux politiques les plus brûlants à un an de la présidentielle.</p>',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=630&fit=crop',
  'Photo d''illustration - Station-service (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'politique'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '6 hours',
  'Carburants : le RN chiffre la baisse de TVA à 12 milliards',
  'Thomas Ménagé (RN) estime la baisse de TVA sur les carburants à 12 milliards d''euros, le gouvernement mise sur des aides ciblées.'
),
(
  'Benoît Payan réinstallé maire de Marseille, Amine Kessaci nommé 4e adjoint',
  'benoit-payan-reinstalle-maire-marseille-amine-kessaci-adjoint',
  'Le maire de Marseille a remis l''écharpe tricolore au militant antinarcotrafic Amine Kessaci, devenu 4e adjoint de la deuxième ville de France.',
  '<p>Réélu lors des municipales 2026, Benoît Payan a été officiellement réinstallé dans ses fonctions de maire de Marseille ce samedi. La cérémonie a été marquée par la nomination d''Amine Kessaci au poste de 4e adjoint, un geste symbolique fort pour la cité phocéenne.</p>

<h2>Le symbole Kessaci</h2>
<p>Amine Kessaci, militant emblématique de la lutte contre le narcotrafic à Marseille, dont le frère Mehdi a été assassiné, incarnait la mobilisation citoyenne contre la violence. Sa nomination au sein de l''exécutif municipal envoie un message puissant. Six personnes ont d''ailleurs été mises en examen dans l''affaire du meurtre de Mehdi Kessaci.</p>

<h2>Les défis du nouveau mandat</h2>
<p>Payan devra faire face à une ville toujours en proie aux règlements de comptes liés au narcotrafic, tout en poursuivant la transformation urbaine engagée lors de son premier mandat. La sécurité reste la préoccupation numéro un des Marseillais.</p>',
  'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=1200&h=630&fit=crop',
  'Photo d''illustration - Marseille, le Vieux-Port (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'politique'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '10 hours',
  'Marseille : Payan réélu, Amine Kessaci 4e adjoint',
  'Benoît Payan réinstallé maire de Marseille avec Amine Kessaci, militant antinarcotrafic, comme 4e adjoint.'
),
(
  'Mairie de Fresnes saccagée : Jeanbrun dénonce « la France McDo » face à la délinquance',
  'mairie-fresnes-saccagee-jeanbrun-france-mcdo-delinquance',
  'Le ministre de la Ville Vincent Jeanbrun appelle la France à « changer de méthode » après le saccage de la mairie de Fresnes par des délinquants.',
  '<p>La mairie de Fresnes a été saccagée par des individus utilisant notamment des mortiers d''artifice, dans un épisode de violence qui a provoqué l''indignation. Le ministre de la Ville et du Logement, Vincent Jeanbrun, a réagi fermement : « Je n''aime pas la France McDo, "venez comme vous êtes" ».</p>

<h2>Un appel à la fermeté</h2>
<p>Le ministre appelle le pays à « changer de méthode » au risque de voir les épisodes de délinquance se multiplier. Cet incident n''est pas isolé : dans les Côtes-d''Armor, un maire élu au premier tour a démissionné après des actes de vandalisme visant son domicile et sa voiture, sur fond de tensions locales.</p>

<h2>Les maires en première ligne</h2>
<p>La vice-présidente de l''Association des Maires de France a alerté : « Ces six dernières années, jamais les maires n''ont été victimes de tant d''incivilités. » Les élections municipales 2026 ont été marquées par plusieurs incidents violents à travers le territoire.</p>',
  'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=630&fit=crop',
  'Photo d''illustration - Mairie française (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'politique'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '12 hours',
  'Mairie de Fresnes saccagée : la réaction de Jeanbrun',
  'Vincent Jeanbrun réagit au saccage de la mairie de Fresnes et appelle à changer de méthode face à la montée de la délinquance.'
),

-- ========================
-- SOCIÉTÉ (5 articles)
-- ========================
(
  'Attentat déjoué à Paris : une bombe artisanale visait le siège de la Bank of America',
  'attentat-dejoue-paris-bombe-artisanale-bank-of-america',
  'Trois suspects, dont un mineur de 17 ans, ont été interpellés après la tentative d''attentat contre le siège parisien de la Bank of America, avec une possible connexion iranienne.',
  '<p>Un attentat visant le siège parisien de la Bank of America, rue La Boétie dans le 8e arrondissement, a été déjoué dans la nuit de vendredi à samedi. Un adolescent de 17 ans a été interpellé alors qu''il tentait de mettre le feu à un engin explosif artisanal devant l''établissement bancaire américain.</p>

<h2>Trois interpellations, l''ombre de l''Iran</h2>
<p>Le Parquet national antiterroriste a annoncé deux nouvelles interpellations dimanche, portant à trois le nombre total de suspects en garde à vue. Le ministre de l''Intérieur Laurent Nunez a évoqué une « suspicion importante » de « lien » avec l''Iran, dans un contexte de guerre au Moyen-Orient.</p>
<p>Le ministre a également estimé que « cette affaire faisait penser à des actions similaires qui se sont déroulées dans d''autres pays européens » — la Belgique, les Pays-Bas et le Royaume-Uni ayant récemment subi des attaques comparables.</p>

<h2>Un contexte de menace élevée</h2>
<p>Cet attentat déjoué intervient dans un contexte de tensions maximales entre l''Iran et les États-Unis. Les intérêts américains en Europe sont désormais considérés comme des cibles potentielles par les services de renseignement, qui maintiennent le niveau d''alerte à son maximum.</p>',
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=630&fit=crop',
  'Photo d''illustration - Paris, opération de sécurité (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'societe'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', TRUE, TRUE, 6,
  NOW() - INTERVAL '1 hour',
  'Attentat déjoué Bank of America Paris : ce que l''on sait',
  'Trois suspects interpellés après la tentative d''attentat contre la Bank of America à Paris, possible lien avec l''Iran selon le ministre de l''Intérieur.'
),
(
  'Tests de féminité aux JO 2028 : Caster Semenya dénonce « un manque de respect envers les femmes »',
  'tests-feminite-jo-2028-caster-semenya-manque-respect-femmes',
  'La double championne olympique sud-africaine Caster Semenya s''élève contre les tests de féminité prévus pour les Jeux Olympiques de Los Angeles 2028.',
  '<p>La double championne olympique du 800 mètres Caster Semenya a dénoncé avec force les tests de féminité prévus pour les Jeux Olympiques de Los Angeles 2028, qualifiant cette pratique de « manque de respect envers les femmes ».</p>

<h2>Un combat de longue date</h2>
<p>L''athlète sud-africaine, qui se bat depuis des années contre les réglementations sur la testostérone imposées par World Athletics, estime que ces tests portent atteinte à la dignité des athlètes féminines. Son cas avait déjà suscité un vif débat lors des Jeux de Tokyo et de Paris.</p>

<h2>Le CIO sous pression</h2>
<p>Le Comité International Olympique fait face à des pressions contradictoires : d''un côté, les défenseurs de l''inclusion et de la dignité des athlètes ; de l''autre, ceux qui plaident pour une stricte séparation des catégories. Le débat promet de s''intensifier à mesure que les JO de Los Angeles approchent.</p>',
  'https://images.unsplash.com/photo-1461896836934-bd45ba8fcff7?w=1200&h=630&fit=crop',
  'Photo d''illustration - Athlétisme, stade olympique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'societe'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '5 hours',
  'JO 2028 : Caster Semenya contre les tests de féminité',
  'La double championne olympique Caster Semenya dénonce les tests de féminité prévus pour les JO de Los Angeles 2028.'
),
(
  'Disneyland Paris inaugure un monde « La Reine des Neiges » et renomme son parc',
  'disneyland-paris-inaugure-reine-des-neiges-disney-adventure-world',
  'Le parc Walt Disney Studios devient Disney Adventure World avec l''ouverture d''une zone entièrement dédiée à La Reine des Neiges, incluant un lac de trois hectares.',
  '<p>Disneyland Paris franchit une étape majeure de sa transformation ce dimanche avec l''inauguration d''une zone entièrement consacrée à La Reine des Neiges et le renommage du parc Walt Disney Studios en Disney Adventure World.</p>

<h2>Une extension ambitieuse</h2>
<p>La nouvelle zone comprend une avenue thématique, un lac de trois hectares et deux nouvelles attractions. Cette extension consacre le « virage créatif » du parc, qui entend conserver sa place de leader touristique en Europe face à une concurrence croissante.</p>
<p>L''investissement, l''un des plus importants de l''histoire du resort, vise à attirer de nouveaux visiteurs et à prolonger la durée moyenne des séjours dans le parc.</p>

<h2>Un enjeu économique pour l''Île-de-France</h2>
<p>Disneyland Paris reste la première destination touristique privée d''Europe. Cette extension s''inscrit dans une stratégie de long terme pour maintenir l''attractivité du parc face aux défis du secteur touristique, notamment dans un contexte de guerre au Moyen-Orient qui affecte les flux de voyageurs.</p>',
  'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=1200&h=630&fit=crop',
  'Photo d''illustration - Parc d''attractions (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'societe'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '8 hours',
  'Disneyland Paris : La Reine des Neiges et Disney Adventure World',
  'Disneyland Paris inaugure la zone La Reine des Neiges et renomme son parc en Disney Adventure World.'
),
(
  'Paris, nouvelle capitale mondiale des demandes en mariage spectaculaires',
  'paris-capitale-mondiale-demandes-mariage-spectaculaires',
  'Mises en scène devant la Tour Eiffel, calèches et musiciens : Paris s''impose comme la destination numéro un pour les demandes en mariage.',
  '<p>Paris renforce son statut de « ville de l''amour » avec un phénomène en pleine expansion : les demandes en mariage spectaculaires se multiplient dans la capitale, avec des mises en scène toujours plus élaborées.</p>

<h2>Des scénarios dignes de films hollywoodiens</h2>
<p>Devant la Tour Eiffel, sur les bords de Seine ou dans les jardins du Luxembourg, des couples du monde entier organisent des demandes en mariage avec calèches, musiciens, photographes professionnels et drones pour capturer l''instant. Une industrie spécialisée s''est développée pour répondre à cette demande croissante.</p>

<h2>Un marché en plein essor</h2>
<p>Les agences parisiennes spécialisées dans l''organisation de demandes en mariage rapportent une augmentation de 40% de leur activité en un an. Les budgets vont de quelques centaines d''euros pour une simple mise en scène à plusieurs dizaines de milliers pour les propositions les plus extravagantes.</p>
<p>La mairie de Paris voit ce phénomène d''un bon œil, estimant qu''il contribue à l''attractivité touristique de la capitale et à son image romantique dans le monde entier.</p>',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop',
  'Photo d''illustration - Tour Eiffel, Paris (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'societe'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '14 hours',
  'Paris : capitale des demandes en mariage spectaculaires',
  'Paris s''impose comme la capitale mondiale des demandes en mariage spectaculaires avec des mises en scène toujours plus élaborées.'
),
(
  'Passage à l''heure d''été : le changement d''heure est-il encore utile ?',
  'passage-heure-ete-changement-heure-encore-utile',
  'Instauré après le premier choc pétrolier, le passage à l''heure d''été suscite chaque année le même débat sur son utilité réelle.',
  '<p>Les Français ont avancé leurs montres d''une heure dans la nuit de samedi à dimanche, perdant une heure de sommeil au passage. Ce rituel biannuel, instauré en 1976 après le premier choc pétrolier, continue de diviser les experts et la population.</p>

<h2>Un dispositif contesté</h2>
<p>Les études récentes montrent que les économies d''énergie réalisées grâce au changement d''heure sont désormais marginales, représentant moins de 0,5% de la consommation électrique nationale. En revanche, les effets sur la santé — troubles du sommeil, fatigue, risques cardiovasculaires accrus — sont de mieux en mieux documentés.</p>

<h2>L''Europe toujours divisée</h2>
<p>Le Parlement européen avait voté en 2019 pour la suppression du changement d''heure, mais la décision n''a jamais été appliquée faute d''accord entre les États membres sur le choix entre heure d''été permanente et heure d''hiver permanente. En 2026, le débat reste ouvert.</p>',
  'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200&h=630&fit=crop',
  'Photo d''illustration - Horloge, changement d''heure (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'societe'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '18 hours',
  'Heure d''été 2026 : le changement d''heure est-il encore utile ?',
  'Le passage à l''heure d''été relance le débat sur l''utilité du changement d''heure instauré après le premier choc pétrolier.'
),

-- ========================
-- ÉCONOMIE (5 articles)
-- ========================
(
  'Hausse des carburants : les routiers bloquent l''A7, les mesures du gouvernement jugées insuffisantes',
  'hausse-carburants-routiers-bloquent-a7-mesures-insuffisantes',
  'Les transporteurs routiers se mobilisent sur l''autoroute A7 pour protester contre la flambée des prix du carburant liée au conflit au Moyen-Orient.',
  '<p>Des chauffeurs routiers ont provoqué de « forts ralentissements » sur l''autoroute A7 ce week-end, protestant contre la hausse vertigineuse des prix du carburant. Sur le bord de la route, les témoignages se multiplient : « Si ça continue, dans cinq ou six mois, j''arrête », confie un routier.</p>

<h2>Des mesures gouvernementales jugées insuffisantes</h2>
<p>Le gouvernement a annoncé des mesures « ciblées » pour le transport, l''agriculture et la pêche, mais les professionnels les jugent largement insuffisantes. « C''est un début, mais ce n''est pas assez », résume un porte-parole des transporteurs.</p>
<p>La hausse des prix à la pompe est directement liée à la fermeture du détroit d''Ormuz par l''Iran, qui a provoqué une flambée mondiale du cours du pétrole. Le prix du litre de gazole dépasse désormais les 2,20 euros sur une large partie du territoire.</p>

<h2>Vols de carburant en hausse</h2>
<p>Signe de la gravité de la situation, les gendarmes ont lancé une alerte sur la recrudescence des vols de carburant à travers le pays. Les exploitants agricoles et les entreprises de transport sont les principales victimes de ce phénomène en forte augmentation.</p>',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=630&fit=crop',
  'Photo d''illustration - Poids lourds sur autoroute (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'economie'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '3 hours',
  'Carburants : les routiers bloquent l''A7, le gouvernement sous pression',
  'Les routiers manifestent sur l''A7 contre la hausse des carburants liée au conflit au Moyen-Orient, les mesures gouvernementales jugées insuffisantes.'
),
(
  'Détroit d''Ormuz bloqué : l''Inde manque de gaz, le choc énergétique s''étend',
  'detroit-ormuz-bloque-inde-manque-gaz-choc-energetique',
  'La fermeture du détroit d''Ormuz par l''Iran provoque des pénuries de gaz en Inde et menace l''approvisionnement énergétique mondial.',
  '<p>La fermeture du détroit d''Ormuz par l''Iran dans le cadre du conflit au Moyen-Orient a des répercussions dramatiques bien au-delà de la région. L''Inde, troisième consommateur mondial d''énergie, fait face à un manque de gaz critique qui menace son économie.</p>

<h2>Un goulet d''étranglement mondial</h2>
<p>Le détroit d''Ormuz est l''artère par laquelle transite environ 20% de la consommation mondiale de pétrole. Son blocage provoque une onde de choc sur les marchés énergétiques mondiaux, avec un baril de Brent qui a dépassé les 130 dollars.</p>
<p>L''usine d''Aluminium Bahrain (Alba), l''une des plus grandes fonderies d''aluminium du monde, a annoncé une réduction de 19% de ses capacités de production en raison des « perturbations de l''approvisionnement et du transit ».</p>

<h2>L''Europe pas épargnée</h2>
<p>En Europe, la hausse des prix de l''énergie ravive le spectre de l''inflation. Les gouvernements européens multiplient les mesures de soutien aux ménages et aux entreprises, tandis que la BCE surveille de près l''évolution de la situation.</p>',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Raffinerie pétrolière (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'economie'),
  (SELECT id FROM authors WHERE slug = 'jean-marc-valois'),
  'fr', 'published', TRUE, TRUE, 5,
  NOW() - INTERVAL '6 hours',
  'Détroit d''Ormuz : choc énergétique mondial, l''Inde en première ligne',
  'Le blocage du détroit d''Ormuz par l''Iran provoque une crise énergétique mondiale : l''Inde manque de gaz, les prix du pétrole flambent.'
),
(
  'Voitures électriques : l''aide pour les bornes de recharge en copropriété bondit de 56%',
  'voitures-electriques-aide-bornes-recharge-copropriete-hausse-56-pourcent',
  'À partir du 1er avril, le plafond de la prime pour l''installation de bornes de recharge passera de 8 000 à 12 500 euros par immeuble.',
  '<p>Bonne nouvelle pour les copropriétaires : à partir du 1er avril 2026, la prime destinée à financer l''installation de bornes de recharge pour véhicules électriques dans les parkings d''immeubles verra son plafond augmenter de 56%, passant de 8 000 à 12 500 euros pour les parkings de 100 places maximum.</p>

<h2>Accélérer la transition</h2>
<p>Cette hausse significative vise à lever l''un des principaux freins à l''adoption des véhicules électriques : la difficulté de recharger à domicile pour les résidents d''immeubles collectifs. Actuellement, seuls 7% des copropriétés en France sont équipées de bornes de recharge.</p>

<h2>Un contexte paradoxal</h2>
<p>Cette mesure intervient dans un contexte paradoxal où la crise énergétique liée au conflit au Moyen-Orient renchérit le coût des carburants fossiles, rendant les véhicules électriques plus attractifs, mais où le prix de l''électricité est lui aussi sous pression à la hausse.</p>',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=630&fit=crop',
  'Photo d''illustration - Borne de recharge électrique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'economie'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '10 hours',
  'Bornes de recharge : la prime bondit de 56% pour les copropriétés',
  'L''aide pour les bornes de recharge en copropriété passe de 8 000 à 12 500 euros à partir du 1er avril 2026.'
),
(
  'Tourisme : Chypre et la Grèce durement touchés par la guerre au Moyen-Orient',
  'tourisme-chypre-grece-touches-guerre-moyen-orient',
  'Rues vides et hôtels désertés : le conflit au Moyen-Orient grève le démarrage de la saison touristique à Chypre et en Grèce.',
  '<p>Le conflit au Moyen-Orient a des conséquences économiques bien au-delà de la zone de guerre. À Chypre et en Grèce, le secteur touristique subit de plein fouet les effets du conflit : rues vides, hôtels désertés, le démarrage de la saison 2026 est catastrophique.</p>

<h2>Des annulations massives</h2>
<p>De nombreux voyageurs annulent leurs séjours dans ces deux pays, considérés comme trop proches de la zone de conflit. Les compagnies aériennes ont réduit leurs fréquences vers Larnaca et Athènes, tandis que les croisiéristes modifient leurs itinéraires pour éviter la Méditerranée orientale.</p>

<h2>L''Espagne en profite</h2>
<p>En revanche, le secteur du tourisme en Espagne s''attend à bénéficier largement de ce contexte. Les réservations pour les Baléares, les Canaries et la côte espagnole sont en forte hausse, les voyageurs se tournant vers des destinations méditerranéennes perçues comme plus sûres.</p>',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop',
  'Photo d''illustration - Côtes grecques désertes (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'economie'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '14 hours',
  'Tourisme : Chypre et Grèce en crise à cause de la guerre au Moyen-Orient',
  'Le tourisme à Chypre et en Grèce s''effondre à cause du conflit au Moyen-Orient, l''Espagne en profite.'
),
(
  'Le gouvernement met en vente 60 Millions de consommateurs',
  'gouvernement-vente-60-millions-consommateurs',
  'La dissolution de l''Institut national de la consommation a été officialisée, le gouvernement cherche un repreneur pour le célèbre magazine.',
  '<p>Le gouvernement a officialisé la dissolution de l''Institut national de la consommation (INC) et lancé la recherche d''un repreneur pour le magazine 60 Millions de consommateurs, une institution de la presse française depuis 1970.</p>

<h2>Une liquidation controversée</h2>
<p>La liquidation de l''INC met fin à plus d''un demi-siècle de service public au bénéfice des consommateurs français. Le magazine, qui compte encore plus de 400 000 abonnés, est considéré comme une référence indépendante en matière de tests de produits et de défense des droits des consommateurs.</p>

<h2>Quel avenir pour la publication ?</h2>
<p>Plusieurs groupes de presse auraient manifesté leur intérêt pour reprendre le titre. La question centrale est de savoir si le magazine pourra conserver son indépendance éditoriale et sa mission de service public une fois passé dans des mains privées. Les associations de consommateurs s''inquiètent d''une perte de crédibilité.</p>',
  'https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=1200&h=630&fit=crop',
  'Photo d''illustration - Presse magazine (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'economie'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '16 hours',
  '60 Millions de consommateurs mis en vente par le gouvernement',
  'Le gouvernement cherche un repreneur pour 60 Millions de consommateurs après la dissolution de l''Institut national de la consommation.'
),

-- ========================
-- TECH (5 articles)
-- ========================
(
  '« On ne sait plus quelle photo croire » : l''IA envahit les annonces immobilières',
  'ia-envahit-annonces-immobilieres-photos-generees',
  'De plus en plus d''agences immobilières utilisent l''intelligence artificielle pour embellir ou générer intégralement les photos de leurs annonces.',
  '<p>Le phénomène prend de l''ampleur dans le secteur immobilier : des annonces présentent désormais des photos entièrement générées ou retouchées par l''intelligence artificielle, rendant les biens méconnaissables par rapport à la réalité. « On ne sait plus quelle photo croire », résument les acheteurs déçus.</p>

<h2>Du home staging virtuel au faux intégral</h2>
<p>Si le « home staging virtuel » — la retouche numérique pour embellir un intérieur — existe depuis plusieurs années, l''arrivée de l''IA générative a franchi un cap. Certains outils permettent désormais de transformer complètement un appartement vétuste en un bien rénové de luxe, le tout en quelques secondes et pour quelques euros.</p>
<p>Les plateformes immobilières commencent à réagir. Certaines imposent un marquage obligatoire des images retouchées par IA, tandis que d''autres développent des outils de détection automatique.</p>

<h2>Un vide juridique</h2>
<p>Actuellement, aucune réglementation spécifique n''encadre l''utilisation de l''IA dans les annonces immobilières. Des associations de consommateurs demandent une obligation de transparence et la possibilité de sanctions en cas de publicité trompeuse avérée.</p>',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Appartement et écran numérique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '2 hours',
  'L''IA envahit les annonces immobilières : photos générées et faux biens',
  'L''intelligence artificielle transforme les annonces immobilières avec des photos générées, soulevant des questions de transparence.'
),
(
  'Peut-on faire confiance à l''IA pour s''informer ? Le grand débat',
  'confiance-ia-information-grand-debat',
  'Alors que de plus en plus de Français utilisent l''intelligence artificielle comme source d''information, les experts alertent sur les risques de désinformation.',
  '<p>L''intelligence artificielle s''impose progressivement comme un outil d''information pour des millions de Français. Chatbots, résumés automatiques, agrégateurs de news alimentés par l''IA : les usages se multiplient, mais la fiabilité de ces outils reste en question.</p>

<h2>Un potentiel « libérateur » mais risqué</h2>
<p>Damien Hontang, PDG de Cobl.ai, estime que « l''IA a un potentiel libérateur absolument incroyable ». Pourtant, les hallucinations — ces informations fausses générées avec aplomb par les modèles de langage — restent un problème majeur, particulièrement dans le domaine de l''actualité.</p>

<h2>Les médias traditionnels face au défi</h2>
<p>Les rédactions s''inquiètent de voir leur audience captée par des outils d''IA qui reformulent leurs articles sans toujours citer leurs sources. Le modèle économique de la presse, déjà fragile, est directement menacé par cette évolution technologique.</p>
<p>Des initiatives émergent néanmoins : certains médias développent leurs propres outils d''IA pour enrichir leur offre éditoriale, tout en maintenant la vérification humaine comme dernier rempart contre la désinformation.</p>',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
  'Photo d''illustration - Intelligence artificielle (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '6 hours',
  'IA et information : peut-on faire confiance aux chatbots ?',
  'L''IA comme source d''information : entre potentiel libérateur et risques de désinformation, le grand débat.'
),
(
  'Fake news à 150 km/h : quand l''IA piège plusieurs médias français',
  'fake-news-150-kmh-ia-piege-medias-francais',
  'Une fausse proposition de loi sur la limite de vitesse à 150 km/h a trompé plusieurs médias, révélant la vulnérabilité de la presse face à la désinformation.',
  '<p>Depuis l''automne 2025, la rumeur d''une limite de vitesse à 150 km/h sur les autoroutes françaises circule sur les réseaux sociaux. En voulant la démentir, plusieurs médias ont fabriqué une seconde fausse information : une proposition de loi inexistante qu''ils ont attribuée au sénateur Louis Vogel.</p>

<h2>L''effet cascade de la désinformation</h2>
<p>Le mécanisme est révélateur des failles du système médiatique à l''ère de l''IA : une première fausse information génère des contenus de « vérification » qui créent eux-mêmes de nouvelles fausses informations. Les outils d''IA utilisés pour la rédaction rapide d''articles ont probablement contribué à cette propagation.</p>

<h2>Un appel à la vigilance</h2>
<p>Cet épisode illustre la nécessité d''un contrôle humain renforcé dans les rédactions, même lorsque l''IA accélère le processus de production. Le sénateur Louis Vogel a dû publier un démenti officiel pour couper court aux attributions erronées.</p>',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=630&fit=crop',
  'Photo d''illustration - Autoroute française et médias (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '10 hours',
  'Fake news à 150 km/h : l''IA piège des médias français',
  'Une fausse proposition de loi sur la vitesse à 150 km/h a trompé plusieurs médias, illustrant les risques de la désinformation par IA.'
),
(
  'Drones militaires : l''Ukraine exporte son expertise vers les pays du Golfe',
  'drones-militaires-ukraine-exporte-expertise-pays-du-golfe',
  'Forte de son expérience de combat, l''Ukraine apporte son savoir-faire en matière de drones aux pays du Golfe engagés dans le conflit au Moyen-Orient.',
  '<p>L''Ukraine, qui a développé une expertise unique en matière de guerre par drones au cours de son conflit avec la Russie, exporte désormais ce savoir-faire vers les pays du Golfe. Les accords signés avec l''Arabie saoudite, les Émirats et le Qatar incluent un volet important de coopération technologique sur les drones.</p>

<h2>De Shahed capturés à l''innovation offensive</h2>
<p>Les Ukrainiens ont non seulement appris à contrer les drones iraniens Shahed utilisés par la Russie, mais ils ont aussi développé leurs propres plateformes offensives. Cette expertise, acquise dans la douleur sur le champ de bataille, est désormais une monnaie d''échange diplomatique précieuse.</p>

<h2>La menace croissante des drones</h2>
<p>À bord des frégates de la marine française déployées dans la zone, la menace des drones est prise très au sérieux. Les armées occidentales modernisent à marche forcée leurs systèmes de défense anti-drones, un marché estimé à 30 milliards de dollars d''ici 2030.</p>',
  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=630&fit=crop',
  'Photo d''illustration - Drone en vol (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM authors WHERE slug = 'jean-marc-valois'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '12 hours',
  'Drones militaires : l''Ukraine vend son expertise aux pays du Golfe',
  'L''Ukraine exporte son expertise en drones de combat vers les pays du Golfe dans le cadre de nouveaux accords de défense.'
),
(
  'La menace invisible : les frappes de drones à combustible solide de la Corée du Nord',
  'menace-invisible-drones-combustible-solide-coree-du-nord',
  'Kim Jong-un a supervisé un nouvel essai de moteur de missile à combustible solide, une technologie qui rend la détection des lancements quasiment impossible.',
  '<p>Kim Jong-un a assisté à un nouvel essai de moteur de missile à combustible solide, déclarant que les capacités de défense de la Corée du Nord étaient entrées « dans une phase importante de changement ». Cette technologie représente un bond en avant dans les capacités militaires nord-coréennes.</p>

<h2>Pourquoi le combustible solide change la donne</h2>
<p>Contrairement aux missiles à propulsion liquide, qui nécessitent un temps de préparation de plusieurs heures détectable par satellite, les missiles à combustible solide peuvent être lancés en quelques minutes. Cette capacité réduit drastiquement le temps de réaction des systèmes de défense adverses.</p>

<h2>Un contexte mondial explosif</h2>
<p>Cette avancée nord-coréenne intervient alors que le monde est focalisé sur le conflit au Moyen-Orient. Les analystes s''inquiètent d''une possible fenêtre d''opportunité pour Pyongyang pour accélérer son programme balistique pendant que l''attention internationale est détournée.</p>',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&h=630&fit=crop',
  'Photo d''illustration - Technologies militaires (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'tech'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '16 hours',
  'Corée du Nord : essai de missile à combustible solide sous la supervision de Kim',
  'Kim Jong-un supervise un nouvel essai de moteur de missile à combustible solide, marquant une avancée dans les capacités nord-coréennes.'
),

-- ========================
-- CULTURE (5 articles)
-- ========================
(
  'Série Harry Potter : insultes racistes contre l''acteur noir incarnant Severus Rogue',
  'serie-harry-potter-insultes-racistes-acteur-severus-rogue',
  'L''incarnation de Severus Rogue par un comédien noir dans la nouvelle série HBO suscite une vague de réactions racistes en ligne.',
  '<p>La nouvelle série Harry Potter produite par HBO n''a pas encore été diffusée que le choix du casting provoque déjà une tempête sur les réseaux sociaux. L''incarnation de Severus Rogue par un comédien noir a déclenché une avalanche de menaces et d''insultes racistes.</p>

<h2>Des réactions d''une violence inédite</h2>
<p>L''acteur et ses proches ont reçu des centaines de messages haineux, allant des insultes racistes aux menaces de mort. HBO a condamné « avec la plus grande fermeté » ces attaques et renforcé les dispositifs de sécurité autour du casting.</p>

<h2>Un débat récurrent dans le fandom</h2>
<p>Ce n''est pas la première fois que le casting d''adaptations de grandes franchises provoque des controverses liées à la diversité. Les films Le Seigneur des Anneaux et la série Le Petit Garçon avaient connu des épisodes similaires. Des fans défendent cependant ce choix artistique, rappelant que J.K. Rowling n''avait jamais spécifié la couleur de peau de Severus Rogue dans ses romans.</p>',
  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1200&h=630&fit=crop',
  'Photo d''illustration - Plateau de tournage (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'culture'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', TRUE, FALSE, 5,
  NOW() - INTERVAL '4 hours',
  'Série Harry Potter HBO : racisme contre l''acteur de Severus Rogue',
  'L''incarnation de Severus Rogue par un acteur noir dans la série Harry Potter HBO provoque des insultes racistes en ligne.'
),
(
  '« Yellow Letters » : İlker Çatak dissèque la dictature turque dans un film puissant',
  'yellow-letters-ilker-catak-dictature-turque-film',
  'Après « La Salle des profs », le réalisateur allemand revient avec un film inspiré par la vague de purges orchestrée par le régime d''Erdoğan.',
  '<p>İlker Çatak, le réalisateur allemand d''origine turque révélé par La Salle des profs, présente Yellow Letters, un film qui décortique les effets de la dictature sur un couple d''artistes turcs. Le long-métrage est directement inspiré par la vague de purges orchestrée par le régime d''Erdoğan entre 2016 et 2019.</p>

<h2>L''intime comme miroir du politique</h2>
<p>Le film suit un couple d''universitaires et artistes frappés par les purges post-tentative de coup d''État. À travers leur histoire personnelle, Çatak explore les mécanismes de contrôle, de surveillance et de destruction psychologique que la dictature exerce sur les individus.</p>

<h2>Un cinéma engagé</h2>
<p>Après le succès critique de La Salle des profs, nommé à l''Oscar du meilleur film international, İlker Çatak confirme son statut de cinéaste majeur du cinéma européen contemporain. Yellow Letters a été présenté en avant-première dans plusieurs festivals et sort en salles cette semaine.</p>',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=630&fit=crop',
  'Photo d''illustration - Cinéma (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'culture'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '8 hours',
  'Yellow Letters : İlker Çatak filme la dictature turque',
  'Après La Salle des profs, İlker Çatak décortique la dictature d''Erdoğan dans Yellow Letters, un film puissant sur un couple d''artistes turcs.'
),
(
  'Henri Matisse : l''œuvre foisonnante de sa « deuxième vie » exposée au Grand Palais',
  'henri-matisse-deuxieme-vie-exposition-grand-palais',
  'Le Grand Palais accueille une exposition majeure consacrée à la période tardive d''Henri Matisse, marquée par ses célèbres papiers découpés.',
  '<p>Le Grand Palais restauré accueille une exposition exceptionnelle consacrée à la « deuxième vie » d''Henri Matisse, cette période tardive et foisonnante qui a vu le maître abandonner progressivement la peinture de chevalet pour se consacrer à ses célèbres gouaches découpées.</p>

<h2>La révolution des ciseaux</h2>
<p>L''exposition retrace le parcours de Matisse à partir des années 1940, lorsque, contraint par la maladie à travailler depuis son fauteuil roulant, il invente une nouvelle technique artistique : les papiers découpés. Ce qui aurait pu être un renoncement devient une renaissance créative.</p>
<p>Des œuvres majeures comme La Tristesse du roi, L''Escargot et les panneaux de la chapelle de Vence sont présentées aux côtés de documents inédits révélant le processus créatif de l''artiste.</p>

<h2>Une résonance contemporaine</h2>
<p>L''exposition fait écho aux débats actuels sur la créativité face aux contraintes. Les commissaires établissent des parallèles avec les artistes contemporains qui, comme Matisse, transforment les limitations en opportunités créatives.</p>',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=630&fit=crop',
  'Photo d''illustration - Exposition d''art (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'culture'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '12 hours',
  'Exposition Matisse au Grand Palais : sa deuxième vie créative',
  'Le Grand Palais expose la période tardive de Matisse, des papiers découpés aux œuvres majeures de sa « deuxième vie ».'
),
(
  'Kevin Costner et Jake Gyllenhaal réunis pour le film Honeymoon with Harry',
  'kevin-costner-jake-gyllenhaal-honeymoon-with-harry',
  'Adaptée du roman éponyme de Bart Baker, la comédie dramatique réunit deux stars hollywoodiennes pour un tournage en Australie.',
  '<p>Kevin Costner et Jake Gyllenhaal seront réunis à l''écran dans Honeymoon with Harry, une comédie dramatique adaptée du roman éponyme de l''écrivain américain Bart Baker. Le tournage débutera en avril dans le Queensland, en Australie.</p>

<h2>Deux générations d''Hollywood</h2>
<p>Le film marque la rencontre entre deux figures emblématiques du cinéma américain : Kevin Costner, légende d''Hollywood dont la carrière connaît un renouveau spectaculaire depuis ses westerns Horizon, et Jake Gyllenhaal, acteur polymorphe reconnu pour ses rôles dans Prisoners, Nightcrawler et Enemy.</p>

<h2>Un film très attendu</h2>
<p>L''annonce de ce casting a immédiatement suscité l''enthousiasme des cinéphiles. Le roman de Bart Baker, best-seller aux États-Unis, mêle humour, road-trip et émotion dans une histoire intergénérationnelle qui se prête parfaitement au duo Costner-Gyllenhaal.</p>',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=630&fit=crop',
  'Photo d''illustration - Cinéma hollywoodien (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'culture'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '16 hours',
  'Honeymoon with Harry : Kevin Costner et Jake Gyllenhaal réunis',
  'Kevin Costner et Jake Gyllenhaal tournent ensemble Honeymoon with Harry, une comédie dramatique adaptée du roman de Bart Baker.'
),
(
  'Le British Museum détrôné : le Natural History Museum devient le musée le plus visité de Londres',
  'british-museum-detrone-natural-history-museum-plus-visite-londres',
  'Avec 7,1 millions de visiteurs en 2025, le Natural History Museum établit un record et détrône le British Museum comme attraction la plus populaire du Royaume-Uni.',
  '<p>Le British Museum n''est plus le musée le plus fréquenté de Londres. Avec 7,1 millions de visiteurs en 2025, le Natural History Museum a été l''attraction touristique la plus populaire du Royaume-Uni, établissant un record de fréquentation jamais atteint pour un musée britannique.</p>

<h2>Les raisons d''un succès</h2>
<p>Le Natural History Museum doit cette performance à plusieurs expositions temporaires à succès, notamment sur les dinosaures et le changement climatique, ainsi qu''à une politique de renouvellement permanent de ses collections permanentes. Sa galerie Hintze, avec son squelette de baleine bleue suspendu, est devenue une attraction iconique sur les réseaux sociaux.</p>

<h2>Le British Museum en difficulté</h2>
<p>Le British Museum, longtemps numéro un incontesté, souffre encore des retombées du scandale du vol d''objets par l''un de ses conservateurs en 2023. La polémique sur la restitution des marbres du Parthénon à la Grèce continue également d''entacher son image.</p>',
  'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=630&fit=crop',
  'Photo d''illustration - Musée d''histoire naturelle (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'culture'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '20 hours',
  'Natural History Museum : le musée le plus visité de Londres en 2025',
  'Le Natural History Museum détrône le British Museum avec 7,1 millions de visiteurs en 2025, un record pour un musée britannique.'
),

-- ========================
-- SCIENCE (5 articles)
-- ========================
(
  'Mission Artemis : un rover suisse bientôt sur la Lune',
  'mission-artemis-rover-suisse-bientot-sur-la-lune',
  'Dans le cadre du programme Artemis de la NASA, un rover développé en Suisse se prépare pour une mission d''exploration lunaire.',
  '<p>Le programme Artemis de la NASA franchit une nouvelle étape avec l''annonce de l''envoi d''un rover développé en Suisse sur la surface lunaire. Ce petit engin d''exploration, conçu par un consortium d''entreprises et d''universités helvétiques, doit collecter des données cruciales sur le sol lunaire.</p>

<h2>La technologie suisse au service de l''exploration</h2>
<p>Le rover, compact et léger, est équipé de capteurs de dernière génération capables d''analyser la composition du régolithe lunaire et de détecter la présence de glace d''eau. Cette mission s''inscrit dans la stratégie plus large de la NASA visant à établir une présence humaine durable sur la Lune.</p>

<h2>Artemis : le retour vers la Lune</h2>
<p>Le programme Artemis, qui prévoit le retour d''astronautes sur la surface lunaire, mobilise des partenaires internationaux. L''Europe, à travers l''ESA, le Japon et le Canada contribuent à cette aventure qui vise à terme la préparation de missions habitées vers Mars.</p>',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=630&fit=crop',
  'Photo d''illustration - Surface lunaire (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'science'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', TRUE, FALSE, 5,
  NOW() - INTERVAL '3 hours',
  'Mission Artemis : un rover suisse pour explorer la Lune',
  'Un rover développé en Suisse sera envoyé sur la Lune dans le cadre de la mission Artemis de la NASA.'
),
(
  'Myllokunmingia : un ancêtre à quatre yeux éclaire notre compréhension du sommeil',
  'myllokunmingia-ancetre-quatre-yeux-sommeil',
  'La découverte d''un ancien vertébré doté de quatre yeux apporte de nouvelles perspectives sur l''évolution du sommeil chez les animaux.',
  '<p>Des chercheurs ont mis en lumière les caractéristiques extraordinaires de Myllokunmingia, l''un des tout premiers vertébrés connus, qui possédait quatre yeux. Cette découverte apporte un éclairage nouveau sur l''évolution du sommeil chez les animaux, y compris l''être humain.</p>

<h2>Quatre yeux contre les prédateurs</h2>
<p>Cet animal vieux de plus de 500 millions d''années disposait de deux yeux latéraux classiques et de deux yeux supplémentaires situés sur le dessus du crâne. Ces « yeux pariétaux » servaient principalement de sentinelles contre les prédateurs venant du dessus, permettant à l''animal de détecter les changements de luminosité même en état de repos.</p>

<h2>L''origine du sommeil</h2>
<p>Les chercheurs établissent un lien entre ces yeux supplémentaires et l''organe pinéal (épiphyse) que possèdent encore aujourd''hui les vertébrés, y compris les humains. Cet organe, qui régule la production de mélatonine et les cycles veille-sommeil, serait le vestige de ces yeux primitifs. Cette découverte éclaire l''origine évolutive du sommeil.</p>',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
  'Photo d''illustration - Recherche scientifique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'science'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '7 hours',
  'Myllokunmingia : un vertébré à 4 yeux éclaire l''évolution du sommeil',
  'Un ancien vertébré à quatre yeux, Myllokunmingia, apporte de nouvelles perspectives sur l''évolution du sommeil.'
),
(
  'Piton de la Fournaise : l''éruption reprend à La Réunion avec des coulées de lave spectaculaires',
  'piton-fournaise-eruption-reprend-reunion-coulees-lave',
  'Le volcan réunionnais est reparti en éruption ce dimanche, avec de la lave à nouveau visible dans les Grandes Pentes.',
  '<p>Le Piton de la Fournaise, l''un des volcans les plus actifs du monde, a repris son éruption ce dimanche à La Réunion. De la lave est à nouveau visible dans les Grandes Pentes, offrant un spectacle naturel impressionnant mais surveillé de près par l''Observatoire volcanologique.</p>

<h2>Un volcan hyperactif</h2>
<p>Le Piton de la Fournaise connaît en moyenne une à deux éruptions par an. Cette nouvelle phase éruptive survient après une période d''accalmie de quelques semaines. Les volcanologues de l''OVPF (Observatoire Volcanologique du Piton de la Fournaise) monitrent en continu l''activité sismique et les déformations du sol.</p>

<h2>Pas de danger pour la population</h2>
<p>Les coulées de lave s''écoulent dans une zone inhabitée du volcan, dans l''Enclos Fouqué. L''accès au volcan reste cependant interdit au public. Le trafic aérien n''est pas perturbé pour le moment, le panache de gaz restant à basse altitude.</p>',
  'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&h=630&fit=crop',
  'Photo d''illustration - Éruption volcanique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'science'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '10 hours',
  'Piton de la Fournaise : nouvelle éruption à La Réunion',
  'Le Piton de la Fournaise reprend son éruption à La Réunion avec des coulées de lave spectaculaires dans les Grandes Pentes.'
),
(
  'Allemagne : une baleine échouée en mer Baltique parvient à regagner le large',
  'allemagne-baleine-echouee-baltique-regagne-large',
  'Après plusieurs jours d''échouage sur la côte allemande, une baleine a finalement réussi à regagner la mer Baltique grâce à l''intervention des sauveteurs.',
  '<p>Bonne nouvelle sur les côtes allemandes : une baleine échouée depuis plusieurs jours sur la côte de la mer Baltique a finalement réussi à regagner le large. L''opération de sauvetage, qui a mobilisé des dizaines de volontaires et de spécialistes, a connu une issue heureuse.</p>

<h2>Un sauvetage complexe</h2>
<p>L''animal, un cétacé de plusieurs tonnes, s''était retrouvé piégé dans des eaux peu profondes le long de la côte. Les équipes de sauvetage ont travaillé jour et nuit pour maintenir l''animal hydraté et éviter qu''il ne se blesse sur les rochers, attendant la marée favorable pour tenter de le guider vers le large.</p>

<h2>Les échouages en augmentation</h2>
<p>Les scientifiques notent une augmentation des échouages de cétacés en mer Baltique et en mer du Nord, un phénomène qu''ils attribuent en partie au changement climatique, à la pollution sonore sous-marine et aux perturbations des courants marins. La surveillance des populations de baleines dans les eaux européennes a été renforcée.</p>',
  'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&h=630&fit=crop',
  'Photo d''illustration - Baleine en mer (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'science'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '14 hours',
  'Allemagne : baleine échouée en Baltique sauvée',
  'Une baleine échouée sur la côte allemande de la Baltique a été sauvée et a regagné le large après une opération de sauvetage.'
),
(
  'Requins positifs à la cocaïne aux Bahamas : une découverte inquiétante',
  'requins-positifs-cocaine-bahamas-decouverte-inquietante',
  'Des chercheurs ont détecté des traces de cocaïne dans le sang de requins des Bahamas, révélant l''ampleur de la pollution par les narcotiques dans les océans.',
  '<p>Des requins des Bahamas ont été testés positifs à la cocaïne, révèle une étude scientifique alarmante. Cette découverte met en lumière l''ampleur insoupçonnée de la contamination des océans par les substances narcotiques.</p>

<h2>Comment la cocaïne arrive-t-elle dans l''océan ?</h2>
<p>Les voies maritimes des Caraïbes sont l''un des principaux corridors du trafic de drogue entre l''Amérique du Sud et l''Amérique du Nord. Les trafiquants jettent régulièrement des cargaisons à la mer pour échapper aux autorités. Ces paquets, qui finissent par se dissoudre, libèrent leur contenu dans l''eau.</p>
<p>Les stations d''épuration des zones côtières constituent une autre source de contamination : les résidus de drogues consommées par la population humaine se retrouvent dans les eaux usées rejetées en mer.</p>

<h2>Des conséquences encore mal connues</h2>
<p>Les effets de cette exposition chronique sur les requins et l''ensemble de l''écosystème marin restent largement inconnus. Les scientifiques appellent à des études approfondies pour évaluer l''impact de cette pollution chimique sur la faune marine.</p>',
  'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=1200&h=630&fit=crop',
  'Photo d''illustration - Requin dans les eaux tropicales (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'science'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '18 hours',
  'Bahamas : des requins testés positifs à la cocaïne',
  'Des requins des Bahamas ont été testés positifs à la cocaïne, révélant l''ampleur de la pollution narcotique dans les océans.'
),

-- ========================
-- SPORT (5 articles)
-- ========================
(
  'F1 : Kimi Antonelli récidive au Japon et devient le plus jeune leader de l''histoire à 19 ans',
  'f1-kimi-antonelli-victoire-japon-plus-jeune-leader-19-ans',
  'Le pilote Mercedes signe une deuxième victoire consécutive à Suzuka et prend la tête du championnat du monde, battant tous les records de précocité en F1.',
  '<p>Kimi Antonelli a remporté le Grand Prix du Japon à Suzuka ce dimanche, signant une deuxième victoire consécutive après son premier succès en Chine deux semaines plus tôt. À seulement 19 ans, le pilote italien de Mercedes devient le plus jeune leader de l''histoire du championnat du monde de Formule 1.</p>

<h2>Un surdoué qui apprend à toute vitesse</h2>
<p>« La voiture de sécurité m''a facilité la vie », a reconnu Antonelli avec humilité après la course. Mais les faits parlent d''eux-mêmes : le jeune Italien, successeur de Lewis Hamilton chez Mercedes, s''est montré impérial sur le circuit de Suzuka, maîtrisant parfaitement la gestion de ses pneumatiques et les dépassements.</p>
<p>Pierre Gasly (Alpine) a signé une course remarquable, résistant brillamment aux assauts de Max Verstappen. « Gasly a tout bien fait », a salué le quadruple champion du monde néerlandais.</p>

<h2>Verstappen envisagerait de raccrocher</h2>
<p>Confronté à un début de saison très délicat avec Red Bull et à de nouvelles réglementations qu''il critique ouvertement, Max Verstappen a laissé entendre qu''il pourrait quitter la Formule 1 en fin de saison. « Est-ce que ça vaut le coup ? » aurait-il confié à son entourage, selon la presse spécialisée.</p>',
  'https://images.unsplash.com/photo-1541447270888-83e8494e98b4?w=1200&h=630&fit=crop',
  'Photo d''illustration - Circuit de Formule 1 (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'sport'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', TRUE, TRUE, 6,
  NOW() - INTERVAL '1 hour',
  'F1 GP Japon : Antonelli vainqueur, plus jeune leader de l''histoire',
  'Kimi Antonelli (Mercedes) remporte le GP du Japon à 19 ans et devient le plus jeune leader de l''histoire du championnat F1.'
),
(
  'Cyclisme : Vingegaard écrase le Tour de Catalogne, Lenny Martinez sur le podium',
  'cyclisme-vingegaard-ecrase-tour-catalogne-lenny-martinez-podium',
  'Le Danois Jonas Vingegaard remporte le Tour de Catalogne avec autorité, tandis que le Français Lenny Martinez prend une belle deuxième place au général.',
  '<p>Jonas Vingegaard a remporté le Tour de Catalogne ce dimanche avec une domination sans partage, étoffant ainsi son palmarès. Le Français Lenny Martinez obtient une remarquable deuxième place au classement général.</p>

<h2>Vingegaard en forme olympique</h2>
<p>Le Danois de la Visma-Lease a Bike a contrôlé la course de bout en bout. La dernière étape, remportée par l''Américain Brady Gilmore devant le Français Dorian Godon au sprint, n''a pas changé la donne au classement général où Vingegaard était intouchable.</p>

<h2>Lenny Martinez confirme</h2>
<p>La deuxième place du Français Lenny Martinez confirme la montée en puissance du jeune coureur, qui ambitionne de briller sur le prochain Tour de France. À 22 ans, il s''impose comme l''un des espoirs les plus prometteurs du cyclisme mondial.</p>

<h2>En marge : un incident grave</h2>
<p>Ce dimanche de cyclisme a été marqué par un incident lors du Grand Prix Gilbert-Bousquet, où plusieurs coureurs ont été blessés après l''irruption de deux voitures sur le parcours en course.</p>',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=630&fit=crop',
  'Photo d''illustration - Cyclisme professionnel (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'sport'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '3 hours',
  'Tour de Catalogne : Vingegaard triomphe, Martinez 2e',
  'Jonas Vingegaard remporte le Tour de Catalogne, le Français Lenny Martinez termine sur le podium.'
),
(
  'Patinage : Cizeron et Fournier Beaudry sacrés champions du monde à Prague',
  'patinage-cizeron-fournier-beaudry-champions-monde-prague',
  'Un mois et demi après leur médaille d''or olympique à Milan, Guillaume Cizeron et Laurence Fournier Beaudry décrochent le titre mondial en danse sur glace.',
  '<p>Guillaume Cizeron et Laurence Fournier Beaudry ont été sacrés champions du monde de danse sur glace samedi soir à Prague, un mois et demi après leur titre olympique décroché à Milan. Leur programme libre a été qualifié de « performance irréelle, d''une beauté inouïe et rare » par les observateurs.</p>

<h2>« On a réussi à être sur notre petite planète »</h2>
<p>Après leur sacre, Guillaume Cizeron a livré ses émotions : « On a réussi à être sur notre petite planète. » Le couple franco-canadien a dominé la compétition de bout en bout, battant leur propre record mondial en danse rythmique avant de livrer un libre magistral.</p>

<h2>Un destin exceptionnel</h2>
<p>Pour Cizeron, c''est la consécration d''une carrière exceptionnelle. Après ses titres olympiques et européens avec Gabriella Papadakis, puis la formation de ce nouveau couple avec la Canadienne Laurence Fournier Beaudry, le patineur lyonnais démontre qu''il est le plus grand danseur sur glace de l''histoire.</p>

<h2>Siao Him Fa hors du podium</h2>
<p>En individuel messieurs, le Français Adam Siao Him Fa n''a pas réussi à monter sur le podium des championnats du monde, tandis que l''Américain Ilia Malinin a été sacré pour la troisième fois.</p>',
  'https://images.unsplash.com/photo-1580737459378-5a9478651c0e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Patinage artistique (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'sport'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '6 hours',
  'Mondiaux de patinage : Cizeron-Fournier Beaudry champions du monde',
  'Guillaume Cizeron et Laurence Fournier Beaudry sacrés champions du monde de danse sur glace à Prague après l''or olympique.'
),
(
  'Tennis : Aryna Sabalenka réussit le « Sunshine Double » en dominant Gauff à Miami',
  'tennis-sabalenka-sunshine-double-gauff-miami',
  'La Bélarusse Aryna Sabalenka remporte le WTA 1000 de Miami après Indian Wells, devenant la cinquième joueuse à réaliser le « Sunshine Double ».',
  '<p>Aryna Sabalenka a dominé Coco Gauff en finale du WTA 1000 de Miami (6-4, 2-6, 6-3) et s''offre son premier « Sunshine Double » en enchaînant les victoires à Indian Wells et Miami. Elle devient la cinquième joueuse de l''histoire à réaliser cette performance.</p>

<h2>Sabalenka, la reine soleil</h2>
<p>La numéro un mondiale confirme sa domination sur le circuit féminin en ce début de saison 2026. Malgré la résistance de Gauff, qui a remporté le deuxième set, Sabalenka a imposé sa puissance dans le set décisif.</p>
<p>« Je vois clairement où je peux m''améliorer », a déclaré Gauff après la défaite, faisant preuve d''une maturité remarquable à seulement 22 ans.</p>

<h2>Sinner-Lehecka, une finale surprise chez les hommes</h2>
<p>Chez les hommes, Jannik Sinner, en position de réaliser le même « Sunshine Double », affrontera le Tchèque Jiri Lehecka en finale, une affiche inattendue. Le Français Arthur Fils, éliminé en demi-finale, a néanmoins impressionné par son intensité tout au long du tournoi.</p>',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=630&fit=crop',
  'Photo d''illustration - Court de tennis (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'sport'),
  (SELECT id FROM authors WHERE slug = 'karim-bensaid'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '8 hours',
  'Tennis Miami : Sabalenka domine Gauff et réussit le Sunshine Double',
  'Aryna Sabalenka remporte Miami après Indian Wells et réalise le Sunshine Double, Sinner en finale chez les hommes.'
),
(
  'NBA : les Spurs de Wembanyama écrasent Milwaukee et s''installent au sommet de l''Ouest',
  'nba-spurs-wembanyama-ecrasent-milwaukee-sommet-ouest',
  'San Antonio corrige Milwaukee 127-95 et confirme sa place dans le top 2 de la Conférence Ouest, porté par un Victor Wembanyama dominant.',
  '<p>Les San Antonio Spurs ont infligé une correction aux Milwaukee Bucks ce samedi soir (127-95), confirmant leur place dans le top 2 de la Conférence Ouest. Victor Wembanyama a une nouvelle fois brillé, signant un double-double impressionnant au rebond.</p>

<h2>Wembanyama, le patron</h2>
<p>Le Français de 21 ans continue de dominer la NBA par sa polyvalence et son impact des deux côtés du terrain. Maxime Raynaud, son compatriote évoluant à Sacramento, poursuit également sa belle dynamique avec un double-double dans la nuit.</p>

<h2>La course aux playoffs</h2>
<p>Avec cette victoire, les Spurs sont désormais quasiment assurés de terminer dans les deux premières places de la Conférence Ouest, ce qui leur garantirait l''avantage du terrain au premier tour des playoffs. Pendant ce temps, Charlotte a vu sa série de victoires prendre fin, et les Memphis Grizzlies retrouvent le chemin du succès.</p>
<p>Fait marquant de la soirée : Luka Doncic (Lakers) a été suspendu un match pour accumulation de fautes techniques, un épisode qui résume la saison tumultueuse du Slovène à Los Angeles.</p>',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=630&fit=crop',
  'Photo d''illustration - Match de basket NBA (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'sport'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '10 hours',
  'NBA : Wembanyama et les Spurs dominent Milwaukee, top 2 à l''Ouest',
  'San Antonio corrige Milwaukee 127-95 avec un Wembanyama dominant, les Spurs s''installent dans le top 2 de la Conférence Ouest.'
),

-- ========================
-- STYLE (5 articles)
-- ========================
(
  'Le pape Léon XIV à Monaco : les images marquantes d''une visite historique',
  'pape-leon-xiv-monaco-visite-historique-images',
  'Pour la première fois depuis plus d''un demi-millénaire, un souverain pontife s''est rendu en visite officielle dans la principauté monégasque.',
  '<p>Le pape Léon XIV a effectué une visite historique à Monaco ce week-end, marquant la première venue d''un souverain pontife dans la principauté depuis plus de 500 ans. Reçu avec tous les honneurs par le prince Albert II et la princesse Charlène, le pape a appelé à la « paix » et au « partage » dans son allocution.</p>

<h2>Des images d''une élégance rare</h2>
<p>La rencontre entre le souverain pontife et le couple princier a offert des images d''une grande solennité. Le pape Léon XIV, vêtu de blanc, contrastait avec le protocole monégasque dans le cadre somptueux du Palais princier. La princesse Charlène, en tenue sobre et voilée selon la tradition, a accueilli le pontife avec une révérence impeccable.</p>

<h2>Monaco, pays ouvertement catholique</h2>
<p>La principauté, dont le catholicisme est la religion d''État, a vécu cette visite comme un événement majeur. Les rues de Monaco ont été nettoyées et décorées pour l''occasion, et des milliers de fidèles se sont rassemblés sur la Place du Palais pour apercevoir le pape.</p>',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Monaco, Palais princier (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'style'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', TRUE, FALSE, 5,
  NOW() - INTERVAL '4 hours',
  'Pape Léon XIV à Monaco : visite historique chez Albert II et Charlène',
  'Le pape Léon XIV effectue une visite historique à Monaco, première venue d''un souverain pontife en 500 ans.'
),
(
  'Butter run : fabriquer du beurre en courant, la nouvelle tendance fitness venue des États-Unis',
  'butter-run-fabriquer-beurre-courant-tendance-fitness',
  'Le « butter run » enflamme les réseaux sociaux : des coureurs emportent de la crème dans un bocal et fabriquent du beurre pendant leur jogging.',
  '<p>Après la tendance du « hot girl walk » et du « 5 AM Club », voici le « butter run », la dernière tendance fitness à enflammer les réseaux sociaux. Le concept : emporter un bocal rempli de crème fraîche pendant son jogging et, grâce aux secousses de la course, fabriquer du beurre frais.</p>

<h2>Une vidéo vue des millions de fois</h2>
<p>La tendance a été lancée par la créatrice américaine Libby Claire, dont la vidéo a été vue des millions de fois sur toutes les plateformes. « Je vais fabriquer du beurre, je ne vais pas juste courir ! » s''exclame-t-elle en montrant le résultat après 30 minutes de course.</p>

<h2>Entre sérieux et dérision</h2>
<p>Si la tendance fait sourire, elle illustre un phénomène plus profond : la gamification du sport et la recherche constante de nouvelles motivations pour pratiquer une activité physique. Les diététiciens rappellent cependant que le beurre ainsi fabriqué reste du beurre, avec ses 750 calories pour 100 grammes.</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop',
  'Photo d''illustration - Jogging et tendance fitness (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'style'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '8 hours',
  'Butter run : la tendance fitness qui consiste à faire du beurre en courant',
  'Le butter run, nouvelle tendance fitness venue des USA, consiste à fabriquer du beurre pendant son jogging.'
),
(
  'Marie Kondo : « Le rangement est une source de joie, pas une corvée »',
  'marie-kondo-rangement-source-joie-pas-corvee',
  'La reine du rangement japonaise revient avec de nouveaux conseils adaptés à l''ère post-pandémique et aux petits espaces urbains.',
  '<p>Marie Kondo, la papesse japonaise du rangement, revient sur le devant de la scène avec un message réaffirmé : « Le rangement est une source de joie. » Dans une interview accordée à France Info, elle adapte sa méthode KonMari aux réalités de 2026.</p>

<h2>L''évolution de la méthode KonMari</h2>
<p>Après avoir surpris ses fans en 2023 en avouant que sa propre maison n''était plus aussi rangée depuis la naissance de son troisième enfant, Marie Kondo assume une approche plus souple. « La perfection n''est pas l''objectif. L''objectif est de s''entourer uniquement de ce qui apporte de la joie », explique-t-elle.</p>

<h2>Minimalisme et petits espaces</h2>
<p>Face à la tendance mondiale des logements de plus en plus petits, particulièrement dans les grandes métropoles, la consultante propose des solutions spécifiques : rangement vertical, rotation saisonnière des objets et désencombrement numérique. Son nouveau livre, attendu en France en mai, approfondit ces thématiques.</p>',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop',
  'Photo d''illustration - Intérieur minimaliste rangé (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'style'),
  (SELECT id FROM authors WHERE slug = 'amina-fall'),
  'fr', 'published', FALSE, FALSE, 4,
  NOW() - INTERVAL '12 hours',
  'Marie Kondo : ses nouveaux conseils rangement pour 2026',
  'Marie Kondo revient avec une méthode KonMari adaptée aux petits espaces et à l''ère post-pandémique.'
),
(
  'Guirec Soudée dans la légende : premier tour du monde à l''envers en multicoque',
  'guirec-soudee-legende-premier-tour-monde-envers-multicoque',
  'Le marin breton a bouclé en 95 jours le premier tour de la planète en multicoque contre les vents et courants dominants, un exploit historique.',
  '<p>Le navigateur breton Guirec Soudée est entré dans la légende de la voile en bouclant, en un peu moins de 95 jours, au large de l''île d''Ouessant, le premier tour de la planète en multicoque contre les vents et courants dominants. Un authentique exploit qui repousse les limites de la navigation hauturière.</p>

<h2>Un défi jugé impossible</h2>
<p>Naviguer « à l''envers » — c''est-à-dire d''est en ouest, contre les vents dominants et le courant circumpolaire — était considéré par beaucoup comme un défi quasi impossible en multicoque. Les trimarans, conçus pour la vitesse portante, ne sont pas optimisés pour remonter au vent durant des semaines.</p>
<p>Guirec Soudée, déjà célèbre pour avoir traversé l''Atlantique avec sa poule Monique, a dû affronter des tempêtes terrifiantes dans les mers du Sud et des conditions de navigation extrêmes pendant plus de trois mois.</p>

<h2>L''aventurier des temps modernes</h2>
<p>À 33 ans, le Breton cumule désormais les exploits : traversée de l''Arctique en voilier, Vendée Globe, et maintenant ce tour du monde historique. Son prochain projet ? Il ne l''a pas encore dévoilé, mais promet qu''il sera « encore plus fou ».</p>',
  'https://images.unsplash.com/photo-1534431439455-3055720f8990?w=1200&h=630&fit=crop',
  'Photo d''illustration - Voilier en haute mer (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'style'),
  (SELECT id FROM authors WHERE slug = 'lucas-berger'),
  'fr', 'published', TRUE, FALSE, 6,
  NOW() - INTERVAL '2 hours',
  'Guirec Soudée : premier tour du monde à l''envers en multicoque',
  'Le marin breton Guirec Soudée réalise le premier tour du monde à l''envers en multicoque en 95 jours.'
),
(
  'Tiger Woods, la chute sans fin : nouvel accident de voiture et arrestation',
  'tiger-woods-chute-sans-fin-accident-voiture-arrestation',
  'Le golfeur légendaire a été impliqué dans un nouvel accident de voiture à Jupiter Island et arrêté pour conduite sous l''emprise de substances.',
  '<p>Tiger Woods a une nouvelle fois fait la une de l''actualité pour de mauvaises raisons. Le golfeur légendaire a été impliqué dans un accident de voiture à Jupiter Island, en Floride, et arrêté pour conduite sous l''emprise de substances. Sa voiture s''est retournée dans des circonstances qui rappellent ses précédents incidents.</p>

<h2>Le crash de trop ?</h2>
<p>Ce nouvel épisode s''inscrit dans une longue série d''incidents qui ont jalonné la vie personnelle de Tiger Woods : accidents de la route à répétition, addiction aux médicaments, arrestations. À chaque fois, le monde du sport a espéré un rebond, mais la spirale semble sans fin.</p>

<h2>Les addictions d''une icône</h2>
<p>Tiger Woods n''a pas réussi à tourner la page de ses addictions malgré plusieurs séjours en centres de réhabilitation. La question de sa capacité à reprendre la compétition se pose désormais avec acuité, alors que le golf professionnel tente de gérer cette situation avec délicatesse.</p>
<p>Les réactions du monde sportif oscillent entre compassion et lassitude. Plusieurs figures du golf ont appelé à respecter la vie privée du champion, tandis que d''autres estiment qu''il est temps pour Woods d''accepter une retraite définitive.</p>',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=630&fit=crop',
  'Photo d''illustration - Parcours de golf (Unsplash)',
  (SELECT id FROM categories WHERE slug = 'style'),
  (SELECT id FROM authors WHERE slug = 'claire-martin'),
  'fr', 'published', FALSE, FALSE, 5,
  NOW() - INTERVAL '16 hours',
  'Tiger Woods : nouvel accident et arrestation en Floride',
  'Tiger Woods impliqué dans un nouvel accident de voiture et arrêté à Jupiter Island, la descente aux enfers continue.'
);
