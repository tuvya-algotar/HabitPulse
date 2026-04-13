"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { computeMetrics } from "@/lib/insight-engine"
import type { Reminder } from "@/lib/reminders"
import { Lightbulb, Target, TrendingUp, BarChart3 } from "lucide-react"

interface InsightSectionProps {
  reminders: Reminder[]
}

export function InsightSection({ reminders }: InsightSectionProps) {
  const { daily, weekly, insights } = useMemo(() => computeMetrics(reminders), [reminders])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 border-b border-theme-border pb-2">
        <h2 className="text-xs font-mono uppercase tracking-widest text-theme-text-muted font-bold">
          Performance Engine
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Stats */}
        <div className="flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-card p-5 relative overflow-hidden group hover:border-theme-border-strong transition-all duration-300">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2 text-white/80">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Target className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold tracking-wide">Daily Progress</h3>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 font-mono">
              {daily.percentage}%
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-theme-text-muted font-medium">
              Today: <span className="text-theme-text font-bold">{daily.completed}</span> / {daily.total} completed
            </p>
            <div className="mt-3 h-1.5 w-full bg-theme-border rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500" 
                initial={{ width: 0 }} 
                animate={{ width: `${daily.percentage}%` }} 
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-card p-5 relative overflow-hidden group hover:border-theme-border-strong transition-all duration-300">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2 text-white/80">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <BarChart3 className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold tracking-wide">7-Day Summary</h3>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 font-mono">
              {weekly.totalCompletions}
            </span>
          </div>
          <div className="relative z-10 flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-xs text-theme-text-muted uppercase tracking-widest font-bold">Avg Rate</span>
               <span className="text-sm text-theme-text font-bold">{weekly.averageDailyRate}%</span>
             </div>
             <div className="h-8 w-px bg-theme-border" />
             <div className="flex flex-col items-end">
               <span className="text-xs text-theme-text-muted uppercase tracking-widest font-bold">Missed</span>
               <span className="text-sm text-theme-text font-bold">{weekly.totalMissed}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-theme-border bg-theme-card p-5 relative overflow-hidden group hover:border-theme-border-strong transition-all duration-300">
         <div className="flex items-center gap-2 text-theme-text mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Lightbulb className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold tracking-wide">Intelligent Insights</h3>
         </div>
         <div className="flex flex-col gap-3">
           {insights.length === 0 ? (
             <div className="flex items-start gap-3 bg-theme-card-hover border border-theme-border rounded-xl p-3">
               <p className="text-sm text-theme-text-muted italic">Insights will appear as you build consistency.</p>
             </div>
           ) : (
             insights.map((insight, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 * idx, duration: 0.4 }}
                 className="flex items-start gap-3 bg-theme-card-hover border border-theme-border rounded-xl p-3"
               >
                  <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-theme-text font-medium leading-relaxed">{insight}</p>
               </motion.div>
             ))
           )}
         </div>
      </div>
    </motion.section>
  )
}
