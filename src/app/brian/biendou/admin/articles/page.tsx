"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image,
  Link2,
  Clock,
  Trash2,
  Filter,
  Loader2,
  CheckSquare,
} from "lucide-react";

interface ArticleStat {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_breaking: boolean;
  is_exclusive: boolean;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  category: { id: string; name: string; slug: string; color: string } | null;
  author: { id: string; name: string; slug: string } | null;
  comment_count: number;
  image_count: number;
  link_count: number;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ApiResponse {
  articles: ArticleStat[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  categories: CategoryOption[];
}

type SortField =
  | "published_at"
  | "created_at"
  | "title"
  | "read_time"
  | "image_count"
  | "link_count";

const COMPUTED_FIELDS: string[] = ["image_count", "link_count"];

export default function ArticlesStatsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("published_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const isComputedSort = COMPUTED_FIELDS.includes(sortField);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data) return;
    const allIds = data.articles.map((a) => a.id);
    const allSelected = allIds.every((id) => selected.has(id));
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        allIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
      fetchArticles();
    } catch {
      alert("Erreur lors de la suppression");
    }
    setDeleting(null);
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/articles/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setSelected(new Set());
      fetchArticles();
    } catch {
      alert("Erreur lors de la suppression groupée");
    }
    setBulkDeleting(false);
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      per_page: "15",
      sort: isComputedSort ? "published_at" : sortField,
      order: isComputedSort ? "desc" : sortOrder,
      status: statusFilter,
    });
    if (categoryFilter) params.set("category_id", categoryFilter);

    try {
      const res = await fetch(`/api/admin/articles?${params}`);
      const json: ApiResponse = await res.json();

      // Client-side sort for computed fields
      if (isComputedSort) {
        json.articles.sort((a, b) => {
          const aVal = a[sortField as keyof ArticleStat] as number;
          const bVal = b[sortField as keyof ArticleStat] as number;
          return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
        });
      }

      setData(json);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, sortField, sortOrder, statusFilter, categoryFilter, isComputedSort]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      published: { bg: "bg-green-50", text: "text-green-700", label: "Publié" },
      draft: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Brouillon" },
      archived: { bg: "bg-gray-100", text: "text-gray-500", label: "Archivé" },
    };
    const s = map[status] || map.draft;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="text-gray-300" />;
    return sortOrder === "desc" ? (
      <ChevronDown size={14} className="text-[#DC2626]" />
    ) : (
      <ChevronUp size={14} className="text-[#DC2626]" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 size={24} className="text-[#DC2626]" />
          Statistiques Articles
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {data ? `${data.total} article${data.total > 1 ? "s" : ""} au total` : "Chargement…"}
        </p>
      </div>

      {/* Bulk Delete Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          <CheckSquare size={16} className="text-red-600" />
          <span className="text-sm font-medium text-red-700">
            {selected.size} article{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {bulkDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Supprimer la sélection
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white
              focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
        >
          <option value="">Toutes les catégories</option>
          {data?.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={!!data && data.articles.length > 0 && data.articles.every((a) => selected.has(a.id))}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Titre <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500">
                    Catégorie
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    Statut
                  </th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("published_at")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Publié <SortIcon field="published_at" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("published_at")}
                      className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                      title="Heure de publication"
                    >
                      <Clock size={14} />
                      <SortIcon field="published_at" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("read_time")}
                      className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                      title="Temps de lecture"
                    >
                      <Clock size={14} />
                      <SortIcon field="read_time" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("image_count")}
                      className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                      title="Images"
                    >
                      <Image size={14} />
                      <SortIcon field="image_count" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button
                      onClick={() => handleSort("link_count")}
                      className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                      title="Liens / Sources"
                    >
                      <Link2 size={14} />
                      <SortIcon field="link_count" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <Trash2 size={14} className="mx-auto text-gray-400" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.articles.map((article) => (
                  <tr
                    key={article.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                      selected.has(article.id) ? "bg-red-50/50" : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(article.id)}
                        onChange={() => toggleSelect(article.id)}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[300px]">
                      <p className="font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {article.author?.name}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      {article.category && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${article.category.color}15`,
                            color: article.category.color,
                          }}
                        >
                          {article.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {statusBadge(article.status)}
                    </td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(article.published_at)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-gray-600 text-xs">
                        {formatTime(article.published_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600">
                      {article.read_time} min
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`font-medium ${
                          article.image_count > 0
                            ? "text-purple-600"
                            : "text-gray-300"
                        }`}
                      >
                        {article.image_count}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`font-medium ${
                          article.link_count > 0
                            ? "text-teal-600"
                            : "text-gray-300"
                        }`}
                      >
                        {article.link_count}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Supprimer cet article"
                      >
                        {deleting === article.id ? <Loader2 size={14} className="animate-spin text-red-500" /> : <Trash2 size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.articles.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      Aucun article trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data.page} sur {data.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from(
              { length: Math.min(5, data.total_pages) },
              (_, i) => {
                const startPage = Math.max(
                  1,
                  Math.min(page - 2, data.total_pages - 4)
                );
                const p = startPage + i;
                if (p > data.total_pages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#DC2626] text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
            )}
            <button
              onClick={() => setPage(Math.min(data.total_pages, page + 1))}
              disabled={page >= data.total_pages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
