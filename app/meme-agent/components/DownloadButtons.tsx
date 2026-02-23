'use client';

import { MemeOutput } from '../types';

interface DownloadButtonsProps {
  output: MemeOutput | null;
}

export default function DownloadButtons({ output }: DownloadButtonsProps) {
  if (!output) return null;

  const handleDownload = async (url: string, type: 'image' | 'video') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const timestamp = Date.now();
      const extension = type === 'image' ? 'jpg' : 'mp4';
      link.download = `meme_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => handleDownload(output.memeImage, 'image')}
        aria-label="Download meme image"
        className="flex-1 h-12 px-6 py-3 bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
      >
        <div className="flex items-center gap-2">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
            aria-hidden="true"
          >
            <path 
              d="M8 11L4 7h2.5V2h3v5H12L8 11z M2 13h12v2H2v-2z" 
              fill="currentColor"
            />
          </svg>
          <span className="text-white text-sm font-semibold leading-5 font-sans">
            Download Image
          </span>
        </div>
      </button>
      
      {output.memeVideo && (
        <button
          onClick={() => handleDownload(output.memeVideo!, 'video')}
          aria-label="Download meme video"
          className="flex-1 h-12 px-6 py-3 bg-black/90 shadow-[0px_0px_0px_3px_rgba(255,255,255,0.08)_inset] rounded-full flex justify-center items-center cursor-pointer hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              aria-hidden="true"
            >
              <path 
                d="M8 11L4 7h2.5V2h3v5H12L8 11z M2 13h12v2H2v-2z" 
                fill="currentColor"
              />
            </svg>
            <span className="text-white text-sm font-semibold leading-5 font-sans">
              Download Video
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
