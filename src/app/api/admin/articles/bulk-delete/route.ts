import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/backend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Liste d'IDs requise" },
        { status: 400 }
      );
    }

    if (ids.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 articles à la fois" },
        { status: 400 }
      );
    }

    // Validate all IDs are strings (UUIDs)
    if (!ids.every((id: unknown) => typeof id === "string" && id.length > 0)) {
      return NextResponse.json(
        { error: "IDs invalides" },
        { status: 400 }
      );
    }

    // Delete comments for all articles
    await supabaseAdmin.from("comments").delete().in("article_id", ids);

    // Delete all articles
    const { error, count } = await supabaseAdmin
      .from("articles")
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Purger le cache Next.js
    revalidatePath("/");
    revalidatePath("/[category]", "page");

    return NextResponse.json({ success: true, deleted: count });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
