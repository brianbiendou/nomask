"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Globe,
  Search,
  Zap,
  ImageIcon,
  Upload,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Play,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Flame,
  TrendingUp,
  Plus,
  Trash2,
} from "lucide-react";

/* ---------------------------------------------------------- */
/* Types                                                      */
/* ---------------------------------------------------------- */
interface StepDef {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PIPELINE_STEPS: StepDef[] = [
  { key: "discovery",  label: "Découverte",      icon: Globe },
  { key: "scraping",   label: "Scraping",        icon: Search },
  { key: "rewriting",  label: "Réécriture IA",   icon: Zap },
  { key: "images",     label: "Images",          icon: ImageIcon },
  { key: "publishing", label: "Publication",     icon: Upload },
];

type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

interface ArticleStep {
  name: string;
  status: string;
  detail?: string;
  startedAt?: string;
  completedAt?: string;
}

interface JobArticle {
  url: string;
  title: string;
  newTitle?: string;
  status: string;
  steps: ArticleStep[];
}

interface Job {
  id: string;
  status: string;
  sourceUrl: string;
  perspective: string;
  mode: string;
  discoveredUrls: string[];
  steps: ArticleStep[];
  articles: JobArticle[];
  createdAt: string;
  completedAt?: string;
  error?: string;
}

/* ---------------------------------------------------------- */
/* Sources préconfigurées                                     */
/* ---------------------------------------------------------- */
const PRESET_SOURCES = [
  { name: "Numerama", url: "https://www.numerama.com" },
  { name: "Le Monde Tech", url: "https://www.lemonde.fr/pixels/" },
  { name: "Le Figaro Tech", url: "https://www.lefigaro.fr/secteur/high-tech" },
];

const PERSPECTIVES = [
  "analyse critique et tech-savvy",
  "vulgarisation grand public",
  "point de vue business et innovation",
  "enquête approfondie et factuelle",
];

/* ---------------------------------------------------------- */
/* Trending types                                             */
/* ---------------------------------------------------------- */
interface TrendingArticle {
  url: string;
  title: string;
  rank: number | null;
  commentCount: number | null;
  section: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
}

interface TrendingResults {
  totalTrending: number;
  sites: Record<string, TrendingArticle[]>;
}

/* ---------------------------------------------------------- */
/* Component                                                  */
/* ---------------------------------------------------------- */
function WorkflowContent() {
  const searchParams = useSearchParams();
  const preselectedJob = searchParams.get("job");

  const [activeJobId, setActiveJobId] = useState<string | null>(preselectedJob);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [mode, setMode] = useState<"discover" | "trending" | "urls">("discover");
  const [sourceUrl, setSourceUrl] = useState(PRESET_SOURCES[0].url);
  const [urlFields, setUrlFields] = useState<string[]>([""]);
  const [perspective, setPerspective] = useState(PERSPECTIVES[0]);
  const [maxArticles, setMaxArticles] = useState(5);
  const [hours, setHours] = useState(24);
  const [force, setForce] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());

  // Trending state
  const [trendingResults, setTrendingResults] = useState<TrendingResults | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [selectedTrendingUrls, setSelectedTrendingUrls] = useState<Set<string>>(new Set());

