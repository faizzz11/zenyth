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
        <h3 className="text-2xl font-bold mb-2">Your Thumbnail Variations</h3>
        <p className="text-gray-600">
          Hover over each thumbnail to see details. Click to select your favorite!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedIndex === index
                ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                : 'hover:scale-102 hover:shadow-xl'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSelect(thumbnail, index)}
          >
            {/* Thumbnail Image */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={thumbnail.imageUrl}
                alt={thumbnail.style}
                className="w-full aspect-video object-cover"
              />

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-white text-center space-y-3 p-4">
                  <h4 className="text-xl font-bold">{thumbnail.style}</h4>
                  <div className="flex gap-4 justify-center text-sm">
                    <div>
                      <span className="opacity-75">Color:</span>
                      <div className="font-semibold">{thumbnail.dominantColor}</div>
                    </div>
                    <div>
                      <span className="opacity-75">Emotion:</span>
                      <div className="font-semibold">{thumbnail.emotion}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(thumbnail, index);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Select This
                    </button>
                    <button
                      onClick={(e) => handleDownload(thumbnail, e)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Badge */}
              {selectedIndex === index && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ✓ Selected
                </div>
              )}
            </div>

            {/* Thumbnail Info */}
            <div className="mt-3 text-center">
              <h4 className="font-semibold text-gray-900">{thumbnail.style}</h4>
              <p className="text-sm text-gray-600">
                {thumbnail.dominantColor} • {thumbnail.emotion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">
            ✓ You selected: <strong>{thumbnails[selectedIndex].style}</strong>
          </p>
          <p className="text-sm text-green-700 mt-1">
            You can download it or select a different variation
          </p>
        </div>
      )}
    </div>
  );
}
