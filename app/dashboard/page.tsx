"use client"

import { useState } from "react"
import Link from "next/link"

const quickActions = [
    {
        title: "Generate Thumbnails",
        description: "AI-powered thumbnail variations with A/B testing",
        href: "/thumbnail-agent",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
        color: "from-amber-500/10 to-orange-500/10",
        borderColor: "border-amber-200/60",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-700",
    },
    {
        title: "Create Memes",
        description: "Generate viral memes with trending templates",
        href: "/meme-agent",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
        color: "from-purple-500/10 to-pink-500/10",
        borderColor: "border-purple-200/60",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-700",
    },
    {
        title: "Music Studio",
        description: "Remix and generate music content with AI",
        href: "/music-agent",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
        color: "from-blue-500/10 to-cyan-500/10",
        borderColor: "border-blue-200/60",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-700",
    },
    {
        title: "Content Planner",
        description: "Plan & schedule a full month of content",
        href: "/dashboard/planner",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        color: "from-emerald-500/10 to-teal-500/10",
        borderColor: "border-emerald-200/60",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-700",
    },
]

const stats = [
    { label: "Content Generated", value: "128", change: "+12%", up: true },
    { label: "Posts Published", value: "64", change: "+8%", up: true },
    { label: "Total Reach", value: "2.4M", change: "+23%", up: true },
    { label: "Engagement Rate", value: "5.7%", change: "+1.2%", up: true },
]

const recentActivity = [
    { type: "thumbnail", title: "Generated 4 thumbnail variations", time: "2 hours ago", status: "completed" },
    { type: "meme", title: "Created viral meme template", time: "5 hours ago", status: "completed" },
    { type: "trend", title: "Trend alert: AI tools for creators", time: "8 hours ago", status: "alert" },
    { type: "publish", title: "Published to YouTube & Instagram", time: "1 day ago", status: "completed" },
    { type: "schedule", title: "Scheduled 5 posts for next week", time: "2 days ago", status: "scheduled" },
]

const trendingTopics = [
    { topic: "AI Video Editing", platform: "YouTube", spike: "+340%", heat: "🔥🔥🔥" },
    { topic: "Content Automation", platform: "LinkedIn", spike: "+180%", heat: "🔥🔥" },
    { topic: "Meme Marketing", platform: "Instagram", spike: "+95%", heat: "🔥" },
    { topic: "Creator Economy 2026", platform: "X", spike: "+250%", heat: "🔥🔥🔥" },
]

