"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"
import { Heart, Target, Users, Lightbulb } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Human-Centered Design",
    description: "Every decision is guided by real user needs. We focus on reducing mental overload, not adding to it.",
  },
  {
    icon: Target,
    title: "Simplicity First",
    description: "No complicated setups, no account walls. Add a reminder and start building habits immediately.",
  },
  {
    icon: Users,
    title: "Built for Everyone",
    description: "Whether you're a student, professional, or caregiver — HabitPulse adapts to your routine.",
  },
  {
    icon: Lightbulb,
    title: "Academic Foundation",
    description: "Created using Design Thinking methodology as part of an academic project, grounded in real research.",
  },
]

export default function AboutPage() {
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
              Company
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              About HabitPulse
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              A student-built project solving everyday forgetfulness through human-centered design.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-12 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white">Our Story</h2>
            <div className="mt-6 flex flex-col gap-6 font-mono text-sm leading-relaxed text-neutral-400">
              <p>
                HabitPulse was born out of a simple observation: people forget small but important daily tasks — taking
                medicine on time, staying hydrated, remembering essentials before leaving home. These aren&apos;t failures of
                willpower; they&apos;re failures of systems.
              </p>
              <p>
                Developed as a Design Thinking project, HabitPulse was built by talking to real users, understanding their
                pain points, prototyping solutions, and iterating based on feedback. The result is a clean, no-friction
                reminder system that works right in your browser — no signups, no downloads, no data collection.
              </p>
              <p>
                This project is currently a prototype for academic purposes, with plans to evolve into a full-featured
                habit management platform in the future.
              </p>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/5 bg-[#0a0a0c] p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <value.icon className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{value.title}</h3>
                <p className="mt-3 text-sm font-mono leading-relaxed text-neutral-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
