"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const roadmapItems = [
  {
    status: "completed",
    quarter: "Q1 2026",
    title: "Core Prototype",
    items: [
      "Basic reminder CRUD functionality",
      "Dashboard with progress tracking",
      "Browser notifications",
      "Dark/light theme support",
      "Edit reminder timings",
    ],
  },
  {
    status: "in-progress",
    quarter: "Q2 2026",
    title: "Mobile Responsive UI",
    items: [
      "Fully responsive mobile design",
      "Touch-friendly controls",
      "Hamburger navigation menu",
      "Mobile-optimized animations",
    ],
  },
  {
    status: "planned",
    quarter: "Q3 2026",
    title: "Smarter Scheduling",
    items: [
      "Recurring reminders (daily, weekly, custom)",
      "Smart time suggestions based on patterns",
      "Habit streak visualization",
      "Weekly and monthly reports",
    ],
  },
  {
    status: "planned",
    quarter: "Q4 2026",
    title: "Advanced Features",
    items: [
      "Calendar integration view",
      "Data export and import",
      "Cross-device sync (optional cloud)",
      "Analytics dashboard",
    ],
  },
]

const statusStyles: Record<string, { dot: string; label: string; bg: string }> = {
  completed: { dot: "bg-white", label: "COMPLETED", bg: "bg-white text-black" },
  "in-progress": { dot: "bg-white/40", label: "IN PROGRESS", bg: "bg-white/10 text-white/80" },
  planned: { dot: "bg-white/10", label: "PLANNED", bg: "bg-transparent border border-white/10 text-white/40" },
}

export default function RoadmapPage() {
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
              Roadmap
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              See what&apos;s coming next for HabitPulse. We&apos;re building features that matter.
            </p>
          </motion.div>

          <div className="relative mt-20 flex flex-col gap-10">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            {roadmapItems.map((item, i) => {
              const style = statusStyles[item.status]
              return (
                <motion.div
                  key={item.quarter}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-8"
                >
                  <div className="hidden md:flex flex-col items-center pt-8">
                    <div className={`h-4 w-4 rounded-full border-[3px] border-black ${style.dot} z-10`} />
                  </div>
                  <div className="flex-1 rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-10 transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10] shadow-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
                      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-neutral-500">{item.quarter}</span>
                        <span className={`rounded px-2.5 py-1 text-[10px] font-bold tracking-widest font-mono ${style.bg}`}>
                          {style.label}
                        </span>
                      </div>
                    </div>
                    <ul className="mt-6 flex flex-col gap-3">
                      {item.items.map((task) => (
                        <li key={task} className="flex items-start gap-3 text-sm font-mono text-neutral-400">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
