"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using HabitPulse, you agree to these Terms of Service. HabitPulse is a prototype developed for educational and demonstration purposes as part of an academic project.",
  },
  {
    title: "Nature of the Service",
    content:
      "HabitPulse is a browser-based habit reminder application. It is provided \"as is\" without warranties of any kind. As a prototype, the application may contain bugs, incomplete features, or be subject to changes without notice.",
  },
  {
    title: "User Data",
    content:
      "All data you create within HabitPulse (reminders, settings, preferences) is stored locally on your device. We do not have access to your data and cannot recover it if lost. You are responsible for your own data backups.",
  },
  {
    title: "Intellectual Property",
    content:
      "HabitPulse and its original content, features, and functionality are the intellectual property of its creators. The application was developed as an academic project and is intended for educational and demonstration use.",
  },
  {
    title: "Limitations",
    content:
      "HabitPulse shall not be held liable for any damages, data loss, or missed reminders resulting from the use of this application. This is a prototype and should not be relied upon for critical health or safety reminders.",
  },
  {
    title: "Modifications",
    content:
      "We reserve the right to modify or discontinue the service at any time without prior notice. As this is an evolving academic project, features may be added, changed, or removed.",
  },
]

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Prototype for educational and demonstration purposes.
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
                <p className="mt-4 text-sm font-mono leading-relaxed text-neutral-400">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
