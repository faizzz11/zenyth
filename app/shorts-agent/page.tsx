"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { GeneratedShort, JobStatus } from "./types";

export default function ShortsAgentPage() {
  const { user } = useUser();
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [currentJob, setCurrentJob] = useState<GeneratedShort | null>(null);
  const [history, setHistory] = useState<GeneratedShort[]>([]);

  // Poll job status
  useEffect(() => {
    if (!currentJob || currentJob.status === "completed" || currentJob.status === "failed") {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/shorts-agent/api/status?jobId=${currentJob.jobId}`);
        
        if (!response.ok) {
          console.error("Status check failed:", response.status);
          return;
        }

        const status: JobStatus = await response.json();

        if (status.error) {
          setCurrentJob({
            ...currentJob,
            status: "failed",
            error: status.error,
          });
          setIsGenerating(false);
          setError(status.error);
          return;
        }

        if (status.status === "completed" && status.video_url) {
          setCurrentJob({
            ...currentJob,
            status: "completed",
            videoUrl: status.video_url,
          });
          setHistory((prev) => [
            {
              ...currentJob,
              status: "completed",
              videoUrl: status.video_url,
            },
            ...prev,
          ]);
          setIsGenerating(false);
        } else if (status.status === "failed") {
          setCurrentJob({
            ...currentJob,
            status: "failed",
            error: status.error || "Generation failed",
          });
          setIsGenerating(false);
          setError(status.error || "Generation failed");
        } else {
          setCurrentJob({
            ...currentJob,
            status: status.status,
          });
        }
      } catch (err: unknown) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [currentJob]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsGenerating(true);
    setCurrentJob(null);

    try {
      const response = await fetch("/shorts-agent/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate short");
      }

      const { jobId, url: originalUrl } = await response.json();

      if (!jobId) {
        throw new Error("No job ID received from server");
      }

      const newJob: GeneratedShort = {
        id: Date.now().toString(),
        jobId,
        originalUrl,
        status: "pending",
        createdAt: new Date(),
      };

      setCurrentJob(newJob);
      setUrl("");
    } catch (err: unknown) {
      console.error("Generate error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate short");
      setIsGenerating(false);
    }
  };

  const canGenerate = () => {
    if (!user) return false;
    if (isGenerating) return false;
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Vertical borders */}
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Header */}
          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-white backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <Link href="/" className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Zenyth
                    </div>
                  </div>
                </Link>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <Link href="/">
                    <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                        Back to Home
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    AI YouTube Shorts Generator
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Transform YouTube videos into engaging shorts.
                    <br className="hidden sm:block" />
                    Paste a URL and let AI create the perfect clip.
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="w-full max-w-[800px] lg:w-[800px] flex flex-col gap-6 mt-12">
                {/* URL Input Form */}
                <form onSubmit={handleGenerate} className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6">
                  <label htmlFor="url" className="block text-sm font-semibold text-[#37322F] font-sans mb-3">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.16)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:border-transparent text-[#37322F] font-sans text-sm"
                    disabled={isGenerating}
                  />
                  <p className="mt-2 text-xs text-[#847971] font-sans">
                    Enter a valid YouTube video URL to generate a short clip
                  </p>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-sans">
                    <p className="font-semibold text-red-800 mb-1">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate()}
                  className="w-full h-14 sm:h-16 px-6 sm:px-8 py-3 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
                >
                  <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
                  <div className="flex flex-col justify-center text-white text-base sm:text-lg font-semibold leading-6 font-sans tracking-tight text-center">
                    {isGenerating ? "Generating..." : "Generate Short"}
                  </div>
                </button>

                {!user && (
                  <p className="text-center text-sm text-[#847971] font-sans">
                    Please sign in to generate shorts.
                  </p>
                )}

                {/* Current Job Status */}
                {currentJob && (
                  <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-[#37322F] font-sans">Current Generation</h3>
                      <StatusBadge status={currentJob.status} />
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-[#847971] font-sans mb-1">Original URL</p>
                      <p className="text-sm text-[#37322F] font-sans truncate">{currentJob.originalUrl}</p>
                    </div>

                    {currentJob.status === "processing" && (
                      <div className="flex items-center space-x-3 py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[oklch(0.6_0.2_45)]"></div>
                        <p className="text-sm text-[#605A57] font-sans">Processing video...</p>
                      </div>
                    )}

                    {currentJob.status === "completed" && currentJob.videoUrl && (
                      <div className="space-y-4 mt-4">
                        <div className="bg-[#FBFAF9] rounded-lg p-4">
                          <video
                            src={currentJob.videoUrl}
                            controls
                            className="w-full rounded-lg"
                            onError={(e) => {
                              console.error("Video load error:", e);
                              const url = new URL(currentJob.videoUrl!);
                              const path = url.pathname;
                              const proxyUrl = `/shorts-agent/api/video?path=${encodeURIComponent(path)}`;
                              console.log("Trying proxy URL:", proxyUrl);
                              e.currentTarget.src = proxyUrl;
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="flex space-x-3">
                          <a
                            href={currentJob.videoUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-3 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-semibold font-sans text-center hover:opacity-90 transition-opacity"
                          >
                            Download Short
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(currentJob.videoUrl!);
                              alert("Video URL copied to clipboard!");
                            }}
                            className="px-4 py-3 border border-[rgba(55,50,47,0.16)] text-[#37322F] rounded-lg text-sm font-semibold font-sans hover:bg-[#FBFAF9] transition-colors"
                          >
                            Copy URL
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJob.status === "failed" && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-sans">{currentJob.error || "Generation failed"}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!isGenerating && !error && !currentJob && (
                  <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-12 text-center flex flex-col items-center gap-3">
                    <span className="text-5xl">🎬</span>
                    <h3 className="text-lg font-semibold text-[#37322F] font-sans">
                      Ready to Create Shorts
                    </h3>
                    <p className="text-sm text-[#847971] font-sans">
                      Enter a YouTube URL and click &quot;Generate Short&quot; to start
                    </p>
                  </div>
                )}
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="w-full max-w-[1000px] lg:w-[1000px] mt-16 mb-12">
                  <h2 className="text-2xl font-semibold text-[#37322F] font-sans mb-6">History</h2>
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm text-[#37322F] font-sans truncate mb-1">{item.originalUrl}</p>
                            <p className="text-xs text-[#847971] font-sans">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        {item.videoUrl && (
                          <div className="mt-4 flex items-center space-x-4">
                            <video
                              src={item.videoUrl}
                              className="w-32 h-32 object-cover rounded-lg"
                              onError={(e) => {
                                const url = new URL(item.videoUrl!);
                                const path = url.pathname;
                                e.currentTarget.src = `/shorts-agent/api/video?path=${encodeURIComponent(path)}`;
                              }}
                            />
                            <div className="flex space-x-2">
                              <a
                                href={item.videoUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-semibold font-sans hover:opacity-90 transition-opacity"
                              >
                                Download
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.videoUrl!);
                                  alert("Video URL copied!");
                                }}
                                className="px-4 py-2 border border-[rgba(55,50,47,0.16)] text-[#37322F] rounded-lg text-sm font-semibold font-sans hover:bg-[#FBFAF9] transition-colors"
                              >
                                Copy URL
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: GeneratedShort["status"] }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-sans border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
