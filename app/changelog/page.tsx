"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const entries = [
  {
    version: "v1.0.0",
    date: "March 2026",
    title: "Initial Prototype Release",
    changes: [
      "Core reminder system with create, edit, and delete functionality",
      "Dashboard with daily progress ring and completion tracking",
      "Five categories: Health, Hydration, Items, Routine, Custom",
      "Quick-add preset reminders for common daily tasks",
      "Browser notification support with snooze functionality",
      "LocalStorage-based data persistence — no accounts required",
      "Dark and light theme support with system preference detection",
      "Responsive landing page with animated sections",
      "Edit reminder timings directly from the dashboard",
    ],
  },
]

export default function ChangelogPage() {
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
              Product
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Changelog
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Track every update and improvement to HabitPulse.
            </p>
          </motion.div>

          <div className="mt-20 flex flex-col gap-12">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
              >
                {/* Accent glow entirely minimal */}
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10 flex flex-wrap items-center gap-4">
                  <span className="rounded bg-white px-3 py-1 text-sm font-bold text-black tracking-wide">
                    {entry.version}
                  </span>
                  <span className="text-sm font-mono text-neutral-500">{entry.date}</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white relative z-10">{entry.title}</h2>
                <ul className="mt-6 flex flex-col gap-4 relative z-10">
                  {entry.changes.map((change) => (
                    <li key={change} className="flex items-start gap-4 text-sm font-mono text-neutral-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                      <span className="leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
