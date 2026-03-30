import Link from "next/link";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color?: string;
  size?: "sm" | "md";
  asSpan?: boolean;
}

export default function CategoryBadge({
  name,
  slug,
  color = "#DC2626",
  size = "sm",
  asSpan = false,
}: CategoryBadgeProps) {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  const className = `inline-block font-sans font-bold uppercase tracking-wider text-white rounded-sm ${sizeClasses}`;

  if (asSpan) {
    return (
      <span className={className} style={{ backgroundColor: color }}>
        {name}
      </span>
    );
  }

  return (
    <Link
      href={`/${slug}`}
      className={className}
      style={{ backgroundColor: color }}
    >
      {name}
    </Link>
  );
}
