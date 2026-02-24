'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ThumbnailForm from './components/ThumbnailForm';
import ThumbnailGrid from './components/ThumbnailGrid';
import LoadingIndicator from './components/LoadingIndicator';
import { ThumbnailGenerationResponse, ThumbnailVariation } from './types';

export default function ThumbnailAgentPage() {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbnails, setThumbnails] = useState<ThumbnailVariation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailVariation | null>(null);

  const handleGenerate = async (params: any) => {
    setIsGenerating(true);
    setError(null);
    setThumbnails(null);
    setSelectedThumbnail(null);

    try {
      const response = await fetch('/thumbnail-agent/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
        }),
      });

      const data: ThumbnailGenerationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate thumbnails');
      }

      setThumbnails(data.thumbnails!);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setThumbnails(null);
    setSelectedThumbnail(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[rgba(55,50,47,0.08)] px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[#37322F] flex items-center justify-center shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#37322F] font-sans tracking-tight">
                Thumbnail Agent
              </h1>
              <p className="text-[13px] text-[#847971] font-sans">
                AI-powered YouTube thumbnail generator with A/B testing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-[oklch(0.6_0.2_45/0.08)] border border-[oklch(0.6_0.2_45/0.15)]">
              <span className="text-[12px] font-medium text-[oklch(0.5_0.18_45)] font-sans">
                4 variations per generation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-[1200px]">
        {!thumbnails && !isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-[rgba(55,50,47,0.10)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)]">
                  <h2 className="text-[15px] font-semibold text-[#37322F] font-sans">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-[12px] text-[#847971] font-sans mt-0.5">
                    Upload your face and customize the output
                  </p>
                </div>
                <div className="p-6">
                  <ThumbnailForm onGenerate={handleGenerate} isGenerating={isGenerating || !user} />
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* How It Works */}
              <div className="rounded-xl border border-[rgba(55,50,47,0.10)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)]">
                  <h3 className="text-[15px] font-semibold text-[#37322F] font-sans">
                    How It Works
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { step: "1", title: "Upload Your Face", desc: "Provide a clear frontal photo of yourself", icon: "👤" },
                    { step: "2", title: "Customize", desc: "Add video type, design instructions, or images", icon: "🎨" },
                    { step: "3", title: "Get 4 Variations", desc: "AI generates 4 unique thumbnail styles", icon: "✨" },
                    { step: "4", title: "Select & Download", desc: "Choose your favorite in 1280×720", icon: "📥" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[#37322F] flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold font-sans">
                        {item.step}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-[13px] font-semibold text-[#37322F] font-sans leading-5">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-[#847971] font-sans leading-[18px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Get */}
              <div className="rounded-xl border border-[oklch(0.6_0.2_45/0.2)] bg-gradient-to-br from-[oklch(0.6_0.2_45/0.04)] to-transparent overflow-hidden">
                <div className="p-5">
                  <h3 className="text-[13px] font-semibold text-[#37322F] font-sans mb-3 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.6 0.2 45)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    What You&apos;ll Get
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { style: "Dramatic Shock Style", desc: "High emotion, viral appeal" },
                      { style: "Clean Professional Style", desc: "Trustworthy, educational" },
                      { style: "Cinematic Dark Style", desc: "Mysterious, high-production" },
                      { style: "Bright Viral Style", desc: "Energetic, attention-grabbing" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.2_45)]" />
                        <span className="text-[13px] font-sans">
                          <span className="font-medium text-[#37322F]">{item.style}</span>
                          <span className="text-[#847971]"> · {item.desc}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Note */}
              <div className="rounded-xl border border-[rgba(55,50,47,0.10)] p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(55,50,47,0.04)] flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#847971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-[#605A57] font-sans leading-[18px]">
                    <span className="font-semibold text-[#37322F]">Privacy & Ethics:</span> Your face is used exclusively in your thumbnails. We learn composition from references but never copy or use other people&apos;s faces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && <LoadingIndicator />}

        {/* Error State */}
        {error && !isGenerating && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-red-800 font-sans mb-1">
                    Generation Failed
                  </h3>
                  <p className="text-[13px] text-red-700 font-sans mb-4">{error}</p>
                  <button
                    onClick={handleRegenerate}
                    className="px-5 py-2 text-[13px] font-medium text-white bg-[#37322F] rounded-full hover:bg-[#49423D] transition-colors font-sans"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {thumbnails && !isGenerating && (
          <div className="space-y-6">
            <ThumbnailGrid thumbnails={thumbnails} onSelect={setSelectedThumbnail} />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRegenerate}
                className="px-8 py-3 text-[13px] font-semibold text-white bg-[#37322F] rounded-full hover:bg-[#49423D] transition-colors font-sans shadow-sm"
              >
                Generate New Thumbnails
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Best Practices Footer */}
      {!thumbnails && !isGenerating && !error && (
        <div className="px-8 pb-12 max-w-[1200px]">
          <div className="rounded-xl border border-[rgba(55,50,47,0.10)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)]">
              <h2 className="text-[15px] font-semibold text-[#37322F] font-sans">
                Thumbnail Best Practices
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-[rgba(55,50,47,0.06)]">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ),
                  title: "Face Visibility",
                  desc: "Your face should occupy 30-50% of the thumbnail for maximum impact",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13.5" cy="6.5" r="2.5" />
                      <path d="M17.9 17.4A7 7 0 0 1 6.1 17.4" />
                      <path d="M2 21a10 10 0 0 1 20 0" />
                    </svg>
                  ),
                  title: "High Contrast",
                  desc: "Bold colors and strong contrast ensure visibility on mobile devices",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  ),
                  title: "Mobile-First",
                  desc: "Thumbnails are optimized for small screens where most viewers watch",
                },
              ].map((item, index) => (
                <div key={index} className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(55,50,47,0.04)] flex items-center justify-center text-[#605A57] mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-[14px] font-semibold text-[#37322F] font-sans mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#847971] font-sans leading-[18px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
