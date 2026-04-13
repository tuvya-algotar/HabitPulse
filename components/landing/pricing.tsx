"use client"

import { Check } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  "Unlimited reminders",
  "All categories",
  "Habit streak tracking",
  "Browser notifications",
  "Local data storage",
]

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pricing" className="relative px-6 py-32 bg-black border-t border-white/5">
      <div className="mx-auto max-w-[1400px] lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-white/50">
            Pricing
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl leading-[1.1]">
            Simple, honest pricing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400 font-mono tracking-wide">
            Currently free to use. Premium tier with advanced syncing coming soon.
          </p>
        </motion.div>

        <div className="mt-20 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[500px]"
          >
            <div className="relative flex flex-col items-start rounded-2xl border border-white/10 bg-[#0a0a0c] p-10 transition-all duration-300 hover:bg-[#0f0f13] hover:border-white/20">
              <span className="text-[40px] leading-none mb-6 text-white inline-flex items-center justify-center h-16 w-16 bg-white/[0.03] border border-white/10 rounded-xl">0</span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Free During Beta
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                This project is currently fully featured and completely free to use. Secure, fast, and entirely local track your life effortlessly.
              </p>

              <div className="my-8 h-px w-full bg-white/5" />

              <ul className="flex flex-col gap-4 w-full">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="rounded-full bg-white text-black p-0.5">
                      <Check className="h-3 w-3 shrink-0" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
