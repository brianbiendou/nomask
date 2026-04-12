"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Hook qui attend que l'élément soit visible (IntersectionObserver)
 * avant de pusher l'annonce AdSense → lazy loading conforme Google.
 */
function useLazyAdSense(ref: React.RefObject<HTMLDivElement | null>) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ref.current || pushed.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !pushed.current) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch {
            // AdSense non chargé ou bloqué
          }
          pushed.current = true;
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // pré-charge 200px avant l'entrée dans le viewport
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
}

/** Annonce in-article "autorelaxed" — après le contenu article (slot 9125999446) */
export function AdSenseInArticle() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Détecte l'entrée dans le viewport pour le rendu conditionnel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useLazyAdSense(ref);

  return (
    <div ref={ref} className="my-8 min-h-22.5">
      {visible && (
        <ins
          className="adsbygoogle adsense-ins"
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-3632266086082682"
          data-ad-slot="9125999446"
        />
      )}
    </div>
  );
}

/** Annonce display responsive — pages diverses (slot 4450490909) */
export function AdSenseDisplay() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useLazyAdSense(ref);

  return (
    <div ref={ref} className="my-8 min-h-22.5">
      {visible && (
        <ins
          className="adsbygoogle adsense-ins"
          data-ad-format="auto"
          data-ad-client="ca-pub-3632266086082682"
          data-ad-slot="4450490909"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
