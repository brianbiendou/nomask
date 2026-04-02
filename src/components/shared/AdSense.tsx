"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function useAdSense() {
  const pushed = useRef(false);
  useEffect(() => {
    if (!pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded or blocked
      }
      pushed.current = true;
    }
  }, []);
}

/** Annonce "autorelaxed" — après le contenu article (slot 9125999446) */
export function AdSenseInArticle() {
  useAdSense();
  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-3632266086082682"
        data-ad-slot="9125999446"
      />
    </div>
  );
}

/** Annonce display responsive — pages diverses (slot 4450490909) */
export function AdSenseDisplay() {
  useAdSense();
  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="auto"
        data-ad-client="ca-pub-3632266086082682"
        data-ad-slot="4450490909"
        data-full-width-responsive="true"
      />
    </div>
  );
}
