"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const sections = [
  {
    title: "Data Collection",
    content:
      "HabitPulse does not collect, store, or transmit any personal data to external servers. All your reminder data, preferences, and settings are stored locally in your browser using the Web Storage API (localStorage).",
  },
  {
    title: "What We Store Locally",
    content:
      "The following data is stored exclusively on your device:\n• Reminder names, times, and categories\n• Completion status and streak data\n• Theme preferences (dark/light mode)\n• Notification permission preferences",
  },
  {
    title: "Third-Party Services",
    content:
      "HabitPulse does not integrate with any third-party analytics, advertising, or tracking services. We do not use cookies for tracking purposes. The only external resources loaded are fonts from Google Fonts.",
  },
  {
    title: "Data Deletion",
    content:
      "Since all data is stored locally in your browser, you can delete all HabitPulse data at any time by clearing your browser's localStorage or using the \"Reset\" feature in the dashboard.",
  },
  {
    title: "Future Changes",
    content:
      "If future versions of HabitPulse introduce cloud-based features (such as cross-device sync), we will update this policy accordingly and clearly inform users before any data leaves their device.",
  },
]

export default function PrivacyPage() {
  return (
    <InfoPageLayout>
      <section className="relative px-6 py-32 bg-black min-h-screen">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Legal
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Data stored locally in browser. No personal data collected or shared with external services.
            </p>
            <p className="mt-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">Last updated: March 2026</p>
          </motion.div>

          <div className="mt-20 flex flex-col gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-10 shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10]"
              >
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <p className="mt-4 text-sm font-mono leading-relaxed text-neutral-400 whitespace-pre-line">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
