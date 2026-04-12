import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nomask.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",       // endpoints internes
          "/brian/",     // interface admin
          // Paramètres de recherche dynamiques — évite l'indexation de pages thin
          "/*/recherche?",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
