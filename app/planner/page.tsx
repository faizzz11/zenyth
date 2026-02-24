'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PlannerForm from './components/PlannerForm';
import ContentCalendar from './components/ContentCalendar';
import PlannerStats from './components/PlannerStats';
import ExportOptions from './components/ExportOptions';
import type { ContentPlan, PlannerFormData } from './types';

export default function PlannerPage() {
    const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'form' | 'plan' | 'history'>('form');
    const [history, setHistory] = useState<ContentPlan[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const response = await fetch('/planner/api/history');
            const data = await response.json();
            if (data.success) {
                setHistory(data.plans);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (view === 'history') {
            fetchHistory();
        }
    }, [view]);

    const handleGeneratePlan = async (formData: PlannerFormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/planner/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setContentPlan(data.plan);
                setView('plan');
            } else {
                setError(data.error || 'Failed to generate content plan');
            }
        } catch (err) {
            console.error('Plan generation error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegeneratePlan = () => {
        setContentPlan(null);
        setView('form');
        setError(null);
    };

    const handleViewPlan = (plan: ContentPlan) => {
        setContentPlan(plan);
        setView('plan');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] to-[#f5f5f4]">
            {/* Header */}
            <div className="border-b border-[rgba(55,50,47,0.12)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-[#37322F] hover:text-[#605A57] transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[oklch(0.5_0.25_35)] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-[#37322F] font-sans">30-Day Content Planner</h1>
                                    <p className="text-xs text-[#8B8580] font-sans">AI-powered content calendar based on trends</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setView('history')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    view === 'history'
                                        ? 'bg-[oklch(0.6_0.2_45)] text-white'
                                        : 'bg-gray-100 text-[#605A57] hover:bg-gray-200'
                                }`}
                            >
                                History
                            </button>
                            {view !== 'form' && (
                                <button
                                    onClick={handleRegeneratePlan}
                                    className="px-4 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    Generate New Plan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'form' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-8 mb-6">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[oklch(0.5_0.25_35)] flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#37322F] mb-2">Create Your Content Strategy</h2>
                                <p className="text-[#605A57]">
                                    Get a personalized 30-day content calendar based on current trends, news, and your niche
                                </p>
                            </div>

                            <PlannerForm onSubmit={handleGeneratePlan} loading={loading} />

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.12)] p-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[#37322F] mb-1">Real-Time News</h3>
                                <p className="text-xs text-[#8B8580]">Powered by SerpAPI for latest trends and news</p>
                            </div>
                            <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.12)] p-6">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[#37322F] mb-1">AI-Powered</h3>
                                <p className="text-xs text-[#8B8580]">Gemini AI creates optimized content strategy</p>
                            </div>
                            <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.12)] p-6">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[#37322F] mb-1">30-Day Calendar</h3>
                                <p className="text-xs text-[#8B8580]">Complete month of content ideas and schedule</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'plan' && contentPlan && (
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        <PlannerStats plan={contentPlan} />

                        {/* Content Calendar */}
                        <ContentCalendar plan={contentPlan} />

                        {/* Export Options */}
                        <ExportOptions plan={contentPlan} />
                    </div>
                )}

                {view === 'history' && (
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
                            <h2 className="text-lg font-semibold text-[#37322F] mb-4">Your Content Plans</h2>
                            
                            {loadingHistory ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[oklch(0.6_0.2_45)] border-t-transparent" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-[#8B8580]">No content plans yet. Create your first one!</p>
                                    <button
                                        onClick={() => setView('form')}
                                        className="mt-4 px-4 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Create Plan
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => handleViewPlan(plan)}
                                            className="w-full text-left p-4 rounded-lg border border-[rgba(55,50,47,0.12)] hover:border-[oklch(0.6_0.2_45)] hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-[#37322F] mb-1">
                                                        {plan.niche}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-[#8B8580] mb-2">
                                                        <span>{new Date(plan.generatedAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{plan.totalPosts} posts</span>
                                                        <span>•</span>
                                                        <span>{plan.platforms.join(', ')}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {plan.platforms.map(p => (
                                                            <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                                                                {p}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-[#8B8580]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
