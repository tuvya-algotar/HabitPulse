"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Github } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Send us your feedback or questions about the Smart Habit Reminder System.",
    detail: "hello@habitpulse.app",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    description: "Have a suggestion or found a bug? We'd love to hear from you.",
    detail: "Use the contact form below",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Check out the source code, report issues, or contribute to the project.",
    detail: "github.com/habitpulse",
  },
]

export default function ContactPage() {
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
              Get in Touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Reach out for questions or feedback about the Smart Habit Reminder System.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/5 bg-[#0a0a0c] p-8 text-center transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <method.icon className="h-6 w-6 text-white/80" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{method.title}</h3>
                <p className="mt-3 text-sm font-mono text-neutral-400 leading-relaxed">{method.description}</p>
                <p className="mt-4 text-sm font-semibold text-white/90">{method.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 rounded-[20px] border border-white/10 bg-[#0a0a0c] p-8 sm:p-12 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white">Send a Message</h2>
            <p className="mt-3 text-sm font-mono text-neutral-500">
              This is a prototype — the form below is for demonstration purposes only.
            </p>
            <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <textarea
                placeholder="Your message"
                rows={6}
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none resize-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                className="self-start rounded-xl bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
