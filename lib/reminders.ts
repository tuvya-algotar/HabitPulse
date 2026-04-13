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
  completed: boolean
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

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveReminders(reminders: Reminder[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export function addReminder(reminder: Omit<Reminder, "id" | "completed" | "createdAt">): Reminder {
  const newReminder: Reminder = {
    type: "binary",
    ...reminder,
    id: crypto.randomUUID(),
    completed: false,
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
      const isCompleted = !r.completed
      const cloned = { ...r, completed: isCompleted }
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
  const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()
  const updated = reminders.map((r) => {
    if (r.id !== id) return r

    const now = new Date()
    // Calculate new time from NOW, not original schedule, to guarantee it drops out of the missed queue
    // Add an extra 1-minute buffer to ensure it doesn't instantly border the miss-window
    const totalMinutes = now.getHours() * 60 + now.getMinutes() + minutes + 1
    const newHour = Math.floor(totalMinutes / 60) % 24
    const newMin = totalMinutes % 60
    const newTime = `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`

    return { ...r, time: newTime, snoozedUntil, lastNotifiedDate: null }
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
      completed: false,
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
      let newCompletedStatus = updatedReminder.completed
      
      // Auto-complete logic
      if (updatedReminder.type === "count" && updatedReminder.currentValue !== undefined && updatedReminder.targetValue !== undefined) {
        newCompletedStatus = updatedReminder.currentValue >= updatedReminder.targetValue
      }
      if (updatedReminder.type === "timer" && updatedReminder.currentDuration !== undefined && updatedReminder.targetDuration !== undefined) {
        newCompletedStatus = updatedReminder.currentDuration >= updatedReminder.targetDuration * 60
      }
      
      updatedReminder.completed = newCompletedStatus
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
