'use client';

import { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6 flex flex-col gap-5">
      <h3 className="text-lg font-semibold text-[#37322F] font-sans">{title}</h3>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Waveform visualization */}
      <div className="h-20 rounded-lg bg-[#FBFAF9] border border-[rgba(55,50,47,0.06)] flex items-center justify-center px-3">
        <div className="flex gap-[3px] items-end h-14 w-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 30}%`,
                backgroundColor: i / 50 * 100 < progress
                  ? 'oklch(0.6 0.2 45)'
                  : 'rgba(55,50,47,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#847971] font-sans w-10 text-right">{formatTime(currentTime)}</span>
        <div className="flex-1 relative h-1.5 bg-[rgba(55,50,47,0.10)] rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: 'oklch(0.6 0.2 45)' }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs text-[#847971] font-sans w-10">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[oklch(0.6_0.2_45)] flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden"
        >
          <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
          {isPlaying ? (
            <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-0.5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <a
          href={audioUrl}
          download
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(55,50,47,0.12)] text-[#605A57] text-sm font-medium font-sans hover:bg-[rgba(55,50,47,0.04)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
}
