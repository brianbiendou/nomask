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

export async function getArticlesBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  locale: string = "fr",
  limit: number = 4
) {
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, category:categories!inner(id, slug)")
    .eq("slug", subcategorySlug)
    .single();

  if (!subcategory) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .eq("subcategory_id", subcategory.id)
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
    .select("slug, published_at, updated_at, category:categories(slug)")
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

export async function getAllAuthors() {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name", { ascending: true });

  if (error) return [];
  return data as import("@/types").Author[];
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

/**
 * Articles pour la sidebar dynamique.
 * Retourne des articles variés en excluant les IDs fournis.
 */
export async function getSidebarArticles(
  excludeIds: string[] = [],
  locale: string = "fr",
  categorySlug?: string
) {
  // Seed basé sur le jour pour variation quotidienne
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // Récupérer un pool d'articles récents
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("locale", locale)
    .order("published_at", { ascending: false })
    .limit(60);

  if (error || !data) return { alirePlus: [], thematique: [], definitions: [] };

  const articles = (data as ArticleWithRelations[]).filter(
    (a) => !excludeIds.includes(a.id)
  );

  // Shuffle déterministe basé sur le jour
  const shuffled = [...articles].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) * 31 + daySeed) % 1000;
    const hashB = (b.id.charCodeAt(0) * 31 + daySeed) % 1000;
    return hashA - hashB;
  });

  // Si une catégorie est fournie, prioriser les articles de cette catégorie
  const sameCat = categorySlug
    ? shuffled.filter((a) => a.category?.slug === categorySlug)
    : [];
  const otherArticles = categorySlug
    ? shuffled.filter((a) => a.category?.slug !== categorySlug)
    : shuffled;

  // "Ne manquez pas" — articles de la même catégorie en priorité, puis variés
  const alirePlus = categorySlug
    ? [...sameCat.slice(0, 5), ...otherArticles.slice(0, 5 - Math.min(sameCat.length, 5))].slice(0, 5)
    : shuffled.slice(0, 5);

  // Thématique — articles de la catégorie courante (avec image), sinon une catégorie aléatoire
  const withImages = shuffled.filter((a) => a.image_url);
  const categories = [...new Set(withImages.map((a) => a.category?.slug))];
  const pickedCat = categorySlug && categories.includes(categorySlug)
    ? categorySlug
    : categories[daySeed % categories.length];
  const thematique = withImages
    .filter((a) => a.category?.slug === pickedCat)
    .slice(0, 4);

  // En savoir plus — articles d'une catégorie différente de la courante
  const otherCats = categories.filter((c) => c !== pickedCat);
  const defCat = otherCats[(daySeed + 1) % Math.max(otherCats.length, 1)];
  const definitions = shuffled
    .filter((a) => a.category?.slug === defCat && !thematique.find((t) => t.id === a.id))
    .slice(0, 3);

  return { alirePlus, thematique, definitions, thematiqueCategory: pickedCat };
}


// ────────────────────────────────────────
// YouTube Videos — rotation automatique
// ────────────────────────────────────────
export interface YouTubeVideoSlot {
  source_name: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  youtube_url: string;
}

export async function getYouTubeCurrentVideos(): Promise<Record<string, YouTubeVideoSlot | null>> {
  // 1. Charger la config de rotation
  const { data: cfgData } = await supabase
    .from("youtube_config")
    .select("rotation_minutes")
    .eq("id", 1)
    .single();

  const rotationMin = cfgData?.rotation_minutes ?? 120;

  // 2. Charger les sources actives, triées par slot_position
  const SLOT_ORDER = ["main", "bottom_left", "bottom_right"];
  const { data: sources } = await supabase
    .from("youtube_sources")
    .select("id, name, slot_position")
    .eq("enabled", true);

  if (!sources || sources.length === 0) return { main: null, bottom_left: null, bottom_right: null };

  // Trier par slot_position : main → bottom_left → bottom_right → reste
  sources.sort((a, b) => {
    const ai = SLOT_ORDER.indexOf(a.slot_position);
    const bi = SLOT_ORDER.indexOf(b.slot_position);
    return (ai === -1 ? 100 : ai) - (bi === -1 ? 100 : bi);
  });

  // Les 3 premiers dans l'ordre trié prennent les slots main, bottom_left, bottom_right
  const SLOT_KEYS = ["main", "bottom_left", "bottom_right"] as const;

  // 3. Index de rotation basé sur le temps
  const nowTs = Math.floor(Date.now() / 1000);
  const rotationIndex = Math.floor(nowTs / (rotationMin * 60));

  // 4. Pour chaque source (max 3), récupérer ses vidéos et assigner au slot correspondant
  const result: Record<string, YouTubeVideoSlot | null> = { main: null, bottom_left: null, bottom_right: null };

  for (let i = 0; i < Math.min(sources.length, 3); i++) {
    const src = sources[i];
    const slotKey = SLOT_KEYS[i];
    const { data: videos } = await supabase
      .from("youtube_videos")
      .select("video_id, title, thumbnail_url")
      .eq("source_id", src.id)
      .order("position");

    if (!videos || videos.length === 0) continue;

    const idx = rotationIndex % videos.length;
    const v = videos[idx];

    result[slotKey] = {
      source_name: src.name,
      video_id: v.video_id,
      title: v.title,
      thumbnail_url: v.thumbnail_url,
      youtube_url: `https://www.youtube.com/watch?v=${v.video_id}`,
    };
  }

  return result;
}
