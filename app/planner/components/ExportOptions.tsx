'use client';

import type { ContentPlan } from '../types';

interface ExportOptionsProps {
    plan: ContentPlan;
}

export default function ExportOptions({ plan }: ExportOptionsProps) {
    const exportToCSV = () => {
        const headers = ['Day', 'Date', 'Title', 'Description', 'Type', 'Platforms', 'Keywords', 'Hashtags', 'CTA'];
        const rows = plan.contentItems.map(item => [
            item.day,
            item.date,
            item.title,
            item.description,
            item.contentType,
            item.platform.join('; '),
            item.keywords.join('; '),
            item.hashtags.map(h => `#${h}`).join(' '),
            item.callToAction
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-plan-${plan.startDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportToJSON = () => {
        const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-plan-${plan.startDate}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        const text = plan.contentItems.map(item => 
            `Day ${item.day} (${item.date})\n${item.title}\n${item.description}\nPlatforms: ${item.platform.join(', ')}\nHashtags: ${item.hashtags.map(h => `#${h}`).join(' ')}\n`
        ).join('\n---\n\n');

        navigator.clipboard.writeText(text);
        alert('Content plan copied to clipboard!');
    };

    return (
        <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[#37322F] mb-1">Export Your Plan</h3>
                    <p className="text-sm text-[#8B8580]">Download or share your 30-day content calendar</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button
                        onClick={exportToJSON}
                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        JSON
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                    </button>
                </div>
            </div>

            {/* Recommendations */}
            {plan.recommendations && plan.recommendations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[rgba(55,50,47,0.12)]">
                    <h4 className="text-sm font-semibold text-[#37322F] mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                        Strategic Recommendations
                    </h4>
                    <ul className="space-y-2">
                        {plan.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#605A57]">
                                <span className="text-[oklch(0.5_0.2_45)] mt-0.5">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Trend Insights */}
            {plan.trendInsights && plan.trendInsights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[rgba(55,50,47,0.12)]">
                    <h4 className="text-sm font-semibold text-[#37322F] mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        Trend Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {plan.trendInsights.map((insight, idx) => (
                            <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-1">
                                    <h5 className="text-sm font-semibold text-red-900">{insight.topic}</h5>
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded-full">
                                        {insight.relevance}%
                                    </span>
                                </div>
                                <p className="text-xs text-red-700 mb-2">Source: {insight.source}</p>
                                <p className="text-xs text-red-600">Peak: {insight.peakTime}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
