import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { getAllAuthors } from "@/lib/queries";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { getDictionary, type Locale } from "@/i18n";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.about.title} — ${SITE_NAME}`,
    description: locale === "en"
      ? `Discover ${SITE_NAME}, your independent news outlet. Our mission, our values and our team.`
      : `Découvrez ${SITE_NAME}, votre média d'information indépendant. Notre mission, nos valeurs et notre équipe.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/a-propos`,
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const authors = await getAllAuthors();

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    description: `${SITE_NAME} est un média d'information en ligne indépendant. L'information sans filtre.`,
    foundingDate: "2025",
    founder: { "@type": "Person", name: "Brian Biendou", url: `${SITE_URL}/${locale}/auteur/brian-biendou` },
    email: "redaction@nomask.fr",
    sameAs: [],
    publishingPrinciples: `${SITE_URL}/${locale}/a-propos`,
    correctionsPolicy: `${SITE_URL}/${locale}/a-propos`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <div className="max-w-255 mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: dict.about.title.replace(`${SITE_NAME}`, "").replace("About ", "").replace("À propos de ", "") || (locale === "en" ? "About" : "À propos") }]} locale={locale} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black font-sans mb-6">{dict.about.title}</h1>

            <div className="text-base leading-relaxed text-gray-800 space-y-4">
              <p>
                <strong>{SITE_NAME}</strong> {locale === "en"
                  ? "is an independent online news media, founded with one conviction: news must be accessible, honest and unfiltered. In a media landscape where editorial lines are often dictated by economic or political interests, we have chosen another path."
                  : "est un média d\u0027information en ligne indépendant, fondé avec une conviction : l\u0027information doit être accessible, honnête et sans filtre. Dans un paysage médiatique où les lignes éditoriales sont souvent dictées par des intérêts économiques ou politiques, nous avons choisi un autre chemin."}
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">{dict.about.mission}</h2>
              <p>{dict.about.missionText}</p>

              <h2 className="text-xl font-bold font-sans mt-8">{locale === "en" ? "What we cover" : "Ce que nous couvrons"}</h2>
              <p>{locale === "en" ? "Our editorial team covers news through nine major topics:" : "Notre rédaction couvre l\u0027actualité à travers neuf grandes rubriques :"}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>{locale === "en" ? "International" : "International"}</strong> — {locale === "en" ? "Geopolitics, conflicts, diplomacy" : "Géopolitique, conflits, diplomatie"}</li>
                <li><strong>{locale === "en" ? "Politics" : "Politique"}</strong> — {locale === "en" ? "French and European political life" : "Vie politique française et européenne"}</li>
                <li><strong>{locale === "en" ? "Society" : "Société"}</strong> — {locale === "en" ? "Education, health, social issues" : "Éducation, santé, faits de société"}</li>
                <li><strong>{locale === "en" ? "Economy" : "Économie"}</strong> — {locale === "en" ? "Finance, business, jobs, markets" : "Finance, entreprises, emploi, marchés"}</li>
                <li><strong>{locale === "en" ? "Tech & AI" : "Tech & IA"}</strong> — {locale === "en" ? "Innovation, digital, cybersecurity, buying guides" : "Innovation, numérique, cybersécurité, guides d\u0027achat"}</li>
                <li><strong>{locale === "en" ? "Culture" : "Culture"}</strong> — {locale === "en" ? "Cinema, music, literature, media" : "Cinéma, musique, littérature, médias"}</li>
                <li><strong>{locale === "en" ? "Science" : "Science"}</strong> — {locale === "en" ? "Research, space, climate, environment" : "Recherche, espace, climat, environnement"}</li>
                <li><strong>{locale === "en" ? "Sport" : "Sport"}</strong> — {locale === "en" ? "Football, basketball, tennis, Olympics" : "Football, basketball, tennis, Jeux Olympiques"}</li>
                <li><strong>{locale === "en" ? "Style" : "Style"}</strong> — {locale === "en" ? "Fashion, lifestyle, trends, design" : "Mode, lifestyle, tendances, design"}</li>
              </ul>

              <h2 className="text-xl font-bold font-sans mt-8">{locale === "en" ? "Our values" : "Nos valeurs"}</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{locale === "en" ? "Editorial independence" : "Indépendance éditoriale"}</strong> — {locale === "en"
                    ? "No shareholders, no media group, no external influence dictates our line. Our articles are written freely by our team."
                    : "Aucun actionnaire, aucun groupe de presse, aucune influence extérieure ne dicte notre ligne. Nos articles sont rédigés librement par notre équipe."}
                </li>
                <li>
                  <strong>{locale === "en" ? "Journalistic rigor" : "Rigueur journalistique"}</strong> — {locale === "en"
                    ? "Every piece of information is cross-checked with at least two sources. We systematically cite our references and publicly correct our errors."
                    : "Chaque information est recoupée avec au minimum deux sources. Nous citons systématiquement nos références et corrigeons nos erreurs publiquement."}
                </li>
                <li>
                  <strong>{locale === "en" ? "Transparency" : "Transparence"}</strong> — {locale === "en"
                    ? "We explain our editorial choices and are open to reader feedback. Our errors are corrected and flagged."
                    : "Nous expliquons nos choix éditoriaux et sommes ouverts aux retours de nos lecteurs. Nos erreurs sont corrigées et signalées."}
                </li>
                <li>
                  <strong>{locale === "en" ? "Accessibility" : "Accessibilité"}</strong> — {locale === "en"
                    ? "Quality information should not be a privilege. Our articles are free and accessible to all."
                    : "L\u0027information de qualité ne devrait pas être un privilège. Nos articles sont gratuits et accessibles à tous."}
                </li>
              </ul>

              <h2 className="text-xl font-bold font-sans mt-8">{locale === "en" ? "Our team" : "Notre équipe"}</h2>
              <p>
                {locale === "en"
                  ? `${SITE_NAME} is driven by a team of passionate journalists, specialized in their respective fields. From international affairs to tech and sports, each editor brings sharp expertise and a critical eye on the news.`
                  : `${SITE_NAME} est porté par une équipe de journalistes passionnés, spécialisés dans leurs domaines respectifs. De l\u0027international à la tech en passant par le sport, chaque rédacteur apporte une expertise pointue et un regard critique sur l\u0027actualité.`}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {authors.map((author) => (
                  <Link
                    key={author.id}
                    href={`/${locale}/auteur/${author.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {author.avatar_url && (
                      <Image src={author.avatar_url} alt={author.name} width={48} height={48} className="rounded-full shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold font-sans group-hover:text-red-600 transition-colors">{author.name}</p>
                      <p className="text-xs text-gray-500">{author.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-4">
                <Link href={`/${locale}/auteurs`} className="text-red-600 hover:underline font-semibold">
                  {locale === "en" ? "See the full team →" : "Voir toute l\u0027équipe →"}
                </Link>
              </p>

              <h2 className="text-xl font-bold font-sans mt-8">{locale === "en" ? "Contact us" : "Nous contacter"}</h2>
              <p>{locale === "en" ? "A question, a suggestion, a correction? We are listening." : "Une question, une suggestion, une correction ? Nous sommes à votre écoute."}</p>
              <ul className="list-none space-y-1">
                <li>{locale === "en" ? "Editors" : "Rédaction"} : <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline">redaction@nomask.fr</a></li>
                <li>{locale === "en" ? "General contact" : "Contact général"} : <a href="mailto:contact@nomask.fr" className="text-brand hover:underline">contact@nomask.fr</a></li>
                <li>{locale === "en" ? "Partnerships" : "Partenariats"} : <a href="mailto:partenariats@nomask.fr" className="text-brand hover:underline">partenariats@nomask.fr</a></li>
              </ul>
            </div>
          </div>

          <DynamicSidebar locale={locale} />
        </div>
      </div>
    </>
  );
}
