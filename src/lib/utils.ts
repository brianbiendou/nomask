export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD}j`;
  return formatDate(dateString);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const SITE_NAME = "NoMask";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nomask.fr";
export const SITE_DESCRIPTION =
  "NoMask — L'actualité sans filtre. Politique, économie, tech, culture, sport et style. L'information vérifiée, sans masque.";

export const CATEGORY_COLORS: Record<string, string> = {
  international: "#2563EB",
  politique: "#DC2626",
  societe: "#9333EA",
  economie: "#16A34A",
  tech: "#0891B2",
  culture: "#D97706",
  science: "#4F46E5",
  sport: "#EA580C",
  style: "#DB2777",
};
