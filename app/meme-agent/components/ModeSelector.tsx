'use client';

import { GenerationMode } from '../types';

interface ModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const handleKeyDown = (event: React.KeyboardEvent, targetMode: GenerationMode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onModeChange(targetMode);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-[#37322F] text-sm font-medium leading-5 font-sans">
        Generation Mode
      </label>
      <div 
        className="flex gap-2"
        role="radiogroup"
        aria-label="Generation mode selection"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'ai-suggested'}
          onClick={() => onModeChange('ai-suggested')}
          onKeyDown={(e) => handleKeyDown(e, 'ai-suggested')}
          className={`flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2 ${
            mode === 'ai-suggested'
              ? 'bg-white border-[#37322F] shadow-[0px_0px_0px_3px_rgba(55,50,47,0.08)]'
              : 'bg-white border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="text-[#37322F] text-sm font-semibold leading-5 font-sans">
              AI Suggested
            </div>
            <div className="text-[#605A57] text-xs font-normal leading-4 font-sans">
              Trending topics
            </div>
          </div>
        </button>
        
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'custom'}
          onClick={() => onModeChange('custom')}
          onKeyDown={(e) => handleKeyDown(e, 'custom')}
          className={`flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2 ${
            mode === 'custom'
              ? 'bg-white border-[#37322F] shadow-[0px_0px_0px_3px_rgba(55,50,47,0.08)]'
              : 'bg-white border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="text-[#37322F] text-sm font-semibold leading-5 font-sans">
              Custom Topic
            </div>
            <div className="text-[#605A57] text-xs font-normal leading-4 font-sans">
              Your own idea
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
