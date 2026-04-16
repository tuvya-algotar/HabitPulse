import { Reminder, isCompletedToday } from "./reminders"

interface FocusScore {
  reminder: Reminder
  score: number
}

function getStreak(
  history: { date: string; completed: boolean }[],
  todayStr: string
): number {
  let streak = 0

  for (let i = 1; i <= 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]

    const entry = history.find((h) => h.date === dateStr)

    if (entry?.completed) streak++
    else break
  }

  return streak
}

export function computeFocusScores(reminders: Reminder[]): FocusScore[] {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const todayStr = now.toISOString().split("T")[0]

  return reminders
    .filter((r) => !isCompletedToday(r))
    .map((r) => {
      let score = 0

      const effectiveTime = new Date()
      const [h, m] = r.time.split(":").map(Number)
      effectiveTime.setHours(h, m, 0, 0)

      const scheduledMinutes = effectiveTime.getHours() * 60 + effectiveTime.getMinutes()

      // overdue
      if (scheduledMinutes < currentMinutes) score += 30

      // upcoming within 60 min
      const diff = scheduledMinutes - currentMinutes
      if (diff >= 0 && diff <= 60) score += 15

      // streak pressure
      const streak = getStreak(r.history || [], todayStr)
      if (streak >= 3) score += 20
      if (streak >= 7) score += 10

      // weak habit (low completion last 7 days)
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i - 1)
        return d.toISOString().split("T")[0]
      })

      const completedLast7 = last7.filter((day) =>
        (r.history || []).some((h) => h.date === day && h.completed)
      ).length

      if (completedLast7 <= 2) score += 10

      return { reminder: r, score }
    })
    .sort((a, b) => b.score - a.score)
}
