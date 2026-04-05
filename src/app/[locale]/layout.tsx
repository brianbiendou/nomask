import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { JsonLdWebSite } from "@/components/shared/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { locales, type Locale, getDictionary } from "@/i18n";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isFr = locale === "fr";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.siteDescription,
    keywords: isFr
      ? ["actualité", "news", "politique", "économie", "tech", "culture", "sport", "science", "style", "IA", "intelligence artificielle", "international", "France"]
      : ["news", "politics", "economy", "tech", "culture", "sports", "science", "style", "AI", "artificial intelligence", "international", "France"],
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    verification: {
      google: "kFB0UwSG_KWqN1fjX-e5n5eNQXHcag9mcZCJ0sEc16s",
    },
    formatDetection: { email: false, telephone: false },
    openGraph: {
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
      alternateLocale: isFr ? "en_US" : "fr_FR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      description: dict.meta.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      description: dict.meta.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/rss.xml`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const isFr = locale === "fr";

  return (
    <>
      <head>
        <JsonLdWebSite />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} - ${isFr ? "Flux RSS" : "RSS Feed"}`}
          href="/rss.xml"
        />
        <link rel="alternate" hrefLang="fr" href={`${SITE_URL}/fr`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/fr`} />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-3632266086082682" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3632266086082682"
          crossOrigin="anonymous"
        />
        {/* Google Reader Revenue Manager */}
        <script
          async
          type="application/javascript"
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(self.SWG_BASIC = self.SWG_BASIC || []).push(function(basicSubscriptions) {
  basicSubscriptions.init({
    type: "NewsArticle",
    isPartOfType: ["Product"],
    isPartOfProductId: "CAow2d7fCw:openaccess",
    clientOptions: { theme: "light", lang: "${locale}" }
  });
});`,
          }}
        />
      </head>
      <Header locale={locale as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
      <Analytics />
    </>
  );
}
