import {
  getArticles,
  getBreakingNews,
  getMostRecentArticles,
  getArticlesByCategory,
  getArticlesBySubcategory,
} from "@/lib/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import Link from "next/link";
import type { ArticleWithRelations } from "@/types";
import { formatDateShort, formatDateWithTime } from "@/lib/utils";

export const revalidate = 300;

export default async function HomePage() {
  const [
    breakingNews,
    latestArticles,
    mostRecent,
    techArticles,
    sportArticles,
    economieArticles,
    buyingGuides,
  ] = await Promise.all([
    getBreakingNews(),
    getArticles({ limit: 30 }),
    getMostRecentArticles("fr", 30),
    getArticlesByCategory("tech", "fr", 4),
    getArticlesByCategory("sport", "fr", 3),
    getArticlesByCategory("economie", "fr", 3),
    getArticlesBySubcategory("tech", "guides-achat", "fr", 4),
  ]);

  // Chronologique : hero = le + récent, sidebar = 3 suivants, etc.
  const heroArticle = latestArticles[0];
  const sidebarArticles = latestArticles.slice(1, 4);

  // "À lire absolument" = les 3 suivants
  const mustReadArticles = latestArticles.slice(4, 7);

  // NoMask+ = les 3 suivants
  const topIds = new Set(latestArticles.slice(0, 10).map((a) => a.id));
  const plusArticles = latestArticles.slice(7, 10);

  // Toute l'actualité = le reste (dédupliqué)
  const allNewsArticles = mostRecent.filter((a) => !topIds.has(a.id));

  // Trending tags
  const trendingTopics =
    breakingNews.length > 0
      ? breakingNews.map((a) => ({ title: a.title, url: `/${a.category?.slug}/${a.slug}` }))
      : latestArticles.slice(0, 5).map((a) => ({ title: a.title, url: `/${a.category?.slug}/${a.slug}` }));

  return (
    <div className="min-h-screen">
      {/* ======= HERO SECTION ======= */}
      <section className="max-w-255 mx-auto px-4 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article principal (gauche - 2 colonnes) */}
          <div className="lg:col-span-2">
            {heroArticle && <ArticleCard article={heroArticle} variant="hero" />}
          </div>

          {/* Sidebar droite (1 colonne) : articles + pub */}
          <div className="flex flex-col gap-4">
            {sidebarArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="sidebar" />
            ))}
            {/* Placeholder publicité (droite) */}
            <div className="border-2 border-red-500 rounded-lg flex items-center justify-center h-48 mt-2">
              <span className="text-red-400 text-sm font-medium">Espace publicitaire</span>
            </div>
          </div>
        </div>

        {/* Placeholder publicité (en dessous du hero) */}
        <div className="border-2 border-red-500 rounded-lg flex items-center justify-center h-32 mt-8 max-w-2xl mx-auto">
          <span className="text-red-400 text-sm font-medium">Espace publicitaire</span>
        </div>
      </section>

      {/* ======= TRENDING BAR ======= */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-255 mx-auto px-4 py-3 flex items-center gap-5 overflow-x-auto hide-scrollbar">
          {/* Icone NoMask en losange */}
          <span className="shrink-0 relative w-8 h-8 flex items-center justify-center">
            <span className="absolute inset-0 bg-brand rounded-sm rotate-45" />
            <span className="relative text-white font-black text-xs z-10">N</span>
          </span>
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
            {trendingTopics.slice(0, 3).map((topic, i) => (
              <Link
                key={i}
                href={topic.url}
                className="shrink-0 text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-2"
              >
                <span className="text-brand text-lg leading-none">&bull;</span>
                {topic.title.length > 45 ? topic.title.slice(0, 45) + "\u2026" : topic.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= À LIRE ABSOLUMENT ======= */}
      <section className="bg-section-dark py-10">
        <div className="max-w-255 mx-auto px-4">
          <SectionTitle title="À lire absolument" light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {mustReadArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="dark" />
            ))}
          </div>
        </div>
      </section>

      {/* ======= LE RÉCAP + DERNIÈRES ACTUS (style Numerama) ======= */}
      <section className="max-w-255 mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
          {/* Colonne gauche : Le récap (étroite) */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-black uppercase tracking-wide text-dark">
                Le <span className="text-brand">r&eacute;cap&apos;</span>
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {/* Premier article avec image */}
            {latestArticles[0] && (
              <ArticleCard article={latestArticles[0]} variant="recap-first" />
            )}
            {/* Articles texte uniquement */}
            <div className="space-y-0">
              {latestArticles.slice(1, 7).map((article) => (
                <ArticleCard key={article.id} article={article} variant="recap-text" />
              ))}
            </div>
            {/* Bloc réseaux sociaux */}
            <div className="mt-6 border-2 border-brand rounded-lg p-4 text-center">
              <p className="text-sm font-bold text-dark mb-3">Retrouvez NoMask sur</p>
              <div className="flex items-center justify-center gap-4">
                <a href="#" className="text-gray-500 hover:text-brand transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand transition-colors" aria-label="X (Twitter)">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="/rss.xml" className="text-gray-500 hover:text-brand transition-colors" aria-label="RSS">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.098-15.772-15.839-15.82zm0-8.18v4.819c12.951.063 23.403 10.532 23.466 23.181h4.534c-.064-15.346-12.645-27.808-28-27.999z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Colonne droite : Les dernières actus (large) */}
          <div>
            <SectionTitle title="Les dernières actus" />
            {/* 2 premiers articles */}
            <div className="mt-4 space-y-0">
              {mostRecent.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} variant="actus-row" />
              ))}
            </div>
            {/* Séparateur L-shape + titre section */}
            <div className="relative mt-4 mb-2 pl-4 pt-4 border-l-[3px] border-brand border-t-[3px]">
              <h3 className="text-xl font-black text-brand italic leading-tight">
                Ce qu&apos;il ne fallait pas manquer
              </h3>
            </div>
            {/* 4 articles suivants */}
            <div className="space-y-0">
              {mostRecent.slice(2, 6).map((article) => (
                <ArticleCard key={article.id} article={article} variant="actus-row" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= ESPACE PUBLICITAIRE ======= */}
      <section className="py-8">
        <div className="max-w-255 mx-auto px-4 flex justify-center">
          <div className="w-full max-w-2xl bg-brand/10 border border-brand/30 rounded-md py-4 px-6 flex items-center justify-center">
            <span className="bg-brand text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mr-3">
              Publicité
            </span>
            <span className="text-sm text-gray-500">Espace publicitaire</span>
          </div>
        </div>
      </section>

      {/* ======= NOS VIDÉOS ======= */}
      <section className="w-full pt-10 pb-16 overflow-hidden">
        <div className="max-w-255 mx-auto px-4 relative">
          
          {/* Title Row */}
          <div className="flex items-center mb-10 w-full relative z-20">
            <div className="flex items-center pr-4 bg-white">
              {/* Brand overlapping shapes */}
              <div className="flex flex-col mr-3 gap-0.5">
                <div className="flex gap-0.5">
                  <span className="w-3 h-3 bg-brand" />
                  <span className="w-3 h-3 bg-brand" />
                </div>
                <div className="flex gap-0.5">
                  <span className="w-3 h-3 bg-transparent" />
                  <span className="w-3 h-3 bg-brand" />
                </div>
              </div>
              <h2 className="text-[26px] font-black tracking-tight text-gray-900">Nos vidéos</h2>
            </div>
            {/* Faint connecting line */}
            <div className="flex-grow h-px bg-gray-200"></div>
            <div className="pl-4 bg-white">
               <a href="#" className="flex items-center gap-1 text-[13px] font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-wider relative group">
                 <span className="pb-0.5 border-b-[1.5px] border-brand group-hover:border-brand-dark">Voir toutes les vidéos</span>
                 <span className="text-xl font-light leading-none -mt-0.5">+</span>
               </a>
            </div>
          </div>

          {/* Videos Wrapper (with dark band behind) */}
          <div className="relative mt-4">
            {/* The absolute full-bleed dark background */}
            {/* 12% top means ~20% of the top video is exposed above it. 12% bottom ends exactly in the middle of bottom videos. */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[100vw] bg-[#212121] z-0" style={{ top: '12%', bottom: '12%' }}>
               {/* Central Radial Glow to highlight videos */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[100%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_50%)] pointer-events-none"></div>
            </div>

            {/* Decorative Triangles (anchored to the wrapper) */}
            <svg viewBox="0 0 100 100" className="absolute -left-28 -top-[2%] w-48 h-48 text-brand z-10 pointer-events-none opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M45 15 L90 85 A5 5 0 0 1 85 90 L15 90 A5 5 0 0 1 10 85 Z" strokeLinejoin="round" strokeLinecap="round" transform="rotate(-15 50 50)" />
            </svg>
            
            <div className="absolute -right-24 top-[40%] flex z-10 pointer-events-none items-center">
               <svg viewBox="0 0 24 24" className="w-[85px] h-[85px] text-[#212121] fill-current stroke-brand stroke-1 -mr-12">
                 <polygon points="6,4 18,12 6,20" strokeLinejoin="round" />
               </svg>
               <svg viewBox="0 0 24 24" className="w-[85px] h-[85px] text-brand fill-current drop-shadow-[0_0_15px_rgba(232,77,14,0.5)]">
                 <polygon points="6,4 18,12 6,20" strokeLinejoin="round" />
               </svg>
            </div>

            <svg viewBox="0 0 24 24" className="absolute -left-16 bottom-[15%] w-[70px] h-[70px] text-[#212121] fill-current stroke-brand stroke-[1.5] drop-shadow-[0_0_12px_rgba(232,77,14,0.6)] z-10 pointer-events-none">
              <polygon points="4,20 12,4 20,20" strokeLinejoin="round" transform="rotate(-25 12 12)" />
            </svg>

            {/* Content Over Dark Band */}
            <div className="relative z-20 w-full flex flex-col pt-0 pb-0">
               
               {/* MAIN VIDEO CARD */}
               <div className="w-full relative">
                 {/* Reverted to exact aspect-video so it's not overly wide ("trop gros horizontalement") */}
                 <div className="aspect-video w-full bg-[#0a0a0a] rounded flex items-center justify-center relative overflow-hidden group cursor-pointer border-b-2 border-black/50 shadow-2xl">
                   {/* Play Button Solid Circle */}
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-[#333333]/90 rounded-full flex items-center justify-center group-hover:bg-[#444444]/90 transition-all duration-300">
                     <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                       <polygon points="6,4 20,12 6,20" />
                     </svg>
                   </div>
                   {/* Top Right Logo pseudo-element (stylized N box like the image) */}
                   <div className="absolute top-4 right-5 text-brand opacity-80 backdrop-blur-sm border-[1px] border-brand rounded px-2 py-1 flex items-center justify-center">
                     <span className="text-brand font-black text-sm mb-0.5">N</span>
                   </div>
                 </div>

                 {/* Main Title and Meta (Placed below video) */}
                 <div className="mt-5 px-1 mb-8 max-w-4xl">
                   <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase mb-2">
                     <svg className="w-3.5 h-3.5 text-brand" viewBox="0 0 24 24" fill="currentColor">
                       <polygon points="6,4 20,12 6,20" />
                     </svg>
                     <span>Catégorie vidéo</span>
                   </div>
                   <h3 className="text-white text-2xl md:text-[28px] lg:text-[30px] font-black leading-[1.1] tracking-tight hover:text-gray-200 cursor-pointer">
                     Titre de la vidéo principale à venir : un contenu exclusif et très impactant
                   </h3>
                 </div>
               </div>

               {/* 2 SMALL VIDEOS GRIDS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
                 {/* Small Video 1 */}
                 <div className="aspect-video w-full bg-[#0a0a0a] rounded flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#333333]/90 rounded-full flex items-center justify-center group-hover:bg-[#444444]/90 transition-all duration-300">
                     <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                       <polygon points="6,4 20,12 6,20" />
                     </svg>
                   </div>
                   <div className="absolute top-3 right-3 text-brand border-[1px] border-brand rounded px-1.5 py-0.5">
                     <span className="text-brand font-black text-[10px]">N</span>
                   </div>
                 </div>

                 {/* Small Video 2 */}
                 <div className="aspect-video w-full bg-[#0a0a0a] rounded flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#333333]/90 rounded-full flex items-center justify-center group-hover:bg-[#444444]/90 transition-all duration-300">
                     <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                       <polygon points="6,4 20,12 6,20" />
                     </svg>
                   </div>
                   <div className="absolute top-3 right-3 text-brand border-[1px] border-brand rounded px-1.5 py-0.5">
                     <span className="text-brand font-black text-[10px]">N</span>
                   </div>
                 </div>
               </div>
               
            </div>
          </div>

          {/* Small Videos Titles (Sitting cleanly on the WHITE BACKGROUND below) */}
          {/* Matches the grid gap above exactly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full mt-4 !px-1">
              <h4 className="text-gray-900 text-[15px] font-bold leading-snug hover:text-brand cursor-pointer">
                L'enfer des arnaques en ligne : pourquoi le pire est encore à venir quand on s'y attend le moins
              </h4>
              <h4 className="text-gray-900 text-[15px] font-bold leading-snug">
                Revenir sur la Lune n'a jamais été aussi risqué : analyse des nouveaux défis spatiaux
              </h4>
          </div>

        </div>
      </section>

      {/* ======= NOS ARTICLES NOMASK+ ======= */}
      <section className="w-full bg-white pt-10 pb-16 overflow-hidden">
        <div className="max-w-255 mx-auto px-4 relative">
          
          {/* NOS ARTICLES NOMASK+ TITLE */}
          <div className="flex items-center mb-10 w-full relative z-20 overflow-visible">
            {/* The faded yellow cross behind */}
            <div className="absolute right-[10%] -top-10 text-[#f4f7c5] pointer-events-none z-0">
               <svg width="140" height="140" viewBox="0 0 100 100" fill="currentColor">
                 <path d="M35 0 H65 V35 H100 V65 H65 V100 H35 V65 H0 V35 H35 Z" />
               </svg>
            </div>
            {/* Outline triangle on the left */}
            <div className="absolute -left-16 -top-2 text-brand pointer-events-none z-0">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" transform="rotate(15)">
                <path d="M50 5 L90 85 H10 Z" />
              </svg>
            </div>

            <div className="flex items-center pr-4 bg-white relative z-10">
              <div className="flex mr-2 mt-1">
                {/* Tilted square */}
                <div className="w-4 h-4 bg-brand rotate-45" />
              </div>
              <h2 className="text-[28px] font-black tracking-tight text-gray-900">Nos articles <span className="text-gray-900">No</span><span className="text-brand">Mask+</span></h2>
            </div>
            
            <div className="flex-grow h-[1px] bg-gray-200 relative z-10"></div>
            
            <div className="pl-4 bg-white/80 backdrop-blur-sm relative z-10">
               <a href="#" className="flex items-center gap-1 text-[13px] font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-wider group relative">
                 <span className="pb-0.5 border-b-[1.5px] border-brand group-hover:border-brand-dark">Voir tous les articles</span>
                 <span className="text-xl font-light leading-none -mt-0.5">+</span>
               </a>
            </div>
          </div>

          {/* ARTICLES LIST */}
          <div className="flex flex-col gap-4 w-full">
            {plusArticles.map((article, index) => {
              const isLeftText = index === 1;

              return (
                <div key={article.id} className="relative w-full h-[160px] md:h-[176px] group overflow-hidden bg-gray-200 flex items-stretch">
                  {/* Full-width background image */}
                  <img 
                    src={article.image_url || '/placeholder.jpg'} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Overlapping grayish-blue container */}
                  <div className={`absolute top-0 bottom-0 ${isLeftText ? 'left-0 w-[65%]' : 'right-0 w-[65%]'} bg-[#303440]/[0.94] z-10 flex flex-col justify-center px-8 md:px-12`}>
                     {/* Title area */}
                     <div className="flex items-start gap-3">
                        {/* Yellow diamond icon with cross */}
                        <div className="mt-1.5 flex-shrink-0">
                           <svg className="w-[16px] h-[16px] text-[#dee042]" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M12 2 L22 12 L12 22 L2 12 Z" />
                             <path d="M11 9 h2 v2 h2 v2 h-2 v2 h-2 v-2 H9 v-2 h2 z" fill="#303440" />
                           </svg>
                        </div>
                        <a href={`/${article.category?.slug}/${article.slug}`} className="hover:text-brand transition-colors">
                          <h3 className="text-white text-lg md:text-[22px] font-black leading-[1.2] tracking-tight line-clamp-3">
                            {article.title}
                          </h3>
                        </a>
                     </div>

                     {/* Author + date */}
                     <div className="flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-500">
                          {article.author?.avatar_url ? (
                            <img src={article.author.avatar_url} alt={article.author?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-500" />
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-x-2 text-[13px]">
                          <span className="text-[#ff6a39] font-bold">
                            {article.author?.name || 'Rédaction'}
                          </span>
                          <span className="text-gray-300 font-medium">
                            Publié le {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : '—'}
                          </span>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======= THÉMATIQUES (Sport, Économie, Sciences) ======= */}
      <section className="bg-[#f7f8fa] py-10 border-t border-gray-200">
        <div className="max-w-255 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ThemeColumn
              title="sport"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /><circle cx="12" cy="12" r="4" /></svg>}
              slug="sport"
              articles={sportArticles}
            />
            <ThemeColumn
              title="économie"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
              slug="economie"
              articles={economieArticles}
            />
            <ThemeColumn
              title="sciences"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4c0 4 4 6 4 6s4-2 4-6a4 4 0 0 0-4-4z" /><path d="M12 12v10" /><path d="M8 18c-2 0-4-1-4-3 0-1.5 1.5-3 4-3" /><path d="M16 18c2 0 4-1 4-3 0-1.5-1.5-3-4-3" /></svg>}
              slug="tech"
              articles={techArticles}
            />
          </div>
        </div>
      </section>

      {/* ======= TOUTE L'ACTUALITÉ ======= */}
      <section className="max-w-255 mx-auto px-4 py-10">
        <h2 className="text-[30px] font-black tracking-tight text-gray-900 mb-8">Toute l'actualité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            {allNewsArticles.slice(0, 5).map((article, idx) => (
              <div key={article.id}>
                {/* L-shape "Jackpot !" badge before the 2nd article */}
                {idx === 1 && (
                  <div className="relative mt-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 pl-3 pb-2 border-l-[3px] border-b-[3px] border-[#e85d99] rounded-bl-sm">
                      <span className="text-[#e85d99] text-[22px] font-black uppercase tracking-tight">Jackpot !</span>
                    </div>
                  </div>
                )}
                <Link href={`/${article.category?.slug}/${article.slug}`} className="flex gap-4 group py-3 border-b border-gray-100 last:border-0">
                  <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden bg-gray-100">
                    <img
                      src={article.image_url || '/placeholder.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      {article.category?.name}
                    </p>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand transition-colors">
                      {article.title}
                    </h3>
                    {article.published_at && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {formatDateWithTime(article.published_at)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            {allNewsArticles.slice(5, 10).map((article, idx) => (
              <div key={article.id}>
                {/* L-shape "Pepites" badge before the 2nd article in right column (4th overall) */}
                {idx === 2 && (
                  <div className="relative mt-2 mb-3 flex justify-end">
                    <div className="inline-flex items-center gap-1.5 pr-3 pb-2 border-r-[3px] border-b-[3px] border-[#e85d99] rounded-br-sm">
                      <span className="text-[#e85d99] text-[22px] font-black uppercase tracking-tight">Pépites</span>
                    </div>
                  </div>
                )}
                <Link href={`/${article.category?.slug}/${article.slug}`} className="flex gap-4 group py-3 border-b border-gray-100 last:border-0">
                  <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden bg-gray-100">
                    <img
                      src={article.image_url || '/placeholder.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">
                      {article.category?.name}
                    </p>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand transition-colors">
                      {article.title}
                    </h3>
                    {article.published_at && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {formatDateWithTime(article.published_at)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= NOS SÉLECTIONS TESTÉES (fond sombre) ======= */}
      <section className="bg-section-dark py-10">
        <div className="max-w-255 mx-auto px-4">
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-[26px] font-black text-white tracking-tight">
              <span className="text-[#8b8cf8]">🏷️</span> Nos sélections testées
            </h2>
            <Link
              href="/tech"
              className="text-sm text-gray-400 hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5 mt-1.5"
            >
              Voir tous les guides <span className="inline-block ml-0.5">+</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {buyingGuides.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                href={`/${article.category?.slug}/${article.slug}`}
                className="flex gap-5 group"
              >
                <div className="w-[160px] h-[110px] flex-shrink-0 overflow-hidden bg-gray-700 rounded-sm">
                  <img
                    src={article.image_url || '/placeholder.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-[#c5c6f7] leading-snug line-clamp-3 group-hover:text-white transition-colors">
                    {article.title}
                  </h3>
                  {article.published_at && (
                    <p className="text-[12px] text-gray-500 mt-2">
                      {formatDateWithTime(article.published_at)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* ---- Sous-composants ---- */

function SectionTitle({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className={`text-lg font-black uppercase tracking-wide ${
          light ? "text-white" : "text-dark"
        }`}
      >
        {title}
      </h2>
      <div className={`flex-1 h-px ${light ? "bg-gray-600" : "bg-gray-200"}`} />
    </div>
  );
}

function ThemeColumn({
  title,
  icon,
  slug,
  articles,
}: {
  title: string;
  icon: React.ReactNode;
  slug: string;
  articles: ArticleWithRelations[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-brand">{icon}</span>
        <h3 className="text-[22px] font-black text-brand lowercase tracking-tight">{title}</h3>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.category?.slug}/${article.slug}`}
            className="block group"
          >
            <div className="flex items-start gap-2">
              <span className="mt-[7px] w-[6px] h-[6px] rounded-full bg-brand flex-shrink-0" />
              <h4 className="text-[14px] text-gray-800 font-semibold group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
            </div>
            {article.published_at && (
              <p className="text-[11px] text-gray-400 mt-1 ml-[14px]">
                {formatDateWithTime(article.published_at)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
