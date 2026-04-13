"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import {
  getReminders,
  addReminder,
  toggleReminder,
  deleteReminder,
  resetDailyReminders,
  editReminder,
} from "@/lib/reminders"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { DashboardHeader } from "./dashboard-header"
import { ProgressRing } from "./progress-ring"
import { ReminderCard } from "./reminder-card"
import { AddReminderDialog } from "./add-reminder-dialog"
import { NotificationManager } from "./notification-manager"
import { EmptyState } from "./empty-state"
import { motion, AnimatePresence } from "framer-motion"

export function DashboardContent() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReminders(getReminders())
  }, [])

  const handleAdd = useCallback(
    (data: { name: string; time: string; category: ReminderCategory }) => {
      const newReminder = addReminder(data)
      setReminders((prev) => [...prev, newReminder])
      toast.success(`"${data.name}" added at ${data.time}`)
    },
    []
  )

  const handleToggle = useCallback((id: string) => {
    const updated = toggleReminder(id)
    setReminders(updated)
    const reminder = updated.find((r) => r.id === id)
    if (reminder?.completed) {
      toast.success(`"${reminder.name}" completed!`)
    }
  }, [])

  const handleDelete = useCallback((id: string) => {
    const current = getReminders()
    const reminder = current.find((r) => r.id === id)
    const updated = deleteReminder(id)
    setReminders(updated)
    if (reminder) {
      toast("Reminder deleted", {
        description: reminder.name,
        action: {
          label: "Undo",
          onClick: () => {
            const restored = addReminder({
              name: reminder.name,
              time: reminder.time,
              category: reminder.category,
            })
            setReminders((prev) => [...prev, restored])
          },
        },
      })
    }
  }, [])

  const handleReset = useCallback(() => {
    const updated = resetDailyReminders()
    setReminders(updated)
    toast.info("All reminders reset for a new day!")
  }, [])

  const handleSnooze = useCallback(() => {
    setReminders(getReminders())
  }, [])

  const handleEdit = useCallback((id: string, updates: Partial<Reminder>) => {
    const updated = editReminder(id, updates)
    setReminders(updated)
    toast.success("Reminder updated successfully")
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-[#050505]">
        <div className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
            <div className="h-8 w-32 animate-pulse rounded-md bg-white/5" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="h-[130px] w-[130px] animate-pulse rounded-full bg-white/5" />
            <div className="h-8 w-48 animate-pulse rounded-md bg-white/5" />
            <div className="mt-8 flex w-full flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => a.time.localeCompare(b.time))
  const completedReminders = reminders.filter((r) => r.completed)
  const completedCount = completedReminders.length
  const totalCount = reminders.length

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      {/* Background radial layer - very subtle white burst mapping to dark linear aesthetics */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-black to-black" />
      </div>

      <DashboardHeader onReset={handleReset} />
      <NotificationManager
        reminders={reminders}
        onComplete={handleToggle}
        onSnooze={handleSnooze}
      />

      <main className="relative mx-auto w-full max-w-5xl flex-1 p-6 z-10">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between pt-8 pb-4"
        >
          <div className="flex flex-col items-center gap-2 sm:items-start text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Your Reminders
            </h1>
            <p className="text-sm font-mono text-neutral-500 tracking-wide mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <ProgressRing completed={completedCount} total={totalCount} />
        </motion.div>

        {/* Add button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex justify-center sm:justify-start"
        >
          <AddReminderDialog onAdd={handleAdd} />
        </motion.div>

        {totalCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-12 flex flex-col gap-12">
            {/* Active reminders */}
            <AnimatePresence mode="popLayout">
              {activeReminders.length > 0 && (
                <motion.section
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-2">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                      Upcoming
                    </h2>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1.5 text-xs font-bold text-white font-mono">
                      {activeReminders.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                      {activeReminders.map((reminder, i) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Completed reminders */}
            <AnimatePresence mode="popLayout">
              {completedReminders.length > 0 && (
                <motion.section
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-2 mt-4">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                      Completed
                    </h2>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1.5 text-xs font-bold text-white font-mono">
                      {completedReminders.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                      {completedReminders.map((reminder, i) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}
