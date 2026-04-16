export type ReminderCategory = "health" | "hydration" | "items" | "routine" | "custom"

export function getLocalDateStr(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export interface ReminderHistory {
  date: string // YYYY-MM-DD
  completed: boolean
  completedAt?: string // ISO string
}

export interface Reminder {
  id: string
  name: string
  time: string // HH:mm format
  category: ReminderCategory
  snoozedUntil?: string // ISO string
  createdAt: string // ISO string
  duration: number // Number of days
  lastNotifiedDate?: string | null // YYYY-MM-DD
  type?: "binary" | "count" | "timer"
  targetValue?: number
  currentValue?: number
  targetDuration?: number
  currentDuration?: number
  history?: ReminderHistory[]
}

const STORAGE_KEY = "smart-habit-reminders"

export function getEffectiveTime(reminder: Reminder): Date {
  if (reminder.snoozedUntil) {
    const snoozeDate = new Date(reminder.snoozedUntil)
    if (snoozeDate > new Date()) {
      return snoozeDate
    }
  }

  const [h, m] = reminder.time.split(":").map(Number)
  const now = new Date()
  const scheduled = new Date(now)
  scheduled.setHours(h, m, 0, 0)

  return scheduled
}

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null

export function saveReminders(reminders: Reminder[]): void {
  if (typeof window === "undefined") return

  if (saveTimeout) clearTimeout(saveTimeout)

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }, 300)
}

export function getActiveReminders(): Reminder[] {
  const reminders = getReminders()
  const now = new Date()

  return reminders.filter((r) => {
    if (!r.duration) return true

    const created = new Date(r.createdAt)
    const expiry = new Date(created)
    expiry.setDate(expiry.getDate() + r.duration)

    return now <= expiry
  })
}

export function isCompletedToday(reminder: Reminder): boolean {
  if (!reminder.history) return false
  const todayStr = getLocalDateStr()
  const entry = reminder.history.find((h) => h.date === todayStr)
  return entry ? entry.completed : false
}

export function addReminder(reminder: Omit<Reminder, "id" | "createdAt">): Reminder {
  const newReminder: Reminder = {
    type: "binary",
    ...reminder,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    history: [],
  }
  const reminders = getReminders()
  reminders.push(newReminder)
  saveReminders(reminders)
  return newReminder
}

function updateHistoryForToday(r: Reminder, isCompleted: boolean) {
  const todayStr = getLocalDateStr()
  const history = r.history || []
  const existingIdx = history.findIndex(h => h.date === todayStr)
  
  if (isCompleted) {
    const newEntry: ReminderHistory = { date: todayStr, completed: true, completedAt: new Date().toISOString() }
    if (existingIdx >= 0) history[existingIdx] = newEntry
    else history.push(newEntry)
  } else {
    if (existingIdx >= 0 && history[existingIdx].completed) {
      history.splice(existingIdx, 1)
    }
  }
  r.history = history
}

export function toggleReminder(id: string): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) => {
    if (r.id === id) {
      const isCompleted = !isCompletedToday(r)
      const cloned = { ...r }
      updateHistoryForToday(cloned, isCompleted)
      return cloned
    }
    return r
  })
  saveReminders(updated)
  return updated
}

export function deleteReminder(id: string): Reminder[] {
  const reminders = getReminders().filter((r) => r.id !== id)
  saveReminders(reminders)
  return reminders
}

export function snoozeReminder(id: string, minutes: number): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) => {
    if (r.id !== id) return r

    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()
    return { ...r, snoozedUntil, lastNotifiedDate: null }
  })
  saveReminders(updated)
  return updated
}

export function resetDailyReminders(): Reminder[] {
  const reminders = getReminders()
  const todayStr = getLocalDateStr()
  
  const updated = reminders.map((r) => {
    // Clear today's entry on reset so insight engine is accurate
    const history = r.history?.filter(h => h.date !== todayStr) || []
    // Let's not proactively inject missed here to keep it simple, insight engine will compute missed passively.
    
    return {
      ...r,
      history,
      snoozedUntil: undefined,
      currentValue: r.currentValue !== undefined ? 0 : undefined,
      currentDuration: r.currentDuration !== undefined ? 0 : undefined,
    }
  })
  saveReminders(updated)
  return updated
}

export function editReminder(id: string, updates: Partial<Reminder>): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) => {
    if (r.id === id) {
      const updatedReminder = { ...r, ...updates }
      let newCompletedStatus = isCompletedToday(updatedReminder)
      
      // Auto-complete logic
      if (updatedReminder.type === "count" && updatedReminder.currentValue !== undefined && updatedReminder.targetValue !== undefined) {
        newCompletedStatus = updatedReminder.currentValue >= updatedReminder.targetValue
      }
      if (updatedReminder.type === "timer" && updatedReminder.currentDuration !== undefined && updatedReminder.targetDuration !== undefined) {
        newCompletedStatus = updatedReminder.currentDuration >= updatedReminder.targetDuration * 60
      }
      
      updateHistoryForToday(updatedReminder, newCompletedStatus)
      return updatedReminder
    }
    return r
  })
  saveReminders(updated)
  return updated
}

export function markNotified(id: string): Reminder[] {
  const reminders = getReminders()
  const today = getLocalDateStr()
  const updated = reminders.map((r) =>
    r.id === id ? { ...r, lastNotifiedDate: today } : r
  )
  saveReminders(updated)
  return updated
}

export const CATEGORY_CONFIG: Record<
  ReminderCategory,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  health: { label: "Health", color: "text-red-400", bgColor: "bg-red-500/10", dotColor: "bg-red-500" },
  hydration: { label: "Hydration", color: "text-blue-400", bgColor: "bg-blue-500/10", dotColor: "bg-blue-500" },
  items: { label: "Items", color: "text-amber-400", bgColor: "bg-amber-500/10", dotColor: "bg-amber-500" },
  routine: { label: "Routine", color: "text-emerald-400", bgColor: "bg-emerald-500/10", dotColor: "bg-emerald-500" },
  custom: { label: "Custom", color: "text-slate-400", bgColor: "bg-slate-500/10", dotColor: "bg-slate-500" },
}

export const PRESET_REMINDERS: { name: string; category: ReminderCategory; time: string; duration: number }[] = [
  { name: "Take morning medicine", category: "health", time: "08:00", duration: 7 },
  { name: "Drink water", category: "hydration", time: "09:00", duration: 7 },
  { name: "Check keys and wallet", category: "items", time: "07:30", duration: 7 },
  { name: "Take evening medicine", category: "health", time: "20:00", duration: 7 },
  { name: "Drink water (afternoon)", category: "hydration", time: "14:00", duration: 7 },
  { name: "Exercise", category: "routine", time: "07:00", duration: 7 },
]
