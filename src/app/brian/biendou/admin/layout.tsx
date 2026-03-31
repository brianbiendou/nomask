"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Zap,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/brian/biendou/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/brian/biendou/admin/articles",
    icon: BarChart3,
  },
  {
    name: "Workflow",
    href: "/brian/biendou/admin/workflow",
    icon: Zap,
  },
  {
    name: "Sources",
    href: "/brian/biendou/admin/sources",
    icon: Globe,
  },
  {
    name: "Paramètres",
    href: "/brian/biendou/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/brian/biendou/admin/login");
  }, [router]);

  // Login page → pas de layout admin
  if (pathname === "/brian/biendou/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex overflow-x-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-100 fixed top-11 bottom-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/brian/biendou/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#DC2626] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">NoMask</span>
              <span className="text-[10px] text-gray-400 block -mt-1">ADMIN PANEL</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/brian/biendou/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#DC2626]/5 text-[#DC2626]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  size={18}
                  className={
                    isActive
                      ? "text-[#DC2626]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />
                {item.name}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-[#DC2626]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "..."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-red-600
              hover:bg-red-50 rounded-xl w-full transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-bold text-gray-900">NoMask Admin</span>
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 inset-y-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-50"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#DC2626]/5 text-[#DC2626]"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen overflow-x-hidden">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
