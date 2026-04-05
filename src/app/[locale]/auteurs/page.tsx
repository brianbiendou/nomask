import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getAllAuthors, getArticlesByAuthor } from "@/lib/queries";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { getDictionary, type Locale } from "@/i18n";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.about.team} — ${SITE_NAME}`,
    description: locale === "en"
      ? `Discover all the journalists and editors of ${SITE_NAME}. An independent and passionate team.`
      : `Découvrez tous les journalistes et rédacteurs de ${SITE_NAME}. Une équipe indépendante et passionnée.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/auteurs`,
    },
  };
}

export default async function AuthorsListPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const authors = await getAllAuthors();

  const authorsWithCounts = await Promise.all(
    authors.map(async (author) => {
      const articles = await getArticlesByAuthor(author.id, locale);
      return { ...author, articleCount: articles.length };
    })
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${dict.about.team} — ${SITE_NAME}`,
    description: `L'ensemble des journalistes et rédacteurs de ${SITE_NAME}`,
    url: `${SITE_URL}/${locale}/auteurs`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-255 mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: dict.about.team }]} locale={locale} />

        <h1 className="text-3xl font-black font-sans mt-4 mb-2">{dict.about.team}</h1>
        <p className="text-gray-600 mb-8">
          {locale === "en"
            ? `${SITE_NAME} is driven by a team of independent and passionate journalists, specialized in their respective fields.`
            : `${SITE_NAME} est porté par une équipe de journalistes indépendants et passionnés, spécialisés dans leurs domaines respectifs.`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorsWithCounts.map((author) => (
            <Link
              key={author.id}
              href={`/${locale}/auteur/${author.slug}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="rounded-full shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 flex items-center justify-center text-xl font-bold text-gray-500">
                  {author.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="font-bold font-sans group-hover:text-red-600 transition-colors">{author.name}</h2>
                <p className="text-sm text-gray-500">{author.role}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {author.articleCount} {locale === "en"
                    ? (author.articleCount <= 1 ? "article" : "articles")
                    : (author.articleCount <= 1 ? "article" : "articles")}
                </p>
                {author.bio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{author.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
