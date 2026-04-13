import { Reminder, getLocalDateStr } from "./reminders"

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
  
  let morningCompletions = 0
  let totalCompletionsWithTime = 0
  const habitMissCounts: Record<string, number> = {}

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
        
        if (historyEntry.completedAt) {
          totalCompletionsWithTime++
          const hour = new Date(historyEntry.completedAt).getHours()
          if (hour < 12) morningCompletions++
        }
      } else {
        if (!isToday) {
          totalMissed++
          habitMissCounts[r.name] = (habitMissCounts[r.name] || 0) + 1
        }
      }
    })
  }

  const rawAvgRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0
  const avgRate = Math.round(rawAvgRate)

  // 3. Insight Generation
  const candidateInsights: { priority: number; text: string }[] = []

  // Variation Pools
  const POOLS = {
    dailyZero: [
      "Start small. One habit is enough today",
      "Begin with one win today",
      "Focus on starting, not finishing everything",
      "Action creates momentum—just start one",
      "Even a tiny step counts today"
    ],
    dailyStarted: [
      "Good start today, keep it going",
      "You're already making progress today",
      "Momentum starts exactly like this",
      "Great focus today, maintain this rhythm",
      "You've set a solid tone for the day"
    ],
    overload: [
      "You're managing many habits, consider focusing on fewer",
      "Too many habits can reduce consistency",
      "Focus on fewer habits for better results",
      "Quality over quantity—try paring down your focus",
      "Scale back your list to reignite momentum"
    ],
    highPerformance: [
      "Excellent consistency this week",
      "You're staying very consistent",
      "Strong discipline this week",
      "You're locking in your habits",
      "You're showing up consistently",
      "This is strong habit formation",
      "Your routines are becoming second nature"
    ],
    moderatePerformance: [
      "Good progress, keep pushing",
      "You're building the foundation, keep going",
      "Solid effort this week, stay on track",
      "You're making steady headway",
      "Keep this rhythm alive",
      "You have a good pace, maintain it",
      "You're holding a steady baseline"
    ],
    lowPerformance: [
      "Try reducing the number of habits to regain focus",
      "It's okay to scale back. Focus on one small win today",
      "Reset your expectations and start with a single habit",
      "Focus on building momentum with just one routine",
      "Don't worry about perfection, just aim for one completion",
      "Adjust your timing to make your routines easier",
      "Small steps are better than perfect planning"
    ],
    morningFlow: [
      "You are more consistent in the morning",
      "Your morning routines are locking in strongly",
      "You have excellent early-day momentum",
      "Mornings are definitely your prime flow state",
      "You're winning the morning consistently",
      "Early action is your strongest habit trait",
      "You harness strong morning energy"
    ],
    momentum: [
      "You're building unbreakable momentum",
      "Your current rhythm is incredibly strong",
      "You've hit a flow state with your routines",
      "You are stacking consecutive wins beautifully",
      "Your daily execution runs like clockwork",
      "You are proving your reliability to yourself"
    ],
    friction: (habitName: string) => [
      `You often miss "${habitName}", consider adjusting its time`,
      `"${habitName}" seems to cause friction, try doing it earlier`,
      `Break "${habitName}" into a smaller step to make it easier`,
      `If "${habitName}" is tough, associate it with an existing routine`,
      `Try a different environment or trigger for "${habitName}"`,
      `Make "${habitName}" so small you can't fail it`
    ],
    fallback: [
      "Every small action builds your identity",
      "Start building your consistency one day at a time",
      "A journey of consistency begins with a single check",
      "Focus entirely on today and disregard the past",
      "Pick one tiny habit and crush it today",
      "You are capable of building strong habits",
      "Don't break the chain, start fresh today"
    ]
  }

  // Pure function random selector that avoids recent entries
  let memoryCache: string[] = []
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("habit_insights_history")
      if (stored) memoryCache = JSON.parse(stored)
    } catch {}
  }

  const pickRandom = (pool: string[]) => {
    // Shuffle the pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    
    // Select first item not in memory cache
    for (const item of shuffled) {
      if (!memoryCache.includes(item)) return item
    }
    
    // Fallback to first shuffle if all used
    return shuffled[0]
  }

  // 1. Daily Awareness (Priority 0 - Highest)
  if (completedToday === 0) {
    candidateInsights.push({ priority: 0, text: pickRandom(POOLS.dailyZero) })
  } else {
    candidateInsights.push({ priority: 0, text: pickRandom(POOLS.dailyStarted) })
  }

  // 2. Overload Detection (Priority 1)
  if (totalHabits >= 6 && avgRate < 50) {
    candidateInsights.push({ priority: 1, text: pickRandom(POOLS.overload) })
  }

  if (totalPossible >= 3) {
    // Momentum / High Consistency (Priority 2 & 3)
    if (avgRate >= 90) {
      candidateInsights.push({ priority: 2, text: pickRandom(POOLS.momentum) })
      candidateInsights.push({ priority: 3, text: pickRandom(POOLS.highPerformance) })
    } else if (avgRate >= 80) {
      candidateInsights.push({ priority: 2, text: pickRandom(POOLS.highPerformance) })
    } else if (avgRate >= 50 && avgRate < 80) {
      candidateInsights.push({ priority: 2, text: pickRandom(POOLS.moderatePerformance) })
    } else if (totalHabits < 6) { // Avoid stacking with overload
      candidateInsights.push({ priority: 2, text: pickRandom(POOLS.lowPerformance) })
    }

    // Morning Consistency (Priority 5)
    if (totalCompletionsWithTime >= 3 && (morningCompletions / totalCompletionsWithTime) > 0.5) {
      candidateInsights.push({ priority: 5, text: pickRandom(POOLS.morningFlow) })
    }

    // Frequent misses / Friction (Priority 4)
    let mostMissed = ""
    let maxMisses = 0
    for (const [name, count] of Object.entries(habitMissCounts)) {
      if (count > maxMisses) {
        maxMisses = count
        mostMissed = name
      }
    }
    
    if (maxMisses >= 3) {
      candidateInsights.push({ priority: 4, text: pickRandom(POOLS.friction(mostMissed)) })
    }
  } else if (completedToday === 0) {
    // Priority 6: Encouragement Fallback
    candidateInsights.push({ priority: 6, text: pickRandom(POOLS.fallback) })
  }

  // Sort by priority and cap at 3
  candidateInsights.sort((a, b) => a.priority - b.priority)
  const finalInsights = candidateInsights.slice(0, 3).map(c => c.text)

  // Persist rotation memory
  if (typeof window !== "undefined" && finalInsights.length > 0) {
    try {
      // keep last 15 seen statements in random pool memory
      const newCache = [...memoryCache, ...finalInsights].slice(-15)
      localStorage.setItem("habit_insights_history", JSON.stringify(newCache))
    } catch {}
  }

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
