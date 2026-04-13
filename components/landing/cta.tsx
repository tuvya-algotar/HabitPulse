"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section className="relative w-full overflow-hidden bg-black py-40 border-t border-white/5" ref={ref}>
      {/* Deep Space Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/[0.05] via-black to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-balance text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.1]">
            Your habits deserve a <span className="text-neutral-500">framework.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 font-mono tracking-wide">
            Join thousands building better routines with HabitPulse. No sign-up, no complicated setup. Your data stays private in your browser natively.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex justify-center"
        >
           <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-2 transition-all"
              >
                <span>Get Started — It's Free</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
