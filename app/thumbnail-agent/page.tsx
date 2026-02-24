'use client';

import { useState } from 'react';
import ThumbnailForm from './components/ThumbnailForm';
import ThumbnailGrid from './components/ThumbnailGrid';
import LoadingIndicator from './components/LoadingIndicator';
import { ThumbnailGenerationResponse, ThumbnailVariation } from './types';

export default function ThumbnailAgentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbnails, setThumbnails] = useState<ThumbnailVariation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailVariation | null>(null);

  const handleGenerate = async (params: any) => {
    setIsGenerating(true);
    setError(null);
    setThumbnails(null);
    setSelectedThumbnail(null);

    try {
      const response = await fetch('/thumbnail-agent/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          userId: 'demo-user', // In production, use actual user ID
        }),
      });

      const data: ThumbnailGenerationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate thumbnails');
      }

      setThumbnails(data.thumbnails!);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setThumbnails(null);
    setSelectedThumbnail(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🖼️</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thumbnail Agent</h1>
              <p className="text-gray-600">AI-powered YouTube thumbnail generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!thumbnails && !isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Create Your Thumbnail</h2>
              <ThumbnailForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">1️⃣</div>
                    <div>
                      <h4 className="font-semibold">Upload Your Face</h4>
                      <p className="text-sm text-gray-600">
                        Provide a clear frontal photo of yourself
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">2️⃣</div>
                    <div>
                      <h4 className="font-semibold">Customize (Optional)</h4>
                      <p className="text-sm text-gray-600">
                        Add video type, design instructions, or additional images
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">3️⃣</div>
                    <div>
                      <h4 className="font-semibold">Get 4 Variations</h4>
                      <p className="text-sm text-gray-600">
                        AI generates 4 unique thumbnail styles
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">4️⃣</div>
                    <div>
                      <h4 className="font-semibold">Select & Download</h4>
                      <p className="text-sm text-gray-600">
                        Choose your favorite and download in 1280x720
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">✨ What You'll Get</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Dramatic Shock Style (High emotion, viral appeal)</li>
                  <li>• Clean Professional Style (Trustworthy, educational)</li>
                  <li>• Cinematic Dark Style (Mysterious, high-production)</li>
                  <li>• Bright Viral Style (Energetic, attention-grabbing)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Privacy & Ethics:</strong> Your face is used exclusively in your
                  thumbnails. We learn composition from references but never copy or use other
                  people's faces.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && <LoadingIndicator />}

        {/* Error State */}
        {error && !isGenerating && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleRegenerate}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {thumbnails && !isGenerating && (
          <div className="space-y-6">
            <ThumbnailGrid thumbnails={thumbnails} onSelect={setSelectedThumbnail} />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRegenerate}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Generate New Thumbnails
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Thumbnail Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-semibold mb-2">Face Visibility</h3>
              <p className="text-sm text-gray-600">
                Your face should occupy 30-50% of the thumbnail for maximum impact
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">High Contrast</h3>
              <p className="text-sm text-gray-600">
                Bold colors and strong contrast ensure visibility on mobile devices
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Mobile-First</h3>
              <p className="text-sm text-gray-600">
                Thumbnails are optimized for small screens where most viewers watch
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
