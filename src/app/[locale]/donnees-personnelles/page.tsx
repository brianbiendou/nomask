import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { getDictionary, type Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.privacy.title} — ${SITE_NAME}`,
    description: locale === "en"
      ? `Privacy policy of ${SITE_NAME}. Learn how we collect, use and protect your personal data.`
      : `Politique de confidentialité de ${SITE_NAME}. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/donnees-personnelles`,
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: dict.privacy.title }]} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-black font-sans mb-6">{dict.privacy.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {locale === "en" ? "Last updated: June 2025" : "Dernière mise à jour : Juin 2025"}
          </p>

          <div className="prose prose-gray max-w-none text-base leading-relaxed space-y-4">
            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "1. Data controller" : "1. Responsable du traitement"}
            </h2>
            <p>
              {locale === "en"
                ? `${SITE_NAME} Media SAS, publisher of the website ${SITE_URL}, is the data controller for the processing of your personal data.`
                : `${SITE_NAME} Media SAS, éditeur du site ${SITE_URL}, est responsable du traitement de vos données personnelles.`}
            </p>
            <p>{locale === "en" ? "Contact" : "Contact"} : <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a></p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "2. Data collected" : "2. Données collectées"}
            </h2>
            <p>
              {locale === "en"
                ? "We may collect the following data:"
                : "Nous sommes susceptibles de collecter les données suivantes :"}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{locale === "en" ? "Navigation data: IP address, browser, device, pages visited" : "Données de navigation : adresse IP, navigateur, appareil, pages visitées"}</li>
              <li>{locale === "en" ? "Newsletter: email address" : "Newsletter : adresse email"}</li>
              <li>{locale === "en" ? "Comments: name, email address, message content" : "Commentaires : nom, adresse email, contenu du message"}</li>
              <li>{locale === "en" ? "Contact: name, email, message" : "Contact : nom, email, message"}</li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "3. Purposes of processing" : "3. Finalités du traitement"}
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{locale === "en" ? "Operating and improving the website" : "Fonctionnement et amélioration du site"}</li>
              <li>{locale === "en" ? "Sending the newsletter (with your consent)" : "Envoi de la newsletter (avec votre consentement)"}</li>
              <li>{locale === "en" ? "Audience measurement and analytics" : "Mesure d\u0027audience et statistiques"}</li>
              <li>{locale === "en" ? "Responding to your requests" : "Répondre à vos demandes"}</li>
              <li>{locale === "en" ? "Displaying relevant ads (with your consent)" : "Affichage de publicités pertinentes (avec votre consentement)"}</li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "4. Legal basis" : "4. Base légale"}
            </h2>
            <p>
              {locale === "en"
                ? "Data processing is based on: your consent (newsletter, cookies), our legitimate interest (analytics, site security), legal obligation (data retention)."
                : "Le traitement des données repose sur : votre consentement (newsletter, cookies), notre intérêt légitime (statistiques, sécurité du site), une obligation légale (conservation des données)."}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "5. Data retention" : "5. Durée de conservation"}
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{locale === "en" ? "Navigation data: 13 months" : "Données de navigation : 13 mois"}</li>
              <li>{locale === "en" ? "Newsletter: until you unsubscribe" : "Newsletter : jusqu\u0027au désabonnement"}</li>
              <li>{locale === "en" ? "Comments: for the duration of publication of the article" : "Commentaires : durée de publication de l\u0027article"}</li>
              <li>{locale === "en" ? "Contact: 3 years from the last contact" : "Contact : 3 ans à compter du dernier contact"}</li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "6. Your rights" : "6. Vos droits"}
            </h2>
            <p>
              {locale === "en"
                ? "In accordance with the GDPR, you have the right of access, rectification, deletion, portability, restriction and objection to the processing of your data."
                : "Conformément au RGPD, vous disposez d\u0027un droit d\u0027accès, de rectification, de suppression, de portabilité, de limitation et d\u0027opposition au traitement de vos données."}
            </p>
            <p>
              {locale === "en"
                ? "To exercise your rights, contact us at:"
                : "Pour exercer vos droits, contactez-nous à :"}{" "}
              <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a>
            </p>
            <p>
              {locale === "en"
                ? "You can also lodge a complaint with the CNIL (www.cnil.fr)."
                : "Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr)."}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "7. Third-party services" : "7. Services tiers"}
            </h2>
            <p>
              {locale === "en"
                ? "We use the following third-party services:"
                : "Nous utilisons les services tiers suivants :"}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — {locale === "en" ? "Hosting and database" : "Hébergement et base de données"}</li>
              <li><strong>Vercel</strong> — {locale === "en" ? "Website hosting" : "Hébergement du site"}</li>
              <li><strong>Google AdSense</strong> — {locale === "en" ? "Advertisement" : "Publicité"}</li>
              <li><strong>Google Analytics</strong> — {locale === "en" ? "Audience measurement" : "Mesure d\u0027audience"}</li>
            </ul>
          </div>
        </div>

        <DynamicSidebar locale={locale} />
      </div>
    </div>
  );
}
