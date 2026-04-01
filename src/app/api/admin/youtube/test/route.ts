import { NextRequest, NextResponse } from "next/server";
import { checkAuth, backendFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const res = await backendFetch("/api/youtube/test", {
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
