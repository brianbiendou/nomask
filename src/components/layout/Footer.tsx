import Link from "next/link";
import type { Locale, Dictionary } from "@/i18n";

const SOCIAL_LINKS = [
  { name: "YouTube", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { name: "TikTok", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  { name: "X", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { name: "Instagram", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: "Facebook", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { name: "RSS", href: "/rss.xml", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-8.18v4.819c12.951.115 23.354 10.617 23.497 23.561h4.503c-.145-15.842-13.009-28.605-28-28.38z"/></svg> },
  { name: "Threads", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.287 3.263-.809.996-1.958 1.584-3.419 1.748-1.09.122-2.14-.018-3.05-.408-1.036-.444-1.856-1.186-2.345-2.132-.42-.812-.596-1.724-.513-2.637.164-1.822 1.282-3.292 2.992-3.936.9-.339 1.946-.471 3.113-.393 1 .066 1.88.293 2.63.676.025-.834-.01-1.623-.105-2.347l2.024-.31c.134.879.197 1.842.187 2.867.598.453 1.088.993 1.46 1.622.588.994.9 2.15.9 3.34-.003 2.585-1.032 4.724-2.978 6.188C17.075 23.365 14.89 23.98 12.186 24zm-.09-5.652c1.12-.122 1.946-.536 2.456-1.23.387-.528.677-1.244.852-2.107-.495-.257-1.074-.436-1.726-.533-.951-.142-1.87-.124-2.66.052-.94.21-1.63.682-1.862 1.265-.143.358-.126.728.051 1.07.264.51.821.87 1.568 1.015.459.09.94.107 1.39.05z"/></svg> },
];

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const footerLinks = [
    { name: dict.footer.home, href: `/${locale}` },
    { name: dict.footer.authors, href: `/${locale}/auteurs` },
    { name: dict.footer.legal, href: `/${locale}/mentions-legales` },
    { name: dict.footer.privacy, href: `/${locale}/donnees-personnelles` },
    { name: dict.footer.cookies, href: `/${locale}/politique-cookies` },
    { name: dict.footer.contact, href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-[#f5f5f5] border-t border-gray-200">
      <div className="max-w-255 mx-auto px-4 pt-10 pb-6">
        <div className="flex flex-col items-center gap-5">
          <Link href={`/${locale}`} className="inline-block">
            <span className="text-4xl font-black tracking-tight lowercase">
              <span className="text-brand">no</span>
              <span className="text-dark">mask</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.filter((s) => s.href !== "#").map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="w-8 h-8 flex items-center justify-center text-brand hover:text-brand-dark transition-colors"
                aria-label={s.name}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-255 mx-auto px-4 pb-3">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {footerLinks.map((item, i) => (
            <span key={item.name} className="flex items-center gap-2">
              <Link
                href={item.href}
                className="text-[13px] font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                {item.name}
              </Link>
              {i < footerLinks.length - 1 && (
                <span className="text-gray-400 text-xs">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-255 mx-auto px-4 pb-8">
        <p className="text-center text-[12px] text-gray-500 font-medium">
          {dict.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
          {" — "}
          <a href={`mailto:${dict.footer.email}`} className="hover:text-brand transition-colors">
            {dict.footer.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
