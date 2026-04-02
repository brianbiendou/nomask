import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ArticleWithRelations } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nomask.fr";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "NoMask";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  // Vérifier que la catégorie existe
  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", category)
    .single();

  if (!cat) {
    return new Response("Category not found", { status: 404 });
  }

  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select(`*, category:categories(*), author:authors(*)`)
    .eq("status", "published")
    .eq("locale", "fr")
    .eq("category_id", cat.id)
    .order("published_at", { ascending: false })
    .limit(30);

  const items = (articles as ArticleWithRelations[]) || [];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_NAME)} — ${escapeXml(cat.name)}</title>
    <link>${SITE_URL}/${cat.slug}</link>
    <description>${escapeXml(cat.description || `Actualités ${cat.name} sur ${SITE_NAME}`)}</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss/${cat.slug}.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml(SITE_NAME)} — ${escapeXml(cat.name)}</title>
      <link>${SITE_URL}/${cat.slug}</link>
    </image>
    ${items
      .map(
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/${article.category?.slug}/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${article.category?.slug}/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <dc:creator>${escapeXml(article.author?.name || SITE_NAME)}</dc:creator>
      <category>${escapeXml(article.category?.name || "")}</category>
      <pubDate>${article.published_at ? new Date(article.published_at).toUTCString() : ""}</pubDate>${article.image_url ? `
      <media:content url="${escapeXml(article.image_url)}" medium="image"/>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
