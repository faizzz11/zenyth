'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentPlan, ContentItem } from '../types';

interface ContentCalendarProps {
    plan: ContentPlan;
}

export default function ContentCalendar({ plan }: ContentCalendarProps) {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

    const platforms = plan.platforms;
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    const getContentForDayAndPlatform = (day: number, platform: string): ContentItem | undefined => {
        return plan.contentItems.find(item => item.day === day && item.platform === platform);
    };

    const getPlatformIcon = (platform: string) => {
        const icons: Record<string, JSX.Element> = {
            youtube: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
            instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
            twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
            linkedin: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
        };
        return icons[platform] || null;
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            youtube: 'bg-red-50 border-red-200 text-red-700',
            instagram: 'bg-pink-50 border-pink-200 text-pink-700',
            twitter: 'bg-gray-50 border-gray-200 text-gray-700',
            linkedin: 'bg-blue-50 border-blue-200 text-blue-700',
        };
        return colors[platform] || 'bg-gray-50 border-gray-200 text-gray-700';
    };

    const handleCreatePost = (item: ContentItem) => {
        const prompt = `${item.title}. ${item.description}. Use hashtags: ${item.hashtags.join(' ')}`;
        router.push(`/all-in-one-post?prompt=${encodeURIComponent(prompt)}&platform=${item.platform}`);
    };

    return (
        <div className="space-y-6">
            {/* Table View */}
            <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.12)] overflow-hidden">
                <div className="p-6 border-b border-[rgba(55,50,47,0.12)]">
                    <h2 className="text-lg font-semibold text-[#37322F]">30-Day Content Calendar</h2>
                    <p className="text-sm text-[#8B8580] mt-1">Click on any content idea to view details or create post</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FBFAF9] border-b border-[rgba(55,50,47,0.12)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#37322F] sticky left-0 bg-[#FBFAF9] z-10 min-w-[80px]">
                                    Day
                                </th>
                                {platforms.map(platform => (
                                    <th key={platform} className={`px-4 py-3 text-center text-xs font-semibold min-w-[250px] ${getPlatformColor(platform)}`}>
                                        <div className="flex items-center justify-center gap-2">
                                            {getPlatformIcon(platform)}
                                            <span className="capitalize">{platform}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-semibold text-[#37322F] sticky right-0 bg-[#FBFAF9] z-10 min-w-[100px]">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(55,50,47,0.08)]">
                            {days.map(day => (
                                <tr key={day} className="hover:bg-[#FBFAF9] transition-colors">
                                    <td className="px-4 py-3 text-sm font-semibold text-[#37322F] sticky left-0 bg-white z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[oklch(0.6_0.2_45)] text-white flex items-center justify-center text-xs font-bold">
                                                {day}
                                            </div>
                                        </div>
                                    </td>
                                    {platforms.map(platform => {
                                        const content = getContentForDayAndPlatform(day, platform);
                                        return (
                                            <td key={platform} className="px-4 py-3">
                                                {content ? (
                                                    <button
                                                        onClick={() => setSelectedItem(content)}
                                                        className="w-full text-left p-3 rounded-lg border border-[rgba(55,50,47,0.12)] hover:border-[oklch(0.6_0.2_45)] hover:shadow-sm transition-all bg-white"
                                                    >
                                                        <div className="text-xs font-semibold text-[#37322F] mb-1 line-clamp-2">
                                                            {content.title}
                                                        </div>
                                                        <div className="text-xs text-[#8B8580] line-clamp-2 mb-2">
                                                            {content.description}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-[#605A57] bg-gray-100 px-2 py-0.5 rounded">
                                                                {content.contentType}
                                                            </span>
                                                            {content.trendBased && (
                                                                <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <div className="text-center text-xs text-[#8B8580] py-6">-</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="px-4 py-3 sticky right-0 bg-white z-10">
                                        {platforms.some(p => getContentForDayAndPlatform(day, p)) && (
                                            <button
                                                onClick={() => {
                                                    const firstContent = platforms.map(p => getContentForDayAndPlatform(day, p)).find(c => c);
                                                    if (firstContent) handleCreatePost(firstContent);
                                                }}
                                                className="w-full px-3 py-2 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                            >
                                                Create
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-[oklch(0.6_0.2_45)] text-white flex flex-col items-center justify-center">
                                        <div className="text-xs font-medium">Day</div>
                                        <div className="text-lg font-bold">{selectedItem.day}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-[#8B8580]">{selectedItem.date}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getPlatformIcon(selectedItem.platform)}
                                            <span className="text-xs text-[#605A57] capitalize">{selectedItem.platform}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-[#37322F] mb-3">{selectedItem.title}</h3>
                            <p className="text-sm text-[#605A57] mb-4">{selectedItem.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Content Type</div>
                                    <div className="text-sm font-medium text-[#37322F]">{selectedItem.contentType}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Time to Create</div>
                                    <div className="text-sm font-medium text-[#37322F]">{selectedItem.timeToCreate}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Engagement</div>
                                    <div className="text-sm font-medium text-[#37322F] capitalize">{selectedItem.estimatedEngagement}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-[#8B8580] mb-1">Trend-Based</div>
                                    <div className="text-sm font-medium text-[#37322F] flex items-center gap-1.5">
                                        {selectedItem.trendBased ? (
                                            <>
                                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                                </svg>
                                                Yes
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                Evergreen
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs font-semibold text-[#37322F] mb-2">Keywords</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.keywords.map((keyword, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs font-semibold text-[#37322F] mb-2">Hashtags</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.hashtags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <div className="text-xs font-semibold text-green-900 mb-1">Call to Action</div>
                                <div className="text-sm text-green-700">{selectedItem.callToAction}</div>
                            </div>

                            {selectedItem.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <div className="text-xs font-semibold text-yellow-900 mb-1">Notes</div>
                                    <div className="text-sm text-yellow-700">{selectedItem.notes}</div>
                                </div>
                            )}

                            <button
                                onClick={() => handleCreatePost(selectedItem)}
                                className="w-full px-4 py-3 bg-[oklch(0.6_0.2_45)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Create Post in All-in-One
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
