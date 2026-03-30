import type { ArticleWithRelations } from "@/types";
import Link from "next/link";

interface MostReadProps {
  articles: ArticleWithRelations[];
}

export default function MostRead({ articles }: MostReadProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-brand mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.1 18.55l-.1.1-.11-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z" />
        </svg>
        Les plus lus
      </h3>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <span className="text-2xl font-black text-gray-200 font-sans shrink-0 w-8 leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {article.category && (
                <span
                  className="text-[10px] font-bold font-sans uppercase tracking-wider"
                  style={{ color: article.category.color }}
                >
                  {article.category.name}
                </span>
              )}
              <Link
                href={`/${article.category?.slug}/${article.slug}`}
                className="block text-sm font-bold text-dark hover:text-brand transition-colors font-sans leading-tight mt-0.5"
              >
                {article.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
