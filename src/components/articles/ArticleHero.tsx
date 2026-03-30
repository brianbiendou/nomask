import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { timeAgo } from "@/lib/utils";

interface ArticleHeroProps {
  article: ArticleWithRelations;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  const articleUrl = `/${article.category?.slug}/${article.slug}`;

  return (
    <article className="relative group">
      <Link href={articleUrl} className="block">
        <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-lg">
          {article.image_url && (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Contenu sur l'image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              {article.category && (
                <CategoryBadge
                  name={`À LA UNE • ${article.category.name}`}
                  slug={article.category.slug}
                  color={article.category.color}
                  size="md"
                  asSpan
                />
              )}
              {article.published_at && (
                <span className="text-xs text-gray-300 font-sans">
                  {timeAgo(article.published_at)}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
              {article.title}
            </h2>
            <p className="text-sm md:text-base text-gray-200 line-clamp-2 max-w-2xl">
              {article.excerpt}
            </p>
            {article.author && (
              <div className="flex items-center gap-3 mt-4">
                {article.author.avatar_url && (
                  <Image
                    src={article.author.avatar_url}
                    alt={article.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <span className="text-sm font-medium text-white font-sans">
                    {article.author.name}
                  </span>
                  <span className="block text-xs text-gray-400 font-sans">
                    {article.author.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
