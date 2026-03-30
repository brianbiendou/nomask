import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: "À propos",
  description: `Découvrez ${SITE_NAME}, votre média d'information indépendant.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "À propos" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">À propos</h1>

      <div className="font-serif text-lg leading-relaxed text-gray-800 space-y-4">
        <p>
          <strong>{SITE_NAME}</strong> est un média d&apos;information en ligne
          indépendant, dédié à fournir une couverture approfondie et impartiale
          de l&apos;actualité en France et dans le monde.
        </p>
        <p>
          Notre rédaction couvre neuf domaines : international, politique,
          société, économie, tech &amp; IA, culture, science, sport et style de vie.
          Chaque article est rédigé avec rigueur journalistique et vérifié avant
          publication.
        </p>
        <p>
          Notre mission est simple : informer sans masque, sans parti pris, en
          privilégiant les faits et l&apos;analyse. Dans un paysage médiatique
          saturé d&apos;opinions, nous croyons que le lecteur mérite une
          information claire et documentée.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Nos valeurs</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Indépendance :</strong> Aucune influence éditoriale
            extérieure.
          </li>
          <li>
            <strong>Rigueur :</strong> Vérification des faits et sources
            multiples.
          </li>
          <li>
            <strong>Transparence :</strong> Nous citons nos sources et corrigeons
            nos erreurs.
          </li>
          <li>
            <strong>Accessibilité :</strong> Un contenu clair et gratuit pour
            tous.
          </li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">Contact</h2>
        <p>
          Une question, une suggestion, une correction ? Écrivez-nous à{" "}
          <a
            href="mailto:contact@nomask.fr"
            className="text-red-600 hover:underline"
          >
            contact@nomask.fr
          </a>
          .
        </p>
      </div>
    </div>
  );
}
