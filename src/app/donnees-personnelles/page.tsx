import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Données personnelles — ${SITE_NAME}`,
  description: `Politique de protection des données personnelles de ${SITE_NAME}. Vos droits et nos engagements RGPD.`,
};

export default function DonneesPersonnellesPage() {
  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Données personnelles" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-2">
      <h1 className="text-3xl font-black font-sans mb-6">
        Politique de protection des données personnelles
      </h1>

      <div className="text-base leading-relaxed text-gray-800 space-y-4">
        <p className="text-sm text-gray-500 italic">
          Dernière mise à jour : 31 mars 2026
        </p>

        <p>
          La protection de vos données personnelles est une priorité pour <strong>{SITE_NAME}</strong>.
          Cette politique vous informe de la manière dont vos données sont collectées, utilisées et
          protégées conformément au Règlement Général sur la Protection des Données (RGPD) et à la
          loi Informatique et Libertés.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données est NoMask Media SAS, société immatriculée
          au RCS de Paris, dont le siège social est situé au 12 rue de la Presse, 75002 Paris.
        </p>
        <p>
          Contact DPO (Délégué à la Protection des Données) :{" "}
          <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a>
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">2. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Données de navigation</strong> — Adresse IP, type de navigateur, pages visitées,
            durée de visite (via cookies analytiques, avec votre consentement)
          </li>
          <li>
            <strong>Données de contact</strong> — Adresse e-mail (lors de l&apos;inscription
            à la newsletter ou de l&apos;utilisation du formulaire de contact)
          </li>
          <li>
            <strong>Données d&apos;abonnement</strong> — Nom, adresse e-mail, informations
            de paiement (pour les abonnés NoMask+, traitées par notre prestataire de paiement sécurisé)
          </li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">3. Finalités du traitement</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Vous permettre d&apos;accéder aux contenus et services du Site</li>
          <li>Envoyer notre newsletter (avec votre consentement explicite)</li>
          <li>Gérer votre abonnement NoMask+</li>
          <li>Mesurer l&apos;audience et améliorer nos services (avec votre consentement)</li>
          <li>Répondre à vos demandes de contact</li>
          <li>Respecter nos obligations légales</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">4. Base légale des traitements</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Consentement</strong> — Newsletter, cookies analytiques</li>
          <li><strong>Exécution du contrat</strong> — Gestion de l&apos;abonnement NoMask+</li>
          <li><strong>Intérêt légitime</strong> — Amélioration des services, sécurité du Site</li>
          <li><strong>Obligation légale</strong> — Conservation des données de facturation</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">5. Durée de conservation</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Données de navigation : 13 mois maximum</li>
          <li>Données de newsletter : jusqu&apos;à votre désinscription</li>
          <li>Données d&apos;abonnement : durée de l&apos;abonnement + 3 ans (obligations comptables)</li>
          <li>Données de contact : 3 ans après le dernier échange</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">6. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Droit d&apos;accès</strong> — Obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> — Corriger des données inexactes</li>
          <li><strong>Droit à l&apos;effacement</strong> — Demander la suppression de vos données</li>
          <li><strong>Droit à la portabilité</strong> — Recevoir vos données dans un format structuré</li>
          <li><strong>Droit d&apos;opposition</strong> — Vous opposer au traitement de vos données</li>
          <li><strong>Droit à la limitation</strong> — Restreindre le traitement de vos données</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{" "}
          <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a>.
          Nous nous engageons à répondre dans un délai de 30 jours.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">7. Partage des données</h2>
        <p>
          Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Notre hébergeur (Vercel) pour le fonctionnement technique du Site</li>
          <li>Notre prestataire de paiement sécurisé (pour les abonnements NoMask+)</li>
          <li>Notre outil d&apos;analyse d&apos;audience (avec votre consentement)</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">8. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
          protéger vos données : chiffrement HTTPS, accès restreint aux bases de données,
          mots de passe hashés, sauvegardes régulières.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">9. Réclamation</h2>
        <p>
          Si vous estimez que le traitement de vos données n&apos;est pas conforme, vous pouvez
          introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique
          et des Libertés) : <a href="https://www.cnil.fr" className="text-brand hover:underline"
          rel="noopener noreferrer" target="_blank">www.cnil.fr</a>.
        </p>
      </div>
      </div>

      <DynamicSidebar />
      </div>
    </div>
  );
}
