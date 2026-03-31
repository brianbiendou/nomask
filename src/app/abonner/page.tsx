import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/utils";
import { Check, Zap, Shield, BookOpen, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `NoMask+ — Soutenez le journalisme indépendant | ${SITE_NAME}`,
  description:
    "Abonnez-vous à NoMask+ pour une lecture sans interruption, des contenus exclusifs et un accès anticipé à nos enquêtes. Soutenez un média libre.",
};

const BENEFITS = [
  {
    icon: BookOpen,
    title: "Lecture sans publicité",
    description: "Profitez de tous nos articles sans aucune interruption publicitaire.",
  },
  {
    icon: Zap,
    title: "Accès anticipé",
    description:
      "Recevez nos enquêtes et analyses en avant-première, avant leur publication grand public.",
  },
  {
    icon: Star,
    title: "Contenus exclusifs",
    description:
      "Le récap\u2019 hebdo NoMask+, des éditos réservés et des coulisses de la rédaction.",
  },
  {
    icon: Shield,
    title: "Soutien à l\u2019indépendance",
    description:
      "Votre abonnement finance un journalisme libre, sans actionnaire ni pression extérieure.",
  },
];

const PLANS = [
  {
    name: "Mensuel",
    price: "5,99\u00a0\u20ac",
    period: "/mois",
    highlight: false,
    description: "Sans engagement, résiliable à tout moment.",
  },
  {
    name: "Annuel",
    price: "49,99\u00a0\u20ac",
    period: "/an",
    highlight: true,
    badge: "Le plus populaire",
    description: "Économisez 30\u00a0% par rapport au tarif mensuel.",
  },
  {
    name: "Pack 2 ans",
    price: "79,99\u00a0\u20ac",
    period: "/2 ans",
    highlight: false,
    description: "L\u2019offre la plus avantageuse, idéale pour les fidèles.",
  },
];

export default function AbonnerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-dark overflow-hidden">
        {/* Decorative diagonal stripe */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #DC2626, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-brand"
          />
        </div>

        <div className="max-w-255 mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block text-brand font-black text-sm tracking-widest uppercase mb-4">
              NoMask+
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              L&apos;info sans filtre,<br />
              <span className="text-brand">sans limites.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              Rejoignez NoMask+ et accédez à l&apos;intégralité de nos contenus.
              Lecture sans pub, accès anticipé, exclusivités — et surtout, le plaisir
              de soutenir un journalisme véritablement indépendant.
            </p>
            <a
              href="#offres"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-7 py-3.5 rounded-md transition-colors text-base"
            >
              Voir les offres <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-255 mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
            Pourquoi rejoindre <span className="text-brand">NoMask+</span>&nbsp;?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="offres" className="bg-light-bg py-16">
        <div className="max-w-255 mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
            Tous les abonnements incluent l&apos;accès complet à NoMask+.
            Résiliable à tout moment pour les formules mensuelles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-xl p-6 flex flex-col
                  ${plan.highlight
                    ? "bg-dark text-white ring-2 ring-brand shadow-xl scale-[1.03]"
                    : "bg-white text-dark border border-gray-200 shadow-sm"
                  }
                `}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}

                <h3
                  className={`text-lg font-bold mb-4 ${plan.highlight ? "text-white" : ""}`}
                >
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className={`text-4xl font-black ${plan.highlight ? "text-brand" : "text-dark"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                    {plan.period}
                  </span>
                </div>

                <p className={`text-sm mb-6 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}>
                  {plan.description}
                </p>

                <ul className="space-y-2 mb-8 flex-1">
                  {["Lecture sans pub", "Contenus exclusifs", "Accès anticipé", "Récap\u2019 hebdo"].map(
                    (feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm">
                        <Check
                          className="w-4 h-4 shrink-0 text-brand"
                        />
                        <span className={plan.highlight ? "text-gray-200" : "text-gray-700"}>
                          {feat}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                <button
                  className={`
                    w-full py-3 rounded-md font-bold text-sm transition-colors cursor-pointer
                    ${plan.highlight
                      ? "bg-brand hover:bg-brand-dark text-white"
                      : "bg-dark hover:bg-gray-800 text-white"
                    }
                  `}
                >
                  S&apos;abonner
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ compact */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-10">Questions fréquentes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-1">Puis-je résilier à tout moment ?</h3>
              <p className="text-gray-600 text-sm">
                Oui. Les formules mensuelles sont sans engagement. Les formules annuelles et
                2 ans sont valables pour la période souscrite, sans reconduction automatique.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Quels moyens de paiement acceptez-vous ?</h3>
              <p className="text-gray-600 text-sm">
                Carte bancaire (Visa, Mastercard, CB) via notre prestataire de paiement sécurisé.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Est-ce que mon abonnement finance vraiment le journalisme ?</h3>
              <p className="text-gray-600 text-sm">
                Intégralement. NoMask n&apos;a aucun actionnaire extérieur. Votre abonnement
                finance directement la rédaction, les enquêtes et le fonctionnement du média.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Y a-t-il un essai gratuit ?</h3>
              <p className="text-gray-600 text-sm">
                De nombreux articles restent accessibles gratuitement. L&apos;abonnement
                débloque les contenus exclusifs et supprime la publicité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-dark py-12">
        <div className="max-w-255 mx-auto px-4 text-center">
          <p className="text-white text-xl font-bold mb-2">
            Prêt à soutenir l&apos;info sans filtre ?
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Rejoignez les lecteurs qui font vivre un journalisme indépendant.
          </p>
          <a
            href="#offres"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-7 py-3.5 rounded-md transition-colors"
          >
            Découvrir les offres <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
