"use client"

import Link from "next/link"
import { Bell, RotateCcw, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { BackupManager } from "./backup-manager"

interface DashboardHeaderProps {
  onReset: () => void
  onRefresh: () => void
}

export function DashboardHeader({ onReset, onRefresh }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-theme-card/80 backdrop-blur-md border-b border-theme-border"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-theme-text-muted transition-colors hover:text-theme-text hover:bg-theme-card-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <Link href="/" className="relative z-10 flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-theme-text transition-transform duration-300 group-hover:scale-105">
              <Bell className="h-4 w-4 text-theme-base" />
            </div>
            <span className="text-lg font-bold tracking-tight text-theme-text">HabitPulse</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <BackupManager onImportComplete={onRefresh} />
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-theme-text-muted transition-colors hover:text-theme-text"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Day</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
