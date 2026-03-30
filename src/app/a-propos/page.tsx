import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: `À propos — ${SITE_NAME}`,
  description: `Découvrez ${SITE_NAME}, votre média d'information indépendant. Notre mission, nos valeurs et notre équipe.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "À propos" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">À propos de NoMask</h1>

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
  );
}
