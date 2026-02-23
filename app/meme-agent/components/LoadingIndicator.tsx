'use client';

import { GenerationStage } from '../types';

interface LoadingIndicatorProps {
  stage: GenerationStage;
}

const stageMessages: Record<Exclude<GenerationStage, null>, string> = {
  concept: 'Generating meme concept...',
  image: 'Creating meme image...',
  video: 'Generating video with captions...',
};

export default function LoadingIndicator({ stage }: LoadingIndicatorProps) {
  if (!stage) return null;

  return (
    <div 
      className="w-full p-6 bg-white border border-[rgba(55,50,47,0.12)] rounded-lg flex flex-col items-center gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative w-12 h-12" aria-hidden="true">
        <div className="absolute inset-0 border-4 border-[rgba(55,50,47,0.12)] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[oklch(0.6_0.2_45)] rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-[#37322F] text-base font-semibold leading-6 font-sans">
          {stageMessages[stage]}
        </div>
        <div className="text-[#605A57] text-sm font-normal leading-5 font-sans text-center">
          This may take a few moments
        </div>
      </div>
      
      {/* Screen reader only announcement */}
      <span className="sr-only">
        {stageMessages[stage]} Please wait.
      </span>
    </div>
  );
}
