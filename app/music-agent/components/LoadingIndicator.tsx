'use client';

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-6">
        {/* Spinning vinyl record */}
        <div className="absolute inset-0 border-8 border-gray-300 rounded-full animate-spin">
          <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Generating Your Music</h3>
        <p className="text-gray-600">This may take up to 30 seconds...</p>
      </div>

      {/* Animated music notes */}
      <div className="flex gap-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="text-4xl animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            🎵
          </div>
        ))}
      </div>
    </div>
  );
}
