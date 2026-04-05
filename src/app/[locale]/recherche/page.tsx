import { Suspense } from "react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import SearchResults from "@/components/search/SearchResults";
import { AdSenseDisplay } from "@/components/shared/AdSense";
import { getDictionary, type Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SearchPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: dict.search.title }]} locale={locale} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">{dict.search.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <p className="text-gray-500 font-sans">{locale === "en" ? "Loading..." : "Chargement..."}</p>
            }
          >
            <SearchResults locale={locale} />
          </Suspense>
        </div>

        <DynamicSidebar locale={locale} />
      </div>

      <AdSenseDisplay />
    </div>
  );
}
