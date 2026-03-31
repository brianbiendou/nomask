import { NextRequest, NextResponse } from "next/server";
import { checkAuth, backendFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { sourceUrl, maxHours = 24 } = body;

  if (!sourceUrl) {
    return NextResponse.json({ error: "sourceUrl requis" }, { status: 400 });
  }

  try {
    const res = await backendFetch("/api/discover", {
      method: "POST",
      body: JSON.stringify({ url: sourceUrl, hours: maxHours }),
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
