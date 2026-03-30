"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Actus", href: "/international", Icon: Globe },
  { name: "Politique", href: "/politique", Icon: Landmark },
  { name: "\u00c9conomie", href: "/economie", Icon: TrendingUp },
  { name: "Soci\u00e9t\u00e9", href: "/societe", Icon: Users },
  { name: "Tech", href: "/tech", Icon: Cpu },
  { name: "Culture", href: "/culture", Icon: Clapperboard },
  { name: "Science", href: "/science", Icon: Microscope },
  { name: "Sport", href: "/sport", Icon: Trophy },
  { name: "Style", href: "/style", Icon: Sparkles },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hysteresis: collapse at 50px, expand only when back near top (< 10px)
      // This prevents the flicker loop caused by header height change
      if (!isScrolledRef.current && currentY > 50) {
        isScrolledRef.current = true;
        setIsScrolled(true);
      } else if (isScrolledRef.current && currentY < 10) {
        isScrolledRef.current = false;
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Ligne 1 : Logo + actions (se masque au scroll) */}
      <div
        className={`border-b border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? "max-h-0 border-b-0" : "max-h-20"
        }`}
      >
        <div className="max-w-255 mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-4xl font-black tracking-tight lowercase">
              <span className="text-brand">no</span>
              <span className="text-dark">mask</span>
            </span>
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {isSearchOpen && !isScrolled ? (
              <form action="/recherche" method="get" className="flex items-center">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:border-brand"
                  autoFocus
                />
                <button type="submit" title="Rechercher" className="px-3 py-1.5 bg-brand text-white rounded-r-md hover:bg-brand-dark">
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
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5" />
                </button>
              )
            )}

            {!isScrolled && (
              <>
                <button className="p-2 text-gray-500 hover:text-brand transition-colors" aria-label="Compte">
                  <UserCircle className="w-5 h-5" />
                </button>

                <Link
                  href="/abonner"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-dark transition-colors"
                >
                  <span className="text-sm">+</span> S&apos;abonner
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Ligne 2 : Navigation — devient ligne unique avec logo+actions au scroll */}
      <nav className="hidden lg:block border-b border-gray-200 bg-white">
        <div className="max-w-255 mx-auto px-4 flex items-center h-11 overflow-x-auto hide-scrollbar">
          {/* Logo compact (visible uniquement au scroll) */}
          {isScrolled && (
            <Link href="/" className="flex items-center shrink-0 mr-4">
              <span className="text-2xl font-black tracking-tight lowercase">
                <span className="text-brand">no</span>
                <span className="text-dark">mask</span>
              </span>
            </Link>
          )}

          {/* Categories centrees */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-normal text-gray-700 hover:text-brand hover:bg-gray-50 rounded transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                <item.Icon className="w-4 h-4 opacity-60" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Actions (visibles uniquement au scroll) */}
          {isScrolled && (
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-brand transition-colors" aria-label="Compte">
                <UserCircle className="w-4 h-4" />
              </button>
              <Link
                href="/abonner"
                className="flex items-center gap-1 px-3 py-1.5 bg-brand text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-brand-dark transition-colors whitespace-nowrap"
              >
                <span className="text-xs">+</span> S&apos;abonner
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-255 mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => (
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
          </div>
        </nav>
      )}
    </header>
  );
}
