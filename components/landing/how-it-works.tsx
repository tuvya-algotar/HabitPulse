"use client"

import { Plus, LayoutDashboard, BellRing } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    number: "01",
    icon: Plus,
    title: "Add Your Reminders",
    description:
      "Choose from preset templates or create custom reminders. Set the time and category natively.",
  },
  {
    number: "02",
    icon: LayoutDashboard,
    title: "Track Your Day",
    description:
      "See all your reminders organized cleanly. Track your daily progress with crisp visuals.",
  },
  {
    number: "03",
    icon: BellRing,
    title: "Get Pinged",
    description:
      "When it's time, you get a beautiful native notification. Mark it as done. That's it.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" className="relative px-6 py-32 bg-[#050505]">
      <div className="relative mx-auto max-w-[1000px] lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-white/50">
            How it works
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl leading-[1.1]">
            Three steps to <span className="text-neutral-500">better routines.</span>
          </h2>
        </motion.div>

        <div className="relative mt-24">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-7 top-0 hidden h-full w-px origin-top bg-white/10 md:block"
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-8 group"
              >
                {/* Step circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center transition-transform group-hover:scale-110"
                >
                  <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                </motion.div>

                <div className="pt-2">
                  <span className="text-xs font-mono tracking-widest text-neutral-500 mb-2 block">
                    STEP {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-white md:text-2xl mb-3">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-neutral-400 max-w-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
