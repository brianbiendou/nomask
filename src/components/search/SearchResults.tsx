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
  const [recentArticles, setRecentArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les articles récents dès le montage (contenu par défaut quand pas de recherche)
  useEffect(() => {
    const loadRecent = async () => {
      const { data } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("locale", locale)
        .order("published_at", { ascending: false })
        .limit(12);
      setRecentArticles((data as ArticleWithRelations[]) || []);
    };
    loadRecent();
  }, [locale]);

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
  }, [q, locale]);

  // Pas de recherche → afficher les derniers articles
  if (!q.trim()) {
    return (
      <>
        <p className="text-gray-500 font-sans text-sm mb-6">
          {locale === "en"
            ? "Enter a term in the search bar to find articles. Below, our latest publications:"
            : "Entrez un terme dans la barre de recherche pour trouver des articles. Ci-dessous, nos dernières publications :"}
        </p>
        {recentArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <p className="text-gray-600 font-sans mb-6">
        {loading
          ? (locale === "en" ? "Searching..." : "Recherche en cours...")
          : `${results.length} ${locale === "en" ? "result" : "résultat"}${results.length !== 1 ? "s" : ""} ${locale === "en" ? "for" : "pour"} « ${q} »`}
      </p>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <>
          <p className="text-gray-500 font-sans mb-6">
            {locale === "en"
              ? "No articles found for this search. Discover our latest articles:"
              : "Aucun article trouvé pour cette recherche. Découvrez nos derniers articles :"}
          </p>
          {recentArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
