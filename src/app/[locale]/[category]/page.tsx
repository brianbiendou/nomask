import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { AdSenseDisplay } from "@/components/shared/AdSense";
import { getDictionary, type Locale } from "@/i18n";

export const revalidate = 300;

const VALID_CATEGORIES = [
  "international",
  "politique",
  "societe",
  "economie",
  "tech",
  "culture",
  "science",
  "sport",
  "style",
];

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};

  const dict = await getDictionary(locale as Locale);
  const isFr = locale === "fr";

  return {
    title: isFr
      ? `${category.name} — Actualités et analyses`
      : `${category.name} — News and analysis`,
    description: category.description || (isFr
      ? `Toute l'actualité ${category.name} sur ${SITE_NAME}`
      : `All ${category.name} news on ${SITE_NAME}`),
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description || (isFr
        ? `Toute l'actualité ${category.name}`
        : `All ${category.name} news`),
      url: `${SITE_URL}/${locale}/${category.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/${category.slug}`,
      languages: {
        fr: `${SITE_URL}/fr/${category.slug}`,
        en: `${SITE_URL}/en/${category.slug}`,
      },
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, category: categorySlug } = await params;
  const dict = await getDictionary(locale as Locale);

  if (!VALID_CATEGORIES.includes(categorySlug)) {
    notFound();
  }

  const [category, articles] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getArticlesByCategory(categorySlug, locale, 20),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: category.name }]} locale={locale} />

      <div className="mb-8 border-b-2 pb-4" style={{ borderColor: category.color }}>
        <h1
          className="text-3xl md:text-4xl font-black font-sans"
          style={{ color: category.color }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {articles.length > 0 ? (
            <div className="space-y-8">
              <ArticleCard article={articles[0]} locale={locale} />
              <AdSenseDisplay />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(1).map((article) => (
                  <ArticleCard key={article.id} article={article} locale={locale} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 font-sans">
              {dict.category.noArticles}
            </p>
          )}
        </div>

        <DynamicSidebar
          excludeIds={articles.map((a) => a.id)}
          categorySlug={categorySlug}
          locale={locale}
        />
      </div>
    </div>
  );
}
