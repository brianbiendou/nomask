import { NextRequest, NextResponse } from "next/server";
import { checkAuth, backendFetch } from "@/lib/backend";

// POST /api/admin/pipeline/trending — Récupère les articles trending
export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const res = await backendFetch("/api/trending", {
      method: "POST",
      body: JSON.stringify(body),
    });
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

// GET /api/admin/pipeline/trending — Sources disponibles
export async function GET() {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const res = await backendFetch("/api/trending/sources");
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
