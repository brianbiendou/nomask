import type { MetadataRoute } from "next";
import { getAllArticleSlugs, getCategories, getAllAuthors } from "@/lib/queries";
import { locales } from "@/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nomask.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Helper: generate locale-variants for a path
  function localeEntries(
    path: string,
    opts: { changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number; lastModified?: Date }
  ): MetadataRoute.Sitemap {
    return locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: opts.lastModified || now,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    }));
  }

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    ...localeEntries("", { changeFrequency: "hourly", priority: 1 }),
    ...localeEntries("/a-propos", { changeFrequency: "monthly", priority: 0.3 }),
    ...localeEntries("/auteurs", { changeFrequency: "weekly", priority: 0.5 }),
    ...localeEntries("/contact", { changeFrequency: "monthly", priority: 0.3 }),
    ...localeEntries("/recherche", { changeFrequency: "monthly", priority: 0.2 }),
    ...localeEntries("/mentions-legales", { changeFrequency: "yearly", priority: 0.1 }),
    ...localeEntries("/donnees-personnelles", { changeFrequency: "yearly", priority: 0.1 }),
    ...localeEntries("/politique-cookies", { changeFrequency: "yearly", priority: 0.1 }),
  ];

  // Pages de catégories
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    localeEntries(`/${cat.slug}`, { changeFrequency: "hourly", priority: 0.8 })
  );

  // Pages d'articles (both locales — the query returns all articles regardless of locale)
  const articleSlugs = await getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs
    .filter((a: any) => a.category?.slug)
    .flatMap((a: any) =>
      locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/${a.category.slug}/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : a.published_at ? new Date(a.published_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/${a.category.slug}/${a.slug}`])),
        },
      }))
    );

  // Pages d'auteurs
  const authors = await getAllAuthors();
  const authorPages: MetadataRoute.Sitemap = authors.flatMap((author) =>
    localeEntries(`/auteur/${author.slug}`, { changeFrequency: "weekly", priority: 0.5 })
  );

  return [...staticPages, ...categoryPages, ...articlePages, ...authorPages];
}
