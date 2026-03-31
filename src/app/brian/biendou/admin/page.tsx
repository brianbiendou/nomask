"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Zap,
  Globe,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Play,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Job {
  id: string;
  status: string;
  sourceUrl: string;
  mode: string;
  articles: Array<{ title: string; status: string; newTitle?: string }>;
  createdAt: string;
  completedAt?: string;
}

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    running: 0,
    failed: 0,
    articlesPublished: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pipeline/run");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);

        const j = data.jobs || [];
        setStats({
          total: j.length,
          completed: j.filter((x: Job) => x.status === "completed").length,
          running: j.filter(
            (x: Job) => !["completed", "failed", "cancelled"].includes(x.status)
          ).length,
          failed: j.filter((x: Job) => x.status === "failed").length,
          articlesPublished: j.reduce(
            (sum: number, x: Job) =>
              sum + x.articles.filter((a) => a.status === "published").length,
            0
          ),
        });
      }
    } catch {
      // Silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Poll uniquement quand il y a des jobs en cours
  useEffect(() => {
    if (stats.running === 0) return;
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs, stats.running]);

  const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    pending: { label: "En attente", color: "text-gray-500 bg-gray-50", icon: Clock },
    discovering: { label: "Découverte", color: "text-blue-600 bg-blue-50", icon: Globe },
    scraping: { label: "Scraping", color: "text-blue-600 bg-blue-50", icon: Loader2 },
    rewriting: { label: "Réécriture IA", color: "text-purple-600 bg-purple-50", icon: Zap },
    publishing: { label: "Publication", color: "text-orange-600 bg-orange-50", icon: TrendingUp },
    completed: { label: "Terminé", color: "text-green-600 bg-green-50", icon: CheckCircle2 },
    failed: { label: "Erreur", color: "text-red-600 bg-red-50", icon: AlertCircle },
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vue d&apos;ensemble du pipeline NoMask
          </p>
        </div>
        <Link
          href="/brian/biendou/admin/workflow"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E84D0E] text-white rounded-xl
            font-medium text-sm hover:bg-[#C7400A] transition-colors shadow-sm"
        >
          <Play size={16} />
          Nouveau workflow
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Workflows total",
            value: stats.total,
            icon: Zap,
            color: "text-[#E84D0E]",
            bg: "bg-[#E84D0E]/5",
          },
          {
            label: "En cours",
            value: stats.running,
            icon: Loader2,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Articles publiés",
            value: stats.articlesPublished,
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Erreurs",
            value: stats.failed,
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Workflows récents
          </h2>
          <Link
            href="/brian/biendou/admin/workflow"
            className="text-sm text-[#E84D0E] hover:text-[#C7400A] font-medium flex items-center gap-1"
          >
            Voir tout
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <Loader2 size={24} className="animate-spin text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Chargement...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Zap size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Aucun workflow lancé
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Lancez votre premier workflow depuis l&apos;onglet Workflow
            </p>
            <Link
              href="/brian/biendou/admin/workflow"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#E84D0E] text-white
                text-sm font-medium rounded-xl hover:bg-[#C7400A] transition-colors"
            >
              <Play size={14} />
              Commencer
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.slice(0, 10).map((job) => {
              const config = statusConfig[job.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const publishedCount = job.articles.filter(
                (a) => a.status === "published"
              ).length;

              return (
                <Link
                  key={job.id}
                  href={`/brian/biendou/admin/workflow?job=${job.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Status icon */}
                  <div className={`p-2 rounded-xl ${config.color.split(" ")[1]}`}>
                    <StatusIcon
                      size={16}
                      className={`${config.color.split(" ")[0]} ${
                        job.status === "scraping" || job.status === "rewriting"
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {job.sourceUrl
                          ? new URL(job.sourceUrl).hostname
                          : `${job.articles.length} article${job.articles.length > 1 ? "s" : ""}`}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                      {job.mode === "auto" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-purple-600 bg-purple-50">
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(job.createdAt).toLocaleString("fr-FR")}
                      {publishedCount > 0 && (
                        <span className="text-green-600"> · {publishedCount} publié{publishedCount > 1 ? "s" : ""}</span>
                      )}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
