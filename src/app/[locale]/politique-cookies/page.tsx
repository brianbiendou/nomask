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
    title: `${dict.cookiePolicy.title} — ${SITE_NAME}`,
    description: locale === "en"
      ? `Cookie policy of ${SITE_NAME}. Learn about the cookies used on our website and how to manage them.`
      : `Politique des cookies de ${SITE_NAME}. Informez-vous sur les cookies utilisés sur notre site et comment les gérer.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/politique-cookies`,
    },
  };
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: dict.cookiePolicy.title }]} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-black font-sans mb-6">{dict.cookiePolicy.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {locale === "en" ? "Last updated: June 2025" : "Dernière mise à jour : Juin 2025"}
          </p>

          <div className="prose prose-gray max-w-none text-base leading-relaxed space-y-4">
            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "1. What is a cookie?" : "1. Qu\u0027est-ce qu\u0027un cookie ?"}
            </h2>
            <p>
              {locale === "en"
                ? "A cookie is a small text file stored on your device (computer, phone, tablet) when you visit a website. Cookies allow the site to remember your actions and preferences over a period of time."
                : "Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, téléphone, tablette) lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences pendant une certaine durée."}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "2. Cookies we use" : "2. Les cookies que nous utilisons"}
            </h2>

            <h3 className="text-lg font-semibold mt-4">
              {locale === "en" ? "Essential cookies" : "Cookies essentiels"}
            </h3>
            <p>
              {locale === "en"
                ? "These cookies are necessary for the website to function properly. They cannot be deactivated."
                : "Ces cookies sont nécessaires au bon fonctionnement du site. Ils ne peuvent pas être désactivés."}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>NEXT_LOCALE</strong> — {locale === "en" ? "Language preference" : "Préférence de langue"}</li>
              <li><strong>supabase-auth-token</strong> — {locale === "en" ? "Session token" : "Jeton de session"}</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">
              {locale === "en" ? "Analytics cookies" : "Cookies analytiques"}
            </h3>
            <p>
              {locale === "en"
                ? "These cookies help us understand how you use our website in order to improve it."
                : "Ces cookies nous aident à comprendre comment vous utilisez notre site afin de l\u0027améliorer."}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Google Analytics</strong> — {locale === "en" ? "Audience measurement" : "Mesure d\u0027audience"}</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">
              {locale === "en" ? "Advertising cookies" : "Cookies publicitaires"}
            </h3>
            <p>
              {locale === "en"
                ? "These cookies are used to display relevant ads and measure their effectiveness."
                : "Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer leur efficacité."}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Google AdSense</strong> — {locale === "en" ? "Ad personalization" : "Personnalisation des publicités"}</li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "3. Managing your cookies" : "3. Gérer vos cookies"}
            </h2>
            <p>
              {locale === "en"
                ? "You can manage your cookie preferences at any time via your browser settings. Here is how to do it for the most common browsers:"
                : "Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur. Voici comment faire pour les navigateurs les plus courants :"}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Chrome</strong> : {locale === "en" ? "Settings > Privacy and security > Cookies" : "Paramètres > Confidentialité et sécurité > Cookies"}</li>
              <li><strong>Firefox</strong> : {locale === "en" ? "Settings > Privacy & Security > Cookies" : "Paramètres > Vie privée et sécurité > Cookies"}</li>
              <li><strong>Safari</strong> : {locale === "en" ? "Preferences > Privacy > Manage Website Data" : "Préférences > Confidentialité > Gérer les données de site"}</li>
              <li><strong>Edge</strong> : {locale === "en" ? "Settings > Cookies and site permissions" : "Paramètres > Cookies et autorisations de site"}</li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "4. Changes" : "4. Modifications"}
            </h2>
            <p>
              {locale === "en"
                ? "We reserve the right to modify this cookie policy at any time. We invite you to check this page regularly."
                : "Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Nous vous invitons à consulter régulièrement cette page."}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "5. Contact" : "5. Contact"}
            </h2>
            <p>
              {locale === "en"
                ? "For any question regarding this cookie policy:"
                : "Pour toute question relative à cette politique de cookies :"}{" "}
              <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline">dpo@nomask.fr</a>
            </p>
          </div>
        </div>

        <DynamicSidebar locale={locale} />
      </div>
    </div>
  );
}
