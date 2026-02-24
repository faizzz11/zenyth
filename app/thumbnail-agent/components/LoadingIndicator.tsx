'use client';

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-6">
        {/* Animated camera icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-pulse">📸</div>
        </div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Generating Your Thumbnails</h3>
        <p className="text-gray-600">Creating 4 unique variations...</p>
        <p className="text-sm text-gray-500">This may take 30-60 seconds</p>
      </div>

      {/* Progress steps */}
      <div className="mt-8 space-y-3 w-full max-w-md">
        {[
          { icon: '🎨', text: 'Analyzing your face photo', delay: '0s' },
          { icon: '🖼️', text: 'Learning from reference styles', delay: '0.2s' },
          { icon: '✨', text: 'Generating variations', delay: '0.4s' },
          { icon: '🎯', text: 'Optimizing for YouTube', delay: '0.6s' },
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm animate-pulse"
            style={{ animationDelay: step.delay }}
          >
            <span className="text-2xl">{step.icon}</span>
            <span className="text-sm text-gray-700">{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
