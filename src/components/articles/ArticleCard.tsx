import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { timeAgo, formatDateShort } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleWithRelations;
  variant?:
    | "default"
    | "horizontal"
    | "compact"
    | "hero"
    | "sidebar"
    | "news-row"
    | "dark";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const articleUrl = `/${article.category?.slug}/${article.slug}`;

  /* ==================== HERO : image + titre avec accent bleu ==================== */
  if (variant === "hero") {
    return (
      <article className="group">
        <Link href={articleUrl} className="block">
          {article.image_url && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 700px"
                priority
              />
              {article.category && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded">
                    {article.category.name}
                  </span>
                </div>
              )}
            </div>
          )}
        </Link>
        <div className="mt-4 pl-4 border-l-4 border-blue-600">
          <Link href={articleUrl}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-dark leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
              {article.title}
            </h2>
          </Link>
          {article.published_at && (
            <span className="text-xs text-gray-400 mt-2 inline-block">
              {formatDateShort(article.published_at)}
            </span>
          )}
        </div>
      </article>
    );
  }

  /* ==================== SIDEBAR : image + title + date (plus grand) ==================== */
  if (variant === "sidebar") {
    return (
      <article className="flex gap-4 group">
        <Link href={articleUrl} className="shrink-0">
          {article.image_url && (
            <div className="relative w-44 h-28 sm:w-52 sm:h-32 overflow-hidden rounded">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="208px"
              />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          <Link
            href={articleUrl}
            className="text-[15px] font-bold text-dark hover:text-blue-600 transition-colors line-clamp-3 leading-snug"
          >
            {article.title}
          </Link>
          {article.published_at && (
            <span className="text-[11px] text-gray-400 mt-1.5">
              {formatDateShort(article.published_at)}
            </span>
          )}
        </div>
      </article>
    );
  }

  /* ==================== NEWS-ROW : image + category + title + date (horizontal) ==================== */
  if (variant === "news-row") {
    return (
      <article className="flex gap-4 group py-4 border-b border-gray-100 last:border-0">
        <Link href={articleUrl} className="shrink-0">
          {article.image_url && (
            <div className="relative w-36 h-24 sm:w-44 sm:h-28 overflow-hidden rounded">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="176px"
              />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-center min-w-0 gap-1">
          {article.category && (
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: article.category.color }}
            >
              {article.category.name}
            </span>
          )}
          <Link
            href={articleUrl}
            className="text-[15px] font-bold text-dark hover:text-brand transition-colors line-clamp-2 leading-snug"
          >
            {article.title}
          </Link>
          {article.published_at && (
            <span className="text-[11px] text-gray-400">
              {timeAgo(article.published_at)}
            </span>
          )}
        </div>
      </article>
    );
  }

  /* ==================== DARK : carte sur fond sombre ==================== */
  if (variant === "dark") {
    return (
      <article className="group">
        <Link href={articleUrl} className="block">
          {article.image_url && (
            <div className="relative aspect-16/10 overflow-hidden rounded mb-3">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>
          )}
        </Link>
        <div>
          {article.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand mb-1 inline-block">
              {article.category.name}
            </span>
          )}
          <Link href={articleUrl}>
            <h3 className="text-base font-bold text-white hover:text-brand transition-colors line-clamp-2 leading-tight mb-1">
              {article.title}
            </h3>
          </Link>
          {article.published_at && (
            <span className="text-[11px] text-gray-400">
              {formatDateShort(article.published_at)}
            </span>
          )}
        </div>
      </article>
    );
  }

  /* ==================== HORIZONTAL ==================== */
  if (variant === "horizontal") {
    return (
      <article className="flex gap-4 group">
        <Link href={articleUrl} className="shrink-0">
          {article.image_url && (
            <div className="relative w-32 h-20 sm:w-40 sm:h-24 overflow-hidden rounded-md">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="160px"
              />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          <Link
            href={articleUrl}
            className="text-sm font-bold text-dark hover:text-brand transition-colors line-clamp-2 leading-tight"
          >
            {article.title}
          </Link>
          <span className="text-xs text-gray-500 mt-1">
            {article.read_time} min de lecture
          </span>
        </div>
      </article>
    );
  }

  /* ==================== COMPACT ==================== */
  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={articleUrl}>
          <h3 className="text-sm font-bold text-dark hover:text-brand transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
        </Link>
      </article>
    );
  }

  /* ==================== DEFAULT ==================== */
  return (
    <article className="group">
      <Link href={articleUrl} className="block">
        {article.image_url && (
          <div className="relative aspect-16/10 overflow-hidden rounded-md mb-3">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
      </Link>
      <div>
        {article.category && (
          <div className="mb-2">
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
              color={article.category.color}
            />
          </div>
        )}
        <Link href={articleUrl}>
          <h3 className="text-lg font-bold text-dark hover:text-brand transition-colors line-clamp-2 leading-tight mb-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{article.read_time} min de lecture</span>
          {article.published_at && (
            <>
              <span>•</span>
              <span>{timeAgo(article.published_at)}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
