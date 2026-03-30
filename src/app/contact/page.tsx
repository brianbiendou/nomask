import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Contact — ${SITE_NAME}`,
  description: `Contactez la rédaction de ${SITE_NAME}. Rédaction, partenariats, questions générales.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Contact" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">Contactez-nous</h1>

      <div className="text-base leading-relaxed text-gray-800 space-y-4">
        <p>
          Une question, une remarque, une information à nous transmettre ?
          Notre équipe est à votre écoute. Choisissez le canal le plus adapté ci-dessous.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Rédaction</h2>
        <p>
          Pour signaler une erreur, proposer un sujet d&apos;article ou nous transmettre
          une information :{" "}
          <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline">
            redaction@nomask.fr
          </a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Partenariats &amp; publicité</h2>
        <p>
          Pour toute demande de partenariat, de sponsoring ou d&apos;espace publicitaire :{" "}
          <a href="mailto:partenariats@nomask.fr" className="text-brand hover:underline">
            partenariats@nomask.fr
          </a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Données personnelles</h2>
        <p>
          Pour exercer vos droits (accès, rectification, suppression) ou contacter
          notre Délégué à la Protection des Données :{" "}
          <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">
            dpo@nomask.fr
          </a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Contact général</h2>
        <p>
          Pour toute autre question :{" "}
          <a href="mailto:contact@nomask.fr" className="text-brand hover:underline">
            contact@nomask.fr
          </a>
        </p>

        <div className="mt-10 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>NoMask Media SAS</strong><br />
            12 rue de la Presse, 75002 Paris<br />
            Directeur de la publication : Brian Biendou
          </p>
        </div>
      </div>
    </div>
  );
}
