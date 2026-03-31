"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [perspective, setPerspective] = useState("analyse critique et tech-savvy");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("gemma3:12b");
  const [ollamaTimeout, setOllamaTimeout] = useState(120);
  const [autoMode, setAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState(2);
  const [maxArticlesPerRun, setMaxArticlesPerRun] = useState(5);
  const [hoursLookback, setHoursLookback] = useState(24);
  const [forceByDefault, setForceByDefault] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const fetchAutoConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pipeline/auto");
      if (res.ok) {
        const data = await res.json();
        setAutoMode(data.config.enabled);
        setAutoInterval(data.config.intervalHours);
        setMaxArticlesPerRun(data.config.maxArticles);
        setHoursLookback(data.config.hoursLookback);
        setPerspective(data.config.perspective);
        setNextRun(data.nextRun);
        setLastRun(data.lastRun);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchAutoConfig(); }, [fetchAutoConfig]);

  const handleSave = async () => {
    setAutoLoading(true);
    try {
      const res = await fetch("/api/admin/pipeline/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: autoMode,
          intervalHours: autoInterval,
          perspective,
          maxArticles: maxArticlesPerRun,
          hoursLookback,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNextRun(data.nextRun);
        setLastRun(data.lastRun);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch { /* silent */ }
    setAutoLoading(false);
  };

  const PERSPECTIVES = [
    "analyse critique et tech-savvy",
    "vulgarisation grand public",
    "point de vue business et innovation",
    "enquête approfondie et factuelle",
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configuration du pipeline et du mode automatique.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in">
              <CheckCircle2 size={14} /> Sauvegardé
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={autoLoading}
            className="px-5 py-2.5 bg-[#DC2626] text-white rounded-xl text-sm font-medium
              hover:bg-[#B91C1C] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            {autoLoading && <Loader2 size={14} className="animate-spin" />}
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* === Section: Mode automatique === */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-50">
              <Clock size={18} className="text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                Mode automatique
              </h2>
              <p className="text-xs text-gray-500">
                Le pipeline s&apos;exécute automatiquement à intervalles réguliers.
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setAutoMode(!autoMode)}
                className="flex items-center gap-2"
              >
                {autoMode ? (
                  <ToggleRight size={28} className="text-[#DC2626]" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-300" />
                )}
                <span className={`text-xs font-medium ${autoMode ? "text-[#DC2626]" : "text-gray-400"}`}>
                  {autoMode ? "Actif" : "Inactif"}
                </span>
              </button>
            </div>
          </div>

          {autoMode && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Intervalle (heures)
                </label>
                <input
                  type="number"
                  value={autoInterval}
                  onChange={(e) => setAutoInterval(Number(e.target.value) || 2)}
                  min={1}
                  max={72}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Articles par exécution
                </label>
                <input
                  type="number"
                  value={maxArticlesPerRun}
                  onChange={(e) => setMaxArticlesPerRun(Number(e.target.value) || 5)}
                  min={1}
                  max={50}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
              </div>
            </div>
          )}

          {/* Schedule info */}
          {autoMode && (lastRun || nextRun) && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {lastRun && (
                <p className="text-[11px] text-gray-500">
                  Dernière exécution : <span className="font-medium">{new Date(lastRun).toLocaleString("fr-FR")}</span>
                </p>
              )}
              {nextRun && (
                <p className="text-[11px] text-green-600">
                  Prochaine exécution : <span className="font-medium">{new Date(nextRun).toLocaleString("fr-FR")}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* === Section: IA / Ollama === */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[#DC2626]/5">
              <Zap size={18} className="text-[#DC2626]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                Intelligence Artificielle
              </h2>
              <p className="text-xs text-gray-500">
                Configuration du modèle Ollama pour la réécriture.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Perspective par défaut
              </label>
              <select
                value={perspective}
                onChange={(e) => setPerspective(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
              >
                {PERSPECTIVES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  URL Ollama
                </label>
                <input
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Modèle
                </label>
                <input
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Timeout (secondes)
              </label>
              <input
                type="number"
                value={ollamaTimeout}
                onChange={(e) => setOllamaTimeout(Number(e.target.value) || 120)}
                min={30}
                max={600}
                className="w-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
              />
            </div>
          </div>
        </div>

        {/* === Section: Pipeline === */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-50">
              <Settings size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                Pipeline
              </h2>
              <p className="text-xs text-gray-500">
                Paramètres par défaut du pipeline de traitement.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Lookback par défaut (heures)
              </label>
              <input
                type="number"
                value={hoursLookback}
                onChange={(e) => setHoursLookback(Number(e.target.value) || 24)}
                min={1}
                max={168}
                className="w-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={forceByDefault}
                onChange={(e) => setForceByDefault(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
              />
              <div>
                <span className="text-sm text-gray-700">
                  Forcer la republication par défaut
                </span>
                <p className="text-[11px] text-gray-400">
                  Écrase les articles existants au lieu de les ignorer.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Les paramètres sont actuellement stockés en mémoire. Pour la persistance,
            exécutez <code className="bg-amber-100 px-1 rounded">database/012_create_pipeline_jobs.sql</code> dans
            l&apos;éditeur SQL Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
