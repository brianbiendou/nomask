'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleWithRelations } from '@/types';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { timeAgo } from '@/lib/utils';

interface NewsCarouselProps {
  articles: ArticleWithRelations[];
  autoPlayInterval?: number;
}

export default function NewsCarousel({
  articles,
  autoPlayInterval = 6000,
}: NewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = articles.length > 0 ? activeIndex % articles.length : 0;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(
        ((index % articles.length) + articles.length) % articles.length
      );
    },
    [articles.length]
  );

  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % articles.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, articles.length, safeIndex]);

  if (!articles.length) return null;

  return (
    <div
      className="relative group rounded-lg overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Articles à la une"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      {articles.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            key={`progress-${safeIndex}`}
            className="h-full bg-red-600 carousel-progress-bar"
            style={{
              animationDuration: isPaused ? '999999s' : `${autoPlayInterval}ms`,
            }}
          />
        </div>
      )}

      {/* Slides */}
      {articles.map((article, index) => {
        const articleUrl = `/${article.category?.slug}/${article.slug}`;
        const isActive = index === safeIndex;

        return (
          <div
            key={article.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} sur ${articles.length}`}
            aria-hidden={!isActive}
            className={`${
              index === 0 ? 'relative' : 'absolute inset-0'
            } transition-opacity duration-700 ease-in-out ${
              isActive
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Link
              href={articleUrl}
              className="block"
              tabIndex={isActive ? 0 : -1}
            >
              <div className="relative aspect-[16/9] md:aspect-[16/10]">
                {article.image_url && (
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority={index < 2}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-12 md:p-6 md:pb-14">
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
          </div>
        );
      })}

      {/* Navigation arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={() => goTo(safeIndex - 1)}
            className="absolute z-20 left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            aria-label="Article précédent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => goTo(safeIndex + 1)}
            className="absolute z-20 right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            aria-label="Article suivant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {articles.length > 1 && (
        <div className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === safeIndex
                  ? 'bg-white w-6 h-2'
                  : 'bg-white/50 hover:bg-white/75 w-2 h-2'
              }`}
              aria-label={`Aller au slide ${i + 1}`}
              aria-current={i === safeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      {/* CSS for progress bar animation */}
      <style>{`
        @keyframes carousel-progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .carousel-progress-bar {
          animation-name: carousel-progress-fill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
