import Link from "next/link";

const SOCIAL_LINKS = [
  { name: "X", href: "#", icon: "ð•" },
  { name: "Facebook", href: "#", icon: "f" },
  { name: "RSS", href: "/rss.xml", icon: "ðŸ“¡" },
];

const FOOTER_LINKS = [
  { name: "Ã€ propos", href: "/a-propos" },
  { name: "Mentions lÃ©gales", href: "/mentions-legales" },
  { name: "DonnÃ©es personnelles", href: "/mentions-legales" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      {/* Logo + rÃ©seaux sociaux */}
      <div className="max-w-300 mx-auto px-4 pt-10 pb-6">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black tracking-tight lowercase">
              <span className="text-brand">no</span>
              <span className="text-white">mask</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="text-gray-400 hover:text-white transition-colors text-lg"
                aria-label={s.name}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Liens */}
      <div className="border-t border-gray-700">
        <div className="max-w-300 mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {FOOTER_LINKS.map((item, i) => (
              <span key={item.name} className="flex items-center gap-4">
                <Link
                  href={item.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
                {i < FOOTER_LINKS.length - 1 && (
                  <span className="text-gray-600 text-xs">Â·</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Â© {new Date().getFullYear()} NoMask, tous droits rÃ©servÃ©s
          </p>
        </div>
      </div>
    </footer>
  );
}
