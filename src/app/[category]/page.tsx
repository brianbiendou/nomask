import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getCategories,
} from "@/lib/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Newsletter from "@/components/home/Newsletter";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { AdSenseDisplay } from "@/components/shared/AdSense";

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
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};

  return {
    title: `${category.name} — Actualités et analyses`,
    description: category.description || `Toute l'actualité ${category.name} sur ${SITE_NAME}`,
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description || `Toute l'actualité ${category.name}`,
      url: `${SITE_URL}/${category.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Validation de la catégorie
  if (!VALID_CATEGORIES.includes(categorySlug)) {
    notFound();
  }

  const [category, articles] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getArticlesByCategory(categorySlug, "fr", 20),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: category.name }]} />

      {/* Header de catégorie */}
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
        {/* Articles */}
        <div className="lg:col-span-2">
          {articles.length > 0 ? (
            <div className="space-y-8">
              {/* Premier article en grand */}
              <ArticleCard article={articles[0]} />

              {/* Annonce AdSense */}
              <AdSenseDisplay />

              {/* Le reste en grille */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(1).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 font-sans">
              Aucun article dans cette catégorie pour le moment.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <DynamicSidebar
          excludeIds={articles.map((a) => a.id)}
          categorySlug={categorySlug}
        />
      </div>
    </div>
  );
}
