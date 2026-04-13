"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const sections = [
  {
    title: "What Are Cookies?",
    content:
      "Cookies are small text files stored on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to site owners.",
  },
  {
    title: "Does HabitPulse Use Cookies?",
    content:
      "No. HabitPulse does not use any cookies — neither first-party nor third-party. We do not use cookies for analytics, advertising, or tracking purposes.",
  },
  {
    title: "What We Use Instead",
    content:
      "HabitPulse uses the browser's localStorage API to save your reminders and preferences locally on your device. Unlike cookies, localStorage data is never sent to any server with HTTP requests. Your data stays on your device only.",
  },
  {
    title: "What is Stored in localStorage",
    content:
      "• Your reminder data (names, times, categories, completion status)\n• Your theme preference (dark or light mode)\n• Notification permission state\n\nThis data never leaves your browser and is not accessible to us or any third party.",
  },
  {
    title: "Clearing Your Data",
    content:
      "You can clear all HabitPulse data at any time by:\n• Using the \"Reset\" button on the dashboard\n• Clearing your browser's site data through browser settings\n• Using your browser's developer tools to clear localStorage",
  },
]

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Uses localStorage for reminders and preferences. No tracking cookies.
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
