import Image from "next/image";
import Link from "next/link";
import { getSidebarArticles } from "@/lib/queries";
import type { ArticleWithRelations } from "@/types";
import Newsletter from "@/components/home/Newsletter";

interface DynamicSidebarProps {
  excludeIds?: string[];
  showNewsletter?: boolean;
  categorySlug?: string;
  locale?: string;
}

export default async function DynamicSidebar({
  excludeIds = [],
  showNewsletter = true,
  categorySlug,
  locale = "fr",
}: DynamicSidebarProps) {
  const { alirePlus, thematique, definitions, thematiqueCategory } =
    await getSidebarArticles(excludeIds, locale, categorySlug);

  const thematiqueCat = thematique[0]?.category;

  return (
    <aside className="space-y-8">
      {/* ══════ À LIRE AUSSI ══════ */}
      {alirePlus.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4 border-b-2 border-brand pb-2 font-sans">
            {locale === "en" ? "Don't miss" : "Ne manquez pas"}
          </h2>
          <div className="space-y-3">
            {alirePlus.map((article) => (
              <SidebarImageCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* ══════ NEWSLETTER ══════ */}
      {showNewsletter && <Newsletter locale={locale} />}

      {/* ══════ THÉMATIQUE (image + titre) ══════ */}
      {thematique.length > 0 && thematiqueCat && (
        <div>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2
              className="text-sm font-bold uppercase tracking-wide font-sans"
              style={{ color: thematiqueCat.color }}
            >
              {thematiqueCat.name}
            </h2>
            <Link
              href={`/${locale}/${thematiqueCat.slug}`}
              className="text-xs font-semibold hover:underline"
              style={{ color: thematiqueCat.color }}
            >
              {locale === "en" ? "See all →" : "Voir tout →"}
            </Link>
          </div>
          <div className="space-y-4">
            {thematique.map((article) => (
              <SidebarImageCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* ══════ EN SAVOIR PLUS / DÉFINITIONS ══════ */}
      {definitions.length > 0 && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: `${definitions[0]?.category?.color || "#3B82F6"}10`,
            borderLeft: `4px solid ${definitions[0]?.category?.color || "#3B82F6"}`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke={definitions[0]?.category?.color || "#3B82F6"}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-sm font-bold font-sans">
              {definitions[0]?.category?.name || "En savoir plus"}…
            </h2>
          </div>
          <div className="space-y-3">
            {definitions.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/${article.category?.slug}/${article.slug}`}
                className="flex items-start gap-2 group"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: article.category?.color || "#3B82F6",
                  }}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-snug">
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
          {definitions[0]?.category && (
            <Link
              href={`/${locale}/${definitions[0].category.slug}`}
              className="inline-block mt-4 text-xs font-semibold hover:underline"
              style={{ color: definitions[0].category.color }}
            >
              {locale === "en"
                ? `See all ${definitions[0].category.name.toLowerCase()} →`
                : `Voir toutes les ${definitions[0].category.name.toLowerCase()} →`}
            </Link>
          )}
        </div>
      )}

      {/* ══════ PUBLICITÉ ══════ */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center h-64">
        <span className="text-gray-300 text-xs font-medium">
          {locale === "en" ? "Ad space" : "Espace publicitaire"}
        </span>
      </div>
    </aside>
  );
}

/* ── Mini composant : lien texte avec badge catégorie ── */
function SidebarTextLink({ article, locale = "fr" }: { article: ArticleWithRelations; locale?: string }) {
  return (
    <Link
      href={`/${locale}/${article.category?.slug}/${article.slug}`}
      className="block group py-2 border-b border-gray-100 last:border-0"
    >
      {article.category && (
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: article.category.color }}
        >
          {article.category.name}
        </span>
      )}
      <p className="text-sm font-semibold text-dark leading-snug mt-0.5 group-hover:text-brand transition-colors line-clamp-2">
        {article.title}
      </p>
    </Link>
  );
}

/* ── Mini composant : image carrée + titre horizontal (style image 3) ── */
function SidebarImageCard({ article, locale = "fr" }: { article: ArticleWithRelations; locale?: string }) {
  return (
    <Link
      href={`/${locale}/${article.category?.slug}/${article.slug}`}
      className="flex gap-3 group py-2 border-b border-gray-100 last:border-0"
    >
      {article.image_url && (
        <div className="w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-100">
          <Image
            src={article.image_url}
            alt={article.title}
            width={96}
            height={80}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-semibold text-dark leading-snug group-hover:text-brand transition-colors line-clamp-3">
          {article.title}
        </p>
      </div>
    </Link>
  );
}
