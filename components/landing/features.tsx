"use client"

import {
  Pill,
  Droplets,
  Key,
  ListChecks,
  BellRing,
  Clock,
} from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  {
    icon: Pill,
    title: "Medicine Reminders",
    description: "Never miss a dose. Set reminders for morning, afternoon, and evening medications.",
  },
  {
    icon: Droplets,
    title: "Stay Hydrated",
    description: "Gentle nudges throughout the day to keep you drinking enough water.",
  },
  {
    icon: Key,
    title: "Essential Items",
    description: "Keys, wallet, phone, ID card. Check before you leave the house.",
  },
  {
    icon: ListChecks,
    title: "Daily Habits",
    description: "Build better routines by tracking exercise, reading, journaling, and more.",
  },
  {
    icon: BellRing,
    title: "Smart Notifications",
    description: "Get notified at the right time with browser notifications you can snooze or dismiss.",
  },
  {
    icon: Clock,
    title: "Daily Reset",
    description: "All reminders refresh each day so you can start fresh every morning.",
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative px-6 py-32 bg-black">
      <div className="mx-auto max-w-[1400px] lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-white/50">
            Features
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl leading-[1.1]">
            Everything you need to <span className="text-neutral-500">stay on track.</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-400 font-mono tracking-wide">
            Designed for simplicity. No complex setup, no distractions. Just reminders that work gracefully in the background.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0c] p-8 transition-all duration-300 hover:bg-[#0f0f13] hover:border-white/10 h-full">
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-xl border border-white/5 bg-white/[0.02] p-3 text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white/90">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
