"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, locale: "fr" });

    if (error) {
      if (error.code === "23505") {
        setStatus("success"); // Already subscribed
      } else {
        setStatus("error");
      }
    } else {
      setStatus("success");
    }
    setEmail("");
  }

  return (
    <div className="bg-dark rounded-lg p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        <h3 className="text-lg font-bold font-sans">Restez informé</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Recevez chaque matin l&apos;essentiel de l&apos;actualité sélectionnée
        par notre rédaction.
      </p>

      {status === "success" ? (
        <p className="text-sm text-green-400 font-sans font-medium">
          ✓ Inscription réussie ! Merci.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full px-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 font-sans focus:outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2.5 bg-brand text-white text-sm font-bold font-sans uppercase tracking-wider rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "S'abonner"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2 font-sans">
          Une erreur est survenue. Réessayez.
        </p>
      )}
    </div>
  );
}
