import {
  getArticles,
  getCarouselArticles,
  getBreakingNews,
  getMostRecentArticles,
  getArticlesByCategory,
} from "@/lib/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import Newsletter from "@/components/home/Newsletter";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";
import { formatDateShort } from "@/lib/utils";

export const revalidate = 300;

export default async function HomePage() {
  const [
    featuredArticles,
    breakingNews,
    latestArticles,
    mostRecent,
    politiqueArticles,
    techArticles,
    societeArticles,
  ] = await Promise.all([
    getCarouselArticles(),
    getBreakingNews(),
    getArticles({ limit: 12 }),
    getMostRecentArticles("fr", 8),
    getArticlesByCategory("politique", "fr", 4),
    getArticlesByCategory("tech", "fr", 4),
    getArticlesByCategory("societe", "fr", 4),
  ]);

  // Hero principal + sidebar
  const heroArticle = featuredArticles[0] || latestArticles[0];
  const sidebarArticles = (featuredArticles.length > 1
    ? featuredArticles.slice(1, 4)
    : latestArticles.slice(1, 4)
  );

  // Articles grille "À lire absolument"
  const heroIds = new Set([heroArticle?.id, ...sidebarArticles.map((a) => a.id)]);
  const mustReadArticles = latestArticles
    .filter((a) => !heroIds.has(a.id))
    .slice(0, 3);

  // Toute l'actualité
  const allUsed = new Set([...heroIds, ...mustReadArticles.map((a) => a.id)]);
  const allNewsArticles = mostRecent.filter((a) => !allUsed.has(a.id));

  // Trending tags
  const trendingTopics =
    breakingNews.length > 0
      ? breakingNews.map((a) => ({ title: a.title, url: `/${a.category?.slug}/${a.slug}` }))
      : latestArticles.slice(0, 5).map((a) => ({ title: a.title, url: `/${a.category?.slug}/${a.slug}` }));

  return (
    <div className="min-h-screen">
      {/* ======= HERO SECTION ======= */}
      <section className="max-w-300 mx-auto px-4 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article principal (gauche - 2 colonnes) */}
          <div className="lg:col-span-2">
            {heroArticle && <ArticleCard article={heroArticle} variant="hero" />}
          </div>

          {/* Sidebar droite (1 colonne) : articles + pub */}
          <div className="flex flex-col gap-4">
            {sidebarArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="sidebar" />
            ))}
            {/* Placeholder publicité (droite) */}
            <div className="border-2 border-red-500 rounded-lg flex items-center justify-center h-48 mt-2">
              <span className="text-red-400 text-sm font-medium">Espace publicitaire</span>
            </div>
          </div>
        </div>

        {/* Placeholder publicité (en dessous du hero) */}
        <div className="border-2 border-red-500 rounded-lg flex items-center justify-center h-32 mt-8 max-w-2xl mx-auto">
          <span className="text-red-400 text-sm font-medium">Espace publicitaire</span>
        </div>
      </section>

      {/* ======= TRENDING BAR ======= */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-300 mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto hide-scrollbar">
          <span className="shrink-0 text-blue-600 font-black text-sm flex items-center gap-1">
            ⚡ Tendances
          </span>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            {trendingTopics.slice(0, 5).map((topic, i) => (
              <Link
                key={i}
                href={topic.url}
                className="shrink-0 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors bg-gray-100 px-3 py-1.5 rounded-full"
              >
                {topic.title.length > 40 ? topic.title.slice(0, 40) + "…" : topic.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= À LIRE ABSOLUMENT ======= */}
      <section className="bg-section-dark py-10">
        <div className="max-w-300 mx-auto px-4">
          <SectionTitle title="À lire absolument" light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {mustReadArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="dark" />
            ))}
          </div>
        </div>
      </section>

      {/* ======= LE RÉCAP + DERNIÈRES ACTUS ======= */}
      <section className="max-w-300 mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Colonne gauche : le récap */}
          <div>
            <SectionTitle title="Le récap'" />
            <div className="mt-4 space-y-0">
              {latestArticles.slice(0, 5).map((article) => (
                <ArticleCard key={article.id} article={article} variant="news-row" />
              ))}
            </div>
          </div>
          {/* Colonne droite : dernières actus */}
          <div>
            <SectionTitle title="Les dernières actus" />
            <div className="mt-4 space-y-0">
              {mostRecent.slice(0, 5).map((article) => (
                <ArticleCard key={article.id} article={article} variant="news-row" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= NOS VIDÉOS (placeholder) ======= */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-300 mx-auto px-4">
          <SectionTitle title="Nos vidéos 🎬" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm"
              >
                Bientôt disponible
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TOUTE L'ACTUALITÉ ======= */}
      <section className="max-w-300 mx-auto px-4 py-10">
        <SectionTitle title="Toute l'actualité" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-6">
          {allNewsArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="news-row" />
          ))}
        </div>
      </section>

      {/* ======= CATÉGORIES EN COLONNES (fond sombre) ======= */}
      <section className="bg-section-dark py-10">
        <div className="max-w-300 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryColumn
              title="Politique"
              slug="politique"
              articles={politiqueArticles}
            />
            <CategoryColumn
              title="Tech & IA"
              slug="tech"
              articles={techArticles}
            />
            <CategoryColumn
              title="Société"
              slug="societe"
              articles={societeArticles}
            />
          </div>
        </div>
      </section>

      {/* ======= NEWSLETTER ======= */}
      <section className="max-w-300 mx-auto px-4 py-10">
        <div className="max-w-lg mx-auto">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}

/* ---- Sous-composants ---- */

function SectionTitle({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className={`text-lg font-black uppercase tracking-wide ${
          light ? "text-white" : "text-dark"
        }`}
      >
        {title}
      </h2>
      <div className={`flex-1 h-px ${light ? "bg-gray-600" : "bg-gray-200"}`} />
    </div>
  );
}

function CategoryColumn({
  title,
  slug,
  articles,
}: {
  title: string;
  slug: string;
  articles: ArticleWithRelations[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-black text-white uppercase tracking-wide">
          {title}
        </h3>
        <Link
          href={`/${slug}`}
          className="text-[11px] font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-wider"
        >
          Voir tout →
        </Link>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.category?.slug}/${article.slug}`}
            className="block group"
          >
            <h4 className="text-sm text-gray-300 group-hover:text-brand transition-colors line-clamp-2 leading-relaxed">
              • {article.title}
            </h4>
            {article.published_at && (
              <span className="text-[10px] text-gray-500">
                {formatDateShort(article.published_at)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
