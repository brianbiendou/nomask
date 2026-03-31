"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Source {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  interval: number; // heures
  lastRun?: string;
  articlesFound?: number;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newInterval, setNewInterval] = useState(2);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/sources");
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setSources(data.sources ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Impossible de charger les sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const deleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const addSource = () => {
    if (!newName || !newUrl) return;
    const id = newName.toLowerCase().replace(/\s+/g, "-");
    setSources((prev) => [
      ...prev,
      {
        id,
        name: newName,
        url: newUrl,
        enabled: true,
        interval: newInterval,
        articlesFound: 0,
      },
    ]);
    setNewName("");
    setNewUrl("");
    setNewInterval(2);
    setShowAdd(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Impossible de sauvegarder");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sources</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les sites surveillés pour la découverte automatique d&apos;articles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 size={14} /> Sauvegardé
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#E84D0E] text-white rounded-xl text-sm font-medium
              hover:bg-[#C7400A] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#E84D0E]" />
          <span className="ml-2 text-sm text-gray-500">Chargement des sources…</span>
        </div>
      ) : (
      <>
      {/* Sources list */}
      <div className="space-y-3">
        {sources.map((source) => (
          <div
            key={source.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 transition-colors
              ${source.enabled ? "border-gray-100" : "border-gray-100 opacity-60"}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  source.enabled ? "bg-[#E84D0E]/5" : "bg-gray-100"
                }`}
              >
                <Globe
                  size={18}
                  className={source.enabled ? "text-[#E84D0E]" : "text-gray-400"}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {source.name}
                  </h3>
                  {source.enabled && (
                    <span className="text-[10px] bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                      Actif
                    </span>
                  )}
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-[#E84D0E] flex items-center gap-1 transition-colors"
                >
                  {source.url}
                  <ExternalLink size={10} />
                </a>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={11} />
                    Toutes les {source.interval}h
                  </div>
                  {source.lastRun && (
                    <div className="text-[11px] text-gray-400">
                      Dernier scan : {new Date(source.lastRun).toLocaleString("fr-FR")}
                    </div>
                  )}
                  {(source.articlesFound ?? 0) > 0 && (
                    <div className="text-[11px] text-green-600">
                      {source.articlesFound} articles trouvés
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Interval input */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={source.interval}
                    onChange={(e) =>
                      setSources((prev) =>
                        prev.map((s) =>
                          s.id === source.id
                            ? { ...s, interval: Number(e.target.value) || 1 }
                            : s
                        )
                      )
                    }
                    min={1}
                    max={72}
                    className="w-14 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-center
                      focus:ring-2 focus:ring-[#E84D0E]/20 focus:border-[#E84D0E] outline-none"
                  />
                  <span className="text-[10px] text-gray-400">h</span>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleSource(source.id)}
                  className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
                  title={source.enabled ? "Désactiver" : "Activer"}
                >
                  {source.enabled ? (
                    <ToggleRight size={22} className="text-[#E84D0E]" />
                  ) : (
                    <ToggleLeft size={22} className="text-gray-300" />
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteSource(source.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add source */}
      {showAdd ? (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Ajouter une source
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nom
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: 01net"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#E84D0E]/20 focus:border-[#E84D0E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                URL du site
              </label>
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://www.01net.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#E84D0E]/20 focus:border-[#E84D0E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Intervalle (h)
              </label>
              <input
                type="number"
                value={newInterval}
                onChange={(e) => setNewInterval(Number(e.target.value) || 2)}
                min={1}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                  focus:ring-2 focus:ring-[#E84D0E]/20 focus:border-[#E84D0E] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addSource}
              disabled={!newName || !newUrl}
              className="px-4 py-2 bg-[#E84D0E] text-white rounded-xl text-sm font-medium
                hover:bg-[#C7400A] disabled:opacity-50 transition-colors"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl
            border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium
            hover:border-[#E84D0E] hover:text-[#E84D0E] transition-colors"
        >
          <Plus size={16} />
          Ajouter une source
        </button>
      )}

      </>
      )}
    </div>
  );
}
