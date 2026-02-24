'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import { VideoType } from '../types';

interface ThumbnailFormProps {
  onGenerate: (params: {
    faceImage: string;
    additionalImages?: string[];
    videoType?: VideoType;
    detailedInstructions?: string;
  }) => void;
  isGenerating: boolean;
}

export default function ThumbnailForm({ onGenerate, isGenerating }: ThumbnailFormProps) {
  const [faceImage, setFaceImage] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoType, setVideoType] = useState<VideoType | ''>('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!faceImage) {
      alert('Please upload your face image');
      return;
    }

    onGenerate({
      faceImage,
      additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
      videoType: videoType || undefined,
      detailedInstructions: instructions || undefined,
    });
  };

  const handleAdditionalImage = (base64: string) => {
    setAdditionalImages([...additionalImages, base64]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Face Image Upload */}
      <ImageUploader
        label="Your Face Photo"
        required
        onImageUpload={setFaceImage}
        helpText="Upload a clear frontal photo of your face. This will be used in all thumbnail variations."
      />

      {/* Video Type Selection */}
      <div>
        <label className="block text-[13px] font-semibold text-[#37322F] font-sans mb-2">
          Video Type (Optional)
        </label>
        <select
          value={videoType}
          onChange={(e) => setVideoType(e.target.value as VideoType)}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(55,50,47,0.15)] bg-white text-[13px] font-sans text-[#37322F] focus:ring-2 focus:ring-[oklch(0.6_0.2_45/0.3)] focus:border-[oklch(0.6_0.2_45/0.5)] outline-none transition-all"
          disabled={isGenerating}
        >
          <option value="">Select video type...</option>
          <option value="vlog">Vlog</option>
          <option value="challenge">Challenge</option>
          <option value="tech-review">Tech Review</option>
          <option value="reaction">Reaction</option>
          <option value="finance">Finance</option>
          <option value="fitness">Fitness</option>
          <option value="gaming">Gaming</option>
          <option value="educational">Educational</option>
          <option value="entertainment">Entertainment</option>
        </select>
      </div>

      {/* Detailed Instructions */}
      <div>
        <label className="block text-[13px] font-semibold text-[#37322F] font-sans mb-2">
          Design Instructions (Optional)
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Example: Make it dramatic, red background, shocked expression, big bold yellow text area"
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(55,50,47,0.15)] bg-white text-[13px] font-sans text-[#37322F] placeholder-[#B2AEA9] focus:ring-2 focus:ring-[oklch(0.6_0.2_45/0.3)] focus:border-[oklch(0.6_0.2_45/0.5)] outline-none resize-none transition-all"
          disabled={isGenerating}
        />
        <p className="text-[11px] text-[#847971] mt-1.5 font-sans">
          Describe colors, emotions, pose, text style, or any specific design elements you want
        </p>
      </div>

      {/* Additional Images (Optional) */}
      <div>
        <label className="block text-[13px] font-semibold text-[#37322F] font-sans mb-1.5">
          Additional Images (Optional)
        </label>
        <p className="text-[11px] text-[#847971] mb-3 font-sans">
          Upload logos, objects, or background references (max 3)
        </p>

        {additionalImages.length < 3 && (
          <ImageUploader
            label={`Additional Image ${additionalImages.length + 1}`}
            onImageUpload={handleAdditionalImage}
            helpText="Optional: Add logos, products, or background elements"
          />
        )}

        {additionalImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {additionalImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Additional ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-[rgba(55,50,47,0.10)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAdditionalImages(additionalImages.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1.5 right-1.5 bg-[#37322F] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#49423D] transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating || !faceImage}
        className="w-full py-3 text-[14px] font-semibold text-white bg-[#37322F] rounded-full hover:bg-[#49423D] transition-all disabled:bg-[#B2AEA9] disabled:cursor-not-allowed font-sans shadow-sm"
      >
        {isGenerating ? 'Generating Thumbnails...' : 'Generate 4 Thumbnail Variations'}
      </button>

      {/* Important Notice */}
      <div className="rounded-lg border border-[rgba(55,50,47,0.10)] bg-[rgba(55,50,47,0.02)] p-4">
        <p className="text-[12px] text-[#605A57] font-sans leading-[18px]">
          <span className="font-semibold text-[#37322F]">Important:</span> All thumbnails will feature ONLY your uploaded face. We use
          reference thumbnails only for learning composition and style patterns, not for copying.
        </p>
      </div>
    </form>
  );
}
