'use client';

export default function LoadingIndicator() {
  return (
    <div
      className="w-full p-6 bg-white border border-[rgba(55,50,47,0.12)] rounded-xl flex flex-col items-center gap-4"
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
          Generating Your Music
        </div>
        <div className="text-[#605A57] text-sm font-normal leading-5 font-sans text-center">
          This may take up to 2 minutes...
        </div>
      </div>

      {/* Musical notes */}
      <div className="flex gap-3 mt-2">
        {['♪', '♫', '♪', '♫', '♪'].map((note, i) => (
          <span
            key={i}
            className="text-2xl animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              color: 'oklch(0.6 0.2 45)',
            }}
          >
            {note}
          </span>
        ))}
      </div>

      <span className="sr-only">Generating your music. Please wait.</span>
    </div>
  );
}
