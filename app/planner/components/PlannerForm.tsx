'use client';

import { useState } from 'react';
import type { PlannerFormData } from '../types';

interface PlannerFormProps {
    onSubmit: (data: PlannerFormData) => void;
    loading: boolean;
}

export default function PlannerForm({ onSubmit, loading }: PlannerFormProps) {
    const [formData, setFormData] = useState<PlannerFormData>({
        niche: '',
        platforms: [],
        contentTypes: [],
        postingFrequency: 7,
        targetAudience: '',
        goals: [],
        tone: 'professional'
    });

    const platforms = [
        { 
            id: 'youtube', 
            name: 'YouTube', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        },
        { 
            id: 'instagram', 
            name: 'Instagram', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        },
        { 
            id: 'twitter', 
            name: 'X (Twitter)', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        },
        { 
            id: 'linkedin', 
            name: 'LinkedIn', 
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        }
    ];

    const contentTypes = [
        { 
            id: 'video', 
            name: 'Videos', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        },
        { 
            id: 'image', 
            name: 'Images', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        },
        { 
            id: 'story', 
            name: 'Stories', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        },
        { 
            id: 'short', 
            name: 'Shorts/Reels', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        }
    ];

    const goals = [
        { 
            id: 'awareness', 
            name: 'Brand Awareness', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        },
        { 
            id: 'engagement', 
            name: 'Engagement', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        },
        { 
            id: 'traffic', 
            name: 'Website Traffic', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
        },
        { 
            id: 'leads', 
            name: 'Lead Generation', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        },
        { 
            id: 'sales', 
            name: 'Sales', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        { 
            id: 'community', 
            name: 'Community Building', 
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        }
    ];

    const tones = [
        { id: 'professional', name: 'Professional' },
        { id: 'casual', name: 'Casual & Friendly' },
        { id: 'humorous', name: 'Humorous' },
        { id: 'inspirational', name: 'Inspirational' },
        { id: 'educational', name: 'Educational' }
    ];

    const toggleSelection = (field: 'platforms' | 'contentTypes' | 'goals', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isValid = formData.niche && formData.platforms.length > 0 && formData.contentTypes.length > 0 && formData.goals.length > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Niche */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Your Niche / Industry *
                </label>
                <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    placeholder="e.g., Tech Reviews, Fitness, Cooking, Business"
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] text-sm"
                    required
                />
            </div>

            {/* Platforms */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Target Platforms * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {platforms.map(platform => (
                        <button
                            key={platform.id}
                            type="button"
                            onClick={() => toggleSelection('platforms', platform.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                                formData.platforms.includes(platform.id)
                                    ? 'border-[oklch(0.6_0.2_45)] bg-[oklch(0.97_0.04_45)]'
                                    : 'border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={formData.platforms.includes(platform.id) ? 'text-[oklch(0.5_0.2_45)]' : 'text-gray-600'}>
                                    {platform.icon}
                                </span>
                                <span className="text-sm font-medium text-[#37322F]">{platform.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Types */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Content Types * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contentTypes.map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleSelection('contentTypes', type.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                                formData.contentTypes.includes(type.id)
                                    ? 'border-[oklch(0.6_0.2_45)] bg-[oklch(0.97_0.04_45)]'
                                    : 'border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={formData.contentTypes.includes(type.id) ? 'text-[oklch(0.5_0.2_45)]' : 'text-gray-600'}>
                                    {type.icon}
                                </span>
                                <span className="text-sm font-medium text-[#37322F]">{type.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Posting Frequency */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Posts per Week: {formData.postingFrequency}
                </label>
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.postingFrequency}
                    onChange={(e) => setFormData({ ...formData, postingFrequency: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[oklch(0.6_0.2_45)]"
                />
                <div className="flex justify-between text-xs text-[#8B8580] mt-1">
                    <span>1 post/week</span>
                    <span>Daily posts</span>
                </div>
            </div>

            {/* Target Audience */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Target Audience (Optional)
                </label>
                <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g., Young professionals, Parents, Students"
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] text-sm"
                />
            </div>

            {/* Goals */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Content Goals * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goals.map(goal => (
                        <button
                            key={goal.id}
                            type="button"
                            onClick={() => toggleSelection('goals', goal.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                                formData.goals.includes(goal.id)
                                    ? 'border-[oklch(0.6_0.2_45)] bg-[oklch(0.97_0.04_45)]'
                                    : 'border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={formData.goals.includes(goal.id) ? 'text-[oklch(0.5_0.2_45)]' : 'text-gray-600'}>
                                    {goal.icon}
                                </span>
                                <span className="text-sm font-medium text-[#37322F]">{goal.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tone */}
            <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Content Tone
                </label>
                <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.2_45)] text-sm"
                >
                    {tones.map(tone => (
                        <option key={tone.id} value={tone.id}>{tone.name}</option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full py-4 bg-[oklch(0.6_0.2_45)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Your 30-Day Plan...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate 30-Day Content Plan
                    </>
                )}
            </button>
        </form>
    );
}
