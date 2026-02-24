'use client';

import { useState, useEffect, useRef } from 'react';
import { MusicHistoryItem } from '../types';

interface MusicHistoryProps {
  userId: string;
}

export default function MusicHistory({ userId }: MusicHistoryProps) {
  const [items, setItems] = useState<MusicHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/music-agent/api/history');
      const data = await response.json();
      if (data.history) {
        setItems(
          data.history.map((item: any) => ({
            ...item,
            id: item._id || item.id,
          }))
        );
      }
    } catch {
      setError('Failed to load music history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (item: MusicHistoryItem) => {
    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(item.output.audioUrl);
    audio.play();
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(item.id);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  if (items.length === 0 && !isLoading && !error) {
    return (
      <div className="w-full text-center py-12 text-[#847971] font-sans">
        No music generated yet. Create your first track above!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#37322F] font-serif">
        Your Music History
      </h2>

      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-sans">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="w-full py-8 flex justify-center">
          <div className="flex items-center gap-2 text-[#847971] font-sans text-sm">
            <div className="w-5 h-5 border-2 border-[rgba(55,50,47,0.20)] border-t-[oklch(0.6_0.2_45)] rounded-full animate-spin"></div>
            Loading history...
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePlay(item)}
            className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-4 flex flex-col gap-3 text-left hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#37322F] font-sans capitalize">
                {item.genre}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  playingId === item.id
                    ? 'bg-[oklch(0.6_0.2_45)]'
                    : 'bg-[#FBFAF9] border border-[rgba(55,50,47,0.12)]'
                }`}
              >
                {playingId === item.id ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[#605A57] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-[#FBFAF9] border border-[rgba(55,50,47,0.08)] rounded text-xs text-[#605A57] font-sans capitalize">
                {item.mood}
              </span>
              <span className="px-2 py-0.5 bg-[#FBFAF9] border border-[rgba(55,50,47,0.08)] rounded text-xs text-[#605A57] font-sans capitalize">
                {item.tempo}
              </span>
            </div>

            <p className="text-xs text-[#847971] font-sans">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
