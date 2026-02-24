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
}

export default function MusicForm({ onGenerate, isGenerating }: MusicFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Mood</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value as MusicMood)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        >
          <option value="romantic">Romantic</option>
          <option value="sad">Sad</option>
          <option value="energetic">Energetic</option>
          <option value="aggressive">Aggressive</option>
          <option value="nostalgic">Nostalgic</option>
          <option value="chill">Chill</option>
          <option value="upbeat">Upbeat</option>
        </select>
      </div>

      {/* Tempo Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Tempo</label>
        <div className="grid grid-cols-3 gap-3">
          {(['slow', 'medium', 'fast'] as MusicTempo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTempo(t)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tempo === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isGenerating}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* BPM (Optional) */}
      <div>
        <label className="block text-sm font-medium mb-2">BPM (Optional)</label>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="e.g., 120"
          min="60"
          max="200"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
      </div>

      {/* Genre Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Genre</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value as MusicGenre)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        >
          <option value="rap">Rap</option>
          <option value="pop">Pop</option>
          <option value="classical">Classical</option>
          <option value="bollywood">Bollywood</option>
          <option value="rock">Rock</option>
          <option value="lofi">Lo-Fi</option>
          <option value="jazz">Jazz</option>
          <option value="electronic">Electronic</option>
          <option value="folk">Folk</option>
        </select>
      </div>

      {/* Singer Style */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Singer Style (Optional)
        </label>
        <input
          type="text"
          value={singerStyle}
          onChange={(e) => setSingerStyle(e.target.value)}
          placeholder="e.g., Kumar Sanu, Arijit Singh"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-500 mt-1">
          Note: Generates instrumental music in the stylistic essence, not voice cloning
        </p>
      </div>

      {/* Free Text Prompt */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Additional Instructions (Optional)
        </label>
        <textarea
          value={freeTextPrompt}
          onChange={(e) => setFreeTextPrompt(e.target.value)}
          placeholder="Describe any specific musical elements you want..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating Music...' : 'Generate Music'}
      </button>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This system generates AI instrumental music. It does not
          clone voices or create official recordings of any artist.
        </p>
      </div>
    </form>
  );
}
