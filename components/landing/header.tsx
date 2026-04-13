"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="relative z-10 flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white transition-transform duration-300 group-hover:scale-105">
            <Bell className="h-4 w-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">HabitPulse</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <a
            href="/#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="/#how-it-works"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            How it works
          </a>
          <a
            href="/#pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            Pricing
          </a>
          
          <div className="ml-4">
            <Link href="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-neutral-200"
              >
                Dashboard 
              </motion.button>
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200"
            >
              Dashboard
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
