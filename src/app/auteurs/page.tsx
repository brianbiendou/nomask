import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllAuthors, getArticlesByAuthor } from "@/lib/queries";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { AdSenseDisplay } from "@/components/shared/AdSense";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Notre équipe de journalistes — ${SITE_NAME}`,
  description: `Découvrez les journalistes et rédacteurs de ${SITE_NAME}. Une équipe indépendante au service de l'information sans filtre.`,
  alternates: {
    canonical: `${SITE_URL}/auteurs`,
  },
};

export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  // Compter les articles par auteur
  const authorsWithCount = await Promise.all(
    authors.map(async (author) => {
      const articles = await getArticlesByAuthor(author.id);
      return { ...author, articleCount: articles.length };
    })
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Équipe éditoriale — ${SITE_NAME}`,
    description: `Les journalistes et rédacteurs de ${SITE_NAME}`,
    url: `${SITE_URL}/auteurs`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-255 mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Notre équipe" }]} />

        <h1 className="text-3xl font-black font-sans mt-4 mb-2">
          Notre équipe
        </h1>
        <p className="text-gray-600 font-serif mb-8 max-w-2xl">
          {SITE_NAME} est porté par une équipe de journalistes passionnés et indépendants,
          chacun spécialisé dans son domaine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorsWithCount.map((author) => (
            <Link
              key={author.id}
              href={`/auteur/${author.slug}`}
              className="group flex flex-col items-center text-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-red-200 transition-all"
            >
              {author.avatar_url && (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  width={96}
                  height={96}
                  className="rounded-full mb-4"
                />
              )}
              <h2 className="text-lg font-bold font-sans group-hover:text-red-600 transition-colors">
                {author.name}
              </h2>
              <p className="text-sm text-red-600 font-sans font-medium mt-1">
                {author.role}
              </p>
              {author.bio && (
                <p className="text-sm text-gray-500 font-serif mt-3 line-clamp-3">
                  {author.bio}
                </p>
              )}
              <span className="text-xs text-gray-400 font-sans mt-3">
                {author.articleCount} article{author.articleCount !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>

        {/* Annonce AdSense */}
        <AdSenseDisplay />
      </div>
    </>
  );
}
