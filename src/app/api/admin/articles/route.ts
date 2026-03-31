import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/backend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_SORTS = [
  "published_at",
  "created_at",
  "updated_at",
  "title",
  "read_time",
];

export async function GET(request: NextRequest) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") || "15")));
  const sortRaw = searchParams.get("sort") || "published_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const status = searchParams.get("status") || "all";
  const categoryId = searchParams.get("category_id") || "";

  // Validate sort field to prevent injection
  const sort = ALLOWED_SORTS.includes(sortRaw) ? sortRaw : "published_at";

  const offset = (page - 1) * perPage;

  try {
    let query = supabaseAdmin
      .from("articles")
      .select(
        `
        id, title, slug, excerpt, content, image_url, status,
        is_featured, is_breaking, is_exclusive, read_time,
        published_at, created_at, updated_at,
        category:categories(id, name, slug, color),
        author:authors(id, name, slug),
        comments(count)
      `,
        { count: "exact" }
      )
      .order(sort, { ascending: order === "asc" })
      .range(offset, offset + perPage - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data: articles, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich articles with image/link counts parsed from content
    const enriched = (articles || []).map((article: Record<string, unknown>) => {
      const content = (article.content as string) || "";
      const imageCount = (content.match(/<img[\s>]/gi) || []).length;
      const linkCount = (content.match(/<a\s[^>]*href/gi) || []).length;
      const comments = article.comments as { count: number }[] | undefined;
      const commentCount = comments?.[0]?.count || 0;

      // Remove heavy content field from response
      const { content: _content, comments: _comments, ...rest } = article;
      return {
        ...rest,
        comment_count: commentCount,
        image_count: imageCount,
        link_count: linkCount,
      };
    });

    // Fetch categories for filter dropdown
    const { data: categories } = await supabaseAdmin
      .from("categories")
      .select("id, name, slug")
      .order("sort_order");

    return NextResponse.json({
      articles: enriched,
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
      categories: categories || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
