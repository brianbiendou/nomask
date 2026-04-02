import Link from "next/link";
import { getMostRecentArticles } from "@/lib/queries";
import { SITE_NAME } from "@/lib/utils";

export const metadata = {
  title: `Page introuvable — ${SITE_NAME}`,
};

export default async function NotFound() {
  const latestArticles = await getMostRecentArticles("fr", 6);

  return (
    <div className="max-w-255 mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-black font-sans text-red-600 mb-4">404</h1>
      <p className="text-xl font-sans text-gray-800 mb-2">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <p className="text-gray-500 font-serif mb-8">
        Pas de panique, l&apos;actualité continue.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link
          href="/"
          className="px-6 py-3 bg-red-600 text-white font-sans font-bold rounded-lg hover:bg-red-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/recherche"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-sans font-bold rounded-lg hover:border-red-600 hover:text-red-600 transition-colors"
        >
          Rechercher un article
        </Link>
      </div>

      {latestArticles.length > 0 && (
        <div className="text-left max-w-2xl mx-auto">
          <h2 className="text-sm font-sans font-bold uppercase tracking-wide text-gray-500 mb-4 border-b pb-2">
            Articles récents
          </h2>
          <div className="space-y-3">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.category?.slug}/${article.slug}`}
                className="block group"
              >
                {article.category && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
