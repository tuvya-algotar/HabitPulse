"use client"

import { ClipboardList } from "lucide-react"
import { motion } from "framer-motion"

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 flex flex-col items-center gap-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl border border-theme-border bg-theme-card"
      >
        <ClipboardList className="h-10 w-10 text-theme-text-muted" />
      </motion.div>
      <h3 className="text-lg font-semibold text-theme-text">Start by adding your first habit</h3>
      <p className="max-w-sm text-sm leading-relaxed text-theme-text-muted">
        Choose from preset templates or create a custom task.
      </p>
    </motion.div>
  )
}
