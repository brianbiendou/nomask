import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { timeAgo, formatDateShort, formatDateWithTime } from "@/lib/utils";
import {
  Globe,
  Landmark,
  TrendingUp,
  Users,
  Cpu,
  Clapperboard,
  Microscope,
  Trophy,
  Sparkles,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  international: Globe,
  politique: Landmark,
  economie: TrendingUp,
  societe: Users,
  tech: Cpu,
  culture: Clapperboard,
  science: Microscope,
  sport: Trophy,
  style: Sparkles,
};

interface ArticleCardProps {
  article: ArticleWithRelations;
  variant?:
    | "default"
    | "horizontal"
    | "compact"
    | "hero"
    | "sidebar"
    | "news-row"
    | "dark"
    | "recap-first"
    | "recap-text"
    | "actus-row"
    | "actus-featured";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const articleUrl = `/${article.category?.slug}/${article.slug}`;

  /* ==================== HERO : image + bordure L-shape brand ==================== */
  if (variant === "hero") {
    return (
      <article className="group">
        <Link href={articleUrl} className="block">
          {article.image_url && (
            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority
                />
              </div>
              {/* L-shape border: horizontal bottom + vertical right */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand" />
              <div className="absolute top-1/3 right-0 bottom-0 w-1 bg-brand" />
              {article.category && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-brand text-white px-2.5 py-1 rounded">
                    {article.category.name}
                  </span>
                </div>
              )}
            </div>
          )}
        </Link>
        <div className="mt-4">
          <Link href={articleUrl}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-dark leading-tight group-hover:text-brand transition-colors line-clamp-3">
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

  /* ==================== SIDEBAR : petite image + max texte (style Numerama) ==================== */
  if (variant === "sidebar") {
    return (
      <article className="flex gap-3 group">
        <Link href={articleUrl} className="shrink-0">
          {article.image_url && (
            <div className="relative w-28 h-20 sm:w-32 sm:h-24 overflow-hidden rounded">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="128px"
              />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <Link
            href={articleUrl}
            className="text-[15px] font-bold text-dark hover:text-brand transition-colors line-clamp-4 leading-snug"
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

  /* ==================== DARK : carte style Numerama (date, categ+icone, titre gros) ==================== */
  if (variant === "dark") {
    const CatIcon = article.category?.slug
      ? CATEGORY_ICONS[article.category.slug]
      : null;
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
          {article.published_at && (
            <span className="text-[11px] text-gray-400 block mb-1">
              {formatDateWithTime(article.published_at)}
            </span>
          )}
          {article.category && (
            <span className="text-[12px] font-semibold text-brand mb-1.5 flex items-center gap-1.5">
              {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
              {article.category.name}
            </span>
          )}
          <Link href={articleUrl}>
            <h3 className="text-lg font-bold text-white hover:text-brand transition-colors line-clamp-4 leading-snug">
              {article.title}
            </h3>
          </Link>
        </div>
      </article>
    );
  }

  /* ==================== RECAP-FIRST : image + titre (premier article du recap) ==================== */
  if (variant === "recap-first") {
    return (
      <article className="group mb-4">
        <Link href={articleUrl} className="block">
          {article.image_url && (
            <div className="relative aspect-[4/3] overflow-hidden rounded mb-3">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          )}
        </Link>
        <Link href={articleUrl}>
          <h3 className="text-[15px] font-bold text-dark hover:text-brand transition-colors line-clamp-3 leading-snug">
            {article.title}
          </h3>
        </Link>
      </article>
    );
  }

  /* ==================== RECAP-TEXT : titre seul (articles suivants du recap) ==================== */
  if (variant === "recap-text") {
    return (
      <article className="group py-3 border-b border-gray-100 last:border-0">
        <Link href={articleUrl}>
          {article.category && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: article.category.color }}
            >
              {article.category.name}
            </span>
          )}
          <h3 className="text-[14px] font-bold text-dark hover:text-brand transition-colors line-clamp-3 leading-snug mt-0.5">
            {article.title}
          </h3>
        </Link>
      </article>
    );
  }

  /* ==================== ACTUS-ROW : image carree + tags + titre + date (dernières actus) ==================== */
  if (variant === "actus-row") {
    return (
      <article className="flex gap-4 group py-4 border-b border-gray-100 last:border-0">
        <Link href={articleUrl} className="shrink-0">
          {article.image_url && (
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 overflow-hidden rounded">
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
        <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
          {article.category && (
            <span className="text-[11px] text-gray-400">
              {article.category.name}
            </span>
          )}
          <Link
            href={articleUrl}
            className="text-[15px] font-bold text-dark hover:text-brand transition-colors line-clamp-3 leading-snug"
          >
            {article.title}
          </Link>
          {article.published_at && (
            <span className="text-[11px] text-gray-400">
              {formatDateWithTime(article.published_at)}
            </span>
          )}
        </div>
      </article>
    );
  }

  /* ==================== ACTUS-FEATURED : image avec titre superposé en bas ==================== */
  if (variant === "actus-featured") {
    return (
      <article className="group relative">
        <Link href={articleUrl} className="block">
          {article.image_url && (
            <div className="relative aspect-[16/9] overflow-hidden rounded">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          )}
        </Link>
        <div className="relative -mt-6 ml-4 z-10">
          <Link href={articleUrl}>
            <h3 className="inline bg-white px-2 py-1 text-xl font-black text-brand leading-tight hover:text-brand-dark transition-colors decoration-2">
              {article.title.length > 50 ? article.title.slice(0, 50) + "\u2026" : article.title}
            </h3>
          </Link>
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
