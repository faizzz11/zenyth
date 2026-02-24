'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ModeSelector from './components/ModeSelector';
import TrendingTopics from './components/TrendingTopics';
import CustomTopicInput from './components/CustomTopicInput';
import StyleSelector from './components/StyleSelector';
import VideoToggle from './components/VideoToggle';
import LoadingIndicator from './components/LoadingIndicator';
import MemePreview from './components/MemePreview';
import DownloadButtons from './components/DownloadButtons';
import ErrorMessage from './components/ErrorMessage';
import MemeHistory from './components/MemeHistory';
import {
  GenerationMode,
  MemeStyle,
  GenerationStage,
  MemeOutput,
  GenerationError,
} from './types';

export default function MemeAgentPage() {
  // Mode state
  const [mode, setMode] = useState<GenerationMode>('ai-suggested');
  
  // Trending topics state
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState<string | null>(null);
  const [trendingTopicsLoading, setTrendingTopicsLoading] = useState(false);
  const [trendingTopicsError, setTrendingTopicsError] = useState<string | null>(null);
  
  // Custom topic state
  const [customTopic, setCustomTopic] = useState('');
  const [customTopicError, setCustomTopicError] = useState<string | null>(null);
  
  // Style state
  const [selectedStyle, setSelectedStyle] = useState<MemeStyle>('classic');
  
  // Video toggle state
  const [videoEnabled, setVideoEnabled] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<GenerationStage>(null);
  const [memeOutput, setMemeOutput] = useState<MemeOutput | null>(null);
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);
  
  // Fetch trending topics on mount and when mode changes to AI
  useEffect(() => {
    if (mode === 'ai-suggested') {
      fetchTrendingTopics();
    }
  }, [mode]);
  
  const fetchTrendingTopics = async (forceRefresh = false) => {
    setTrendingTopicsLoading(true);
    setTrendingTopicsError(null);
    
    try {
      const url = forceRefresh 
        ? '/meme-agent/api/trending?refresh=true' 
        : '/meme-agent/api/trending';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTrendingTopics(data.topics);
      } else {
        setTrendingTopicsError(data.error || 'Failed to load trending topics');
      }
    } catch (error) {
      setTrendingTopicsError('Failed to load trending topics. Please try again.');
    } finally {
      setTrendingTopicsLoading(false);
    }
  };
  
  const handleGenerate = async () => {
    // Validate input
    const topic = mode === 'ai-suggested' ? selectedTrendingTopic : customTopic;
    
    if (!topic) {
      if (mode === 'custom') {
        setCustomTopicError('Please enter a topic');
      }
      return;
    }
    
    if (mode === 'custom' && (topic.length < 3 || topic.length > 200)) {
      setCustomTopicError('Topic must be between 3 and 200 characters');
      return;
    }
    
    // Clear previous results and errors
    setMemeOutput(null);
    setGenerationError(null);
    setCustomTopicError(null);
    
    // Start generation
    setIsGenerating(true);
    setGenerationStage('concept');
    
    try {
      const response = await fetch('/meme-agent/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          topic,
          style: selectedStyle,
          generateVideo: videoEnabled,
          userId: 'demo-user', // TODO: Replace with actual user ID from auth
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.output) {
        setMemeOutput(data.output);
        setGenerationStage(null);
      } else if (data.error) {
        setGenerationError(data.error);
        setGenerationStage(null);
      }
    } catch (error) {
      setGenerationError({
        stage: 'concept',
        message: 'An unexpected error occurred. Please try again.',
        retryable: true,
      });
      setGenerationStage(null);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRetry = () => {
    handleGenerate();
  };
  
  const canGenerate = () => {
    if (isGenerating) return false;
    if (mode === 'ai-suggested') return selectedTrendingTopic !== null;
    if (mode === 'custom') return customTopic.length >= 3 && customTopic.length <= 200;
    return false;
  };

  return (
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Vertical borders */}
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Header */}
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
                    AI-Powered Meme Generator
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Create trending memes with AI-generated concepts,
                    <br className="hidden sm:block" />
                    images, and optional animated videos.
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="w-full max-w-[800px] lg:w-[800px] flex flex-col gap-6 mt-12">
                {/* Mode Selector */}
                <ModeSelector mode={mode} onModeChange={setMode} />
                
                {/* Trending Topics or Custom Input */}
                {mode === 'ai-suggested' ? (
                  <TrendingTopics
                    topics={trendingTopics}
                    selectedTopic={selectedTrendingTopic}
                    onTopicSelect={setSelectedTrendingTopic}
                    onRefresh={() => fetchTrendingTopics(true)}
                    isLoading={trendingTopicsLoading}
                    error={trendingTopicsError}
                  />
                ) : (
                  <CustomTopicInput
                    value={customTopic}
                    onChange={setCustomTopic}
                    error={customTopicError}
                  />
                )}
                
                {/* Style Selector */}
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleChange={setSelectedStyle}
                />
                
                {/* Video Toggle */}
                <VideoToggle enabled={videoEnabled} onToggle={setVideoEnabled} />
                
                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate()}
                  className="w-full h-14 sm:h-16 px-6 sm:px-8 py-3 relative bg-[oklch(0.6_0.2_45)] shadow-[0px_0px_0px_3px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[rgba(55,50,47,0.40)] focus:ring-offset-2"
                >
                  <div className="w-full h-full absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.18)] mix-blend-multiply"></div>
                  <div className="flex flex-col justify-center text-white text-base sm:text-lg font-semibold leading-6 font-sans tracking-tight text-center">
                    {isGenerating ? 'Generating...' : 'Generate Meme'}
                  </div>
                </button>
                
                {/* Loading Indicator */}
                {isGenerating && <LoadingIndicator stage={generationStage} />}
                
                {/* Error Message */}
                {generationError && (
                  <ErrorMessage error={generationError} onRetry={handleRetry} />
                )}
                
                {/* Meme Preview */}
                {memeOutput && (
                  <>
                    <MemePreview output={memeOutput} isLoading={isGenerating} />
                    <DownloadButtons output={memeOutput} />
                  </>
                )}
              </div>

              {/* Meme History */}
              <div className="w-full max-w-[1000px] lg:w-[1000px] mt-16 mb-12">
                <MemeHistory userId="demo-user" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
