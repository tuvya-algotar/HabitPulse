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
  getLocalDateStr,
  snoozeReminder,
} from "@/lib/reminders"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { computeMetrics } from "@/lib/insight-engine"
import { DashboardHeader } from "./dashboard-header"
import { ProgressRing } from "./progress-ring"
import { ReminderCard } from "./reminder-card"
import { AddReminderDialog } from "./add-reminder-dialog"
import { NotificationManager } from "./notification-manager"
import { EmptyState } from "./empty-state"
import { InsightSection } from "./insight-section"
import { motion, AnimatePresence } from "framer-motion"

export function DashboardContent() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState("all")
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReminders(getReminders())
    
    // Check onboarding
    const hasVisited = localStorage.getItem("habitpulse_hasVisited")
    if (!hasVisited) {
      setShowOnboarding(true)
    }
  }, [])

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem("habitpulse_hasVisited", "true")
    setShowOnboarding(false)
  }, [])

  const handleAdd = useCallback(
    (data: Omit<Reminder, "id" | "completed" | "createdAt">) => {
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
              duration: reminder.duration,
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

  const handleSnoozeItem = useCallback((id: string, minutes: number) => {
    snoozeReminder(id, minutes)
    setReminders(getReminders())
    toast.success(`Habit snoozed for ${minutes >= 60 ? '1 hour' : '30 minutes'}`)
  }, [])

  const handleRefreshData = useCallback(() => {
    setReminders(getReminders())
  }, [])

  const handleEdit = useCallback((id: string, updates: Partial<Reminder>) => {
    const updated = editReminder(id, updates)
    setReminders(updated)
    toast.success("Reminder updated successfully")
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-theme-base">
        <div className="bg-theme-card/80 backdrop-blur-md border-b border-theme-border sticky top-0 z-50">
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

  const now = new Date()
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes()
  const todayStr = getLocalDateStr(now)

  const isCompletedToday = (r: Reminder) => {
    const todayHistory = r.history?.find((h) => h.date === todayStr)
    return todayHistory?.completed === true
  }

  const isMissed = (reminder: Reminder) => {
    if (isCompletedToday(reminder)) return false
    const [h, m] = reminder.time.split(":").map(Number)
    const scheduledMinutes = h * 60 + m
    return scheduledMinutes < currentTotalMinutes && reminder.lastNotifiedDate !== todayStr
  }

  const matchesFilter = (r: Reminder) => {
    if (filter === "all") return true
    if (filter === "morning") return parseInt(r.time.split(":")[0], 10) < 12
    if (filter === "evening") return parseInt(r.time.split(":")[0], 10) >= 17
    return r.category === filter
  }

  const missedReminders = reminders
    .filter(isMissed)
    .filter(matchesFilter)
    .sort((a, b) => a.time.localeCompare(b.time))
    
  const activeReminders = reminders
    .filter((r) => !isCompletedToday(r) && !isMissed(r))
    .filter(matchesFilter)
    .sort((a, b) => a.time.localeCompare(b.time))
    
  const metrics = computeMetrics(reminders)
  const completedCount = metrics.daily.completed
  const totalCount = metrics.daily.total

  const completedReminders = reminders
    .filter((r) => {
      const todayHistory = r.history?.find((h) => h.date === todayStr)
      return todayHistory?.completed === true
    })
    .filter(matchesFilter)
    .sort((a, b) => a.time.localeCompare(b.time))

  const filteredTotal = missedReminders.length + activeReminders.length + completedReminders.length

  const todayFocusHabits = reminders
    .filter((r) => !isCompletedToday(r))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3)

  return (
    <div className="relative flex min-h-screen flex-col bg-theme-base text-theme-text transition-colors duration-300">
      {/* Background radial layer */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-theme-border via-transparent to-transparent opacity-20" />
      </div>

      <DashboardHeader onReset={handleReset} onRefresh={handleRefreshData} />
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
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-theme-text leading-[1.1]">
              Your Reminders
            </h1>
            <p className="text-sm font-mono text-theme-text-muted tracking-wide mt-1">
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
            
            {missedReminders.length > 0 && filter === "all" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-amber-500">
                  You have a few habits to catch up on. See below.
                </p>
              </div>
            )}

            {/* Today's Focus Section */}
            {filter === "all" && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-theme-border pb-2">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Today's Focus
                  </h2>
                  <span className="ml-auto text-xs font-medium text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {todayFocusHabits.length} task{todayFocusHabits.length !== 1 ? 's' : ''} left today
                  </span>
                </div>
                
                {todayFocusHabits.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-8 border border-emerald-500/20 rounded-2xl bg-emerald-500/5 text-emerald-400 gap-2 shadow-[0_0_30px_rgba(16,185,129,0.03)]"
                  >
                    <span className="text-2xl">🎉</span>
                    <span className="font-semibold text-sm">You're all done for today</span>
                    <span className="text-xs opacity-70">Great consistency today</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.03)] transition-all duration-500">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <AnimatePresence mode="popLayout">
                      {todayFocusHabits.map((reminder, i) => (
                        <ReminderCard
                          key={`focus-${reminder.id}`}
                          reminder={reminder}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            )}

            <InsightSection reminders={reminders} />

            {/* Filter Dropdown Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
              <h2 className="text-lg font-bold text-theme-text">Your Dashboard</h2>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none w-full sm:w-auto bg-theme-base border border-theme-border text-theme-text text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="all">All Habits</option>
                  <option value="morning">Morning (Before 12 PM)</option>
                  <option value="evening">Evening (After 5 PM)</option>
                  <option disabled>──────────</option>
                  <option value="health">Health</option>
                  <option value="hydration">Hydration</option>
                  <option value="items">Items</option>
                  <option value="routine">Routine</option>
                  <option value="custom">Custom</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-theme-text-muted">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
            </div>

            {filteredTotal === 0 && filter !== "all" && (
              <div className="flex items-center justify-center p-8 border border-dashed border-theme-border rounded-2xl bg-theme-card/30">
                <p className="text-theme-text-muted">No habits in this category</p>
              </div>
            )}

            {/* Missed reminders */}
            <AnimatePresence mode="popLayout">
              {missedReminders.length > 0 && (
                <motion.section
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex flex-col gap-1 border-b border-amber-500/20 pb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                        You missed earlier
                      </h2>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded bg-amber-500/20 px-1.5 text-xs font-bold text-amber-500 font-mono">
                        {missedReminders.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-500/60 font-medium">You can still complete them anytime</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                      {missedReminders.slice(0, 5).map((reminder, i) => (
                        <div key={reminder.id} className="relative group mt-3">
                          {/* Snooze Options */}
                          <div className="absolute -top-3 right-2 z-10 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleSnoozeItem(reminder.id, 30)}
                              className="text-[10px] uppercase tracking-wider font-bold bg-[#1a1a1c] border border-amber-500/20 text-amber-500 px-2 py-1 rounded shadow-lg hover:bg-amber-500/10 transition-colors"
                            >
                              +30m
                            </button>
                            <button
                              onClick={() => handleSnoozeItem(reminder.id, 60)}
                              className="text-[10px] uppercase tracking-wider font-bold bg-[#1a1a1c] border border-amber-500/20 text-amber-500 px-2 py-1 rounded shadow-lg hover:bg-amber-500/10 transition-colors"
                            >
                              +1h
                            </button>
                          </div>
                          
                          <p className="absolute -top-5 left-2 text-[11px] font-medium text-amber-500/80">
                            Was scheduled at {reminder.time}
                          </p>
                          <div className="border border-amber-500/10 rounded-2xl relative overflow-hidden bg-amber-500/[0.02]">
                            <ReminderCard
                              key={`missed-${reminder.id}`}
                              reminder={reminder}
                              onToggle={handleToggle}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              index={i}
                            />
                            {/* subtle tint overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-amber-500/[0.02]" />
                          </div>
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Active reminders */}
            <AnimatePresence mode="popLayout">
              {activeReminders.length > 0 && (
                <motion.section
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex items-center gap-3 border-b border-theme-border pb-2">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-theme-text-muted font-bold">
                      Upcoming
                    </h2>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded bg-theme-border px-1.5 text-xs font-bold text-theme-text font-mono">
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
                  <div className="mb-4 flex items-center gap-3 border-b border-theme-border pb-2 mt-4">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-theme-text-muted font-bold">
                      Completed
                    </h2>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded bg-theme-border px-1.5 text-xs font-bold text-theme-text font-mono">
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

      <footer className="w-full pb-8 pt-4 flex flex-col items-center text-center opacity-50 z-10 transition-opacity hover:opacity-100">
        <p className="text-xs font-mono text-theme-text-muted flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500/50 inline-block"></span>
          Your data stays safely on this device
        </p>
      </footer>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-sm rounded-[24px] border border-white/10 bg-[#0a0a0c] p-8 shadow-2xl text-center flex flex-col gap-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl">🌱</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to HabitPulse</h2>
                <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                  A calm space to build better routines.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-left my-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm">1</div>
                  <div className="flex flex-col pt-1.5">
                    <p className="text-sm font-semibold text-white">Add a habit</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Start small with simple routines.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm">2</div>
                  <div className="flex flex-col pt-1.5">
                    <p className="text-sm font-semibold text-white">Complete it daily</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Focus purely on today.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-bold text-sm">3</div>
                  <div className="flex flex-col pt-1.5">
                    <p className="text-sm font-semibold text-white">Track your progress</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Build streaks and momentum.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={dismissOnboarding}
                className="mt-2 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
