'use client';

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-24 h-24 mb-8">
        {/* Spinning ring */}
        <div className="absolute inset-0 border-3 border-[rgba(55,50,47,0.08)] border-t-[#37322F] rounded-full animate-spin"></div>
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#37322F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2 mb-10">
        <h3 className="text-lg font-semibold text-[#37322F] font-sans tracking-tight">
          Generating Your Thumbnails
        </h3>
        <p className="text-[13px] text-[#847971] font-sans">
          Creating 4 unique variations · This may take 30-60 seconds
        </p>
      </div>

      {/* Progress steps */}
      <div className="space-y-3 w-full max-w-sm">
        {[
          { icon: '🔍', text: 'Analyzing your face photo', delay: '0s' },
          { icon: '🎨', text: 'Learning from reference styles', delay: '0.2s' },
          { icon: '✨', text: 'Generating variations', delay: '0.4s' },
          { icon: '🎯', text: 'Optimizing for YouTube', delay: '0.6s' },
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-[rgba(55,50,47,0.08)] bg-[#FBFAF9] p-3.5 animate-pulse"
            style={{ animationDelay: step.delay }}
          >
            <span className="text-lg">{step.icon}</span>
            <span className="text-[13px] text-[#49423D] font-sans font-medium">{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
