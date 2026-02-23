'use client';

import { MemeStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: MemeStyle;
  onStyleChange: (style: MemeStyle) => void;
}

const styles: { value: MemeStyle; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional meme style' },
  { value: 'modern', label: 'Modern', description: 'Contemporary aesthetic' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' },
];

export default function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const handleKeyDown = (event: React.KeyboardEvent, style: MemeStyle) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onStyleChange(style);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-[#37322F] text-sm font-medium leading-5 font-sans">
        Meme Style
      </label>
      <div 
        className="grid grid-cols-3 gap-2"
        role="radiogroup"
        aria-label="Meme style selection"
      >
        {styles.map((style) => (
          <button
            key={style.value}
            type="button"
            role="radio"
            aria-checked={selectedStyle === style.value}
            onClick={() => onStyleChange(style.value)}
            onKeyDown={(e) => handleKeyDown(e, style.value)}
            className={`px-3 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2 ${
              selectedStyle === style.value
                ? 'bg-white border-[#37322F] shadow-[0px_0px_0px_3px_rgba(55,50,47,0.08)]'
                : 'bg-white border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="text-[#37322F] text-sm font-semibold leading-5 font-sans">
                {style.label}
              </div>
              <div className="text-[#605A57] text-xs font-normal leading-4 font-sans text-center">
                {style.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
