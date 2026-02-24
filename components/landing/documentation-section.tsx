"use client"

import { useState, useEffect } from "react"
import type React from "react"

// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const cards = [
    {
      id: "memes",
      title: "AI Meme Generator",
      description: "Generate viral memes instantly with AI.\nCustomize templates, add trending captions, and go viral.",
    },
    {
      id: "music",
      title: "Music Content Exchange",
      description: "Remix and generate music content with AI.\nBlend modern beats with classic vocals and styles.",
    },
    {
      id: "creator",
      title: "AI Creator Studio",
      description: "AI cartoon voice/face with funny explanations.\nMake complex topics entertaining and viral.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [cards.length])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[1.17px] outline-[#37322F] outline-offset-[-0.58px] rounded-full"></div>
            }
            text="AI Agents"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Meet your AI creative agents
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Meme generation, music remixing, and AI creator studio
            <br />
            — your entire creative team, powered by AI.
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
          {/* Left Column - Feature Cards */}
          <div className="w-full md:w-auto md:max-w-[400px] flex flex-col justify-center items-center gap-4 order-2 md:order-1">
            {cards.map((card, index) => {
              const isActive = index === activeCard

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`w-full overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer ${isActive
                      ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
                      : "border border-[rgba(2,6,23,0.08)]"
                    }`}
                >
                  <div
                    className={`w-full h-0.5 bg-[rgba(50,45,43,0.08)] overflow-hidden ${isActive ? "opacity-100" : "opacity-0"}`}
                  >
                    <div
                      key={animationKey}
                      className="h-0.5 bg-[#322D2B] animate-[progressBar_5s_linear_forwards] will-change-transform"
                    />
                  </div>
                  <div className="px-6 py-5 w-full flex flex-col gap-2">
                    <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm font-semibold leading-6 font-sans">
                      {card.title}
                    </div>
                    <div className="self-stretch text-[#605A57] text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line">
                      {card.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column - Image */}
          <div className="w-full md:w-auto rounded-lg flex flex-col justify-center items-center gap-2 order-1 md:order-2 md:px-0 px-[00]">
            <div className="w-full md:w-[580px] h-[250px] md:h-[420px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-lg flex flex-col justify-start items-start relative">
              {activeCard === 0 && (
                <div
                  key="hospital"
                  className="absolute inset-0 transition-all duration-500 ease-in-out flex items-center justify-center opacity-100 scale-100 bg-gradient-to-br from-blue-50 to-blue-100"
                >
                  <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="40" width="320" height="220" rx="8" fill="white" stroke="#0066CC" strokeWidth="2" />
                    <rect x="60" y="60" width="120" height="40" rx="4" fill="#0066CC" opacity="0.2" />
                    <rect x="60" y="110" width="80" height="30" rx="4" fill="#0066CC" opacity="0.1" />
                    <rect x="150" y="110" width="80" height="30" rx="4" fill="#0066CC" opacity="0.1" />
                    <rect x="240" y="110" width="80" height="30" rx="4" fill="#0066CC" opacity="0.1" />
                    <rect x="60" y="150" width="260" height="100" rx="4" fill="#0066CC" opacity="0.1" />
                    <circle cx="80" cy="80" r="8" fill="#0066CC" />
                    <rect x="100" y="75" width="60" height="10" rx="2" fill="#0066CC" opacity="0.3" />
                    <rect x="200" y="60" width="100" height="20" rx="4" fill="#0066CC" opacity="0.2" />
                    <rect x="310" y="60" width="40" height="20" rx="4" fill="#0066CC" />
                  </svg>
                </div>
              )}
              {activeCard === 1 && (
                <div
                  key="doctor"
                  className="absolute inset-0 transition-all duration-500 ease-in-out flex items-center justify-center opacity-100 scale-100 bg-gradient-to-br from-purple-50 to-purple-100"
                >
                  <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="40" width="320" height="220" rx="8" fill="white" stroke="#6B46C1" strokeWidth="2" />
                    <circle cx="120" cy="120" r="40" fill="#6B46C1" opacity="0.1" />
                    <path d="M100 120L110 130L140 100" stroke="#6B46C1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="200" y="80" width="120" height="80" rx="4" fill="#6B46C1" opacity="0.1" />
                    <rect x="220" y="100" width="80" height="40" rx="4" fill="#6B46C1" opacity="0.2" />
                    <path d="M80 200L100 180L120 200L140 180L160 200" stroke="#6B46C1" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <rect x="200" y="180" width="120" height="60" rx="4" fill="#6B46C1" opacity="0.1" />
                    <rect x="220" y="200" width="80" height="20" rx="2" fill="#6B46C1" opacity="0.3" />
                    <circle cx="280" cy="120" r="12" fill="#6B46C1" />
                    <path d="M275 120L280 125L285 120" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              {activeCard === 2 && (
                <div
                  key="patient"
                  className="absolute inset-0 transition-all duration-500 ease-in-out flex items-center justify-center opacity-100 scale-100 bg-gradient-to-br from-green-50 to-green-100"
                >
                  <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="40" width="320" height="220" rx="8" fill="white" stroke="#00A651" strokeWidth="2" />
                    <rect x="60" y="60" width="100" height="140" rx="4" fill="#00A651" opacity="0.1" />
                    <circle cx="110" cy="100" r="20" fill="#00A651" opacity="0.2" />
                    <rect x="80" y="130" width="60" height="60" rx="4" fill="#00A651" opacity="0.1" />
                    <rect x="180" y="60" width="160" height="40" rx="4" fill="#00A651" opacity="0.1" />
                    <rect x="200" y="70" width="120" height="20" rx="2" fill="#00A651" opacity="0.3" />
                    <rect x="180" y="120" width="80" height="30" rx="4" fill="#00A651" opacity="0.2" />
                    <rect x="270" y="120" width="70" height="30" rx="4" fill="#00A651" opacity="0.2" />
                    <rect x="180" y="170" width="160" height="30" rx="4" fill="#00A651" opacity="0.1" />
                    <path d="M200 200L220 180L240 200L260 180L280 200" stroke="#00A651" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="320" cy="100" r="15" fill="#00A651" />
                    <path d="M315 100L320 105L325 100" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
