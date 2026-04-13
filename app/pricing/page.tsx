"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  "Unlimited reminders",
  "All categories",
  "Habit streak tracking",
  "Browser notifications",
  "Local data storage",
]

export default function PricingPage() {
  return (
    <InfoPageLayout>
      <section className="relative px-6 py-32 bg-black min-h-screen">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Pricing
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Currently free to use. Premium plans coming soon.
            </p>
          </motion.div>

          <div className="mt-20 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex w-full max-w-[500px] flex-col items-center rounded-[24px] border border-white/20 bg-[#0a0a0c] p-10 sm:p-14 text-center transition-all duration-500 hover:border-white/30 hover:bg-[#0d0d10] shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[24px] pointer-events-none" />
              <span className="text-[56px] leading-none mb-4">🚀</span>
              <h2 className="mt-2 text-3xl font-bold text-white relative z-10">Free During Beta</h2>
              <p className="mt-6 text-sm font-mono leading-relaxed text-neutral-400 relative z-10">
                This project is currently a prototype developed for academic purposes, so it is completely free to use.
                Future versions may include premium features such as advanced habit tracking, analytics, and cross-device syncing.
              </p>
              <div className="my-10 h-px w-full bg-white/10 relative z-10" />
              <ul className="flex flex-col gap-4 w-full text-left relative z-10">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-sm font-mono text-neutral-300">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 relative z-10 w-full pt-6 border-t border-white/5">
                <span className="inline-flex items-center justify-center w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  Premium plans coming soon
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
