import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthorBySlug, getArticlesByAuthor } from "@/lib/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};

  return {
    title: `${author.name} — Journaliste`,
    description: author.bio || `Articles de ${author.name} sur ${SITE_NAME}`,
    openGraph: {
      title: `${author.name} | ${SITE_NAME}`,
      description: author.bio || `Articles de ${author.name}`,
      url: `${SITE_URL}/auteur/${author.slug}`,
      type: "profile",
    },
    alternates: {
      canonical: `${SITE_URL}/auteur/${author.slug}`,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.id);

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Auteurs", href: "#" }, { label: author.name }]} />

      {/* Profil auteur */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-10 mt-4">
        {author.avatar_url && (
          <Image
            src={author.avatar_url}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-3xl font-black font-sans">{author.name}</h1>
          {author.role && (
            <p className="text-red-600 font-sans font-medium mt-1">
              {author.role}
            </p>
          )}
          {author.bio && (
            <p className="mt-3 text-gray-600 font-serif leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          )}
          <div className="flex gap-3 mt-3">
            {author.twitter_url && (
              <a
                href={author.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-red-600 font-sans"
              >
                X / Twitter
              </a>
            )}
            {author.linkedin_url && (
              <a
                href={author.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-red-600 font-sans"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Articles de l'auteur */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
      <h2 className="text-sm font-sans font-bold uppercase tracking-wide text-gray-500 mb-4 border-b pb-2">
        Articles de {author.name} ({articles.length})
      </h2>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-sans">Aucun article publié.</p>
      )}
      </div>

      <DynamicSidebar
        excludeIds={articles.map((a) => a.id)}
      />
      </div>
    </div>
  );
}
