'use client';

import { useState } from 'react';
import { ThumbnailVariation } from '../types';

interface ThumbnailGridProps {
  thumbnails: ThumbnailVariation[];
  onSelect?: (thumbnail: ThumbnailVariation) => void;
}

export default function ThumbnailGrid({ thumbnails, onSelect }: ThumbnailGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (thumbnail: ThumbnailVariation, index: number) => {
    setSelectedIndex(index);
    if (onSelect) {
      onSelect(thumbnail);
    }
  };

  const handleDownload = (thumbnail: ThumbnailVariation, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = thumbnail.imageUrl;
    link.download = `thumbnail-${thumbnail.style.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-[#37322F] font-sans tracking-tight mb-1">
          Your Thumbnail Variations
        </h3>
        <p className="text-[13px] text-[#847971] font-sans">
          Hover to see details · Click to select your favorite
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border ${selectedIndex === index
                ? 'ring-2 ring-[oklch(0.6_0.2_45)] border-[oklch(0.6_0.2_45/0.3)] shadow-lg scale-[1.02]'
                : 'border-[rgba(55,50,47,0.10)] hover:border-[rgba(55,50,47,0.20)] hover:shadow-md'
              }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSelect(thumbnail, index)}
          >
            {/* Thumbnail Image */}
            <div className="relative overflow-hidden bg-[#FBFAF9]">
              <img
                src={thumbnail.imageUrl}
                alt={thumbnail.style}
                className="w-full aspect-video object-cover"
              />

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-[#37322F]/70 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div className="text-white text-center space-y-3 p-4">
                  <h4 className="text-lg font-semibold font-sans">{thumbnail.style}</h4>
                  <div className="flex gap-4 justify-center text-[12px] font-sans">
                    <div>
                      <span className="opacity-70">Color:</span>
                      <div className="font-medium mt-0.5">{thumbnail.dominantColor}</div>
                    </div>
                    <div>
                      <span className="opacity-70">Emotion:</span>
                      <div className="font-medium mt-0.5">{thumbnail.emotion}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(thumbnail, index);
                      }}
                      className="px-4 py-2 bg-white text-[#37322F] rounded-full text-[13px] font-medium hover:bg-gray-100 transition-colors font-sans"
                    >
                      Select This
                    </button>
                    <button
                      onClick={(e) => handleDownload(thumbnail, e)}
                      className="px-4 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity font-sans"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Badge */}
              {selectedIndex === index && (
                <div className="absolute top-3 right-3 bg-[#37322F] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-lg font-sans flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Selected
                </div>
              )}
            </div>

            {/* Thumbnail Info */}
            <div className="p-4 text-center border-t border-[rgba(55,50,47,0.06)]">
              <h4 className="text-[14px] font-semibold text-[#37322F] font-sans">{thumbnail.style}</h4>
              <p className="text-[12px] text-[#847971] font-sans mt-0.5">
                {thumbnail.dominantColor} · {thumbnail.emotion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
          <p className="text-[13px] text-emerald-800 font-medium font-sans flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Selected: <strong>{thumbnails[selectedIndex].style}</strong>
          </p>
          <p className="text-[12px] text-emerald-700 mt-1 font-sans">
            You can download it or select a different variation
          </p>
        </div>
      )}
    </div>
  );
}
