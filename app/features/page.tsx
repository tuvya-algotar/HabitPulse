"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { Bell, Clock, CheckCircle, Zap, Layers, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Set reminders for medicines, hydration, daily essentials, and custom tasks. Each reminder is categorized and color-coded for quick visual scanning.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Choose exact times for each reminder. Edit timings anytime directly from the dashboard. Snooze when you need a few extra minutes.",
  },
  {
    icon: CheckCircle,
    title: "Progress Tracking",
    description:
      "See your daily completion rate at a glance with the progress ring. Track which reminders you've completed and which are still upcoming.",
  },
  {
    icon: Zap,
    title: "Quick-Add Presets",
    description:
      "Get started instantly with built-in preset reminders for common tasks like taking medicine, drinking water, and checking essentials.",
  },
  {
    icon: Layers,
    title: "Category Organization",
    description:
      "Organize reminders into Health, Hydration, Items, Routine, and Custom categories. Each category has its own color and icon for easy identification.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "All your data is stored locally in your browser using localStorage. No accounts, no servers, no data collection. Your habits stay private.",
  },
]

export default function FeaturesPage() {
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
              Product
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Features
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Manage daily routines through simple reminders — create tasks, schedule reminders, and track completion.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <feature.icon className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm font-mono leading-relaxed text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
