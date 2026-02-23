'use client';

interface VideoToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function VideoToggle({ enabled, onToggle }: VideoToggleProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(!enabled);
    }
  };

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white border border-[rgba(55,50,47,0.12)] rounded-lg">
      <div className="flex flex-col gap-1">
        <label 
          htmlFor="video-toggle"
          className="text-[#37322F] text-sm font-medium leading-5 font-sans cursor-pointer"
        >
          Generate Video
        </label>
        <div className="text-[#605A57] text-xs font-normal leading-4 font-sans">
          Create an animated video version with captions
        </div>
      </div>
      
      <button
        id="video-toggle"
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle video generation"
        onClick={() => onToggle(!enabled)}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2 ${
          enabled ? 'bg-[oklch(0.6_0.2_45)]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
