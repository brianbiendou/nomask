/**
 * Helper partagé pour les API routes admin.
 * – Vérifie l'auth Supabase
 * – Proxy les requêtes vers le backend Python (FastAPI)
 */
import { createSupabaseServer } from "@/lib/supabase-server";

export async function checkAuth() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

/**
 * Appelle le backend Python et renvoie le JSON.
 */
export async function backendFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BACKEND_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
