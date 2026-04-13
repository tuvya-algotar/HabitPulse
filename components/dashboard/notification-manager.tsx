"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { snoozeReminder, getReminders, CATEGORY_CONFIG, markNotified } from "@/lib/reminders"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { BellRing, X, Clock, CheckCircle, AlarmClock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationManagerProps {
  reminders: Reminder[]
  onComplete: (id: string) => void
  onSnooze: () => void
}

interface ActiveNotification {
  id: string
  reminder: Reminder
  timestamp: number
}

const CATEGORY_EMOJI: Record<ReminderCategory, string> = {
  health: "💊",
  hydration: "💧",
  items: "🔑",
  routine: "⚡",
  custom: "📌",
}

export function NotificationManager({
  reminders,
  onComplete,
  onSnooze,
}: NotificationManagerProps) {
  const notifiedRef = useRef<Set<string>>(new Set())
  const [permissionState, setPermissionState] = useState<NotificationPermission>("granted")
  const [showBanner, setShowBanner] = useState(false)
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    const perm = Notification.permission
    setPermissionState(perm)
    if (perm === "default") {
      setShowBanner(true)
    }
  }, [])

  const requestPermission = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    Notification.requestPermission().then((perm) => {
      setPermissionState(perm)
      setShowBanner(false)
    })
  }, [])

  const dismissNotification = useCallback((notifId: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== notifId))
  }, [])

  const handleComplete = useCallback(
    (notifId: string, reminderId: string) => {
      dismissNotification(notifId)
      onComplete(reminderId)
    },
    [dismissNotification, onComplete]
  )

  const handleSnooze = useCallback(
    (notifId: string, reminder: Reminder) => {
      dismissNotification(notifId)
      snoozeReminder(reminder.id, 5)
      onSnooze()
    },
    [dismissNotification, onSnooze]
  )

  const triggerNotification = useCallback(
    (reminder: Reminder) => {
      const notifId = `${reminder.id}-${Date.now()}`

      // Add in-app notification card
      setActiveNotifications((prev) => [
        ...prev,
        { id: notifId, reminder, timestamp: Date.now() },
      ])

      // Auto-dismiss after 30s
      setTimeout(() => {
        setActiveNotifications((prev) => prev.filter((n) => n.id !== notifId))
      }, 30000)

      // Browser notification
      if (permissionState === "granted") {
        try {
          const emoji = CATEGORY_EMOJI[reminder.category] || "🔔"
          new Notification(`${emoji} ${reminder.name}`, {
            body: `Scheduled at ${reminder.time} · ${CATEGORY_CONFIG[reminder.category].label}`,
            tag: reminder.id,
            icon: "/favicon.ico",
          })
        } catch {
          // Notification might not be supported
        }
      }
    },
    [permissionState]
  )

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const today = now.toISOString().split("T")[0]
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`

      const currentReminders = getReminders()

      currentReminders.forEach((reminder) => {
        if (reminder.completed) return

        // Check snoozed reminders
        if (reminder.snoozedUntil) {
          const snoozedUntil = new Date(reminder.snoozedUntil)
          if (now < snoozedUntil) return // still snoozing

          // Snooze has expired — trigger the notification
          const notifKey = `${reminder.id}-snoozed-${reminder.snoozedUntil}`
          if (!notifiedRef.current.has(notifKey)) {
            notifiedRef.current.add(notifKey)
            triggerNotification(reminder)
          }
          return
        }

        // Normal time-based check
        if (reminder.time === currentTime && reminder.lastNotifiedDate !== today) {
          markNotified(reminder.id)
          triggerNotification(reminder)
        }
      })
    }

    // Run initially, then set interval to trigger every 60 seconds (1 minute)
    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [reminders, triggerNotification])

  return (
    <>
      {/* Permission Banner */}
      <AnimatePresence>
        {showBanner && permissionState === "default" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-md relative z-40"
          >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <BellRing className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-white/90">
                  Enable browser notifications to get reminded even when this tab is in the background.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestPermission}
                  className="shrink-0 rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all hover:bg-neutral-200"
                >
                  Enable
                </motion.button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="rounded-lg p-1.5 text-white/50 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-App Notification Cards */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[350px] max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="sync">
          {activeNotifications.map((notif) => {
            const cat = CATEGORY_CONFIG[notif.reminder.category]
            const emoji = CATEGORY_EMOJI[notif.reminder.category]
            return (
               <motion.div
                key={notif.id}
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#121214] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10`}>
                    <span className="text-lg">{emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-neutral-600">·</span>
                      <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notif.reminder.time}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">
                      {notif.reminder.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {notif.reminder.snoozedUntil ? "Snoozed reminder is due" : "It's time for your reminder"}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="shrink-0 -mr-1 -mt-1 p-1 text-neutral-500 transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleComplete(notif.id, notif.reminder.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] font-bold text-black transition-all hover:bg-neutral-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Done
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSnooze(notif.id, notif.reminder)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] font-semibold text-white transition-all hover:bg-white/10"
                  >
                    <AlarmClock className="h-4 w-4" />
                    Snooze 5m
                  </motion.button>
                </div>

                {/* Auto-dismiss progress bar (white/20 style) */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 30, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-white/20 blur-[0.5px]`}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}
