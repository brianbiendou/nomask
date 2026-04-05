"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Search,
  X,
  UserCircle,
  Menu,
  ChevronDown,
} from "lucide-react";
import type { Locale, Dictionary } from "@/i18n";

const NAV_ICONS: Record<string, typeof Globe> = {
  actus: Globe,
  politique: Landmark,
  economie: TrendingUp,
  societe: Users,
  tech: Cpu,
  culture: Clapperboard,
  science: Microscope,
  sport: Trophy,
  style: Sparkles,
};

const CATEGORY_HREFS: Record<string, string> = {
  actus: "/international",
  politique: "/politique",
  economie: "/economie",
  societe: "/societe",
  tech: "/tech",
  culture: "/culture",
  science: "/science",
  sport: "/sport",
  style: "/style",
};

const CATEGORY_KEYS = ["actus", "politique", "economie", "societe", "tech", "culture", "science", "sport", "style"] as const;

/* ─── Language Switcher ─── */
function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchTo = (target: Locale) => {
    setOpen(false);
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    const segments = pathname.split("/");
    if (segments[1] === "fr" || segments[1] === "en") {
      segments[1] = target;
    }
    router.push(segments.join("/"));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-600 hover:text-brand transition-colors rounded"
        aria-label="Language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium uppercase">{locale}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[130px]">
          <button
            onClick={() => switchTo("fr")}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === "fr" ? "font-bold text-brand" : "text-gray-700"}`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => switchTo("en")}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === "en" ? "font-bold text-brand" : "text-gray-700"}`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Header ─── */
interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const navItems = CATEGORY_KEYS.map((key) => ({
    name: dict.nav.categories[key],
    href: `/${locale}${CATEGORY_HREFS[key]}`,
    Icon: NAV_ICONS[key],
  }));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/brian/biendou/admin");
  const [isScrolled, setIsScrolled] = useState(isAdmin);
  const isScrolledRef = useRef(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      setIsScrolled(true);
      isScrolledRef.current = true;
      return;
    }
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!isScrolledRef.current && currentY > 50) {
        isScrolledRef.current = true;
        setIsScrolled(true);
      } else if (isScrolledRef.current && currentY < 10) {
        isScrolledRef.current = false;
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin, pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm overflow-visible">
      {/* Row 1: Logo + actions (hides on scroll) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isScrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-24"
        }`}
      >
        <div className="max-w-255 mx-auto px-4 flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <span className="text-5xl font-black tracking-tight lowercase">
              <span className="text-brand">no</span>
              <span className="text-dark">mask</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isSearchOpen && !isScrolled ? (
              <form action={`/${locale}/recherche`} method="get" className="flex items-center">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.nav.searchPlaceholder}
                  className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:border-brand"
                  autoFocus
                />
                <button type="submit" title={dict.nav.search} className="px-3 py-1.5 bg-brand text-white rounded-r-md hover:bg-brand-dark">
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              !isScrolled && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-500 hover:text-brand transition-colors"
                  aria-label={dict.nav.search}
                >
                  <Search className="w-5 h-5" />
                </button>
              )
            )}

            {!isScrolled && (
              <>
                <LanguageSwitcher locale={locale} />
                <button className="p-2 text-gray-500 hover:text-brand transition-colors" aria-label={dict.nav.login}>
                  <UserCircle className="w-5 h-5" />
                </button>
                <Link
                  href={`/${locale}/abonner`}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-dark transition-colors"
                >
                  {dict.nav.subscribe}
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand"
              aria-label={dict.nav.menu}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation */}
      <nav className="hidden lg:block border-b border-gray-200 bg-white overflow-visible">
        <div className="max-w-255 mx-auto px-4 flex items-center h-11 overflow-visible">
          {isScrolled && (
            <Link href={`/${locale}`} className="flex items-center shrink-0 mr-4">
              <span className="text-2xl font-black tracking-tight lowercase">
                <span className="text-brand">no</span>
                <span className="text-dark">mask</span>
              </span>
            </Link>
          )}

          <div className={`flex-1 flex items-center ${isScrolled ? "justify-center gap-0.5" : "justify-start gap-1"}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 py-1.5 text-sm font-normal text-gray-700 hover:text-brand hover:bg-gray-50 rounded transition-colors whitespace-nowrap ${isScrolled ? "px-1.5" : "px-2.5"}`}
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                <item.Icon className="w-4 h-4 opacity-60" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {isScrolled && (
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                aria-label={dict.nav.search}
              >
                <Search className="w-4 h-4" />
              </button>
              <LanguageSwitcher locale={locale} />
              <button className="p-1.5 text-gray-500 hover:text-brand transition-colors" aria-label={dict.nav.login}>
                <UserCircle className="w-4 h-4" />
              </button>
              <Link
                href={`/${locale}/abonner`}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-brand text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-brand-dark transition-colors whitespace-nowrap"
              >
                {dict.nav.subscribe}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-255 mx-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.Icon className="w-5 h-5 opacity-60" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="px-3 py-3 border-t border-gray-100 mt-2">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
