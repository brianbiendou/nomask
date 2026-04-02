import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { getAllAuthors } from "@/lib/queries";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `À propos — ${SITE_NAME}`,
  description: `Découvrez ${SITE_NAME}, votre média d'information indépendant. Notre mission, nos valeurs et notre équipe.`,
  alternates: {
    canonical: `${SITE_URL}/a-propos`,
  },
};

export default async function AboutPage() {
  const authors = await getAllAuthors();

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    description: `${SITE_NAME} est un média d'information en ligne indépendant. L'information sans filtre.`,
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      name: "Brian Biendou",
      url: `${SITE_URL}/auteur/brian-biendou`,
    },
    email: "redaction@nomask.fr",
    sameAs: [],
    publishingPrinciples: `${SITE_URL}/a-propos`,
    correctionsPolicy: `${SITE_URL}/a-propos`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "À propos" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-2">
      <h1 className="text-3xl font-black font-sans mb-6">À propos de NoMask</h1>

      <div className="text-base leading-relaxed text-gray-800 space-y-4">
        <p>
          <strong>{SITE_NAME}</strong> est un média d&apos;information en ligne indépendant,
          fondé avec une conviction : l&apos;information doit être accessible, honnête et sans filtre.
          Dans un paysage médiatique où les lignes éditoriales sont souvent dictées par des intérêts
          économiques ou politiques, nous avons choisi un autre chemin.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Notre mission</h2>
        <p>
          Informer sans masque. C&apos;est notre promesse et notre nom. Nous croyons que chaque
          citoyen mérite une information claire, vérifiée et contextualisée pour se forger sa propre
          opinion. Pas de sensationnalisme, pas de parti pris : des faits, de l&apos;analyse et
          de la transparence.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Ce que nous couvrons</h2>
        <p>
          Notre rédaction couvre l&apos;actualité à travers neuf grandes rubriques :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>International</strong> — Géopolitique, conflits, diplomatie</li>
          <li><strong>Politique</strong> — Vie politique française et européenne</li>
          <li><strong>Société</strong> — Éducation, santé, faits de société</li>
          <li><strong>Économie</strong> — Finance, entreprises, emploi, marchés</li>
          <li><strong>Tech &amp; IA</strong> — Innovation, numérique, cybersécurité, guides d&apos;achat</li>
          <li><strong>Culture</strong> — Cinéma, musique, littérature, médias</li>
          <li><strong>Science</strong> — Recherche, espace, climat, environnement</li>
          <li><strong>Sport</strong> — Football, basketball, tennis, Jeux Olympiques</li>
          <li><strong>Style</strong> — Mode, lifestyle, tendances, design</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">Nos valeurs</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Indépendance éditoriale</strong> — Aucun actionnaire, aucun groupe de presse,
            aucune influence extérieure ne dicte notre ligne. Nos articles sont rédigés librement
            par notre équipe.
          </li>
          <li>
            <strong>Rigueur journalistique</strong> — Chaque information est recoupée avec
            au minimum deux sources. Nous citons systématiquement nos références et corrigeons
            nos erreurs publiquement.
          </li>
          <li>
            <strong>Transparence</strong> — Nous expliquons nos choix éditoriaux et sommes
            ouverts aux retours de nos lecteurs. Nos erreurs sont corrigées et signalées.
          </li>
          <li>
            <strong>Accessibilité</strong> — L&apos;information de qualité ne devrait pas être
            un privilège. Nos articles sont gratuits et accessibles à tous.
          </li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">Notre équipe</h2>
        <p>
          {SITE_NAME} est porté par une équipe de journalistes passionnés, spécialisés dans
          leurs domaines respectifs. De l&apos;international à la tech en passant par le sport,
          chaque rédacteur apporte une expertise pointue et un regard critique sur l&apos;actualité.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/auteur/${author.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {author.avatar_url && (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full shrink-0"
                />
              )}
              <div>
                <p className="text-sm font-bold font-sans group-hover:text-red-600 transition-colors">
                  {author.name}
                </p>
                <p className="text-xs text-gray-500">{author.role}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4">
          <Link href="/auteurs" className="text-red-600 hover:underline font-semibold">
            Voir toute l&apos;équipe →
          </Link>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Nous contacter</h2>
        <p>
          Une question, une suggestion, une correction ? Nous sommes à votre écoute.
        </p>
        <ul className="list-none space-y-1">
          <li>
            Rédaction :{" "}
            <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline">
              redaction@nomask.fr
            </a>
          </li>
          <li>
            Contact général :{" "}
            <a href="mailto:contact@nomask.fr" className="text-brand hover:underline">
              contact@nomask.fr
            </a>
          </li>
          <li>
            Partenariats :{" "}
            <a href="mailto:partenariats@nomask.fr" className="text-brand hover:underline">
              partenariats@nomask.fr
            </a>
          </li>
        </ul>
      </div>
      </div>

      <DynamicSidebar />
      </div>
    </div>
    </>
  );
}