export default function DashboardPage() {
    const [greeting] = useState(() => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 17) return "Good afternoon"
        return "Good evening"
    })

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar */}
            <div className="border-b border-[rgba(55,50,47,0.08)] px-8 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#37322F] font-sans tracking-tight">
                            {greeting}, Karan 👋
                        </h1>
                        <p className="text-sm text-[#847971] mt-1 font-sans">
                            Here&apos;s what&apos;s happening with your content today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-[13px] font-medium text-[#605A57] border border-[rgba(55,50,47,0.15)] rounded-full hover:bg-[rgba(55,50,47,0.04)] transition-colors font-sans">
                            <span className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                Notifications
                            </span>
                        </button>
                        <Link
                            href="/thumbnail-agent"
                            className="px-5 py-2 text-[13px] font-medium text-white bg-[#37322F] rounded-full hover:bg-[#49423D] transition-colors font-sans shadow-sm"
                        >
                            + Create Content
                        </Link>
                    </div>
                </div>
            </div>

            <div className="px-8 py-8 max-w-[1400px]">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="px-6 py-5 rounded-xl border border-[rgba(55,50,47,0.10)] bg-white hover:border-[rgba(55,50,47,0.20)] transition-all duration-200 hover:shadow-[0px_4px_12px_rgba(55,50,47,0.06)]"
                        >
                            <div className="text-[13px] font-medium text-[#847971] font-sans mb-2">
                                {stat.label}
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-semibold text-[#37322F] font-sans tracking-tight">
                                    {stat.value}
                                </div>
                                <div className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${stat.up
                                        ? "text-emerald-700 bg-emerald-50"
                                        : "text-red-700 bg-red-50"
                                    }`}>
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-[#37322F] font-sans tracking-tight mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`group relative p-5 rounded-xl border ${action.borderColor} bg-gradient-to-br ${action.color} hover:shadow-[0px_8px_24px_rgba(55,50,47,0.08)] transition-all duration-300 hover:-translate-y-0.5`}
                            >
                                <div className={`w-11 h-11 rounded-lg ${action.iconBg} flex items-center justify-center mb-4 ${action.iconColor}`}>
                                    {action.icon}
                                </div>
                                <h3 className="text-[15px] font-semibold text-[#37322F] font-sans mb-1">
                                    {action.title}
                                </h3>
                                <p className="text-[13px] text-[#847971] font-sans leading-5">
                                    {action.description}
                                </p>
                                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#847971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-3">
                        <div className="rounded-xl border border-[rgba(55,50,47,0.10)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)] flex items-center justify-between">
                                <h2 className="text-[15px] font-semibold text-[#37322F] font-sans">
                                    Recent Activity
                                </h2>
                                <button className="text-[12px] font-medium text-[oklch(0.6_0.2_45)] hover:underline font-sans">
                                    View all
                                </button>
                            </div>
                            <div className="divide-y divide-[rgba(55,50,47,0.06)]">
                                {recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="px-6 py-4 flex items-center gap-4 hover:bg-[rgba(55,50,47,0.02)] transition-colors"
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                                                activity.status === "alert" ? "bg-amber-50 text-amber-600" :
                                                    "bg-blue-50 text-blue-600"
                                            }`}>
                                            {activity.status === "completed" && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            {activity.status === "alert" && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                                </svg>
                                            )}
                                            {activity.status === "scheduled" && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-medium text-[#37322F] font-sans truncate">
                                                {activity.title}
                                            </div>
                                            <div className="text-[12px] text-[#847971] font-sans mt-0.5">
                                                {activity.time}
                                            </div>
                                        </div>
                                        <div className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${activity.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                                                activity.status === "alert" ? "bg-amber-50 text-amber-700" :
                                                    "bg-blue-50 text-blue-700"
                                            }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trending Topics */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-[rgba(55,50,47,0.10)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)] flex items-center justify-between">
                                <h2 className="text-[15px] font-semibold text-[#37322F] font-sans">
                                    Trending Now 🔥
                                </h2>
                                <Link href="/dashboard/trends" className="text-[12px] font-medium text-[oklch(0.6_0.2_45)] hover:underline font-sans">
                                    Explore
                                </Link>
                            </div>
                            <div className="divide-y divide-[rgba(55,50,47,0.06)]">
                                {trendingTopics.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="px-6 py-4 hover:bg-[rgba(55,50,47,0.02)] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[13px] font-semibold text-[#37322F] font-sans">
                                                {trend.topic}
                                            </span>
                                            <span className="text-[12px] font-bold text-emerald-600">
                                                {trend.spike}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] text-[#847971] font-sans">
                                                {trend.platform}
                                            </span>
                                            <span className="text-[12px]">{trend.heat}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tip Card */}
                        <div className="mt-5 rounded-xl border border-[oklch(0.6_0.2_45/0.2)] bg-gradient-to-br from-[oklch(0.6_0.2_45/0.05)] to-[oklch(0.6_0.2_45/0.02)] p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[oklch(0.6_0.2_45/0.15)] flex items-center justify-center flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.5 0.2 45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-semibold text-[#37322F] font-sans mb-1">
                                        Pro Tip
                                    </h3>
                                    <p className="text-[12px] text-[#605A57] font-sans leading-[18px]">
                                        Use the Trend Detector to find rising topics, then auto-generate content with our AI agents for maximum reach.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
