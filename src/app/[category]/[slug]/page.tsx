import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
  getCommentsByArticle,
  getAllArticleSlugs,
} from "@/lib/queries";
import { formatDate, timeAgo, SITE_NAME, SITE_URL } from "@/lib/utils";
import CategoryBadge from "@/components/shared/CategoryBadge";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { JsonLdArticle, JsonLdBreadcrumb } from "@/components/shared/JsonLd";
import ShareButtons from "@/components/shared/ShareButtons";
import AuthorCard from "@/components/shared/AuthorCard";
import CommentSection from "@/components/comments/CommentSection";
import DynamicSidebar from "@/components/shared/DynamicSidebar";

export const revalidate = 300;

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

  const [relatedArticles, comments] = await Promise.all([
    getRelatedArticles(article.id, article.category_id, "fr", 3),
    getCommentsByArticle(article.id),
  ]);

  const articleUrl = `/${article.category?.slug}/${article.slug}`;

  return (
    <>
      <JsonLdArticle article={article} />
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
              <figure className="mb-8">
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
              dangerouslySetInnerHTML={{ __html: article.content }}
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
    </>
  );
}
