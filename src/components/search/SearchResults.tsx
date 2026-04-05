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

export default function SearchResults({ locale = "fr" }: { locale?: string }) {
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
        .eq("locale", locale)
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
            ? (locale === "en" ? "Searching..." : "Recherche en cours...")
            : `${results.length} ${locale === "en" ? "result" : "résultat"}${results.length !== 1 ? "s" : ""} ${locale === "en" ? "for" : "pour"} « ${q} »`}
        </p>
      )}

      {!q && (
        <p className="text-gray-500 font-sans">
          {locale === "en" ? "Enter a search term in the bar above." : "Entrez un terme de recherche dans la barre ci-dessus."}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}

      {q && !loading && results.length === 0 && (
        <p className="text-gray-500 font-sans">
          {locale === "en" ? "No articles found. Try other keywords." : "Aucun article trouvé. Essayez d'autres mots-clés."}
        </p>
      )}
    </>
  );
}
