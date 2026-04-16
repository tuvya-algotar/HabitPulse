import { Reminder, getLocalDateStr, isCompletedToday } from "./reminders"

export interface DailyMetrics {
  total: number
  completed: number
  percentage: number
}

export interface WeeklySummary {
  totalCompletions: number
  averageDailyRate: number
  totalMissed: number
}

export type Insight = {
  text: string
  priority: number
  icon: string
}

function getStreak(history: { date: string; completed: boolean }[], todayStr: string) {
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

export function computeInsights(reminders: Reminder[]): Insight[] {
  const insights: Insight[] = []
  const todayStr = new Date().toISOString().split("T")[0]

  const completedToday = reminders.filter(isCompletedToday).length
  const total = reminders.length

  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0

  if (total > 0) {
    if (pct === 100) {
      insights.push({ text: `Perfect day. All ${total} habits done.`, priority: 6, icon: "🏆" })
    } else if (pct >= 75) {
      insights.push({ text: `${completedToday}/${total} done. Strong progress.`, priority: 4, icon: "🔥" })
    } else if (pct >= 50) {
      insights.push({ text: `Halfway there. ${total - completedToday} left.`, priority: 3, icon: "⚡" })
    } else if (completedToday > 0) {
      insights.push({ text: `${completedToday} done. Keep momentum.`, priority: 2, icon: "🌱" })
    } else {
      insights.push({ text: "Start with your easiest habit.", priority: 0, icon: "⏰" })
    }
  }

  for (const r of reminders) {
    if (isCompletedToday(r)) continue

    const streak = getStreak(r.history || [], todayStr)

    if (streak >= 3) {
      insights.push({
        text: `"${r.name}" streak (${streak} days) is at risk.`,
        priority: 5,
        icon: "🔗",
      })
      break
    }
  }

  return insights.sort((a, b) => b.priority - a.priority).slice(0, 3)
}

export function computeMetrics(reminders: Reminder[]): {
  daily: DailyMetrics
  weekly: WeeklySummary
  insights: string[]
} {
  const now = new Date()
  const todayStr = getLocalDateStr(now)
  
  const totalHabits = reminders.length

  // 1. Daily Progress
  let completedToday = 0
  reminders.forEach((r) => {
    const todayHistory = r.history?.find(h => h.date === todayStr)
    if (todayHistory?.completed) {
      completedToday++
    }
  })

  const dailyPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  // 2. Weekly Summary Engine
  let totalPossible = 0
  let totalCompleted = 0
  let totalMissed = 0

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dStr = getLocalDateStr(d)
    const isToday = i === 0
    
    reminders.forEach((r) => {
      const createdDateStr = getLocalDateStr(new Date(r.createdAt))
      
      if (dStr < createdDateStr) {
        return // skip
      }

      totalPossible++
      
      const historyEntry = r.history?.find(h => h.date === dStr)
      if (historyEntry?.completed) {
        totalCompleted++
      } else {
        if (!isToday) {
          totalMissed++
        }
      }
    })
  }

  const rawAvgRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0
  const avgRate = Math.round(rawAvgRate)

  // 3. Generate real insights
  const realInsights = computeInsights(reminders)
  const finalInsights = realInsights.map(i => `${i.icon} ${i.text}`)

  return {
    daily: {
      total: totalHabits,
      completed: completedToday,
      percentage: dailyPercentage,
    },
    weekly: {
      totalCompletions: totalCompleted,
      averageDailyRate: avgRate,
      totalMissed: totalMissed,
    },
    insights: finalInsights,
  }
}