  /* Load jobs list */
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pipeline/run");
      if (res.ok) {
        const data = await res.json();
        setAllJobs(data.jobs || []);
      }
    } catch { /* silent */ }
  }, []);

  /* Poll active job */
  const fetchActiveJob = useCallback(async () => {
    if (!activeJobId) return;
    try {
      const res = await fetch(`/api/admin/pipeline/job/${activeJobId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveJob(data.job);
      } else if (res.status === 404) {
        // Job disparu (ex: backend redémarré) — on arrête le polling
        setActiveJob((prev) => prev ? { ...prev, status: "completed" } : prev);
      }
    } catch { /* silent */ }
  }, [activeJobId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchActiveJob();
    if (!activeJobId) return;
    // Stop polling if the job is finished
    const status = activeJob?.status;
    if (status === "completed" || status === "failed") return;
    const interval = setInterval(fetchActiveJob, 2000);
    return () => clearInterval(interval);
  }, [activeJobId, activeJob?.status, fetchActiveJob]);

  /* Fetch trending articles */
  const fetchTrending = async () => {
    setTrendingLoading(true);
    setTrendingError(null);
    setTrendingResults(null);
    setSelectedTrendingUrls(new Set());
    try {
      const body: Record<string, unknown> = {
        maxPerSite: maxArticles,
        includeComments: true,
      };

      // Si une source spécifique est sélectionnée, on l'envoie
      body.url = sourceUrl;

      const res = await fetch("/api/admin/pipeline/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setTrendingResults(data);
      } else {
        const data = await res.json();
        setTrendingError(data.error || `Erreur ${res.status}`);
      }
    } catch (err) {
      setTrendingError(err instanceof Error ? err.message : "Impossible de joindre le backend");
    }
    setTrendingLoading(false);
  };

  const toggleTrendingUrl = (url: string) => {
    setSelectedTrendingUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const selectAllTrending = (siteUrls: TrendingArticle[]) => {
    setSelectedTrendingUrls((prev) => {
      const next = new Set(prev);
      const allSelected = siteUrls.every((a) => next.has(a.url));
      if (allSelected) {
        siteUrls.forEach((a) => next.delete(a.url));
      } else {
        siteUrls.forEach((a) => next.add(a.url));
      }
      return next;
    });
  };

  const launchTrendingPipeline = async () => {
    if (selectedTrendingUrls.size === 0) return;
    setLaunching(true);
    setLaunchError(null);
    try {
      const body = {
        urls: Array.from(selectedTrendingUrls),
        perspective,
        force,
        mode: "trending",
      };

      const res = await fetch("/api/admin/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setActiveJobId(data.jobId);
        setExpandedArticles(new Set());
        setSelectedTrendingUrls(new Set());
        await fetchJobs();
      } else {
        setLaunchError(data.error || `Erreur ${res.status}`);
      }
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Impossible de joindre le backend");
    }
    setLaunching(false);
  };

  /* Launch pipeline */
  const handleLaunch = async () => {
    setLaunching(true);
    setLaunchError(null);
    try {
      const body: Record<string, unknown> = { perspective, force };

      if (mode === "discover") {
        body.sourceUrl = sourceUrl;
        body.maxArticles = maxArticles;
        body.hours = hours;
        body.mode = "discover";
      } else {
        body.urls = urlFields
          .map((u) => u.trim())
          .filter(Boolean);
        body.mode = "manual";
      }

      const res = await fetch("/api/admin/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setActiveJobId(data.jobId);
        setExpandedArticles(new Set());
        await fetchJobs();
      } else {
        setLaunchError(data.error || `Erreur ${res.status}`);
      }
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Impossible de joindre le backend");
    }
    setLaunching(false);
  };

  /* Helpers */
  const getStepStatus = (job: Job, stepKey: string): StepStatus => {
    const statusLower = job.status.toLowerCase();

    const stepOrder = ["discovery", "scraping", "rewriting", "images", "publishing"];
    const currentIdx = stepOrder.indexOf(statusLower);
    const targetIdx = stepOrder.indexOf(stepKey);

    if (job.status === "completed") return "completed";
    if (job.status === "failed") {
      if (targetIdx <= currentIdx) return targetIdx === currentIdx ? "failed" : "completed";
      return "pending";
    }

    if (targetIdx < currentIdx) return "completed";
    if (targetIdx === currentIdx) return "running";
    return "pending";
  };

  const toggleArticle = (idx: number) => {
    setExpandedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  /* -------------------------------------------------------- */
  /* Render                                                   */
  /* -------------------------------------------------------- */
  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-full mx-auto overflow-x-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Workflow</h1>
      <p className="text-sm text-gray-500 mb-5">
        Lancez et suivez les pipelines de découverte, scraping, réécriture IA et publication.
      </p>

      <div className="grid lg:grid-cols-[300px_1fr] gap-3">
        {/* ===== LEFT: Launch form ===== */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Nouveau workflow
            </h2>

            {/* Mode tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
              {(["discover", "trending", "urls"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors
                    ${mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {m === "discover" ? "🔍 Découverte" : m === "trending" ? "🔥 Trending" : "🔗 URLs manuelles"}
                </button>
              ))}
            </div>

            {mode === "discover" ? (
              <>
                {/* Source selector */}
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Source
                </label>
                <select
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none mb-3"
                >
                  {PRESET_SOURCES.map((s) => (
                    <option key={s.url} value={s.url}>{s.name}</option>
                  ))}
                </select>

                {/* Hours & Max articles */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Depuis (heures)
                    </label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      min={1}
                      max={168}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                        focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Max articles
                    </label>
                    <input
                      type="number"
                      value={maxArticles}
                      onChange={(e) => setMaxArticles(Number(e.target.value))}
                      min={1}
                      max={50}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                        focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                    />
                  </div>
                </div>
              </>
            ) : mode === "trending" ? (
              <>
                {/* Source selector pour trending */}
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Source
                </label>
                <select
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none mb-3"
                >
                  {PRESET_SOURCES.map((s) => (
                    <option key={s.url} value={s.url}>{s.name}</option>
                  ))}
                </select>

                {/* Max articles */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Max articles par site
                  </label>
                  <input
                    type="number"
                    value={maxArticles}
                    onChange={(e) => setMaxArticles(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                      focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                  />
                </div>

                {/* Fetch trending button */}
                <button
                  onClick={fetchTrending}
                  disabled={trendingLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                    bg-red-50 text-[#DC2626] border border-[#DC2626]/20 font-medium text-xs
                    hover:bg-red-100 disabled:opacity-50 transition-colors mb-3"
                >
                  {trendingLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Flame size={14} />
                  )}
                  {trendingLoading ? "Recherche..." : "Voir les articles qui buzzent"}
                </button>

                {trendingError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600">{trendingError}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  URLs des articles
                </label>
                <div className="space-y-2 mb-3">
                  {urlFields.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const updated = [...urlFields];
                          updated[idx] = e.target.value;
                          setUrlFields(updated);
                        }}
                        placeholder={`https://www.example.com/article-${idx + 1}`}
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                          focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                      />
                      {urlFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setUrlFields(urlFields.filter((_, i) => i !== idx))}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Supprimer cette URL"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setUrlFields([...urlFields, ""])}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors mb-3"
                >
                  <Plus size={14} />
                  Ajouter une URL
                </button>
              </>
            )}

            {/* Perspective */}
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Perspective IA
            </label>
            <select
              value={perspective}
              onChange={(e) => setPerspective(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none mb-3"
            >
              {PERSPECTIVES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Force toggle */}
            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
              />
              <span className="text-xs text-gray-600">
                Forcer la republication (écrase les existants)
              </span>
            </label>

            {/* Launch error */}
            {launchError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-600 font-medium">{launchError}</p>
              </div>
            )}

            {/* Launch button */}
            {mode === "trending" ? (
              <button
                onClick={launchTrendingPipeline}
                disabled={launching || selectedTrendingUrls.size === 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  bg-[#DC2626] text-white font-medium text-sm
                  hover:bg-[#B91C1C] disabled:opacity-50 transition-colors shadow-sm"
              >
                {launching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                {launching
                  ? "Lancement..."
                  : selectedTrendingUrls.size > 0
                  ? `Lancer le pipeline (${selectedTrendingUrls.size} articles)`
                  : "Sélectionnez des articles trending"}
              </button>
            ) : (
              <button
                onClick={handleLaunch}
                disabled={launching}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  bg-[#DC2626] text-white font-medium text-sm
                  hover:bg-[#B91C1C] disabled:opacity-50 transition-colors shadow-sm"
              >
                {launching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                {launching ? "Lancement..." : "Lancer le workflow"}
              </button>
            )}
          </div>

          {/* ===== Job history ===== */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Historique
            </h3>
            {allJobs.length === 0 ? (
              <p className="text-xs text-gray-400">Aucun workflow</p>
            ) : (
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {allJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => { setActiveJobId(j.id); setExpandedArticles(new Set()); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors
                      ${activeJobId === j.id
                        ? "bg-[#DC2626]/5 text-[#DC2626] font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {j.status === "completed" ? (
                        <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                      ) : j.status === "failed" ? (
                        <AlertCircle size={12} className="text-red-500 shrink-0" />
                      ) : (
                        <Loader2 size={12} className="text-blue-500 animate-spin shrink-0" />
                      )}
                      <span className="truncate">
                        {j.sourceUrl
                          ? new URL(j.sourceUrl).hostname
                          : `${j.articles?.length || 0} articles`}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 ml-5">
                      {new Date(j.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT: Workflow visualizer ===== */}
        <div className="space-y-4">
          {/* === Trending results panel === */}
          {mode === "trending" && trendingResults && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-[#DC2626]" />
                  <h2 className="font-semibold text-gray-900 text-sm">
                    Articles Trending ({trendingResults.totalTrending})
                  </h2>
                </div>
                {selectedTrendingUrls.size > 0 && (
                  <span className="text-xs font-medium text-[#DC2626] bg-red-50 px-2 py-1 rounded-lg">
                    {selectedTrendingUrls.size} sélectionné{selectedTrendingUrls.size > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {Object.entries(trendingResults.sites).map(([siteUrl, articles]) => (
                <div key={siteUrl} className="border-b border-gray-50 last:border-b-0">
                  {/* Site header */}
                  <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700">
                        {(() => {
                          try { return new URL(siteUrl).hostname; } catch { return siteUrl; }
                        })()}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({articles.length} article{articles.length > 1 ? "s" : ""})
                      </span>
                    </div>
                    <button
                      onClick={() => selectAllTrending(articles)}
                      className="text-[10px] font-medium text-[#DC2626] hover:underline"
                    >
                      {articles.every((a) => selectedTrendingUrls.has(a.url))
                        ? "Tout désélectionner"
                        : "Tout sélectionner"}
                    </button>
                  </div>

                  {/* Articles list */}
                  <div className="divide-y divide-gray-50">
                    {articles.map((article, idx) => (
                      <label
                        key={article.url}
                        className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTrendingUrls.has(article.url)}
                          onChange={() => toggleTrendingUrl(article.url)}
                          className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {article.rank && (
                              <span className="text-[10px] font-bold text-[#DC2626] bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                                #{article.rank}
                              </span>
                            )}
                            <p className="text-sm font-medium text-gray-900 break-words">
                              {article.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {article.commentCount != null && article.commentCount > 0 && (
                              <span className="text-[10px] text-gray-500">
                                💬 {article.commentCount} commentaire{article.commentCount > 1 ? "s" : ""}
                              </span>
                            )}
                            {article.section && (
                              <span className="text-[10px] text-gray-400">
                                {article.section}
                              </span>
                            )}
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#DC2626] hover:underline flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={9} />
                              voir
                            </a>
                            {article.publishedAt && (
                              <span className="text-[10px] text-gray-400">
                                {new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {trendingResults.totalTrending === 0 && (
                <div className="px-5 py-8 text-center">
                  <Flame size={24} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">
                    Aucun article trending détecté sur ce site.
                    <br />
                    Le site n&apos;a peut-être pas de section &quot;les plus lus&quot;.
                  </p>
                </div>
              )}
            </div>
          )}

          {!activeJob && !trendingResults ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <Zap size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Sélectionnez un workflow ou lancez-en un nouveau
              </p>
            </div>
          ) : activeJob ? (
            <>
              {/* === Pipeline steps visualization === */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-900 text-sm">Pipeline</h2>
                  <span className="text-xs text-gray-400">
                    ID: {activeJob.id.slice(0, 8)}
                  </span>
                </div>

                {/* Step nodes on single row */}
                <div className="flex items-start">
                  {PIPELINE_STEPS.map((step, i) => {
                    const status = getStepStatus(activeJob, step.key);
                    const Icon = step.icon;
                    const ring =
                      status === "completed"
                        ? "ring-2 ring-green-500 bg-green-50"
                        : status === "running"
                        ? "ring-2 ring-[#DC2626] bg-[#DC2626]/5"
                        : status === "failed"
                        ? "ring-2 ring-red-500 bg-red-50"
                        : "ring-1 ring-gray-200 bg-gray-50";
                    const iconColor =
                      status === "completed" ? "text-green-600"
                        : status === "running" ? "text-[#DC2626]"
                        : status === "failed" ? "text-red-500"
                        : "text-gray-400";
                    const labelColor =
                      status === "completed" ? "text-green-600"
                        : status === "running" ? "text-[#DC2626]"
                        : status === "failed" ? "text-red-500"
                        : "text-gray-400";

                    // Line between this node and the next
                    const nextDone = i < PIPELINE_STEPS.length - 1 &&
                      status === "completed" &&
                      ["completed", "running"].includes(getStepStatus(activeJob, PIPELINE_STEPS[i + 1].key));

                    return (
                      <div key={step.key} className="flex items-center" style={{ flex: i < PIPELINE_STEPS.length - 1 ? '1 1 0%' : '0 0 auto' }}>
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${ring} transition-all duration-300`}>
                            {status === "completed" ? (
                              <CheckCircle2 size={20} className="text-green-600" />
                            ) : status === "running" ? (
                              <Loader2 size={20} className="text-[#DC2626] animate-spin" />
                            ) : status === "failed" ? (
                              <AlertCircle size={20} className="text-red-500" />
                            ) : (
                              <Icon size={18} className={iconColor} />
                            )}
                          </div>
                          <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${labelColor}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < PIPELINE_STEPS.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 mt-[-16px] ${nextDone ? 'bg-green-400' : 'bg-gray-200'} transition-colors duration-500`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Error message */}
                {activeJob.error && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 font-medium">
                      <AlertCircle size={12} className="inline mr-1" />
                      {activeJob.error}
                    </p>
                  </div>
                )}
              </div>

              {/* === Articles list === */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 text-sm">
                    Articles ({activeJob.articles.length})
                  </h2>
                </div>

                {activeJob.articles.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Circle size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">
                      {activeJob.status === "completed"
                        ? "Aucun article trouvé"
                        : "En attente des articles..."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {activeJob.articles.map((article, idx) => {
                      const isExpanded = expandedArticles.has(idx);
                      const isPublished = article.status === "published";
                      const isFailed = article.status === "failed";
                      const isSkipped = article.status === "skipped";
                      const isProcessing =
                        !isPublished && !isFailed && !isSkipped;

                      return (
                        <div key={idx}>
                          <button
                            onClick={() => toggleArticle(idx)}
                            className="w-full flex items-center gap-3 px-6 py-3.5 text-left
                              hover:bg-gray-50/50 transition-colors"
                          >
                            {isPublished ? (
                              <CheckCircle2
                                size={16}
                                className="text-green-500 shrink-0"
                              />
                            ) : isFailed ? (
                              <AlertCircle
                                size={16}
                                className="text-red-500 shrink-0"
                              />
                            ) : isSkipped ? (
                              <Circle
                                size={16}
                                className="text-gray-300 shrink-0"
                              />
                            ) : (
                              <Loader2
                                size={16}
                                className="text-[#DC2626] animate-spin shrink-0"
                              />
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 break-words">
                                {article.newTitle || article.title || article.url}
                              </p>
                              {article.newTitle && article.title && (
                                <p className="text-[10px] text-gray-400 break-words mt-0.5">
                                  Original : {article.title}
                                </p>
                              )}
                            </div>

                            {isProcessing && (
                              <span className="text-[10px] text-[#DC2626] font-medium whitespace-nowrap">
                                En cours
                              </span>
                            )}

                            {isExpanded ? (
                              <ChevronDown size={14} className="text-gray-400 shrink-0" />
                            ) : (
                              <ChevronRight size={14} className="text-gray-400 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-4 pt-0">
                              <div className="ml-7 space-y-2">
                                {/* Article URL */}
                                {article.url && (
                                  <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-[#DC2626] hover:underline flex items-center gap-1 break-all"
                                  >
                                    <ExternalLink size={10} className="shrink-0" />
                                    <span className="truncate">{article.url}</span>
                                  </a>
                                )}

                                {/* Per-article steps */}
                                {article.steps && article.steps.length > 0 && (
                                  <div className="space-y-1 mt-2">
                                    {article.steps.map((step, si) => (
                                      <div
                                        key={si}
                                        className="flex items-center gap-2 text-[11px]"
                                      >
                                        {step.status === "completed" ? (
                                          <CheckCircle2 size={11} className="text-green-500" />
                                        ) : step.status === "failed" ? (
                                          <AlertCircle size={11} className="text-red-500" />
                                        ) : step.status === "running" ? (
                                          <Loader2 size={11} className="text-[#DC2626] animate-spin" />
                                        ) : (
                                          <Circle size={11} className="text-gray-300" />
                                        )}
                                        <span className="text-gray-600">{step.name}</span>
                                        {step.detail && (
                                          <span className="text-gray-400">
                                            — {step.detail}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </div>
    }>
      <WorkflowContent />
    </Suspense>
  );
}
