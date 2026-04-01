"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Youtube,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
  Image,
} from "lucide-react";

interface YouTubeSource {
  id: string;
  name: string;
  channel_url: string;
  slot_position: string;
  video_count: number;
  enabled: boolean;
  created_at: string;
}

interface YouTubeConfig {
  enabled: boolean;
  refresh_hours: number[];
  rotation_minutes: number;
}

const SLOT_LABELS: Record<string, string> = {
  main: "Principal (grande vidéo)",
  bottom_left: "Bas gauche",
  bottom_right: "Bas droite",
};

export default function VideosAdminPage() {
  const [sources, setSources] = useState<YouTubeSource[]>([]);
  const [config, setConfig] = useState<YouTubeConfig>({
    enabled: false,
    refresh_hours: [6, 21],
    rotation_minutes: 120,
  });
  const [refreshRunning, setRefreshRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSlot, setNewSlot] = useState("main");
  const [newCount, setNewCount] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [srcRes, cfgRes] = await Promise.all([
        fetch("/api/admin/youtube/sources"),
        fetch("/api/admin/youtube/config"),
      ]);
      if (!srcRes.ok || !cfgRes.ok) throw new Error("Erreur chargement");
      const srcData = await srcRes.json();
      const cfgData = await cfgRes.json();
      setSources(srcData.sources ?? []);
      setConfig(cfgData.config ?? { enabled: false, refresh_hours: [6, 21], rotation_minutes: 120 });
      setRefreshRunning(cfgData.refreshRunning ?? false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/youtube/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde");
      const data = await res.json();
      setConfig(data.config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* silent */ }
    setSaving(false);
  };

  const handleAddSource = async () => {
    if (!newName || !newUrl) return;
    try {
      const res = await fetch("/api/admin/youtube/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          channel_url: newUrl,
          slot_position: newSlot,
          video_count: newCount,
        }),
      });
      if (!res.ok) throw new Error("Erreur ajout");
      setNewName("");
      setNewUrl("");
      setNewSlot("main");
      setNewCount(10);
      setShowAdd(false);
      fetchData();
    } catch { /* silent */ }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await fetch(`/api/admin/youtube/sources/${id}`, { method: "DELETE" });
      fetchData();
    } catch { /* silent */ }
  };

  const handleToggleSource = async (source: YouTubeSource) => {
    try {
      await fetch(`/api/admin/youtube/sources/${source.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !source.enabled }),
      });
      fetchData();
    } catch { /* silent */ }
  };

  const handleRefreshNow = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/youtube/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Erreur refresh");
      const data = await res.json();
      const total = data.results?.reduce((sum: number, r: { count?: number }) => sum + (r.count ?? 0), 0) ?? 0;
      alert(`Refresh terminé : ${total} vidéos mises en cache`);
      fetchData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur refresh");
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vidéos YouTube</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les sources vidéo affichées sur la landing page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in">
              <CheckCircle2 size={14} /> Sauvegardé
            </span>
          )}
          <button
            onClick={handleRefreshNow}
            disabled={refreshing}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium
              hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Rafraîchir maintenant
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="px-5 py-2.5 bg-[#DC2626] text-white rounded-xl text-sm font-medium
              hover:bg-[#B91C1C] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Sauvegarder
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="space-y-6">

        {/* === Config auto-refresh === */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-red-50">
              <Clock size={18} className="text-[#DC2626]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Processus automatique</h2>
              <p className="text-xs text-gray-500">
                Récupère automatiquement les dernières vidéos aux heures configurées.
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className="flex items-center gap-2"
              >
                {config.enabled ? (
                  <ToggleRight size={28} className="text-[#DC2626]" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-300" />
                )}
                <span className={`text-xs font-medium ${config.enabled ? "text-[#DC2626]" : "text-gray-400"}`}>
                  {config.enabled ? "Actif" : "Inactif"}
                </span>
              </button>
            </div>
          </div>

          {config.enabled && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Heures de refresh (UTC)
                </label>
                <input
                  type="text"
                  value={config.refresh_hours.join(", ")}
                  onChange={(e) => {
                    const hours = e.target.value
                      .split(",")
                      .map((h) => parseInt(h.trim()))
                      .filter((h) => !isNaN(h) && h >= 0 && h <= 23);
                    setConfig({ ...config, refresh_hours: hours });
                  }}
                  placeholder="6, 21"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Ex: 6, 21 pour 6h et 21h UTC</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Rotation (minutes)
                </label>
                <input
                  type="number"
                  value={config.rotation_minutes}
                  onChange={(e) => setConfig({ ...config, rotation_minutes: parseInt(e.target.value) || 120 })}
                  min={10}
                  max={1440}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm
                    focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">120 min = rotation toutes les 2h</p>
              </div>
            </div>
          )}

          {refreshRunning && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[11px] text-green-600 flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                Boucle auto-refresh active en arrière-plan
              </p>
            </div>
          )}
        </div>

        {/* === Sources YouTube === */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50">
                <Youtube size={18} className="text-[#DC2626]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Sources YouTube</h2>
                <p className="text-xs text-gray-500">
                  {sources.length} source{sources.length > 1 ? "s" : ""} — 3 emplacements sur la landing page
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100
                rounded-xl text-xs font-medium text-gray-700 transition-colors border border-gray-200"
            >
              <Plus size={14} />
              Ajouter
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Le Monde"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                      focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">URL chaîne YouTube</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/@channel/videos"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                      focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Emplacement</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                      focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                  >
                    {Object.entries(SLOT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de vidéos</label>
                  <input
                    type="number"
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value) || 10)}
                    min={1}
                    max={50}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                      focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddSource}
                  className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-xs font-medium hover:bg-[#B91C1C] transition-colors"
                >
                  Ajouter la source
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Sources list */}
          <div className="space-y-2">
            {sources.map((src) => (
              <div
                key={src.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  src.enabled ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              >
                {/* Icon */}
                <div className="p-2 rounded-lg bg-red-50 flex-shrink-0">
                  <Image size={16} className="text-[#DC2626]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 truncate">{src.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                      {SLOT_LABELS[src.slot_position] ?? src.slot_position}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href={src.channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-[#DC2626] flex items-center gap-1 truncate"
                    >
                      {src.channel_url}
                      <ExternalLink size={10} />
                    </a>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] text-gray-400">{src.video_count} vidéos</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleToggleSource(src)}>
                    {src.enabled ? (
                      <ToggleRight size={22} className="text-[#DC2626]" />
                    ) : (
                      <ToggleLeft size={22} className="text-gray-300" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteSource(src.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {sources.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Aucune source YouTube configurée
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
