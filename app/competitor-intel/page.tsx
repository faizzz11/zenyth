"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CompetitorAnalysis, Platform, AnalysisHistoryItem } from "./types";

const ANALYSIS_STAGES = [
  "Detecting platform...",
  "Scraping channel data...",
  "Fetching recent content...",
  "Analyzing performance metrics...",
  "Identifying posting patterns...",
  "Mapping audience insights...",
  "Detecting content gaps...",
  "Generating recommendations...",
];

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function CompetitorIntelPage() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"performance" | "posting" | "audience" | "gaps">("performance");

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [analyzing]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/competitor-intel/api/history");
      const data = await res.json();
      if (data.success) setHistory(data.items || []);
    } catch {}
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setStageIndex(0);
    setAnalysis(null);
    setError(null);

    try {
      const res = await fetch("/competitor-intel/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        fetchHistory();
      } else {
        setError(data.error || "Analysis failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const renderLoadingState = () => (
    <div className="rounded-xl border border-[oklch(0.6_0.2_45)]/20 bg-[oklch(0.6_0.2_45)]/5 p-8">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-[3px] border-[oklch(0.6_0.2_45)]/20 border-t-[oklch(0.6_0.2_45)] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-6 w-6 text-[oklch(0.6_0.2_45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#37322F]">Analyzing Competitor...</p>
          <p className="text-xs text-[oklch(0.6_0.2_45)] mt-1 font-medium">{ANALYSIS_STAGES[stageIndex]}</p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-1.5 rounded-full bg-[rgba(55,50,47,0.08)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[oklch(0.6_0.2_45)] transition-all duration-700 ease-out"
              style={{ width: `${((stageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-[10px] text-[#847971]">This may take 1-2 minutes depending on the channel size.</p>
      </div>
    </div>
  );

  const renderAnalysisResults = () => {
    if (!analysis) return null;

    const tabs = [
      { 
        id: "performance" as const, 
        label: "Content Performance", 
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      { 
        id: "posting" as const, 
        label: "Posting Patterns", 
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      { 
        id: "audience" as const, 
        label: "Audience Insights", 
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      },
      { 
        id: "gaps" as const, 
        label: "Content Gaps", 
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      },
    ];

    return (
      <div className="space-y-6">
        {/* Channel Overview Card */}
        <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-[oklch(0.6_0.2_45)] to-[#37322F] flex items-center justify-center text-white text-xl font-bold shrink-0">
              {analysis.channelName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[#37322F] font-serif truncate">{analysis.channelName}</h2>
              <p className="text-xs text-[#847971] truncate">{analysis.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${analysis.platform === "youtube" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}`}>
                {analysis.platform === "youtube" ? "YouTube" : "Instagram"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {analysis.platform === "youtube" ? (
              <>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{formatNumber(analysis.subscribers)}</p>
                  <p className="text-[10px] text-[#847971]">Subscribers</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{formatNumber(analysis.totalViews)}</p>
                  <p className="text-[10px] text-[#847971]">Total Views</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{formatNumber(analysis.totalPosts)}</p>
                  <p className="text-[10px] text-[#847971]">Videos</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{analysis.contentPerformance?.avgEngagementRate?.toFixed(1) ?? "—"}%</p>
                  <p className="text-[10px] text-[#847971]">Engagement Rate</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{formatNumber(analysis.followers)}</p>
                  <p className="text-[10px] text-[#847971]">Followers</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{formatNumber(analysis.totalPosts)}</p>
                  <p className="text-[10px] text-[#847971]">Posts</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{analysis.contentPerformance?.avgEngagementRate?.toFixed(1) ?? "—"}%</p>
                  <p className="text-[10px] text-[#847971]">Engagement Rate</p>
                </div>
                <div className="rounded-lg bg-[#FBFAF9] p-3 text-center">
                  <p className="text-lg font-semibold text-[#37322F]">{analysis.contentPerformance?.totalVideosAnalyzed ?? "—"}</p>
                  <p className="text-[10px] text-[#847971]">Posts Analyzed</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Analysis Tabs */}
        <div className="flex rounded-full border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-full py-2 px-3 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === t.id ? "bg-[#37322F] text-white shadow-sm" : "text-[#605A57] hover:text-[#37322F]"}`}
            >
              <span className="hidden sm:inline">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white overflow-hidden">
          {activeTab === "performance" && renderPerformanceTab()}
          {activeTab === "posting" && renderPostingTab()}
          {activeTab === "audience" && renderAudienceTab()}
          {activeTab === "gaps" && renderGapsTab()}
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="rounded-xl border border-[oklch(0.6_0.2_45)]/20 bg-[oklch(0.6_0.2_45)]/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[oklch(0.6_0.2_45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-sm font-semibold text-[#37322F]">Strategic Recommendations</h3>
            </div>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.6_0.2_45)] text-white text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-[#37322F] leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPerformanceTab = () => {
    const perf = analysis?.contentPerformance;
    if (!perf) return <div className="p-6 text-sm text-[#847971]">No performance data available.</div>;
    return (
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Best Content Type</p>
            <p className="text-sm font-medium text-[#37322F]">{perf.bestContentType || "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Duration Insight</p>
            <p className="text-sm font-medium text-[#37322F]">{perf.durationInsight || "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Avg Engagement</p>
            <p className="text-sm font-medium text-[#37322F]">{perf.avgEngagementRate?.toFixed(2) ?? "—"}%</p>
          </div>
        </div>
        {perf.topVideosByViews && perf.topVideosByViews.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#37322F] mb-3">Top Performing Content</h4>
            <div className="space-y-2">
              {perf.topVideosByViews.slice(0, 10).map((v, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-[rgba(55,50,47,0.06)] p-3 hover:bg-[#FBFAF9] transition-colors">
                  <span className="text-xs font-bold text-[#847971] w-5 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#37322F] truncate">{v.title}</p>
                    <p className="text-[10px] text-[#847971]">{v.date || ""}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[10px] text-[#605A57]">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {formatNumber(v.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {formatNumber(v.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {formatNumber(v.comments)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPostingTab = () => {
    const pat = analysis?.postingPattern;
    if (!pat) return <div className="p-6 text-sm text-[#847971]">No posting pattern data available.</div>;
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Most Active Day</p>
            <p className="text-lg font-semibold text-[#37322F]">{pat.mostActiveDay || "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Upload Frequency</p>
            <p className="text-lg font-semibold text-[#37322F]">{pat.uploadFrequency || "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Avg Posts/Week</p>
            <p className="text-lg font-semibold text-[#37322F]">{pat.avgPostsPerWeek ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Best Time to Post</p>
            <p className="text-lg font-semibold text-[#37322F]">{pat.bestTimeToPost || "—"}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
          <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Consistency Score</p>
          <p className="text-sm font-medium text-[#37322F]">{pat.consistencyScore || "—"}</p>
        </div>
      </div>
    );
  };

  const renderAudienceTab = () => {
    const aud = analysis?.audienceInsight;
    if (!aud) return <div className="p-6 text-sm text-[#847971]">No audience data available.</div>;
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Content Style</p>
            <p className="text-sm font-medium text-[#37322F]">{aud.contentStyle || "—"}</p>
          </div>
          <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Target Audience</p>
            <p className="text-sm font-medium text-[#37322F]">{aud.targetAudience || "—"}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
          <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-1">Thumbnail / Visual Style</p>
          <p className="text-sm font-medium text-[#37322F]">{aud.thumbnailStyle || "—"}</p>
        </div>
        {aud.topicClusters && aud.topicClusters.length > 0 && (
          <div>
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-2">Topic Clusters</p>
            <div className="flex flex-wrap gap-2">
              {aud.topicClusters.map((t, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-[oklch(0.6_0.2_45)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.5_0.2_45)]">{t}</span>
              ))}
            </div>
          </div>
        )}
        {aud.titlePatterns && aud.titlePatterns.length > 0 && (
          <div>
            <p className="text-[10px] text-[#847971] uppercase tracking-wide mb-2">Title Patterns</p>
            <div className="space-y-1.5">
              {aud.titlePatterns.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#37322F]">
                  <span className="text-[oklch(0.6_0.2_45)]">→</span> {p}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGapsTab = () => {
    const gap = analysis?.contentGap;
    if (!gap) return <div className="p-6 text-sm text-[#847971]">No content gap data available.</div>;
    return (
      <div className="p-6 space-y-5">
        {gap.underservedTopics && gap.underservedTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-[oklch(0.6_0.2_45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h4 className="text-xs font-semibold text-[#37322F]">Underserved Topics</h4>
            </div>
            <p className="text-[10px] text-[#847971] mb-2">Topics the competitor hasn't covered well — your opportunity.</p>
            <div className="flex flex-wrap gap-2">
              {gap.underservedTopics.map((t, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-[oklch(0.6_0.2_45)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.5_0.2_45)]">{t}</span>
              ))}
            </div>
          </div>
        )}
        {gap.overusedThemes && gap.overusedThemes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-[#847971]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-xs font-semibold text-[#37322F]">Overused Themes</h4>
            </div>
            <p className="text-[10px] text-[#847971] mb-2">Saturated topics — differentiate or avoid.</p>
            <div className="flex flex-wrap gap-2">
              {gap.overusedThemes.map((t, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-[rgba(55,50,47,0.06)] px-3 py-1 text-xs font-medium text-[#605A57]">{t}</span>
              ))}
            </div>
          </div>
        )}
        {gap.trendingOpportunities && gap.trendingOpportunities.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-[oklch(0.6_0.2_45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h4 className="text-xs font-semibold text-[#37322F]">Trending Opportunities</h4>
            </div>
            <p className="text-[10px] text-[#847971] mb-2">Rising topics the competitor hasn't covered yet.</p>
            <div className="flex flex-wrap gap-2">
              {gap.trendingOpportunities.map((t, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-[#37322F] px-3 py-1 text-xs font-medium text-white">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[oklch(0.6_0.2_45)] to-[oklch(0.5_0.25_35)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37322F] font-serif">Competitor Intelligence</h1>
              <p className="text-sm text-[#8B8580]">Analyze any YouTube channel or Instagram profile to uncover their content strategy.</p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* URL Input */}
          <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-5">
            <label className="block text-sm font-semibold text-[#37322F] mb-2">Competitor URL</label>
            <p className="text-xs text-[#847971] mb-3">
              Paste a YouTube channel URL or Instagram profile URL to analyze their content strategy.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/@channelname or https://instagram.com/username"
                className="flex-1 h-11 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] px-4 text-sm text-[#37322F] placeholder:text-[#847971] outline-none focus:border-[oklch(0.6_0.2_45)] focus:ring-1 focus:ring-[oklch(0.6_0.2_45)] transition-colors"
                onKeyDown={(e) => e.key === "Enter" && !analyzing && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !url.trim()}
                className="h-11 px-6 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply" />
                <span className="text-white text-sm font-semibold relative z-10">
                  {analyzing ? "Analyzing..." : "Analyze"}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-[10px] text-[#847971]">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" /> YouTube
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#847971]">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" /> Instagram
              </div>
            </div>
          </div>

          {/* Loading State */}
          {analyzing && renderLoadingState()}

          {/* Error */}
          {error && !analyzing && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {analysis && !analyzing && renderAnalysisResults()}

          {/* History */}
          {!analysis && !analyzing && history.length > 0 && (
            <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-[rgba(55,50,47,0.08)]">
                <h3 className="text-sm font-semibold text-[#37322F]">Recent Analyses</h3>
              </div>
              <div className="divide-y divide-[rgba(55,50,47,0.06)]">
                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setUrl(item.url)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#FBFAF9] transition-colors text-left"
                  >
                    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${item.platform === "youtube" ? "bg-red-500" : "bg-purple-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#37322F] truncate">{item.channelName}</p>
                      <p className="text-[10px] text-[#847971] truncate">{item.url}</p>
                    </div>
                    <span className="text-[10px] text-[#847971] shrink-0">
                      {new Date(item.analyzedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
