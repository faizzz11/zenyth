'use client';

import { useState } from 'react';
import { MusicMood, MusicTempo, MusicGenre } from '../types';

interface MusicFormProps {
  onGenerate: (params: {
    mood: MusicMood;
    tempo: MusicTempo;
    bpm?: number;
    genre: MusicGenre;
    singerStyle?: string;
    freeTextPrompt?: string;
  }) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const moods: { value: MusicMood; label: string }[] = [
  { value: 'romantic', label: 'Romantic' },
  { value: 'sad', label: 'Sad' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'chill', label: 'Chill' },
  { value: 'upbeat', label: 'Upbeat' },
];

const tempos: { value: MusicTempo; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
];

const genres: { value: MusicGenre; label: string }[] = [
  { value: 'rap', label: 'Rap' },
  { value: 'pop', label: 'Pop' },
  { value: 'classical', label: 'Classical' },
  { value: 'bollywood', label: 'Bollywood' },
  { value: 'rock', label: 'Rock' },
  { value: 'lofi', label: 'Lo-Fi' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'folk', label: 'Folk' },
];

export default function MusicForm({ onGenerate, isGenerating, disabled }: MusicFormProps) {
  const [mood, setMood] = useState<MusicMood>('energetic');
  const [tempo, setTempo] = useState<MusicTempo>('medium');
  const [bpm, setBpm] = useState<string>('');
  const [genre, setGenre] = useState<MusicGenre>('pop');
  const [singerStyle, setSingerStyle] = useState('');
  const [freeTextPrompt, setFreeTextPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      mood,
      tempo,
      bpm: bpm ? parseInt(bpm) : undefined,
      genre,
      singerStyle: singerStyle || undefined,
      freeTextPrompt: freeTextPrompt || undefined,
    });
  };

  const isDisabled = isGenerating || disabled;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6 sm:p-8 flex flex-col gap-6">
      {/* Mood */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">Mood</label>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              disabled={isDisabled}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-colors ${
                mood === m.value
                  ? 'bg-[oklch(0.6_0.2_45)] text-white'
                  : 'bg-[#FBFAF9] border border-[rgba(55,50,47,0.12)] text-[#605A57] hover:bg-[rgba(55,50,47,0.06)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tempo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">Tempo</label>
        <div className="flex flex-wrap gap-2">
          {tempos.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTempo(t.value)}
              disabled={isDisabled}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-colors ${
                tempo === t.value
                  ? 'bg-[oklch(0.6_0.2_45)] text-white'
                  : 'bg-[#FBFAF9] border border-[rgba(55,50,47,0.12)] text-[#605A57] hover:bg-[rgba(55,50,47,0.06)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">Genre</label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGenre(g.value)}
              disabled={isDisabled}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-colors ${
                genre === g.value
                  ? 'bg-[oklch(0.6_0.2_45)] text-white'
                  : 'bg-[#FBFAF9] border border-[rgba(55,50,47,0.12)] text-[#605A57] hover:bg-[rgba(55,50,47,0.06)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* BPM */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">BPM (Optional)</label>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="e.g., 120"
          min="60"
          max="200"
          disabled={isDisabled}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] text-[#37322F] text-sm font-sans placeholder:text-[#847971] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Singer Style */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">Singer Style (Optional)</label>
        <input
          type="text"
          value={singerStyle}
          onChange={(e) => setSingerStyle(e.target.value)}
          placeholder="e.g., Kumar Sanu, Arijit Singh"
          disabled={isDisabled}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] text-[#37322F] text-sm font-sans placeholder:text-[#847971] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] focus:border-transparent disabled:opacity-50"
        />
        <p className="text-xs text-[#847971] font-sans">
          Generates music in the stylistic essence, not voice cloning
        </p>
      </div>

      {/* Free Text Prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#37322F] font-sans">Additional Instructions (Optional)</label>
        <textarea
          value={freeTextPrompt}
          onChange={(e) => setFreeTextPrompt(e.target.value)}
          placeholder="Describe any specific musical elements you want..."
          rows={3}
          disabled={isDisabled}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] text-[#37322F] text-sm font-sans placeholder:text-[#847971] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] focus:border-transparent resize-none disabled:opacity-50"
        />
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full h-14 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
      >
        <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
        <div className="flex flex-col justify-center text-white text-base font-semibold leading-6 font-sans tracking-tight text-center">
          {isGenerating ? 'Generating Music...' : 'Generate Music'}
        </div>
      </button>
    </form>
  );
}
