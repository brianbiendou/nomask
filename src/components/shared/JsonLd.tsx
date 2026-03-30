import type { ArticleWithRelations } from "@/types";
import { SITE_URL } from "@/lib/utils";

interface JsonLdArticleProps {
  article: ArticleWithRelations;
}

export function JsonLdArticle({ article }: JsonLdArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author?.name,
      url: `${SITE_URL}/auteur/${article.author?.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "NoMask",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${article.category?.slug}/${article.slug}`,
    },
    articleSection: article.category?.name,
    inLanguage: article.locale === "fr" ? "fr-FR" : "en-US",
    wordCount: article.content.split(/\s+/).length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function JsonLdWebSite() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NoMask",
    description:
      "NoMask — L'actualité sans filtre. Politique, économie, tech, culture, sport et style.",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/recherche?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "NoMask",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function JsonLdBreadcrumb({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
