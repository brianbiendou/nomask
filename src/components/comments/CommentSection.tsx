"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getInitials } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentSectionProps {
  articleId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  articleId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setStatus("loading");
    const { data, error } = await supabase
      .from("comments")
      .insert({
        article_id: articleId,
        author_name: name.trim(),
        author_initials: getInitials(name.trim()),
        content: content.trim(),
        parent_id: replyTo,
      })
      .select()
      .single();

    if (!error && data) {
      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo
              ? { ...c, replies: [...(c.replies || []), data] }
              : c
          )
        );
      } else {
        setComments((prev) => [...prev, { ...data, replies: [] }]);
      }
      setContent("");
      setReplyTo(null);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("idle");
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-sans">
          Réactions ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
        <button
          onClick={() => {
            setReplyTo(null);
            document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-4 py-2 bg-brand text-white text-sm font-bold font-sans rounded-md hover:bg-brand-dark transition-colors"
        >
          Poster un commentaire
        </button>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={() => {
                setReplyTo(comment.id);
                document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            {/* Réponses */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <form
        id="comment-form"
        onSubmit={handleSubmit}
        className="mt-8 bg-light-bg rounded-lg p-6 border border-gray-200"
      >
        {replyTo && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-gray-500 font-sans">
              Répondre à un commentaire
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-xs text-brand font-sans hover:underline"
            >
              Annuler
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            required
            maxLength={100}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-md font-sans focus:outline-none focus:border-brand"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Votre commentaire..."
            required
            maxLength={2000}
            rows={4}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-md font-sans focus:outline-none focus:border-brand resize-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="self-start px-6 py-2.5 bg-brand text-white text-sm font-bold font-sans rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Envoi..." : "Publier"}
          </button>
          {status === "success" && (
            <p className="text-sm text-green-600 font-sans">
              Commentaire publié !
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onReply?: () => void;
  isReply?: boolean;
}) {
  const timeAgo = getTimeAgo(comment.created_at);

  return (
    <div className={`${isReply ? "bg-gray-50" : "bg-white"} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand text-xs font-bold font-sans flex items-center justify-center">
          {comment.author_initials}
        </div>
        <div>
          <span className="text-sm font-bold font-sans text-dark">
            {comment.author_name}
          </span>
          <span className="text-xs text-gray-500 font-sans ml-2">
            {timeAgo}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      {onReply && (
        <button
          onClick={onReply}
          className="mt-2 text-xs font-sans text-gray-500 hover:text-brand transition-colors"
        >
          Répondre
        </button>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  return `Il y a ${Math.floor(diffH / 24)}j`;
}
