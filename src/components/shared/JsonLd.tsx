import type { ArticleWithRelations } from "@/types";
import { SITE_URL } from "@/lib/utils";

interface JsonLdArticleProps {
  article: ArticleWithRelations;
}

export function JsonLdArticle({ article }: JsonLdArticleProps) {
  const authorSameAs: string[] = [];
  if (article.author?.twitter_url) authorSameAs.push(article.author.twitter_url);
  if (article.author?.linkedin_url) authorSameAs.push(article.author.linkedin_url);

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
      jobTitle: article.author?.role || undefined,
      image: article.author?.avatar_url || undefined,
      sameAs: authorSameAs.length > 0 ? authorSameAs : undefined,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "NoMask",
      url: SITE_URL,
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
    isAccessibleForFree: true,
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

/**
 * Extrait automatiquement les paires Question/Réponse du contenu HTML
 * pour les guides d'achat. Cherche les Hx suivis de paragraphes.
 */
export function JsonLdFAQ({ article }: JsonLdArticleProps) {
  // Extraire les questions : titres H2/H3 contenant "?" ou commençant par des mots interrogatifs
  const questionRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;

  const html = article.content;
  const questions: { question: string; answer: string }[] = [];

  let match;
  while ((match = questionRegex.exec(html)) !== null) {
    const title = match[1].replace(/<[^>]+>/g, "").trim();
    // Vérifier si c'est une question (contient ? ou commence par mots interrogatifs)
    const isQuestion = /\?|^(comment|pourquoi|quel|quelle|quels|quelles|est-ce|faut-il|combien|où|quand)/i.test(title);
    if (!isQuestion) continue;

    // Chercher le premier paragraphe après ce titre
    const afterTitle = html.substring(match.index + match[0].length);
    const pMatch = /<p[^>]*>(.*?)<\/p>/i.exec(afterTitle);
    if (pMatch) {
      const answer = pMatch[1].replace(/<[^>]+>/g, "").trim();
      if (answer.length > 20) {
        questions.push({ question: title, answer });
      }
    }
  }

  if (questions.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
