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
    title: `${dict.legal.title} — ${SITE_NAME}`,
    description: locale === "en"
      ? `Legal notices for ${SITE_NAME}. Editor, hosting and terms of use.`
      : `Mentions légales de ${SITE_NAME}. Éditeur, hébergement et conditions d\u0027utilisation.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/mentions-legales`,
    },
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: dict.legal.title }]} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-black font-sans mb-6">{dict.legal.title}</h1>

          <div className="prose prose-gray max-w-none text-base leading-relaxed space-y-4">
            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "1. Editor" : "1. Éditeur"}
            </h2>
            <p>
              {locale === "en"
                ? `The website ${SITE_URL} is published by:`
                : `Le site ${SITE_URL} est édité par :`}
            </p>
            <ul className="list-none space-y-1">
              <li><strong>{SITE_NAME} Media SAS</strong></li>
              <li>Paris, France</li>
              <li>{locale === "en" ? "Publication director" : "Directeur de la publication"} : Brian Biendou</li>
              <li>{locale === "en" ? "Contact" : "Contact"} : <a href="mailto:contact@nomask.fr" className="text-brand hover:underline">contact@nomask.fr</a></li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "2. Hosting" : "2. Hébergement"}
            </h2>
            <p>{locale === "en" ? "The website is hosted by:" : "Le site est hébergé par :"}</p>
            <ul className="list-none space-y-1">
              <li><strong>Vercel Inc.</strong></li>
              <li>340 S Lemon Ave #4133</li>
              <li>Walnut, CA 91789, USA</li>
              <li><a href="https://vercel.com" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
            </ul>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "3. Intellectual property" : "3. Propriété intellectuelle"}
            </h2>
            <p>
              {locale === "en"
                ? `All content published on ${SITE_URL} (articles, images, illustrations, logos) is the property of ${SITE_NAME} Media SAS or its partners and is protected by the Code of Intellectual Property. Any partial or total reproduction without prior written authorization is prohibited.`
                : `L\u0027ensemble des contenus publiés sur ${SITE_URL} (articles, images, illustrations, logos) est la propriété de ${SITE_NAME} Media SAS ou de ses partenaires et est protégé par le Code de la propriété intellectuelle. Toute reproduction partielle ou totale sans autorisation écrite préalable est interdite.`}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "4. Terms of use" : "4. Conditions d\u0027utilisation"}
            </h2>
            <p>
              {locale === "en"
                ? `Use of the website ${SITE_URL} implies full and complete acceptance of these legal notices. ${SITE_NAME} reserves the right to modify these notices at any time.`
                : `L\u0027utilisation du site ${SITE_URL} implique l\u0027acceptation pleine et entière des présentes mentions légales. ${SITE_NAME} se réserve le droit de les modifier à tout moment.`}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "5. Limitation of liability" : "5. Limitation de responsabilité"}
            </h2>
            <p>
              {locale === "en"
                ? `${SITE_NAME} strives to ensure the accuracy of the information published on this site. However, ${SITE_NAME} cannot guarantee the accuracy, completeness or timeliness of the information available. ${SITE_NAME} shall not be held liable for any decision made based on information from this site.`
                : `${SITE_NAME} s\u0027efforce d\u0027assurer l\u0027exactitude des informations publiées sur ce site. Toutefois, ${SITE_NAME} ne peut garantir l\u0027exactitude, la complétude ou l\u0027actualité des informations disponibles. ${SITE_NAME} décline toute responsabilité pour toute décision prise sur la base des informations de ce site.`}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "6. Hyperlinks" : "6. Liens hypertextes"}
            </h2>
            <p>
              {locale === "en"
                ? `${SITE_NAME} may contain links to external websites. ${SITE_NAME} has no control over the content of these sites and shall not be held liable for their content or practices.`
                : `${SITE_NAME} peut contenir des liens vers des sites externes. ${SITE_NAME} n\u0027exerce aucun contrôle sur le contenu de ces sites et ne saurait être tenu responsable de leur contenu ou de leurs pratiques.`}
            </p>

            <h2 className="text-xl font-bold font-sans mt-6">
              {locale === "en" ? "7. Applicable law" : "7. Droit applicable"}
            </h2>
            <p>
              {locale === "en"
                ? "These legal notices are governed by French law. In the event of a dispute, the French courts shall have exclusive jurisdiction."
                : "Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents."}
            </p>
          </div>
        </div>

        <DynamicSidebar locale={locale} />
      </div>
    </div>
  );
}
