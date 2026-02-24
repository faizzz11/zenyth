'use client';

import type { ContentPlan } from '../types';

interface PlannerStatsProps {
    plan: ContentPlan;
}

export default function PlannerStats({ plan }: PlannerStatsProps) {
    const trendBasedCount = plan.contentItems.filter(item => item.trendBased).length;
    const highEngagementCount = plan.contentItems.filter(item => item.estimatedEngagement === 'high').length;
    const platformCount = plan.platforms.length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="text-xs text-[#8B8580]">Total Posts</div>
                </div>
                <div className="text-3xl font-bold text-[#37322F]">{plan.totalPosts}</div>
            </div>

            <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-xs text-[#8B8580]">Trend-Based</div>
                </div>
                <div className="text-3xl font-bold text-red-600">{trendBasedCount}</div>
            </div>

            <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="text-xs text-[#8B8580]">High Engagement</div>
                </div>
                <div className="text-3xl font-bold text-green-600">{highEngagementCount}</div>
            </div>

            <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </div>
                    <div className="text-xs text-[#8B8580]">Platforms</div>
                </div>
                <div className="text-3xl font-bold text-purple-600">{platformCount}</div>
            </div>
        </div>
    );
}
