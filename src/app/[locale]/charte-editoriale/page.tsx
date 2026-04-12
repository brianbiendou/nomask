import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale !== "en";
  return {
    title: isFr
      ? `Charte éditoriale — ${SITE_NAME}`
      : `Editorial Charter — ${SITE_NAME}`,
    description: isFr
      ? `Découvrez la charte éditoriale de ${SITE_NAME} : nos principes, notre méthode de travail, nos sources et notre engagement envers une information de qualité.`
      : `Discover the editorial charter of ${SITE_NAME}: our principles, working method, sources and commitment to quality journalism.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/charte-editoriale`,
    },
  };
}

export default async function CharteEditorialePage({ params }: PageProps) {
  const { locale } = await params;
  const isFr = locale !== "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: isFr ? `Charte éditoriale — ${SITE_NAME}` : `Editorial Charter — ${SITE_NAME}`,
    description: isFr
      ? `Les principes éditoriaux et la méthode journalistique de ${SITE_NAME}`
      : `The editorial principles and journalistic method of ${SITE_NAME}`,
    url: `${SITE_URL}/${locale}/charte-editoriale`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-255 mx-auto px-4 py-6">
        <Breadcrumb
          items={[{ label: isFr ? "Charte éditoriale" : "Editorial Charter" }]}
          locale={locale}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black font-sans mb-6">
              {isFr ? "Charte éditoriale" : "Editorial Charter"}
            </h1>

            <div className="text-base leading-relaxed text-gray-800 space-y-6">
              <p className="text-lg text-gray-600 font-serif leading-relaxed">
                {isFr
                  ? `${SITE_NAME} est un média d'information indépendant fondé sur une conviction simple : le lecteur mérite une information claire, contextualisée et sans parti pris commercial. Cette charte définit nos engagements éditoriaux.`
                  : `${SITE_NAME} is an independent news outlet built on a simple conviction: readers deserve clear, contextualized, and commercially unbiased information. This charter defines our editorial commitments.`}
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "1. Notre ligne éditoriale" : "1. Our editorial line"}
              </h2>
              <p>
                {isFr
                  ? `${SITE_NAME} couvre l'actualité généraliste à travers neuf rubriques : Politique, International, Société, Économie, Tech & IA, Culture, Science, Sport et Style. Chaque article publié répond à trois critères : pertinence pour le lecteur, vérification des faits, et valeur informative réelle.`
                  : `${SITE_NAME} covers general news through nine sections: Politics, International, Society, Economy, Tech & AI, Culture, Science, Sport and Style. Each published article meets three criteria: relevance to the reader, fact-checking, and real informational value.`}
              </p>
              <p>
                {isFr
                  ? "Nous ne publions pas d'articles publicitaires déguisés, de contenus sponsorisés non identifiés, ni de dépêches recopiées sans valeur ajoutée. Notre équipe éditoriale analyse chaque sujet pour apporter un contexte, une mise en perspective et des points clés que le lecteur ne trouvera pas ailleurs."
                  : "We do not publish disguised advertising articles, unidentified sponsored content, or copied wire stories without added value. Our editorial team analyzes each topic to provide context, perspective and key takeaways that readers won't find elsewhere."}
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "2. Notre méthode de travail" : "2. Our working method"}
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>{isFr ? "Veille et sélection" : "Monitoring and selection"}</strong>
                  {isFr
                    ? " — Notre équipe effectue une veille quotidienne de l'actualité nationale et internationale. Seuls les sujets présentant un intérêt réel pour nos lecteurs sont sélectionnés."
                    : " — Our team conducts daily monitoring of national and international news. Only topics of genuine interest to our readers are selected."}
                </li>
                <li>
                  <strong>{isFr ? "Vérification des faits" : "Fact-checking"}</strong>
                  {isFr
                    ? " — Chaque information publiée est recoupée avec au moins deux sources indépendantes. Nous identifions et citons systématiquement nos références."
                    : " — Every piece of information published is cross-referenced with at least two independent sources. We systematically identify and cite our references."}
                </li>
                <li>
                  <strong>{isFr ? "Rédaction et enrichissement" : "Writing and enrichment"}</strong>
                  {isFr
                    ? " — Nos rédacteurs rédigent chaque article avec leurs propres mots, en l'enrichissant d'un contexte historique, d'analyses sectorielles et d'une synthèse des points essentiels à retenir."
                    : " — Our writers author each article in their own words, enriching it with historical context, sector analysis and a summary of essential takeaways."}
                </li>
                <li>
                  <strong>{isFr ? "Relecture et publication" : "Proofreading and publication"}</strong>
                  {isFr
                    ? " — Chaque article passe par une relecture avant publication pour valider la qualité rédactionnelle, l'exactitude des informations et la conformité à notre charte."
                    : " — Each article undergoes a review before publication to validate editorial quality, accuracy of information and compliance with our charter."}
                </li>
              </ul>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "3. Indépendance et transparence" : "3. Independence and transparency"}
              </h2>
              <p>
                {isFr
                  ? `${SITE_NAME} ne reçoit aucun financement de partis politiques, d'États ou de groupes industriels. Nos revenus proviennent exclusivement de la publicité programmatique (Google AdSense) et de partenariats commerciaux clairement identifiés comme tels. Aucun annonceur n'influence notre ligne éditoriale.`
                  : `${SITE_NAME} receives no funding from political parties, states or industrial groups. Our revenues come exclusively from programmatic advertising (Google AdSense) and commercial partnerships clearly identified as such. No advertiser influences our editorial line.`}
              </p>
              <p>
                {isFr
                  ? "Lorsqu'un article contient un point de vue ou une analyse éditoriale, cela est explicitement signalé. Nous distinguons clairement les faits, les analyses et les opinions."
                  : "When an article contains a point of view or editorial analysis, this is explicitly flagged. We clearly distinguish between facts, analysis and opinion."}
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "4. Corrections et mises à jour" : "4. Corrections and updates"}
              </h2>
              <p>
                {isFr
                  ? "Nous nous engageons à corriger rapidement toute erreur factuelle signalée. Les corrections sont indiquées en bas d'article avec la date de modification. Pour signaler une erreur, contactez notre rédaction à l'adresse : "
                  : "We are committed to quickly correcting any factual error reported. Corrections are noted at the bottom of the article with the modification date. To report an error, contact our editorial team at: "}
                <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline">
                  redaction@nomask.fr
                </a>
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "5. Droits et responsabilités" : "5. Rights and responsibilities"}
              </h2>
              <p>
                {isFr
                  ? `Tous les contenus publiés sur ${SITE_NAME} sont rédigés par notre équipe éditoriale et constituent des œuvres originales protégées par le droit d'auteur. Toute reproduction partielle ou totale sans autorisation écrite est interdite.`
                  : `All content published on ${SITE_NAME} is written by our editorial team and constitutes original works protected by copyright. Any partial or total reproduction without written authorization is prohibited.`}
              </p>
              <p>
                {isFr
                  ? "Notre couverture éditoriale s'appuie sur des sources d'information publiques, des communiqués officiels, des rapports institutionnels et la veille de nos journalistes. Nous ne reproduisons jamais un article d'un tiers sans transformation substantielle et apport de valeur éditoriale propre."
                  : "Our editorial coverage is based on public information sources, official press releases, institutional reports and our journalists' monitoring. We never reproduce a third-party article without substantial transformation and our own editorial value contribution."}
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">
                {isFr ? "6. Contact éditorial" : "6. Editorial contact"}
              </h2>
              <p>
                {isFr
                  ? "Pour toute question relative à notre ligne éditoriale, pour nous soumettre un sujet ou signaler un problème :"
                  : "For any question relating to our editorial line, to submit a topic or report a problem:"}
              </p>
              <ul className="list-none space-y-1">
                <li>
                  {isFr ? "Rédaction" : "Editorial"} :{" "}
                  <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline">
                    redaction@nomask.fr
                  </a>
                </li>
                <li>
                  {isFr ? "Direction de la publication" : "Publication director"} : Brian Biendou
                </li>
              </ul>

              <p className="text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
                {isFr
                  ? `Charte éditoriale de ${SITE_NAME} — Dernière mise à jour : avril 2026`
                  : `Editorial charter of ${SITE_NAME} — Last updated: April 2026`}
              </p>
            </div>
          </div>

          <DynamicSidebar locale={locale} />
        </div>
      </div>
    </>
  );
}
