"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        label: "Thumbnail Agent",
        href: "/thumbnail-agent",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
    },
    {
        label: "Meme Generator",
        href: "/meme-agent",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
    },
    {
        label: "Music Studio",
        href: "/music-agent",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    {
        label: "All In One Post",
        href: "/all-in-one-post",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
        ),
    },
    {
        label: "Content Planner",
        href: "/dashboard/planner",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        label: "Trend Detector",
        href: "/dashboard/trends",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
]

const bottomItems = [
    {
        label: "Settings",
        href: "/settings",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={`${collapsed ? "w-[72px]" : "w-[260px]"
                } h-screen sticky top-0 flex flex-col border-r border-[rgba(55,50,47,0.12)] bg-[#FBFAF9] transition-all duration-300 ease-in-out z-40`}
        >
            {/* Logo */}
            <div className="h-[64px] flex items-center px-5 border-b border-[rgba(55,50,47,0.08)] gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#37322F] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm font-sans">Z</span>
                </div>
                {!collapsed && (
                    <span className="text-[#2F3037] text-lg font-semibold font-sans tracking-tight">
                        Zenyth
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`${collapsed ? "ml-0" : "ml-auto"} w-7 h-7 rounded-md flex items-center justify-center hover:bg-[rgba(55,50,47,0.06)] transition-colors`}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#605A57"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                    >
                        <polyline points="11 17 6 12 11 7" />
                        <polyline points="18 17 13 12 18 7" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? "bg-[#37322F] text-white shadow-sm"
                                    : "text-[#605A57] hover:bg-[rgba(55,50,47,0.06)] hover:text-[#37322F]"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#847971] group-hover:text-[#49423D]"}`}>
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="text-[13px] font-medium leading-5 font-sans whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                            {isActive && !collapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.2_45)]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-4 border-t border-[rgba(55,50,47,0.08)] space-y-1">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-[#37322F] text-white shadow-sm"
                                    : "text-[#605A57] hover:bg-[rgba(55,50,47,0.06)] hover:text-[#37322F]"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#847971] group-hover:text-[#49423D]"}`}>
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="text-[13px] font-medium leading-5 font-sans whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* User Profile */}
                {!collapsed && (
                    <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(55,50,47,0.04)] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[#37322F] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">KB</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#37322F] truncate">Karan B.</div>
                            <div className="text-[11px] text-[#847971] truncate">Creator Plan</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="mt-3 flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.6_0.2_45)] to-[#37322F] flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">KB</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}
