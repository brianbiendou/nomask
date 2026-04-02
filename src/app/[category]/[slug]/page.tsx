import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
  getCommentsByArticle,
  getAllArticleSlugs,
  getArticlesByCategory,
  getMostRecentArticles,
} from "@/lib/queries";
import { formatDate, timeAgo, formatDateWithTime, SITE_NAME, SITE_URL } from "@/lib/utils";
import CategoryBadge from "@/components/shared/CategoryBadge";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { JsonLdArticle, JsonLdBreadcrumb, JsonLdFAQ } from "@/components/shared/JsonLd";
import ShareButtons from "@/components/shared/ShareButtons";
import AuthorCard from "@/components/shared/AuthorCard";
import CommentSection from "@/components/comments/CommentSection";
import DynamicSidebar from "@/components/shared/DynamicSidebar";

export const revalidate = 300;

/**
 * Supprime du contenu HTML les <img> dont le src correspond à l'image principale,
 * pour éviter les doublons avec le hero affiché au-dessus.
 */
function deduplicateImages(html: string, mainImageUrl: string | null): string {
  if (!mainImageUrl || !html) return html;

  // Extraire le nom de fichier de l'image principale pour une comparaison souple
  const mainFilename = mainImageUrl.split("/").pop()?.split("?")[0]?.toLowerCase() || "";

  // Supprimer les <img> (et leur <figure> parent éventuel) qui correspondent à l'image principale
  return html
    // Supprime les <figure> contenant l'image dupliquée
    .replace(/<figure[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/figure>/gi, (match, src) => {
      const srcFilename = src.split("/").pop()?.split("?")[0]?.toLowerCase() || "";
      return srcFilename === mainFilename ? "" : match;
    })
    // Supprime les <img> isolés qui correspondent
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, (match, src) => {
      const srcFilename = src.split("/").pop()?.split("?")[0]?.toLowerCase() || "";
      return srcFilename === mainFilename ? "" : match;
    });
}

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs
    .filter((s: any) => s.category?.slug)
    .map((s: any) => ({
      category: s.category.slug,
      slug: s.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE_URL}/${article.category?.slug}/${article.slug}`;

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    keywords: article.seo_keywords || undefined,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      url,
      type: "article",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      section: article.category?.name,
      authors: article.author?.name ? [article.author.name] : [],
      images: article.image_url
        ? [
            {
              url: article.image_url,
              width: 1200,
              height: 630,
              alt: article.image_caption || article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      images: article.image_url ? [article.image_url] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article || article.category?.slug !== categorySlug) {
    notFound();
  }

  const [relatedArticles, comments, categoryArticles, latestArticles] = await Promise.all([
    getRelatedArticles(article.id, article.category_id, "fr", 3),
    getCommentsByArticle(article.id),
    getArticlesByCategory(categorySlug, "fr", 12),
    getMostRecentArticles("fr", 12),
  ]);

  // Exclure l'article actuel des listes
  const moreCategoryArticles = categoryArticles.filter((a) => a.id !== article.id).slice(0, 10);
  const moreLatestArticles = latestArticles.filter(
    (a) => a.id !== article.id && !moreCategoryArticles.some((c) => c.id === a.id)
  ).slice(0, 10);

  const articleUrl = `/${article.category?.slug}/${article.slug}`;

  return (
    <>
      <JsonLdArticle article={article} />
      <JsonLdFAQ article={article} />
      <JsonLdBreadcrumb
        items={[
          { name: article.category?.name || "", url: `${SITE_URL}/${article.category?.slug}` },
          { name: article.title, url: `${SITE_URL}${articleUrl}` },
        ]}
      />

      <article className="max-w-255 mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            {
              label: article.category?.name || "",
              href: `/${article.category?.slug}`,
            },
            { label: article.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Header */}
            <header className="mb-6">
              {article.category && (
                <CategoryBadge
                  name={article.category.name}
                  slug={article.category.slug}
                  color={article.category.color}
                />
              )}

              <h1 className="text-3xl md:text-4xl font-black font-sans leading-tight mt-3">
                {article.title}
              </h1>

              <p className="mt-3 text-lg text-gray-600 font-serif leading-relaxed">
                {article.excerpt}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 font-sans">
                {article.author && (
                  <Link
                    href={`/auteur/${article.author.slug}`}
                    className="flex items-center gap-2 hover:text-red-600 transition-colors"
                  >
                    {article.author.avatar_url && (
                      <Image
                        src={article.author.avatar_url}
                        alt={article.author.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium">{article.author.name}</span>
                  </Link>
                )}
                <time dateTime={article.published_at || ""}>
                  {article.published_at ? formatDate(article.published_at) : ""}
                </time>
                {article.published_at && (
                  <span className="text-gray-400">
                    {timeAgo(article.published_at)}
                  </span>
                )}
                {article.updated_at && article.published_at &&
                  new Date(article.updated_at).getTime() - new Date(article.published_at).getTime() > 60000 && (
                  <span className="text-gray-400 italic">
                    · Mis à jour le{" "}
                    <time dateTime={article.updated_at}>
                      {formatDate(article.updated_at)}
                    </time>
                  </span>
                )}
                {article.read_time && (
                  <span>{article.read_time} min de lecture</span>
                )}
              </div>

              {/* Partage */}
              <div className="mt-4 flex items-center gap-3 border-t border-b border-gray-200 py-3">
                <span className="text-xs font-sans font-semibold uppercase text-gray-500 tracking-wide">
                  Partager
                </span>
                <ShareButtons title={article.title} url={articleUrl} />
              </div>
            </header>

            {/* Image principale */}
            {article.image_url && (
              <figure className="mb-8 relative img-watermark">
                <Image
                  src={article.image_url}
                  alt={article.image_caption || article.title}
                  width={800}
                  height={450}
                  className="w-full rounded-lg"
                  priority
                />
                {article.image_caption && (
                  <figcaption className="mt-2 text-xs text-gray-400 font-sans">
                    {article.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Contenu de l'article */}
            <div
              className="article-content font-serif text-lg leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: deduplicateImages(article.content, article.image_url) }}
            />

            {/* Partage en bas */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans font-semibold uppercase text-gray-500 tracking-wide">
                  Partager cet article
                </span>
                <ShareButtons title={article.title} url={articleUrl} />
              </div>
            </div>

            {/* Info auteur */}
            {article.author && (
              <div className="mt-8">
                <AuthorCard author={article.author} />
              </div>
            )}

            {/* Commentaires */}
            <div className="mt-10">
              <CommentSection
                articleId={article.id}
                initialComments={comments}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Articles liés — texte uniquement avec badge couleur */}
            {relatedArticles.length > 0 && (
              <div>
                <h2 className="text-sm font-sans font-bold uppercase tracking-wide text-gray-500 mb-3 border-b-2 border-brand pb-2">
                  À lire aussi
                </h2>
                <div className="space-y-0">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/${related.category?.slug}/${related.slug}`}
                      className="block group py-1 border-b border-gray-100 last:border-0"
                    >
                      {related.category && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: related.category.color }}
                        >
                          {related.category.name}
                        </span>
                      )}
                      <p className="text-sm font-semibold text-dark leading-snug mt-0 group-hover:text-brand transition-colors line-clamp-2">
                        {related.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar dynamique contextuelle */}
            <DynamicSidebar
              excludeIds={[article.id, ...relatedArticles.map((r) => r.id)]}
              categorySlug={article.category?.slug}
            />
          </aside>
        </div>
      </article>

      {/* ======= SECTIONS ARTICLES LIÉS (sous l'article, pleine largeur) ======= */}
      <div className="max-w-255 mx-auto px-4 pb-12">
        {/* Section catégorie */}
        {moreCategoryArticles.length > 0 && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-black text-dark mb-6">
              Les derniers articles{" "}
              <span style={{ color: article.category?.color || "var(--color-brand)" }}>
                {article.category?.name}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
              {moreCategoryArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/${a.category?.slug}/${a.slug}`}
                  className="flex gap-4 group py-4 border-b border-gray-100"
                >
                  {a.image_url && (
                    <div className="w-[130px] h-[90px] flex-shrink-0 overflow-hidden bg-gray-100 rounded">
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      {a.category?.name}
                    </p>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand transition-colors">
                      {a.title}
                    </h3>
                    {a.published_at && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {formatDateWithTime(a.published_at)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section dernières actus globales */}
        {moreLatestArticles.length > 0 && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-black text-dark mb-6">
              Les dernières actualités
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
              {moreLatestArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/${a.category?.slug}/${a.slug}`}
                  className="flex gap-4 group py-4 border-b border-gray-100"
                >
                  {a.image_url && (
                    <div className="w-[130px] h-[90px] flex-shrink-0 overflow-hidden bg-gray-100 rounded">
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      {a.category?.name}
                    </p>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand transition-colors">
                      {a.title}
                    </h3>
                    {a.published_at && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {formatDateWithTime(a.published_at)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
