"use client"

import { Clock, Trash2, Check, Pill, Droplets, Key, ListChecks, Tag, Play, Pause, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Reminder, ReminderCategory, ReminderHistory } from "@/lib/reminders"
import { CATEGORY_CONFIG, getLocalDateStr, isCompletedToday } from "@/lib/reminders"
import { motion, AnimatePresence } from "framer-motion"
import { EditReminderDialog } from "./edit-reminder-dialog"
import { useState, useEffect } from "react"

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
  
  const isBinary = !reminder.type || reminder.type === "binary"
  const isCount = reminder.type === "count"
  const isTimer = reminder.type === "timer"

  const [isRunning, setIsRunning] = useState(false)
  const [localSeconds, setLocalSeconds] = useState(reminder.currentDuration || 0)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isCompletedToday(reminder)) {
      interval = setInterval(() => {
        setLocalSeconds((prev) => {
          const next = prev + 1
          const targetSeconds = (reminder.targetDuration ?? 0) * 60

          if (next >= targetSeconds && targetSeconds > 0) {
            clearInterval(interval)
            setIsRunning(false)
            onToggle(reminder.id)
            return next
          }

          return next
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, reminder, onToggle])

  useEffect(() => {
    if (!isRunning) {
      setLocalSeconds(reminder.currentDuration || 0)
    }
  }, [reminder.currentDuration, isRunning])

  useEffect(() => {
    if (isTimer && reminder.targetDuration) {
      if (localSeconds >= reminder.targetDuration * 60 && isRunning) {
        setIsRunning(false)
        onEdit(reminder.id, { currentDuration: localSeconds })
      }
    }
  }, [localSeconds, isTimer, reminder.targetDuration, isRunning, reminder.id, onEdit])

  const handleToggleTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      onEdit(reminder.id, { currentDuration: localSeconds })
    } else {
      setIsRunning(true)
    }
  }

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleIncrement = () => {
    const next = (reminder.currentValue || 0) + 1
    onEdit(reminder.id, { currentValue: next })
  }
  const handleDecrement = () => {
    const next = Math.max(0, (reminder.currentValue || 0) - 1)
    onEdit(reminder.id, { currentValue: next })
  }

  // 1. Streak Logic
  const getStreak = () => {
    let streak = 0
    // Look back up to 365 days
    for (let i = 0; i < 365; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dStr = getLocalDateStr(d)
        
        const entry = reminder.history?.find(h => h.date === dStr)
        const isCompleted = entry?.completed === true

        if (i === 0) {
            // Today logic
            if (isCompleted) streak++
            else continue // SKIP today (don't break streak if not done yet)
        } else {
            // Past days
            if (isCompleted) streak++
            else break
        }
    }
    return streak
  }
  const streak = getStreak()

  // 2. Weekly Activity Visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i)) // 6 days ago -> today
      const dateStr = getLocalDateStr(d)
      const entry = reminder.history?.find(h => h.date === dateStr)
      return { 
          dateStr, 
          isToday: i === 6, 
          completed: entry?.completed === true 
      }
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.98 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.2),
        layout: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden rounded-xl border p-4 sm:p-5 transition-all duration-500 ${
        isCompletedToday(reminder)
          ? "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_25px_rgba(16,185,129,0.05)]"
          : "border-theme-border bg-theme-card hover:border-theme-border-strong hover:bg-theme-card-hover shadow-sm"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Complete button for binary (or manual overide for others) */}
        {isBinary && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggle(reminder.id)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
              isCompletedToday(reminder)
                ? "border-emerald-500/50 bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "border-theme-border hover:border-theme-text hover:bg-theme-card-hover bg-theme-base"
            }`}
            aria-label={isCompletedToday(reminder) ? "Mark as incomplete" : "Mark as complete"}
          >
            <motion.div
              initial={false}
              animate={isCompletedToday(reminder) ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          </motion.button>
        )}

        {(isCount || isTimer) && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggle(reminder.id)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
              isCompletedToday(reminder)
                ? "border-emerald-500/50 bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "border-theme-border-strong hover:border-theme-text hover:bg-theme-card-hover bg-theme-base text-theme-text-muted hover:text-theme-text"
            }`}
            aria-label="Toggle Complete"
          >
            <Check className="h-4 w-4" />
          </motion.button>
        )}

        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-3">
             <p
               className={`font-semibold truncate transition-all duration-500 ${
                 isCompletedToday(reminder)
                   ? "text-emerald-500/70 line-through"
                   : "text-theme-text"
               }`}
             >
               {reminder.name}
             </p>
             <AnimatePresence mode="popLayout">
               {streak > 0 ? (
                   <motion.span 
                     key={streak}
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="text-[10px] font-bold text-orange-400 font-mono tracking-widest bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-1"
                   >
                     🔥 {streak} DAY{streak !== 1 ? 'S' : ''} {isCompletedToday(reminder) ? <span className="text-[9px] opacity-70 ml-0.5">GROWING</span> : ''}
                   </motion.span>
               ) : (
                   <motion.span 
                     key="no-streak"
                     className="text-[10px] font-bold text-theme-text-muted font-mono tracking-widest bg-theme-border/50 border border-theme-border px-1.5 py-0.5 rounded-md"
                   >
                     NO STREAK
                   </motion.span>
               )}
             </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                 <Clock className="h-3 w-3" />
                 {reminder.time}
               </span>
               <span
                 className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-theme-text-muted bg-theme-card-hover border border-theme-border ${
                   isCompletedToday(reminder) ? 'opacity-50' : ''
                 }`}
               >
                 <Icon className="h-3 w-3" />
                 {config.label}
               </span>
            </div>

            {/* Weekly Activity Row */}
            <div className="flex items-center gap-1.5">
               {last7Days.map((day, idx) => (
                   <div 
                      key={idx}
                      className={`h-1.5 w-4 rounded-full transition-colors duration-500 ${
                          day.completed ? 'bg-emerald-500' : 'bg-theme-border'
                      } ${day.isToday && !day.completed ? 'outline outline-1 outline-offset-1 outline-theme-border-strong' : ''}`}
                      title={day.dateStr}
                   />
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Habit Specific Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 opacity-100 transition-opacity">
        {isCount && !isCompletedToday(reminder) && (
          <div className="flex items-center gap-3 bg-theme-card-hover border border-theme-border rounded-xl px-2 py-1">
            <button
              onClick={handleDecrement}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-theme-text-muted hover:bg-theme-border hover:text-theme-text transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center min-w-[3rem]">
              <span className="text-white font-bold text-sm leading-none">{reminder.currentValue || 0}</span>
              <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mt-1">/ {reminder.targetValue}</span>
            </div>
            <button
              onClick={handleIncrement}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-theme-text-muted hover:bg-theme-border hover:text-theme-text transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {isCount && isCompletedToday(reminder) && (
           <div className="flex items-center gap-2 bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2">
            <span className="text-theme-text font-bold text-sm">Target reached</span>
            <span className="text-theme-text-muted font-bold text-sm">({reminder.currentValue || 0} / {reminder.targetValue})</span>
           </div>
        )}

        {isTimer && !isCompletedToday(reminder) && (
          <div className="flex items-center gap-3 bg-theme-card-hover border border-theme-border rounded-xl px-2 py-1">
            <div className="flex flex-col items-center min-w-[3.5rem] px-2">
              <span className="text-theme-text font-mono font-bold text-sm leading-none">{formatTime(localSeconds)}</span>
              <span className="text-theme-text-muted text-[10px] uppercase font-bold tracking-widest mt-1">/ {reminder.targetDuration}m</span>
            </div>
            <button
              onClick={handleToggleTimer}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isRunning ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-theme-border text-theme-text hover:bg-theme-border-strong"
              }`}
            >
              {isRunning 
                ? <Pause className="h-4 w-4" fill="currentColor" /> 
                : <Play className="h-4 w-4 ml-1" fill="currentColor" />
              }
            </button>
          </div>
        )}

        {isTimer && isCompletedToday(reminder) && (
           <div className="flex items-center gap-2 bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2">
            <span className="text-theme-text font-bold text-sm">Timer complete</span>
            <span className="text-theme-text-muted font-bold text-sm font-mono">({formatTime(localSeconds)})</span>
           </div>
        )}

        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 mt-3 sm:mt-0"
        >
          <EditReminderDialog reminder={reminder} onEdit={onEdit} />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
            onClick={() => onDelete(reminder.id)}
            aria-label="Delete reminder"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
