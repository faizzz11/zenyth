"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Platform = { name: string; label: string; connected: boolean };
type TabId = "ai" | "manual";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  ),
  youtube: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ),
  twitter: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "from-purple-500 via-pink-500 to-orange-500",
  youtube: "from-red-600 to-red-600",
  twitter: "from-gray-900 to-gray-900",
  linkedin: "from-blue-700 to-blue-700",
};

const IMAGE_EXTS = ["jpg","jpeg","png","webp","gif","avif","bmp","svg"];
const VIDEO_EXTS = ["mp4","mov","avi","mkv","webm","m4v"];

function getMediaType(file: File): "image" | "video" | "unsupported" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (VIDEO_EXTS.includes(ext)) return "video";
  return "unsupported";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AllInOnePostPage() {
  const [tab, setTab] = useState<TabId>("ai");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Media state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | "none">("none");
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI tab state
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<Record<string, any> | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, any>>({});
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual tab state
  const [manualContent, setManualContent] = useState<Record<string, Record<string, string>>>({});

  // Publishing state
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<Record<string, { success: boolean; error?: string }> | null>(null);

  useEffect(() => {
    fetch("/api/all-in-one/connections")
      .then((r) => r.json())
      .then((data) => {
        if (data.connections) {
          setPlatforms(data.connections);
          const sel: Record<string, boolean> = {};
          data.connections.forEach((p: Platform) => { sel[p.name] = p.connected; });
          setSelected(sel);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle URL parameters for autofill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promptParam = params.get('prompt');
    const platformParam = params.get('platform');
    
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam));
      setTab('ai');
    }
    
    if (platformParam && platforms.length > 0) {
      // Select only the specified platform
      const sel: Record<string, boolean> = {};
      platforms.forEach((p) => {
        sel[p.name] = p.name === platformParam && p.connected;
      });
      setSelected(sel);
    }
  }, [platforms]);

  const connectedPlatforms = platforms.filter((p) => p.connected);
  const selectedPlatforms = connectedPlatforms.filter((p) => selected[p.name]);

  const togglePlatform = (name: string) => setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  const selectAll = () => {
    const sel: Record<string, boolean> = {};
    connectedPlatforms.forEach((p) => (sel[p.name] = true));
    setSelected((prev) => ({ ...prev, ...sel }));
  };
  const deselectAll = () => {
    const sel: Record<string, boolean> = {};
    connectedPlatforms.forEach((p) => (sel[p.name] = false));
    setSelected((prev) => ({ ...prev, ...sel }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMediaError(null);
    if (!file) { setMediaFile(null); setMediaPreview(null); setMediaType("none"); return; }
    const type = getMediaType(file);
    if (type === "unsupported") {
      setMediaError("Unsupported file type. Use JPG, PNG, WEBP, AVIF, MP4, MOV, etc.");
      setMediaFile(null); setMediaPreview(null); setMediaType("none");
      return;
    }
    setMediaFile(file);
    setMediaType(type);
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
  };

  const removeMedia = () => {
    setMediaFile(null); setMediaPreview(null); setMediaType("none"); setMediaError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedPlatforms.length === 0) return;
    setGenerating(true); setAiContent(null); setEditedContent({}); setPublishResults(null); setAiError(null);
    try {
      const res = await fetch("/api/all-in-one/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          platforms: selectedPlatforms.map((p) => p.name),
          mediaType,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setAiContent(data.content);
        setEditedContent(JSON.parse(JSON.stringify(data.content)));
      } else {
        setAiError(data.error || "Failed to generate content. Please try again.");
      }
    } catch {
      setAiError("Network error. Please try again.");
    } finally { setGenerating(false); }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;
    setPublishing(true); setPublishResults(null);

    let base64: string | undefined;
    if (mediaFile) {
      try { base64 = await fileToBase64(mediaFile); } catch {}
    }

    const isAi = tab === "ai";
    const payloadPlatforms = selectedPlatforms.map((p) => ({
      name: p.name,
      content: isAi ? (editedContent[p.name] || aiContent?.[p.name] || {}) : (manualContent[p.name] || {}),
      mediaFile: base64 ? { base64, name: mediaFile!.name, type: mediaFile!.type } : undefined,
    }));

    try {
      const res = await fetch("/api/all-in-one/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: payloadPlatforms }),
      });
      const data = await res.json();
      if (data.results) setPublishResults(data.results);
    } catch {} finally { setPublishing(false); }
  };

  const updateEditedField = (platform: string, field: string, value: string) => {
    setEditedContent((prev) => ({ ...prev, [platform]: { ...prev[platform], [field]: value } }));
  };
  const updateManualField = (platform: string, field: string, value: string) => {
    setManualContent((prev) => ({ ...prev, [platform]: { ...prev[platform], [field]: value } }));
  };

  const renderMediaUpload = () => (
    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-5">
      <label className="block text-sm font-semibold text-[#37322F] mb-2">Upload Media</label>
      <p className="text-xs text-[#847971] mb-3">
        Upload an image or video. The system will automatically detect the type and post accordingly to each platform.
      </p>
      {!mediaFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[rgba(55,50,47,0.2)] bg-[#FBFAF9] py-8 cursor-pointer hover:border-[oklch(0.6_0.2_45)] hover:bg-[oklch(0.6_0.2_45)]/5 transition-all"
        >
          <svg className="h-8 w-8 text-[#847971]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-[#605A57]">Click to upload image or video</span>
          <span className="text-xs text-[#847971]">JPG, PNG, WEBP, AVIF, MP4, MOV</span>
        </div>
      ) : (
        <div className="flex items-start gap-4 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] p-3">
          {mediaType === "image" && mediaPreview && (
            <img src={mediaPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
          )}
          {mediaType === "video" && mediaPreview && (
            <video src={mediaPreview} className="h-20 w-20 rounded-lg object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#37322F] truncate">{mediaFile.name}</p>
            <p className="text-xs text-[#847971]">{(mediaFile.size / 1024 / 1024).toFixed(1)} MB · {mediaType === "image" ? "📷 Image" : "🎬 Video"}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {mediaType === "image" && (
                <>
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">IG: Feed Post</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">LI: Image Post</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">X: Image Tweet</span>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">YT: Community Post</span>
                </>
              )}
              {mediaType === "video" && (
                <>
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">IG: Reel</span>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">YT: Video Upload</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">X: Video Tweet</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">LI: Video Post</span>
                </>
              )}
            </div>
          </div>
          <button onClick={removeMedia} className="rounded-full p-1.5 hover:bg-red-50 transition-colors" aria-label="Remove media">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
      {mediaError && <p className="mt-2 text-xs text-red-600">{mediaError}</p>}
    </div>
  );

  const renderPlatformToggles = () => (
    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#37322F]">Select Platforms</h3>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-[#605A57] hover:text-[#37322F] transition-colors">Select All</button>
          <span className="text-xs text-[rgba(55,50,47,0.3)]">|</span>
          <button onClick={deselectAll} className="text-xs text-[#605A57] hover:text-[#37322F] transition-colors">Deselect All</button>
        </div>
      </div>
      {connectedPlatforms.length === 0 ? (
        <p className="text-sm text-[#847971]">No connected accounts. <Link href="/settings" className="text-[oklch(0.6_0.2_45)] hover:underline">Connect in Settings</Link></p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {connectedPlatforms.map((p) => (
            <button key={p.name} onClick={() => togglePlatform(p.name)}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all ${selected[p.name] ? "border-[oklch(0.6_0.2_45)] bg-[oklch(0.6_0.2_45)]/5 shadow-sm" : "border-[rgba(55,50,47,0.12)] bg-white hover:border-[rgba(55,50,47,0.25)]"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br ${PLATFORM_COLORS[p.name]} text-white shrink-0`}>{PLATFORM_ICONS[p.name]}</div>
              <span className="text-xs font-medium text-[#37322F]">{p.label}</span>
              <div className={`ml-auto h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected[p.name] ? "border-[oklch(0.6_0.2_45)] bg-[oklch(0.6_0.2_45)]" : "border-[rgba(55,50,47,0.25)]"}`}>
                {selected[p.name] && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderAiTab = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-5">
        <label className="block text-sm font-semibold text-[#37322F] mb-2">Your Idea / Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your content idea... e.g. 'Launch announcement for our new AI-powered design tool'"
          className="w-full h-28 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-4 py-3 text-sm text-[#37322F] placeholder:text-[#847971] outline-none focus:border-[oklch(0.6_0.2_45)] focus:ring-1 focus:ring-[oklch(0.6_0.2_45)] transition-colors resize-none" />
        <button onClick={handleGenerate} disabled={generating || !prompt.trim() || selectedPlatforms.length === 0}
          className="mt-4 w-full h-12 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
          <span className="text-white text-sm font-semibold relative z-10">{generating ? "Generating Content..." : "Generate with AI"}</span>
        </button>
      </div>
      {generating && (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[oklch(0.6_0.2_45)] border-t-transparent" />
          <span className="text-sm text-[#605A57]">AI is crafting platform-specific content...</span>
        </div>
      )}
      {aiError && !generating && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{aiError}</p>
        </div>
      )}
      {aiContent && !generating && Object.keys(editedContent).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#37322F]">Generated Content — review and edit before posting</h3>
          {selectedPlatforms.map((p) => {
            const content = editedContent[p.name];
            if (!content || Object.keys(content).length === 0) return (
              <div key={p.name} className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white overflow-hidden">
                <div className={`flex items-center gap-2.5 px-5 py-3 bg-linear-to-r ${PLATFORM_COLORS[p.name]} text-white`}>
                  {PLATFORM_ICONS[p.name]}<span className="text-sm font-semibold">{p.label}</span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[#847971]">No content generated for this platform. Try regenerating.</p>
                </div>
              </div>
            );
            return (
              <div key={p.name} className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white overflow-hidden">
                <div className={`flex items-center gap-2.5 px-5 py-3 bg-linear-to-r ${PLATFORM_COLORS[p.name]} text-white`}>
                  {PLATFORM_ICONS[p.name]}<span className="text-sm font-semibold">{p.label}</span>
                </div>
                <div className="p-5 space-y-3">
                  {Object.entries(content).map(([field, value]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-[#605A57] mb-1 capitalize">{field.replace(/_/g, " ")}</label>
                      {Array.isArray(value) ? (
                        <textarea value={(value as string[]).join(", ")} onChange={(e) => updateEditedField(p.name, field, e.target.value)}
                          className="w-full rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-3 py-2 text-sm text-[#37322F] outline-none focus:border-[oklch(0.6_0.2_45)] resize-none h-16" />
                      ) : typeof value === "string" && value.length > 100 ? (
                        <textarea value={value as string} onChange={(e) => updateEditedField(p.name, field, e.target.value)}
                          className="w-full rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-3 py-2 text-sm text-[#37322F] outline-none focus:border-[oklch(0.6_0.2_45)] resize-none h-24" />
                      ) : (
                        <input type="text" value={String(value)} onChange={(e) => updateEditedField(p.name, field, e.target.value)}
                          className="w-full h-9 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-3 text-sm text-[#37322F] outline-none focus:border-[oklch(0.6_0.2_45)]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const getManualFields = (platformName: string): { field: string; label: string; type: "input" | "textarea" }[] => {
    switch (platformName) {
      case "instagram":
        return [
          { field: "feed_caption", label: "Caption", type: "textarea" },
          { field: "hashtags", label: "Hashtags (comma separated)", type: "input" },
        ];
      case "youtube":
        if (mediaType === "video") {
          return [
            { field: "video_title", label: "Video Title", type: "input" },
            { field: "description", label: "Description", type: "textarea" },
            { field: "tags", label: "Tags (comma separated)", type: "input" },
          ];
        }
        // Image or no media → community post fields
        return [
          { field: "community_post", label: "Community Post Text", type: "textarea" },
          { field: "hashtags", label: "Hashtags (comma separated)", type: "input" },
        ];
      case "twitter":
        return [{ field: "tweet", label: "Tweet", type: "textarea" }];
      case "linkedin":
        return [{ field: "post", label: "Post Content", type: "textarea" }];
      default:
        return [];
    }
  };

  const renderManualTab = () => (
    <div className="space-y-4">
      {selectedPlatforms.length === 0 ? (
        <p className="text-sm text-[#847971] text-center py-8">Select at least one platform above.</p>
      ) : (
        selectedPlatforms.map((p) => {
          const fields = getManualFields(p.name);
          return (
            <div key={p.name} className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white overflow-hidden">
              <div className={`flex items-center gap-2.5 px-5 py-3 bg-linear-to-r ${PLATFORM_COLORS[p.name]} text-white`}>
                {PLATFORM_ICONS[p.name]}<span className="text-sm font-semibold">{p.label}</span>
              </div>
              <div className="p-5 space-y-3">
                {fields.map((f) => (
                  <div key={f.field}>
                    <label className="block text-xs font-medium text-[#605A57] mb-1">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea value={manualContent[p.name]?.[f.field] || ""} onChange={(e) => updateManualField(p.name, f.field, e.target.value)}
                        placeholder={`Enter ${f.label.toLowerCase()}...`}
                        className="w-full rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-3 py-2 text-sm text-[#37322F] placeholder:text-[#847971] outline-none focus:border-[oklch(0.6_0.2_45)] resize-none h-24" />
                    ) : (
                      <input type="text" value={manualContent[p.name]?.[f.field] || ""} onChange={(e) => updateManualField(p.name, f.field, e.target.value)}
                        placeholder={`Enter ${f.label.toLowerCase()}...`}
                        className="w-full h-9 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-3 text-sm text-[#37322F] placeholder:text-[#847971] outline-none focus:border-[oklch(0.6_0.2_45)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderPublishResults = () => {
    if (!publishResults) return null;
    return (
      <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-5 space-y-2">
        <h3 className="text-sm font-semibold text-[#37322F] mb-3">Publishing Results</h3>
        {Object.entries(publishResults).map(([name, result]) => {
          const platform = platforms.find((p) => p.name === name);
          return (
            <div key={name} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br ${PLATFORM_COLORS[name]} text-white shrink-0`}>{PLATFORM_ICONS[name]}</div>
              <span className="text-sm font-medium text-[#37322F]">{platform?.label || name}</span>
              <span className={`ml-auto text-xs font-medium ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.success ? "✓ Published" : `✗ ${result.error || "Failed"}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[oklch(0.6_0.2_45)] border-t-transparent" />
      </div>
    );
  }

  const canPublish = tab === "ai"
    ? selectedPlatforms.length > 0 && aiContent !== null
    : selectedPlatforms.length > 0 && Object.keys(manualContent).length > 0;

  return (
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>
              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 pr-2 sm:pr-3 bg-white backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <Link href="/" className="flex justify-center items-center">
                  <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">Zenyth</div>
                </Link>
                <Link href="/dashboard">
                  <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">Dashboard</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[160px] pb-8 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] flex flex-col justify-center items-center gap-4">
                <div className="text-center text-[#37322F] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[64px] font-normal leading-[1.1] font-serif">All In One Post</div>
                <div className="text-center text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] font-sans text-sm font-medium max-w-[500px]">
                  Generate AI-powered content or create manually, then publish to all your platforms at once.
                </div>
              </div>

              <div className="w-full max-w-[800px] flex flex-col gap-6 mt-10">
                {/* Tabs */}
                <div className="flex rounded-full border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] p-1">
                  <button onClick={() => setTab("ai")} className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${tab === "ai" ? "bg-[#37322F] text-white shadow-sm" : "text-[#605A57] hover:text-[#37322F]"}`}>Generate All with AI</button>
                  <button onClick={() => setTab("manual")} className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${tab === "manual" ? "bg-[#37322F] text-white shadow-sm" : "text-[#605A57] hover:text-[#37322F]"}`}>Upload / Create Manually</button>
                </div>

                {renderPlatformToggles()}
                {renderMediaUpload()}
                {tab === "ai" ? renderAiTab() : renderManualTab()}
                {renderPublishResults()}

                {canPublish && (
                  <button onClick={handlePublish} disabled={publishing}
                    className="w-full h-14 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
                    <span className="text-white text-base font-semibold relative z-10">
                      {publishing ? "Publishing..." : `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? "s" : ""}`}
                    </span>
                  </button>
                )}
                <div className="h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
