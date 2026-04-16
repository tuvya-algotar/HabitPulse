"use client"

import { useEffect, useRef, useCallback, useState } from "react"

import { getActiveReminders, CATEGORY_CONFIG, markNotified, getLocalDateStr, isCompletedToday, getEffectiveTime } from "@/lib/reminders"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { SNOOZE_DURATIONS } from "@/lib/constants"
import { BellRing, X, Clock, CheckCircle, AlarmClock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// TypeScript: expose Electron's preload bridge on window
declare global {
  interface Window {
    electronAPI?: {
      notify: (data: { title: string; body: string }) => void
    }
  }
}

interface NotificationManagerProps {
  reminders: Reminder[]
  onComplete: (id: string) => void
  onSnooze: (id: string, minutes: number) => void
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

// Generate a safe integer ID based on UUID for native plugins
function hashId(idString: string): number {
  let hash = 0
  for (let i = 0; i < idString.length; i++) {
    hash = (hash << 5) - hash + idString.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}



// Abstract Notification Layer Wrapper
// Routes to Electron native notification when available, falls back to Web Notification API.
async function sendNotification(title: string, body: string, reminderId?: string) {
  if (typeof window === "undefined") return

  // ── Electron desktop path ──────────────────────────────────────────────────
  if (window.electronAPI) {
    window.electronAPI.notify({ title, body })
    return
  }

  // ── Browser (Web Notification API) fallback ────────────────────────────────
  if ("Notification" in window) {
    console.log("Notification permission:", Notification.permission)
    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          tag: reminderId || title,
          icon: "/favicon.ico",
        })
      } catch (err) {
        console.warn("Failed to fire Notification constructor:", err)
      }
    } else {
      console.warn("Notification permission blocked, skipped system push.")
    }
  }
}

export function NotificationManager({
  reminders,
  onComplete,
  onSnooze,
}: NotificationManagerProps) {
  const notifiedRef = useRef<Set<string>>(new Set())
  const [permissionState, setPermissionState] = useState<string>("default")
  const [showBanner, setShowBanner] = useState(false)
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>([])

  // Initialization check for permission
  useEffect(() => {
    const initPerms = async () => {
      if (typeof window === "undefined" || !("Notification" in window)) return
      const perm = Notification.permission
      setPermissionState(perm)
      if (perm === "default" || perm === "denied") {
        setShowBanner(true)
      }
    }
    initPerms()
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    const perm = await Notification.requestPermission()
    setPermissionState(perm)
    setShowBanner(false)
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
      onSnooze(reminder.id, SNOOZE_DURATIONS.short)
    },
    [dismissNotification, onSnooze]
  )

  const triggerNotification = useCallback(
    (reminder: Reminder) => {
      const notifId = `${reminder.id}-${Date.now()}`

      setActiveNotifications((prev) => {
        if (prev.some(n => n.reminder.id === reminder.id)) return prev
        return [...prev, { id: notifId, reminder, timestamp: Date.now() }]
      })

      setTimeout(() => {
        setActiveNotifications((prev) => prev.filter((n) => n.id !== notifId))
      }, 30000)

      toast.info("Reminder triggered", {
        description: reminder.name,
      })

      // Try triggering OS notification through abstract wrapper (For Snooze or Web triggers)
      sendNotification("HabitPulse", `Time to complete "${reminder.name}"`, reminder.id)
    },
    []
  )

  // ----------------------------------------------------
  // NATIVE APP SCHEDULING (Capacitor Exclusive logic removed)
  // ----------------------------------------------------

  // ----------------------------------------------------
  // WEB APP DYNAMIC POLLING (Browser Background logic)
  // ----------------------------------------------------
  const checkReminders = useCallback(() => {
    const now = new Date()
    const today = getLocalDateStr(now)
    
    let lastCheckedTime = now.getTime() - 30000 // default to 30s ago
    try {
      const lastCheckedStr = localStorage.getItem("lastCheckedTime")
      if (lastCheckedStr) lastCheckedTime = parseInt(lastCheckedStr, 10)
    } catch {}

    const currentReminders = getActiveReminders()

    currentReminders.forEach((reminder) => {
      if (isCompletedToday(reminder)) return

      // Check snoozed reminders first
      if (reminder.snoozedUntil) {
        const snoozedUntil = new Date(reminder.snoozedUntil)
        if (now.getTime() >= snoozedUntil.getTime()) {
          const notifKey = `${reminder.id}-snoozed-${reminder.snoozedUntil}`
          if (!notifiedRef.current.has(notifKey)) {
            notifiedRef.current.add(notifKey)
            triggerNotification(reminder)
          }
        }
        return
      }

      // Time parsing
      const scheduledTime = getEffectiveTime(reminder)
      
      const diffInSeconds = (now.getTime() - scheduledTime.getTime()) / 1000
      const isWithinWindow = diffInSeconds >= -30 && diffInSeconds <= 120
      
      const missedInactive = scheduledTime.getTime() > lastCheckedTime && scheduledTime.getTime() <= now.getTime()

      if ((isWithinWindow || missedInactive) && reminder.lastNotifiedDate !== today) {
        console.log("TRIGGERING NOTIFICATION:", reminder.name)
        reminder.lastNotifiedDate = today
        markNotified(reminder.id)
        triggerNotification(reminder)
      }
    })
    
    try {
      localStorage.setItem("lastCheckedTime", now.getTime().toString())
    } catch {}
  }, [triggerNotification])

  useEffect(() => {
    checkReminders()
    const interval = setInterval(checkReminders, 30000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkReminders()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [checkReminders])

  return (
    <>
      <AnimatePresence>
        {showBanner && (
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
                  {(permissionState === "default" || permissionState === "prompt")
                    ? "Enable notifications to get habit reminders."
                    : "Notifications are blocked. Enable from settings."
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(permissionState === "default" || permissionState === "prompt") && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestPermission}
                    className="shrink-0 rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all hover:bg-neutral-200"
                  >
                    Enable
                  </motion.button>
                )}
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

      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[350px] max-w-[calc(100vw-2rem)] pointer-events-none">
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
                className="relative pointer-events-auto overflow-hidden rounded-[20px] border border-white/10 bg-[#121214] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4"
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
                    Snooze 30m
                  </motion.button>
                </div>

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

