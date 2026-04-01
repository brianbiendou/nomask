"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Video,
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
  Play,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
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

interface TestVideo {
  video_id: string;
  title: string;
  thumbnail_url: string;
  published_at: string;
}

const SLOT_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "Principal (grande vidéo)", color: "bg-red-100 text-red-700" },
  1: { label: "Bas gauche", color: "bg-blue-100 text-blue-700" },
  2: { label: "Bas droite", color: "bg-purple-100 text-purple-700" },
};

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);

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
  const [reordering, setReordering] = useState(false);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCount, setNewCount] = useState(10);

  // Test modal
  const [testModal, setTestModal] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testSourceName, setTestSourceName] = useState("");
  const [testVideos, setTestVideos] = useState<TestVideo[]>([]);
  const [testError, setTestError] = useState<string | null>(null);

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
          slot_position: "reserve",
          video_count: newCount,
        }),
      });
      if (!res.ok) throw new Error("Erreur ajout");
      setNewName("");
      setNewUrl("");
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

  const handleMoveSource = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sources.length) return;

    setReordering(true);
    const reordered = [...sources];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setSources(reordered);

    try {
      const res = await fetch("/api/admin/youtube/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error("Erreur réordonnement");
      await fetchData();
    } catch {
      await fetchData();
    }
    setReordering(false);
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

  const handleTestSource = async (channelUrl: string, name: string, count: number = 10) => {
    setTestSourceName(name);
    setTestVideos([]);
    setTestError(null);
    setTestModal(true);
    setTestLoading(true);
    try {
      const res = await fetch("/api/admin/youtube/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_url: channelUrl, count }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestError(data.error || "Impossible de récupérer les vidéos");
      } else {
        setTestVideos(data.videos ?? []);
      }
    } catch (e: unknown) {
      setTestError(e instanceof Error ? e.message : "Erreur réseau");
    }
    setTestLoading(false);
  };

  const toggleHour = (hour: number) => {
    const hours = config.refresh_hours.includes(hour)
      ? config.refresh_hours.filter((h) => h !== hour)
      : [...config.refresh_hours, hour].sort((a, b) => a - b);
    setConfig({ ...config, refresh_hours: hours });
  };

  const getSlotInfo = (index: number) => {
    return SLOT_LABELS[index] ?? { label: "En réserve", color: "bg-gray-100 text-gray-500" };
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

          {/* Hour picker + rotation (always visible) */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Heures de refresh (UTC) — cliquez pour activer/désactiver
              </label>
              <div className="grid grid-cols-12 gap-1.5">
                {ALL_HOURS.map((h) => {
                  const active = config.refresh_hours.includes(h);
                  return (
                    <button
                      key={h}
                      onClick={() => toggleHour(h)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? "bg-[#DC2626] text-white shadow-sm"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 border border-gray-100"
                      }`}
                    >
                      {h}h
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                {config.refresh_hours.length === 0
                  ? "Aucune heure sélectionnée"
                  : `Refresh à ${config.refresh_hours.map((h) => `${h}h`).join(", ")} UTC`}
              </p>
            </div>
            <div className="max-w-xs">
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

          {config.enabled && refreshRunning && (
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
                <Video size={18} className="text-[#DC2626]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Sources YouTube</h2>
                <p className="text-xs text-gray-500">
                  {sources.length} source{sources.length > 1 ? "s" : ""} — les 3 premières s&apos;affichent sur la landing page
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
              <p className="text-[10px] text-gray-400 -mt-1">
                La nouvelle source sera ajoutée en réserve. Utilisez les flèches pour la placer dans un emplacement actif.
              </p>
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
              <div className="max-w-xs">
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de vidéos à récupérer</label>
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
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddSource}
                  className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-xs font-medium hover:bg-[#B91C1C] transition-colors"
                >
                  Ajouter la source
                </button>
                <button
                  onClick={() => newUrl && handleTestSource(newUrl, newName || "Nouveau", newCount)}
                  disabled={!newUrl}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <Play size={12} />
                  Tester
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
            {sources.map((src, index) => {
              const slot = getSlotInfo(index);
              const isActive = index < 3;
              return (
                <div
                  key={src.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    !src.enabled
                      ? "bg-gray-50 border-gray-100 opacity-50"
                      : isActive
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  {/* Position + Arrows */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-8">
                    <button
                      onClick={() => handleMoveSource(index, "up")}
                      disabled={index === 0 || reordering}
                      title="Monter"
                      className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-xs font-bold text-gray-400 select-none">
                      <GripVertical size={14} className="text-gray-300" />
                    </span>
                    <button
                      onClick={() => handleMoveSource(index, "down")}
                      disabled={index === sources.length - 1 || reordering}
                      title="Descendre"
                      className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? "bg-red-50" : "bg-gray-100"}`}>
                    <Image size={16} className={isActive ? "text-[#DC2626]" : "text-gray-400"} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900 truncate">{src.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${slot.color}`}>
                        {slot.label}
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
                    <button
                      onClick={() => handleTestSource(src.channel_url, src.name, src.video_count)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Tester la récupération"
                    >
                      <Play size={14} />
                    </button>
                    <button onClick={() => handleToggleSource(src)} title={src.enabled ? "Désactiver" : "Activer"}>
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
              );
            })}

            {sources.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Aucune source YouTube configurée
              </div>
            )}
          </div>
        </div>

      </div>

      {/* === Modale Test YouTube === */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            {/* Header modale */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Test : {testSourceName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {testLoading
                    ? "Récupération en cours..."
                    : testError
                    ? "Échec de la récupération"
                    : `${testVideos.length} vidéo${testVideos.length > 1 ? "s" : ""} récupérée${testVideos.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={() => setTestModal(false)}
                title="Fermer"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body modale */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {testLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 size={32} className="animate-spin text-[#DC2626]" />
                  <p className="text-sm text-gray-500">Connexion à YouTube...</p>
                </div>
              )}

              {testError && !testLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <AlertCircle size={32} className="text-red-400" />
                  <p className="text-sm text-red-600 font-medium">{testError}</p>
                  <p className="text-xs text-gray-400">Vérifiez l&apos;URL de la chaîne et réessayez</p>
                </div>
              )}

              {!testLoading && !testError && testVideos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {testVideos.map((v, i) => (
                    <a
                      key={v.video_id}
                      href={`https://www.youtube.com/watch?v=${v.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl overflow-hidden border border-gray-100 hover:border-[#DC2626]/30 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-video bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.thumbnail_url}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          #{i + 1}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">
                          {v.title}
                        </p>
                        {v.published_at && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(v.published_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer modale */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!testLoading && !testError && testVideos.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    Récupération OK
                  </span>
                )}
              </div>
              <button
                onClick={() => setTestModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
