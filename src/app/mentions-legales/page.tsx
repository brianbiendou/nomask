import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${SITE_NAME}.`,
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Mentions légales" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">
        Mentions légales
      </h1>

      <div className="font-serif text-lg leading-relaxed text-gray-800 space-y-4">
        <h2 className="text-xl font-bold font-sans mt-6">Éditeur du site</h2>
        <p>
          Le site <strong>{SITE_NAME}</strong> (nomask.fr) est édité par :<br />
          [Nom de la société / de l&apos;éditeur]<br />
          [Adresse]<br />
          [SIRET / RNA]<br />
          Directeur de la publication : [Nom]
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc.<br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">
          Propriété intellectuelle
        </h2>
        <p>
          L&apos;ensemble du contenu du site (textes, images, vidéos, graphismes,
          logo) est protégé par le droit d&apos;auteur. Toute reproduction, même
          partielle, est interdite sans autorisation préalable.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">
          Données personnelles
        </h2>
        <p>
          Les données personnelles collectées via le formulaire de newsletter
          sont utilisées exclusivement pour l&apos;envoi de la newsletter. Vous
          pouvez exercer vos droits (accès, rectification, suppression) en
          écrivant à{" "}
          <a
            href="mailto:contact@nomask.fr"
            className="text-red-600 hover:underline"
          >
            contact@nomask.fr
          </a>
          .
        </p>
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous
          disposez d&apos;un droit d&apos;accès, de rectification et de
          suppression de vos données.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Cookies</h2>
        <p>
          Ce site utilise des cookies techniques nécessaires à son bon
          fonctionnement. Des cookies analytiques peuvent être utilisés pour
          mesurer l&apos;audience, avec votre consentement.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">
          Responsabilité
        </h2>
        <p>
          L&apos;éditeur s&apos;efforce de fournir des informations exactes et à
          jour. Cependant, il ne saurait être tenu responsable des erreurs,
          omissions ou résultats obtenus suite à l&apos;utilisation de ces
          informations.
        </p>
      </div>
    </div>
  );
}
