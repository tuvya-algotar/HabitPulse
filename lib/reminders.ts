export type ReminderCategory = "health" | "hydration" | "items" | "routine" | "custom"

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

export function addReminder(reminder: Omit<Reminder, "id" | "completed" | "createdAt">): Reminder {
  const newReminder: Reminder = {
    ...reminder,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: new Date().toISOString(),
  }
  const reminders = getReminders()
  reminders.push(newReminder)
  saveReminders(reminders)
  return newReminder
}

export function toggleReminder(id: string): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) =>
    r.id === id ? { ...r, completed: !r.completed } : r
  )
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

    // Parse the current time and add minutes
    const [h, m] = r.time.split(":").map(Number)
    const totalMinutes = h * 60 + m + minutes
    const newHour = Math.floor(totalMinutes / 60) % 24
    const newMin = totalMinutes % 60
    const newTime = `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`

    return { ...r, time: newTime, snoozedUntil }
  })
  saveReminders(updated)
  return updated
}

export function resetDailyReminders(): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) => ({
    ...r,
    completed: false,
    snoozedUntil: undefined,
  }))
  saveReminders(updated)
  return updated
}

export function editReminder(id: string, updates: Partial<Reminder>): Reminder[] {
  const reminders = getReminders()
  const updated = reminders.map((r) =>
    r.id === id ? { ...r, ...updates } : r
  )
  saveReminders(updated)
  return updated
}

export function markNotified(id: string): Reminder[] {
  const reminders = getReminders()
  const today = new Date().toISOString().split("T")[0]
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
