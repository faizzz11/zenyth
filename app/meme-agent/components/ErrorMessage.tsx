'use client';

import { GenerationError } from '../types';

interface ErrorMessageProps {
  error: GenerationError | null;
  onRetry: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div 
      className="w-full p-6 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-5 h-5 text-red-600" aria-hidden="true">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-red-800 text-base font-semibold leading-6 font-sans">
            {error.stage === 'concept' && 'Concept Generation Failed'}
            {error.stage === 'image' && 'Image Generation Failed'}
            {error.stage === 'video' && 'Video Generation Failed'}
          </div>
          <div className="text-red-700 text-sm font-normal leading-5 font-sans">
            {error.message}
          </div>
        </div>
      </div>
      
      {error.retryable && (
        <button
          onClick={onRetry}
          aria-label="Retry generation"
          className="self-start px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 text-sm font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
