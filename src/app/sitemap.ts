import type { MetadataRoute } from "next";
import { getAllArticleSlugs, getCategories } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nomask.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  // Pages de catégories
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // Pages d'articles
  const articleSlugs = await getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs
    .filter((a: any) => a.category?.slug)
    .map((a: any) => ({
      url: `${SITE_URL}/${a.category.slug}/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : a.published_at ? new Date(a.published_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
