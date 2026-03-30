import type { ArticleWithRelations } from "@/types";
import { formatTime } from "@/lib/utils";
import Link from "next/link";

interface LiveTickerProps {
  articles: ArticleWithRelations[];
}

export default function LiveTicker({ articles }: LiveTickerProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
        </span>
        <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-brand">
          Direct
        </h3>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <span className="text-xs font-bold text-brand font-sans shrink-0 pt-0.5">
              {article.published_at && formatTime(article.published_at)}
            </span>
            <Link
              href={`/${article.category?.slug}/${article.slug}`}
              className="text-sm font-medium text-dark hover:text-brand transition-colors font-sans leading-tight"
            >
              {article.title}
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/international"
        className="block mt-4 text-center text-xs font-bold font-sans uppercase tracking-wider text-brand border border-brand rounded-md py-2 hover:bg-brand hover:text-white transition-colors"
      >
        Voir toute l&apos;actualité
      </Link>
    </div>
  );
}
