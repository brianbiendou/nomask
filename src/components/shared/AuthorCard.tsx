import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/types";

interface AuthorCardProps {
  author: Author;
  showBio?: boolean;
}

export default function AuthorCard({
  author,
  showBio = true,
}: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-light-bg rounded-lg border border-gray-200">
      {author.avatar_url && (
        <Image
          src={author.avatar_url}
          alt={author.name}
          width={56}
          height={56}
          className="rounded-full shrink-0"
        />
      )}
      <div>
        <h4 className="font-bold font-sans text-dark">{author.name}</h4>
        <p className="text-xs text-gray-500 font-sans">{author.role}</p>
        {showBio && author.bio && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {author.bio}
          </p>
        )}
        <Link
          href={`/auteur/${author.slug}`}
          className="inline-block mt-2 text-xs font-bold font-sans text-brand hover:underline"
        >
          Voir tous ses articles
        </Link>
      </div>
    </div>
  );
}
