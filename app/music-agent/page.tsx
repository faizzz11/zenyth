'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import MusicForm from './components/MusicForm';
import AudioPlayer from './components/AudioPlayer';
import LoadingIndicator from './components/LoadingIndicator';
import MusicHistory from './components/MusicHistory';
import { MusicGenerationResponse } from './types';

export default function MusicAgentPage() {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<MusicGenerationResponse['output'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: any) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedMusic(null);

    try {
      const response = await fetch('/music-agent/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
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
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Vertical borders */}
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Header / Navbar */}
          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-white backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <Link href="/" className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Zenyth
                    </div>
                  </div>
                </Link>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <Link href="/">
                    <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                        Back to Home
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    AI-Powered Music Generator
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Create custom music tracks with AI. Choose your mood,
                    <br className="hidden sm:block" />
                    genre, tempo, and style to generate unique audio.
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="w-full max-w-[800px] lg:w-[800px] flex flex-col gap-6 mt-12">
                {/* Music Form */}
                <MusicForm
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  disabled={!user}
                />

                {!user && (
                  <p className="text-center text-sm text-[#847971] font-sans">
                    Please sign in to generate music.
                  </p>
                )}

                {/* Loading */}
                {isGenerating && <LoadingIndicator />}

                {/* Error */}
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-sans">
                    <p className="font-semibold text-red-800 mb-1">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Audio Player & Track Details */}
                {generatedMusic && !isGenerating && (
                  <div className="flex flex-col gap-4">
                    <AudioPlayer
                      audioUrl={generatedMusic.audioUrl}
                      title="Your Generated Music"
                    />

                    {/* Track Details */}
                    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-6">
                      <h3 className="text-base font-semibold text-[#37322F] font-sans mb-4">Track Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                        <div>
                          <span className="text-[#847971]">Genre</span>
                          <p className="font-medium text-[#37322F] capitalize">{generatedMusic.genre}</p>
                        </div>
                        <div>
                          <span className="text-[#847971]">Mood</span>
                          <p className="font-medium text-[#37322F] capitalize">{generatedMusic.mood}</p>
                        </div>
                        <div>
                          <span className="text-[#847971]">Tempo</span>
                          <p className="font-medium text-[#37322F] capitalize">{generatedMusic.tempo}</p>
                        </div>
                        <div>
                          <span className="text-[#847971]">Duration</span>
                          <p className="font-medium text-[#37322F]">{generatedMusic.duration}s</p>
                        </div>
                        {generatedMusic.styleReference && generatedMusic.styleReference !== 'Original style' && (
                          <div className="col-span-2">
                            <span className="text-[#847971]">Style Reference</span>
                            <p className="font-medium text-[#37322F]">{generatedMusic.styleReference}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Disclaimer */}
                    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] p-4">
                      <p className="text-xs text-[#605A57] font-sans">
                        <span className="font-semibold">AI-Generated:</span> This track is AI-generated music
                        in the stylistic essence of the requested parameters. It is not an official
                        recording or voice clone of any artist.
                      </p>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!isGenerating && !error && !generatedMusic && (
                  <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white p-12 text-center flex flex-col items-center gap-3">
                    <span className="text-5xl">🎼</span>
                    <h3 className="text-lg font-semibold text-[#37322F] font-sans">
                      Ready to Create Music
                    </h3>
                    <p className="text-sm text-[#847971] font-sans">
                      Fill in the form and click &quot;Generate Music&quot; to start
                    </p>
                  </div>
                )}
              </div>

              {/* Music History */}
              <div className="w-full max-w-[1000px] lg:w-[1000px] mt-16 mb-12">
                <MusicHistory userId={user?.id || ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
