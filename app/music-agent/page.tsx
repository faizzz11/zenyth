'use client';

import { useState } from 'react';
import MusicForm from './components/MusicForm';
import AudioPlayer from './components/AudioPlayer';
import LoadingIndicator from './components/LoadingIndicator';
import { MusicGenerationResponse } from './types';

export default function MusicAgentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<MusicGenerationResponse['output'] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: any) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedMusic(null);

    try {
      const response = await fetch('/music-agent/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          userId: 'demo-user', // In production, use actual user ID
        }),
      });

      const data: MusicGenerationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate music');
      }

      setGeneratedMusic(data.output!);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎵</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Music Agent</h1>
              <p className="text-gray-600">AI-powered instrumental music generation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Create Your Music</h2>
            <MusicForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Right Column - Output */}
          <div>
            {isGenerating && <LoadingIndicator />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {generatedMusic && !isGenerating && (
              <div className="space-y-6">
                <AudioPlayer
                  audioUrl={generatedMusic.audioUrl}
                  title="Your Generated Music"
                />

                {/* Metadata */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Track Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Genre:</span>
                      <p className="font-medium">{generatedMusic.genre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mood:</span>
                      <p className="font-medium">{generatedMusic.mood}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tempo:</span>
                      <p className="font-medium">{generatedMusic.tempo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{generatedMusic.duration}s</p>
                    </div>
                    {generatedMusic.styleReference && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Style Reference:</span>
                        <p className="font-medium">{generatedMusic.styleReference}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>AI-Generated:</strong> This track is AI-generated instrumental music
                    in the stylistic essence of the requested parameters. It is not an official
                    recording or voice clone of any artist.
                  </p>
                </div>
              </div>
            )}

            {!isGenerating && !error && !generatedMusic && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🎼</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Create Music
                </h3>
                <p className="text-gray-600">
                  Fill in the form and click "Generate Music" to start
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">1. Set Parameters</h3>
              <p className="text-sm text-gray-600">
                Choose mood, tempo, genre, and optional style references
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">2. AI Generation</h3>
              <p className="text-sm text-gray-600">
                Lyria RealTime creates instrumental music based on your inputs
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🎧</div>
              <h3 className="font-semibold mb-2">3. Listen & Download</h3>
              <p className="text-sm text-gray-600">
                Play your track and download it for use
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
