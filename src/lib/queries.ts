import { supabase } from "./supabase";
import type { ArticleWithRelations } from "@/types";

const ARTICLE_SELECT = `
  *,
  category:categories(*),
  author:authors(*),
  subcategory:subcategories(*)
`;

export async function getArticles(options?: {
  locale?: string;
  categorySlug?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  breaking?: boolean;
}) {
  const {
    locale = "fr",
    categorySlug,
    limit = 20,
    offset = 0,
    featured,
    breaking,
  } = options || {};

  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }
  if (featured !== undefined) {
    query = query.eq("is_featured", featured);
  }
  if (breaking !== undefined) {
    query = query.eq("is_breaking", breaking);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Filter out articles where category didn't match (due to inner join behavior)
  if (categorySlug) {
    return (data as ArticleWithRelations[]).filter(
      (a) => a.category?.slug === categorySlug
    );
  }

  return data as ArticleWithRelations[];
}

export async function getArticleBySlug(slug: string, locale: string = "fr") {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as ArticleWithRelations;
}

export async function getFeaturedArticle(locale: string = "fr") {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as ArticleWithRelations;
}

export async function getCarouselArticles(locale: string = "fr", limit: number = 5) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function getBreakingNews(locale: string = "fr") {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function getArticlesByCategory(
  categorySlug: string,
  locale: string = "fr",
  limit: number = 10
) {
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function getMostRecentArticles(
  locale: string = "fr",
  limit: number = 4
) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  locale: string = "fr",
  limit: number = 3
) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("category_id", categoryId)
    .neq("id", articleId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getCommentsByArticle(articleId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  if (error) return [];

  // Organiser les commentaires avec leurs réponses
  const topLevel = data.filter((c) => !c.parent_id);
  return topLevel.map((comment) => ({
    ...comment,
    replies: data.filter((c) => c.parent_id === comment.id),
  }));
}

export async function getAllArticleSlugs(locale: string = "fr") {
  const { data, error } = await supabase
    .from("articles")
    .select("slug, category:categories(slug)")
    .eq("status", "published")
    .eq("locale", locale);

  if (error) return [];
  return data;
}

export async function getAuthorBySlug(slug: string) {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getArticlesByAuthor(
  authorId: string,
  locale: string = "fr"
) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("author_id", authorId)
    .order("published_at", { ascending: false });

  if (error) return [];
  return data as ArticleWithRelations[];
}

export async function searchArticles(
  query: string,
  locale: string = "fr",
  limit: number = 20
) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ArticleWithRelations[];
}
