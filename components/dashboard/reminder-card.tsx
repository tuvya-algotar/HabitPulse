"use client"

import { Clock, Trash2, Check, Pill, Droplets, Key, ListChecks, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { CATEGORY_CONFIG } from "@/lib/reminders"
import { motion } from "framer-motion"
import { EditReminderDialog } from "./edit-reminder-dialog"

const CATEGORY_ICONS: Record<ReminderCategory, typeof Pill> = {
  health: Pill,
  hydration: Droplets,
  items: Key,
  routine: ListChecks,
  custom: Tag,
}

interface ReminderCardProps {
  reminder: Reminder
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<Reminder>) => void
  index: number
}

export function ReminderCard({ reminder, onToggle, onDelete, onEdit, index }: ReminderCardProps) {
  const config = CATEGORY_CONFIG[reminder.category]
  const Icon = CATEGORY_ICONS[reminder.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        reminder.completed
          ? "border-white/5 bg-white/[0.02]"
          : "border-white/10 bg-[#0a0a0c] hover:border-white/20 hover:bg-[#0d0d10]"
      }`}
    >
      {/* Complete button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onToggle(reminder.id)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-300 ${
          reminder.completed
            ? "border-white bg-white text-black"
            : "border-white/20 hover:border-white/50 hover:bg-white/5 bg-black"
        }`}
        aria-label={reminder.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.div
          initial={false}
          animate={reminder.completed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
        >
          <Check className="h-4 w-4" />
        </motion.div>
      </motion.button>

      <div className="flex-1 min-w-0 py-1">
        <p
          className={`font-semibold truncate transition-all duration-300 ${
            reminder.completed
              ? "text-neutral-500 line-through"
              : "text-white"
          }`}
        >
          {reminder.name}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Clock className="h-3 w-3" />
            {reminder.time}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-white/60 bg-white/5 border border-white/10 ${
              reminder.completed ? 'opacity-50' : ''
            }`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
      >
        <EditReminderDialog reminder={reminder} onEdit={onEdit} />
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
          onClick={() => onDelete(reminder.id)}
          aria-label="Delete reminder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  )
}
