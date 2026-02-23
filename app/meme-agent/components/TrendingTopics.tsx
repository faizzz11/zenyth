'use client';

interface TrendingTopicsProps {
  topics: string[];
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function TrendingTopics({
  topics,
  selectedTopic,
  onTopicSelect,
  onRefresh,
  isLoading,
  error,
}: TrendingTopicsProps) {
  const handleTopicKeyDown = (event: React.KeyboardEvent, topic: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTopicSelect(topic);
    }
  };

  const handleRefreshKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRefresh();
    }
  };

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800 text-sm font-medium font-sans mb-2">
          {error}
        </div>
        <button
          onClick={onRefresh}
          onKeyDown={handleRefreshKeyDown}
          className="px-3 py-1.5 bg-white border border-red-300 rounded-md text-red-700 text-xs font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-[#37322F] text-sm font-medium leading-5 font-sans">
          Trending Topics
        </label>
        <button
          onClick={onRefresh}
          onKeyDown={handleRefreshKeyDown}
          disabled={isLoading}
          className="px-3 py-1.5 bg-white border border-[rgba(55,50,47,0.12)] rounded-md text-[#37322F] text-xs font-medium hover:border-[rgba(55,50,47,0.24)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
          aria-label="Refresh trending topics"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicSelect(topic)}
              onKeyDown={(e) => handleTopicKeyDown(e, topic)}
              className={`p-3 rounded-lg border transition-all text-left focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2 ${
                selectedTopic === topic
                  ? 'bg-white border-[#37322F] shadow-[0px_0px_0px_3px_rgba(55,50,47,0.08)]'
                  : 'bg-white border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
              }`}
            >
              <div className="text-[#37322F] text-sm font-medium leading-5 font-sans">
                {topic}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
