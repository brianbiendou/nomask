"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ArticleCard from "@/components/articles/ArticleCard";
import type { ArticleWithRelations } from "@/types";

const ARTICLE_SELECT = `
  *,
  category:categories(*),
  author:authors(*),
  subcategory:subcategories(*)
`;

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const sanitized = q.replace(/[%_]/g, "");
      const { data } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("locale", "fr")
        .or(`title.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`)
        .order("published_at", { ascending: false })
        .limit(20);

      setResults((data as ArticleWithRelations[]) || []);
      setLoading(false);
    };

    search();
  }, [q]);

  return (
    <>
      {q && (
        <p className="text-gray-600 font-sans mb-6">
          {loading
            ? "Recherche en cours..."
            : `${results.length} résultat${results.length !== 1 ? "s" : ""} pour « ${q} »`}
        </p>
      )}

      {!q && (
        <p className="text-gray-500 font-sans">
          Entrez un terme de recherche dans la barre ci-dessus.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {q && !loading && results.length === 0 && (
        <p className="text-gray-500 font-sans">
          Aucun article trouvé. Essayez d&apos;autres mots-clés.
        </p>
      )}
    </>
  );
}
