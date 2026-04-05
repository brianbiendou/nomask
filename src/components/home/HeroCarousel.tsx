"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";

function formatDateShort(dateStr: string, locale: string = "fr") {
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "long",
  });
}

interface HeroCarouselProps {
  articles: ArticleWithRelations[];
  locale?: string;
}

export default function HeroCarousel({ articles, locale = "fr" }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = articles.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play toutes les 8 secondes
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  if (total === 0) return null;

  const article = articles[current];
  const articleUrl = `/${locale}/${article.category?.slug}/${article.slug}`;

  return (
    <div className="relative group/carousel">
      {/* Image + contenu */}
      <Link href={articleUrl} className="block">
        <div className="relative aspect-[16/9] overflow-hidden img-watermark img-watermark-lg">
          {article.image_url && (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 700px"
              priority={current === 0}
            />
          )}
          {/* L-shape border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand" />
          <div className="absolute top-1/3 right-0 bottom-0 w-1 bg-brand" />
          {/* Badge catégorie */}
          {article.category && (
            <div className="absolute top-4 left-4">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand text-white px-2.5 py-1 rounded">
                {article.category.name}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Titre + date */}
      <div className="mt-4">
        <Link href={articleUrl}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-dark leading-tight hover:text-brand transition-colors line-clamp-3 min-h-[4.7rem] md:min-h-[5.625rem] lg:min-h-[7rem]">
            {article.title}
          </h2>
        </Link>
        {article.published_at && (
          <span className="text-xs text-gray-400 mt-2 inline-block">
            {formatDateShort(article.published_at, locale)}
          </span>
        )}
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prev}
        className="absolute top-1/3 left-3 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        aria-label={locale === "en" ? "Previous article" : "Article précédent"}
      >
        <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute top-1/3 right-3 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        aria-label={locale === "en" ? "Next article" : "Article suivant"}
      >
        <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Tirets indicateurs */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-brand" : "w-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Article ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
