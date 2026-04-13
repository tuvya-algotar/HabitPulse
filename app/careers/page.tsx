"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

export default function CareersPage() {
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
              Company
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Careers
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Academic project — no open positions currently. Future opportunities for developers and designers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 flex flex-col items-center gap-8 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Briefcase className="h-10 w-10 text-white/80" />
            </div>
            <div className="rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-12 shadow-2xl max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-white">No Open Positions</h2>
              <p className="mt-6 text-sm font-mono leading-relaxed text-neutral-400">
                HabitPulse is currently an academic prototype. As the project grows beyond its academic scope, we plan to
                open opportunities for:
              </p>
              <ul className="mt-8 flex flex-col gap-4 text-sm font-mono text-neutral-300 text-left w-full sm:w-3/4 mx-auto">
                <li className="flex items-center gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  Frontend Developers (React / Next.js)
                </li>
                <li className="flex items-center gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  UX/UI Designers
                </li>
                <li className="flex items-center gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  Mobile App Developers
                </li>
                <li className="flex items-center gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  Content Writers
                </li>
              </ul>
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Check back later or follow our roadmap for project updates.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
