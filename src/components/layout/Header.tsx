"use client";

import Link from "next/link";
import { useState } from "react";
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
  { name: "actus", href: "/international", Icon: Globe },
  { name: "politique", href: "/politique", Icon: Landmark },
  { name: "\u00e9conomie", href: "/economie", Icon: TrendingUp },
  { name: "soci\u00e9t\u00e9", href: "/societe", Icon: Users },
  { name: "tech", href: "/tech", Icon: Cpu },
  { name: "culture", href: "/culture", Icon: Clapperboard },
  { name: "science", href: "/science", Icon: Microscope },
  { name: "sport", href: "/sport", Icon: Trophy },
  { name: "style", href: "/style", Icon: Sparkles },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Ligne 1 : Logo + actions */}
      <div className="border-b border-gray-100">
        <div className="max-w-300 mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-4xl font-black tracking-tight lowercase">
              <span className="text-brand">no</span>
              <span className="text-dark">mask</span>
            </span>
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
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
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-brand transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <button className="p-2 text-gray-500 hover:text-brand transition-colors" aria-label="Compte">
              <UserCircle className="w-5 h-5" />
            </button>

            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-dark transition-colors"
            >
              <span className="text-sm">+</span> S&apos;abonner
            </Link>

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

      {/* Ligne 2 : Navigation categories */}
      <nav className="hidden lg:block border-b border-gray-200 bg-white">
        <div className="max-w-300 mx-auto px-4 flex items-center justify-center gap-1 h-11 overflow-x-auto hide-scrollbar">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-gray-700 hover:text-brand hover:bg-gray-50 rounded transition-colors whitespace-nowrap"
            >
              <item.Icon className="w-4 h-4 opacity-60" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-300 mx-auto px-4 py-2">
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
