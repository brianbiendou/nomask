import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Mentions légales — ${SITE_NAME}`,
  description: `Mentions légales du site ${SITE_NAME}. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.`,
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Mentions légales" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-2">
      <h1 className="text-3xl font-black font-sans mb-6">
        Mentions légales
      </h1>

      <div className="text-base leading-relaxed text-gray-800 space-y-4">
        <p className="text-sm text-gray-500 italic">
          Dernière mise à jour : 31 mars 2026
        </p>

        <h2 className="text-xl font-bold font-sans mt-6">1. Éditeur du site</h2>
        <p>
          Le site <strong>{SITE_NAME}</strong> (ci-après « le Site ») accessible à l&apos;adresse
          nomask.fr est édité par :
        </p>
        <ul className="list-none pl-4 space-y-1 text-gray-700">
          <li><strong>Raison sociale :</strong> NoMask Media SAS</li>
          <li><strong>Siège social :</strong> 12 rue de la Presse, 75002 Paris, France</li>
          <li><strong>RCS :</strong> Paris B 123 456 789</li>
          <li><strong>SIRET :</strong> 123 456 789 00012</li>
          <li><strong>Capital social :</strong> 10 000 €</li>
          <li><strong>Directeur de la publication :</strong> Brian Biendou</li>
          <li><strong>Contact :</strong>{" "}
            <a href="mailto:contact@nomask.fr" className="text-brand hover:underline">contact@nomask.fr</a>
          </li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">2. Hébergement</h2>
        <p>Le Site est hébergé par :</p>
        <ul className="list-none pl-4 space-y-1 text-gray-700">
          <li><strong>Vercel Inc.</strong></li>
          <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
          <li>Site web : <a href="https://vercel.com" className="text-brand hover:underline" rel="noopener noreferrer" target="_blank">vercel.com</a></li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">3. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu du Site — textes, photographies, illustrations, graphismes,
          logo, marques, vidéos, bases de données, mise en page — est protégé par le Code de la
          propriété intellectuelle et par les conventions internationales relatives au droit d&apos;auteur.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie
          des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite sans
          l&apos;autorisation écrite préalable de NoMask Media SAS.
        </p>
        <p>
          Toute exploitation non autorisée du Site ou de ses contenus sera considérée comme
          constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions des
          articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">4. Responsabilité</h2>
        <p>
          L&apos;éditeur s&apos;efforce de fournir sur le Site des informations aussi précises que
          possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes
          et des carences dans la mise à jour, qu&apos;elles soient de son fait ou du fait des tiers
          partenaires qui lui fournissent ces informations.
        </p>
        <p>
          Les informations et contenus publiés sur le Site le sont à titre purement informatif et
          ne sauraient constituer un conseil juridique, financier ou professionnel.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">5. Liens hypertextes</h2>
        <p>
          Le Site peut contenir des liens hypertextes vers d&apos;autres sites web. {SITE_NAME} ne
          dispose d&apos;aucun contrôle sur le contenu de ces sites tiers et décline toute
          responsabilité quant à leur contenu.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">6. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, les
          tribunaux français seront seuls compétents.
        </p>
      </div>
      </div>

      <DynamicSidebar />
      </div>
    </div>
  );
}
