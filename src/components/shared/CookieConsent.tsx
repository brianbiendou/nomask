"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "nomask_cookie_consent";

type ConsentStatus = "accepted" | "refused" | null;

export default function CookieConsent({ locale = "fr" }: { locale?: string }) {
  const [status, setStatus] = useState<ConsentStatus | "loading">("loading");
  const isFr = locale !== "en";

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY) as ConsentStatus | null;
    setStatus(saved);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setStatus("accepted");
    // Active les annonces AdSense personnalisées
    try {
      // @ts-expect-error google tag
      window.gtag?.("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_personalization: "granted",
        ad_user_data: "granted",
      });
    } catch {
      // silencieux si gtag absent
    }
  };

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_KEY, "refused");
    setStatus("refused");
    // Désactive les annonces personnalisées
    try {
      // @ts-expect-error google tag
      window.gtag?.("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_personalization: "denied",
        ad_user_data: "denied",
      });
    } catch {
      // silencieux si gtag absent
    }
  };

  // Pas encore chargé ou déjà répondu → ne rien afficher
  if (status === "loading" || status === "accepted" || status === "refused") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={isFr ? "Bandeau cookies" : "Cookie banner"}
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t-2 border-gray-200 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold text-gray-900 mb-1">
            {isFr ? "🍪 Ce site utilise des cookies" : "🍪 This site uses cookies"}
          </p>
          <p>
            {isFr ? (
              <>
                Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic
                et personnaliser les publicités (Google AdSense). En acceptant, vous consentez à
                l'utilisation de ces cookies.{" "}
                <Link href={`/${locale}/politique-cookies`} className="underline hover:text-red-600">
                  En savoir plus
                </Link>
                {" "}et consulter notre{" "}
                <Link href={`/${locale}/donnees-personnelles`} className="underline hover:text-red-600">
                  politique de confidentialité
                </Link>
                .
              </>
            ) : (
              <>
                We use cookies to improve your experience, analyze traffic and personalize ads
                (Google AdSense). By accepting, you consent to the use of these cookies.{" "}
                <Link href={`/${locale}/politique-cookies`} className="underline hover:text-red-600">
                  Learn more
                </Link>
                {" "}and read our{" "}
                <Link href={`/${locale}/donnees-personnelles`} className="underline hover:text-red-600">
                  privacy policy
                </Link>
                .
              </>
            )}
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleRefuse}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            {isFr ? "Refuser" : "Refuse"}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isFr ? "Accepter" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
