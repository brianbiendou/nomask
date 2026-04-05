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
    title: `${dict.contact.title} — ${SITE_NAME}`,
    description: dict.contact.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: dict.contact.title }]} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-black font-sans mb-6">{dict.contact.title}</h1>

          <div className="text-base leading-relaxed text-gray-800 space-y-6">
            <p>{dict.contact.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold font-sans mb-2">📝 {dict.contact.editorial}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {locale === "en"
                    ? "For corrections, tips or editorial questions:"
                    : "Pour les corrections, informations ou questions éditoriales :"}
                </p>
                <a href="mailto:redaction@nomask.fr" className="text-brand hover:underline font-medium">redaction@nomask.fr</a>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold font-sans mb-2">🤝 {dict.contact.partnerships}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {locale === "en"
                    ? "For partnership and sponsorship inquiries:"
                    : "Pour les demandes de partenariat et de sponsoring :"}
                </p>
                <a href="mailto:partenariats@nomask.fr" className="text-brand hover:underline font-medium">partenariats@nomask.fr</a>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold font-sans mb-2">🔒 {dict.contact.dpo}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {locale === "en"
                    ? "For any request regarding your personal data:"
                    : "Pour toute demande concernant vos données personnelles :"}
                </p>
                <a href="mailto:dpo@nomask.fr" className="text-brand hover:underline font-medium">dpo@nomask.fr</a>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold font-sans mb-2">📧 {dict.contact.general}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {locale === "en"
                    ? "For any other question:"
                    : "Pour toute autre question :"}
                </p>
                <a href="mailto:contact@nomask.fr" className="text-brand hover:underline font-medium">contact@nomask.fr</a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-bold font-sans mb-2">📍 {dict.contact.address}</h2>
              <p className="text-sm text-gray-700">
                {dict.contact.company}<br />
                Paris, France
              </p>
            </div>
          </div>
        </div>

        <DynamicSidebar locale={locale} />
      </div>
    </div>
  );
}
