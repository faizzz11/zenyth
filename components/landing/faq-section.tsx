"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Zenyth and who is it for?",
    answer:
      "Zenyth is an AI-powered content creation and social media management platform for creators, influencers, and brands. It helps you generate videos, thumbnails, scripts, memes, and more — then publish across all platforms in one click.",
  },
  {
    question: "What kind of content can Zenyth generate?",
    answer:
      "Zenyth can generate video scripts, AI voiceovers, edited videos, smart thumbnails with A/B testing, memes, images, titles, descriptions, tags, and even month-long content calendars. Our AI agents handle everything from ideation to final output.",
  },
  {
    question: "How does multi-platform publishing work?",
    answer:
      "With one click, Zenyth publishes your content across YouTube, Instagram, X (Twitter), LinkedIn, TikTok, and more. It auto-rewrites and optimizes your content for each platform's unique format, tone, and requirements.",
  },
  {
    question: "What is the Smart Thumbnail A/B Testing feature?",
    answer:
      "Zenyth's AI generates 5 thumbnail variants for your video, automatically runs A/B tests across your audience, and keeps the highest-performing thumbnail based on click-through rate (CTR). No manual testing needed.",
  },
  {
    question: "How does the Trend Spike Detector work?",
    answer:
      "Unlike tools that show what's already trending, Zenyth detects early trend spikes before they peak. You get real-time notifications so you can create content on viral topics while they're still rising — giving you maximum reach.",
  },
  {
    question: "How do I get started with Zenyth?",
    answer:
      "Getting started is simple! Sign up for free, connect your social media accounts, and start creating. Use our AI agents to generate content, schedule posts, and track performance — all from one dashboard.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Everything you need to know about Zenyth
            <br className="hidden md:block" />
            and how it supercharges your content creation.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
