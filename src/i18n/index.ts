import "server-only";

export type Locale = "fr" | "en";
export const defaultLocale: Locale = "fr";
export const locales: Locale[] = ["fr", "en"];

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!locales.includes(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
