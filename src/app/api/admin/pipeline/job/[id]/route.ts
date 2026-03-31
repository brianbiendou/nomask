import { NextRequest, NextResponse } from "next/server";
import { checkAuth, backendFetch } from "@/lib/backend";

// GET /api/admin/pipeline/job/[id] — Détail d'un job spécifique
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const res = await backendFetch(`/api/pipeline/job/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Backend injoignable: ${message}` },
      { status: 502 }
    );
  }
}
