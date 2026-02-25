'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PlatformTrends, TrendingTopic } from './types';

export default function TrendsAgentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [platformTrends, setPlatformTrends] = useState<PlatformTrends[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
    const [error, setError] = useState<string | null>(null);
    const [selectedTrend, setSelectedTrend] = useState<TrendingTopic | null>(null);

    const platforms = [
        { 
            id: 'all', 
            label: 'All Platforms', 
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
        },
        { 
            id: 'general', 
            label: 'Google Trends', 
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
        },
        { 
            id: 'youtube', 
            label: 'YouTube', 
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        },
        { 
            id: 'twitter', 
            label: 'Twitter/X', 
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        },
        { 
            id: 'instagram', 
            label: 'Instagram', 
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        },
        { 
            id: 'linkedin', 
            label: 'LinkedIn', 
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        },
    ];

    const fetchTrends = async (platform: string = 'all') => {
        setLoading(true);
        setError(null);
        try {
            const url = platform === 'all' 
                ? '/trends-agent/api/fetch'
                : `/trends-agent/api/fetch?platform=${platform}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setPlatformTrends(data.trends);
            } else {
                setError(data.error || 'Failed to fetch trends');
            }
        } catch (err) {
            console.error('Error fetching trends:', err);
            setError('An error occurred while fetching trends');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends(selectedPlatform);
    }, [selectedPlatform]);

    const handleCreateContent = (trend: TrendingTopic) => {
        const prompt = `Create content about: ${trend.title}. ${trend.description}`;
        router.push(`/all-in-one-post?prompt=${encodeURIComponent(prompt)}&platform=${trend.platform === 'general' ? 'youtube' : trend.platform}`);
    };

    const getPlatformIcon = (platform: string) => {
        const icons: Record<string, JSX.Element> = {
            youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
            instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
            twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
            linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
            general: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        };
        return icons[platform] || icons.general;
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            youtube: 'bg-red-50 border-red-200 text-red-700',
            instagram: 'bg-pink-50 border-pink-200 text-pink-700',
            twitter: 'bg-gray-50 border-gray-200 text-gray-700',
            linkedin: 'bg-blue-50 border-blue-200 text-blue-700',
            general: 'bg-purple-50 border-purple-200 text-purple-700'
        };
        return colors[platform] || colors.general;
    };

    const getTrendScoreColor = (score: number) => {
        if (score >= 90) return 'bg-red-100 text-red-700 border-red-200';
        if (score >= 70) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-green-100 text-green-700 border-green-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] to-[#f5f5f4]">
            {/* Header */}
            <div className="border-b border-[rgba(55,50,47,0.12)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[oklch(0.5_0.25_35)] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-[#37322F] font-sans">Trends Detector</h1>
                                <p className="text-xs text-[#8B8580] font-sans">Discover trending topics across platforms</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => fetchTrends(selectedPlatform)}
                            disabled={loading}
                            className="px-4 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Refreshing...' : 'Refresh Trends'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Platform Filter */}
                <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6 mb-6">
                    <h2 className="text-sm font-semibold text-[#37322F] mb-4">Filter by Platform</h2>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map(platform => (
                            <button
                                key={platform.id}
                                onClick={() => setSelectedPlatform(platform.id)}
                                title={platform.label}
                                className={`p-3 rounded-lg transition-all ${
                                    selectedPlatform === platform.id
                                        ? 'bg-[oklch(0.6_0.2_45)] text-white shadow-sm'
                                        : 'bg-gray-100 text-[#605A57] hover:bg-gray-200'
                                }`}
                            >
                                {platform.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[oklch(0.6_0.2_45)] border-t-transparent" />
                    </div>
                )}

                {/* Trends Grid */}
                {!loading && platformTrends.length > 0 && (
                    <div className="space-y-8">
                        {platformTrends.map(platformData => (
                            <div key={platformData.platform} className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] overflow-hidden">
                                <div className={`px-6 py-4 border-b border-[rgba(55,50,47,0.12)] ${getPlatformColor(platformData.platform)}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getPlatformIcon(platformData.platform)}
                                            <div>
                                                <h3 className="text-base font-semibold capitalize">{platformData.platform} Trends</h3>
                                                <p className="text-xs opacity-75">
                                                    Updated: {new Date(platformData.lastUpdated).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-medium">
                                            {platformData.trends.length} trends
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {platformData.trends.map(trend => (
                                            <button
                                                key={trend.id}
                                                onClick={() => setSelectedTrend(trend)}
                                                className="text-left p-4 rounded-lg border border-[rgba(55,50,47,0.12)] hover:border-[oklch(0.6_0.2_45)] hover:shadow-md transition-all bg-white"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getTrendScoreColor(trend.trendScore)}`}>
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                                        </svg>
                                                        {trend.trendScore}
                                                    </span>
                                                    {trend.searchVolume && (
                                                        <span className="text-xs text-[#8B8580]">
                                                            {trend.searchVolume.toLocaleString()} searches
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <h4 className="text-sm font-semibold text-[#37322F] mb-2 line-clamp-2">
                                                    {trend.title}
                                                </h4>
                                                
                                                <p className="text-xs text-[#605A57] mb-3 line-clamp-2">
                                                    {trend.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[#8B8580] bg-gray-100 px-2 py-1 rounded">
                                                        {trend.category}
                                                    </span>
                                                    <svg className="w-4 h-4 text-[oklch(0.6_0.2_45)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && platformTrends.length === 0 && !error && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <p className="text-[#8B8580]">No trending topics found. Try refreshing or selecting a different platform.</p>
                    </div>
                )}
            </div>

            {/* Trend Detail Modal */}
            {selectedTrend && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTrend(null)}>
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${getPlatformColor(selectedTrend.platform)}`}>
                                    {getPlatformIcon(selectedTrend.platform)}
                                    <span className="text-sm font-medium capitalize">{selectedTrend.platform}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedTrend(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-[#37322F] mb-3">{selectedTrend.title}</h3>
                            <p className="text-sm text-[#605A57] mb-4">{selectedTrend.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Trend Score</div>
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm font-medium border ${getTrendScoreColor(selectedTrend.trendScore)}`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                        {selectedTrend.trendScore}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Category</div>
                                    <div className="text-sm font-medium text-[#37322F]">{selectedTrend.category}</div>
                                </div>
                                {selectedTrend.searchVolume && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-[#8B8580] mb-1">Search Volume</div>
                                        <div className="text-sm font-medium text-[#37322F]">
                                            {selectedTrend.searchVolume.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Source</div>
                                    <div className="text-sm font-medium text-[#37322F]">{selectedTrend.source}</div>
                                </div>
                            </div>

                            {selectedTrend.relatedKeywords.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs font-semibold text-[#37322F] mb-2">Related Keywords</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTrend.relatedKeywords.map((keyword, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedTrend.link && (
                                <a
                                    href={selectedTrend.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 mb-4 text-sm text-[oklch(0.6_0.2_45)] hover:underline"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View original source
                                </a>
                            )}

                            <button
                                onClick={() => handleCreateContent(selectedTrend)}
                                className="w-full px-4 py-3 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Content from This Trend
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
