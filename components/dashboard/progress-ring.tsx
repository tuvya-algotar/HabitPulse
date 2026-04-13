"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

interface ProgressRingProps {
  completed: number
  total: number
}

export function ProgressRing({ completed, total }: ProgressRingProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (percentage / 100) * circumference

  const progress = useMotionValue(circumference)
  const displayPercentage = useTransform(progress, [circumference, 0], [0, 100])
  const [displayNum, setDisplayNum] = useState(0)

  useEffect(() => {
    const controls = animate(progress, targetOffset, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [percentage, circumference, progress, targetOffset])

  useEffect(() => {
    const unsubscribe = displayPercentage.on("change", (v) => {
      setDisplayNum(Math.round(v))
    })
    return unsubscribe
  }, [displayPercentage])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative">
        <svg width="130" height="130" className="-rotate-90">
          {/* Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress */}
          <motion.circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: progress }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
            {displayNum}%
          </span>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">complete</span>
        </div>
      </div>
      <p className="text-sm font-mono text-neutral-500 mt-2">
        <span className="font-semibold text-white">{completed}</span> of{" "}
        <span className="font-semibold text-white">{total}</span> tasks done
      </p>
    </motion.div>
  )
}
