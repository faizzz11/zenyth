'use client';

import { MemeOutput } from '../types';
import Image from 'next/image';

interface MemePreviewProps {
  output: MemeOutput | null;
  isLoading: boolean;
}

export default function MemePreview({ output, isLoading }: MemePreviewProps) {
  if (isLoading || !output) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 p-6 bg-white border border-[rgba(55,50,47,0.12)] rounded-lg">
      <div className="text-[#37322F] text-lg font-semibold leading-6 font-sans">
        Your Meme
      </div>
      
      {/* Image Preview */}
      <div className="w-full aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={output.memeImage}
          alt={output.memeCaption}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Caption */}
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <div className="text-[#37322F] text-sm font-medium leading-5 font-sans text-center">
          {output.memeCaption}
        </div>
      </div>
      
      {/* Video Player (if available) */}
      {output.memeVideo && (
        <div className="w-full flex flex-col gap-2">
          <div className="text-[#37322F] text-sm font-medium leading-5 font-sans">
            Video Version
          </div>
          <div className="w-full aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={output.memeVideo}
              controls
              className="w-full h-full object-contain"
              aria-label="Meme video with animated captions"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
