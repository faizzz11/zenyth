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
      "Zenyth is a comprehensive hospital management platform designed for healthcare facilities. It's perfect for hospitals, clinics, doctors, and patients looking to streamline healthcare operations, manage patient care, and improve overall efficiency.",
  },
  {
    question: "How does Zenyth help with hospital management?",
    answer:
      "Zenyth provides complete hospital operations management including bed tracking, patient admissions and discharges, inventory management, OPD queue management, and real-time analytics. Everything you need to run a hospital efficiently is in one platform.",
  },
  {
    question: "What features are available for doctors?",
    answer:
      "The doctor portal includes patient management, AI-powered diagnosis assistance, electronic prescriptions, medical records management, appointment scheduling, and comprehensive patient history tracking. All tools doctors need for efficient patient care.",
  },
  {
    question: "What can patients do with Zenyth?",
    answer:
      "Patients can book appointments, view their medical records and history, access prescriptions, use AI-powered symptom checking, track their health metrics, and communicate with healthcare providers. Everything patients need for their healthcare journey.",
  },
  {
    question: "Is patient data secure with Zenyth?",
    answer:
      "Absolutely. We use healthcare-grade security measures including HIPAA compliance, end-to-end encryption, regular security audits, and secure data storage. Patient privacy and data security are our top priorities.",
  },
  {
    question: "How do I get started with Zenyth?",
    answer:
      "Getting started is simple! Sign up for free, choose your role (hospital, doctor, or patient), complete your profile setup, and our team will help you get started. Hospital administrators can set up their facility, doctors can start managing patients, and patients can begin booking appointments immediately.",
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
            and how it transforms healthcare management.
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
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
