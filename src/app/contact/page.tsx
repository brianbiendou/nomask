import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez la rédaction de ${SITE_NAME}.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Contact" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">Contact</h1>

      <div className="font-serif text-lg leading-relaxed text-gray-800 space-y-4">
        <p>
          Vous souhaitez nous écrire ? Nous sommes à votre écoute.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Rédaction</h2>
        <p>
          Pour signaler une erreur, proposer un sujet ou nous transmettre une
          information :{" "}
          <a
            href="mailto:redaction@nomask.fr"
            className="text-red-600 hover:underline"
          >
            redaction@nomask.fr
          </a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Partenariats &amp; publicité</h2>
        <p>
          Pour toute demande de partenariat ou de publicité :{" "}
          <a
            href="mailto:partenariats@nomask.fr"
            className="text-red-600 hover:underline"
          >
            partenariats@nomask.fr
          </a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">Contact général</h2>
        <p>
          Pour toute autre question :{" "}
          <a
            href="mailto:contact@nomask.fr"
            className="text-red-600 hover:underline"
          >
            contact@nomask.fr
          </a>
        </p>
      </div>
    </div>
  );
}
