import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Politique de cookies — ${SITE_NAME}`,
  description: `Politique d'utilisation des cookies sur ${SITE_NAME}. Découvrez quels cookies nous utilisons et comment les gérer.`,
};

export default function PolitiqueCookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Politique de cookies" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">
        Politique de cookies
      </h1>

      <div className="text-base leading-relaxed text-gray-800 space-y-4">
        <p className="text-sm text-gray-500 italic">
          Dernière mise à jour : 31 mars 2026
        </p>

        <p>
          Lors de votre navigation sur <strong>{SITE_NAME}</strong>, des cookies et autres traceurs
          peuvent être déposés sur votre terminal. Cette page vous explique ce que sont les cookies,
          ceux que nous utilisons et comment les gérer.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre navigateur lors de la visite
          d&apos;un site web. Il permet au site de mémoriser des informations sur votre visite
          (langue préférée, paramètres d&apos;affichage, etc.) pour faciliter votre navigation
          ultérieure.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">2. Cookies strictement nécessaires</h2>
        <p>
          Ces cookies sont indispensables au fonctionnement du Site. Ils ne peuvent pas être
          désactivés. Ils incluent notamment :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cookies de session pour maintenir votre connexion</li>
          <li>Cookies de sécurité (protection CSRF)</li>
          <li>Cookie de mémorisation de votre choix en matière de consentement aux cookies</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">3. Cookies analytiques</h2>
        <p>
          Avec votre consentement, nous utilisons des cookies analytiques pour mesurer
          l&apos;audience de notre Site et comprendre comment il est utilisé. Ces données
          nous aident à améliorer nos contenus et notre ergonomie.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Pages les plus consultées</li>
          <li>Durée moyenne des visites</li>
          <li>Taux de rebond</li>
          <li>Provenance géographique (anonymisée)</li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">4. Cookies publicitaires</h2>
        <p>
          Si des espaces publicitaires sont affichés sur le Site, des cookies peuvent être
          déposés par nos partenaires publicitaires pour personnaliser les annonces en fonction
          de vos centres d&apos;intérêt. Ces cookies ne sont déposés qu&apos;avec votre
          consentement préalable.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">5. Cookies de réseaux sociaux</h2>
        <p>
          Les boutons de partage vers les réseaux sociaux (X, Facebook, etc.) peuvent déposer
          des cookies tiers. Nous vous invitons à consulter les politiques de confidentialité
          de ces réseaux pour en savoir plus.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">6. Gérer vos préférences</h2>
        <p>
          Vous pouvez à tout moment modifier vos préférences en matière de cookies :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Via le bandeau de consentement</strong> — Affiché lors de votre première
            visite, il vous permet d&apos;accepter ou de refuser les cookies non essentiels.
          </li>
          <li>
            <strong>Via les paramètres de votre navigateur</strong> — Chaque navigateur
            propose des options pour bloquer ou supprimer les cookies.
          </li>
        </ul>
        <p>Voici les liens vers les pages de gestion des cookies des principaux navigateurs :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <a href="https://support.google.com/chrome/answer/95647" className="text-brand hover:underline" rel="noopener noreferrer" target="_blank">Google Chrome</a>
          </li>
          <li>
            <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" className="text-brand hover:underline" rel="noopener noreferrer" target="_blank">Mozilla Firefox</a>
          </li>
          <li>
            <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-brand hover:underline" rel="noopener noreferrer" target="_blank">Safari</a>
          </li>
          <li>
            <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-brand hover:underline" rel="noopener noreferrer" target="_blank">Microsoft Edge</a>
          </li>
        </ul>

        <h2 className="text-xl font-bold font-sans mt-8">7. Durée de conservation</h2>
        <p>
          Les cookies ont une durée de vie maximale de 13 mois à compter de leur dépôt
          sur votre terminal, conformément aux recommandations de la CNIL. Votre consentement
          est valable pour une durée de 6 mois.
        </p>

        <h2 className="text-xl font-bold font-sans mt-8">8. Contact</h2>
        <p>
          Pour toute question relative à notre politique de cookies, contactez notre DPO :{" "}
          <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a>.
        </p>
      </div>
    </div>
  );
}
