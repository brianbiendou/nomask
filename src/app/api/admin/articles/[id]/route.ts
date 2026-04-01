import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/backend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    // Récupérer le slug avant suppression (pour nettoyer processed_urls côté backend)
    const { data: article } = await supabaseAdmin
      .from("articles")
      .select("id, slug, title")
      .eq("id", id)
      .single();

    if (!article) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }

    // Supprimer les commentaires liés
    await supabaseAdmin.from("comments").delete().eq("article_id", id);

    // Supprimer l'article
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Purger le cache Next.js
    revalidatePath("/");
    revalidatePath(`/${article.slug}`);

    return NextResponse.json({ success: true, deleted: article.slug });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
