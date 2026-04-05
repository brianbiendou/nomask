import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import { getDictionary, type Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.subscribe.title} — ${SITE_NAME}`,
    description: dict.subscribe.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/abonner`,
    },
  };
}

export default async function SubscribePage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const benefits = [
    { icon: "📰", title: dict.subscribe.benefit1, text: dict.subscribe.benefit1Text },
    { icon: "🚫", title: dict.subscribe.benefit2, text: dict.subscribe.benefit2Text },
    { icon: "📧", title: dict.subscribe.benefit3, text: dict.subscribe.benefit3Text },
    { icon: "❤️", title: dict.subscribe.benefit4, text: dict.subscribe.benefit4Text },
  ];

  const plans = [
    {
      name: dict.subscribe.monthly,
      price: "4,99€",
      period: dict.subscribe.perMonth,
      features: [dict.subscribe.benefit1, dict.subscribe.benefit2, dict.subscribe.benefit3],
      highlight: false,
    },
    {
      name: dict.subscribe.annual,
      price: "49,99€",
      period: dict.subscribe.perYear,
      features: [dict.subscribe.benefit1, dict.subscribe.benefit2, dict.subscribe.benefit3, dict.subscribe.benefit4],
      highlight: true,
      badge: dict.subscribe.bestValue,
    },
    {
      name: dict.subscribe.twoYear,
      price: "89,99€",
      period: locale === "en" ? "/2 years" : "/2 ans",
      features: [dict.subscribe.benefit1, dict.subscribe.benefit2, dict.subscribe.benefit3, dict.subscribe.benefit4],
      highlight: false,
    },
  ];

  const faqItems = locale === "en"
    ? [
        { q: "Can I cancel at any time?", a: "Yes, you can cancel your subscription at any time. You will keep your access until the end of the current period." },
        { q: "How to subscribe?", a: "Choose a plan, click \"Choose this plan\" and follow the steps. Payment is secure." },
        { q: "Is my payment secure?", a: "Yes, all payments are processed by Stripe, the leader in online payments." },
        { q: "Can I switch plans?", a: "Yes, you can upgrade or downgrade your plan at any time from your account." },
      ]
    : [
        { q: "Puis-je annuler à tout moment ?", a: "Oui, vous pouvez résilier votre abonnement à tout moment. Vous conserverez votre accès jusqu\u0027à la fin de la période en cours." },
        { q: "Comment s\u0027abonner ?", a: "Choisissez une formule, cliquez sur « Choisir ce plan » et suivez les étapes. Le paiement est sécurisé." },
        { q: "Mon paiement est-il sécurisé ?", a: "Oui, tous les paiements sont traités par Stripe, le leader du paiement en ligne." },
        { q: "Puis-je changer de formule ?", a: "Oui, vous pouvez passer à une formule supérieure ou inférieure à tout moment depuis votre espace personnel." },
      ];

  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-black font-sans mb-4">{dict.subscribe.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{dict.subscribe.description}</p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {benefits.map((b, i) => (
          <div key={i} className="text-center p-6 rounded-xl bg-gray-50">
            <div className="text-3xl mb-3">{b.icon}</div>
            <h3 className="font-bold font-sans mb-1">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.text}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-xl border-2 transition-shadow ${
              plan.highlight
                ? "border-red-600 shadow-lg"
                : "border-gray-200 hover:shadow-md"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="text-xl font-bold font-sans mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-black">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-bold transition-colors ${
                plan.highlight
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {dict.subscribe.choosePlan}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-black font-sans text-center mb-8">{dict.subscribe.faq}</h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details key={i} className="group border border-gray-200 rounded-lg p-4">
              <summary className="font-bold font-sans cursor-pointer group-open:mb-2">{item.q}</summary>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
