"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Check, ChevronRight, Activity, Calendar, Settings, Bell, Search, LayoutGrid } from "lucide-react"

function HeroText() {
  return (
    <div className="space-y-8 max-w-xl">
      <div className="space-y-4">
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-2 leading-[1.1]"
        >
          Master Your <span className="text-neutral-400">Habits.</span>
        </motion.h1>

        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
        >
          Own Your Day.
        </motion.h1>
      </div>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-lg font-mono text-sm tracking-wide"
      >
        HabitPulse is the elegant habit tracker that empowers you to build lasting routines, stay consistent, and achieve meaningful goals without the mental clutter.
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-6 pt-4"
      >
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#ffffff", color: "#000000" }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-white text-black px-8 py-3.5 text-base font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 group"
          >
            Get Started
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
        <a href="#how-it-works" className="group">
          <motion.button
            whileHover={{ scale: 1.02, color: "#ffffff" }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full px-6 py-3.5 text-base font-medium text-neutral-400 transition-colors"
          >
            Learn More
          </motion.button>
        </a>
      </motion.div>
    </div>
  )
}

function HeroDashboardPreview({ scrollYProgress }: { scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  
  const [hoveredHabit, setHoveredHabit] = useState<number | null>(null)

  return (
    <motion.div
      style={{ y, scale, opacity }}
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[700px] h-[500px] rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex"
    >
      {/* Decorative Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Sidebar Mock */}
      <div className="w-16 md:w-56 h-full border-r border-white/5 bg-[#0d0d10] flex flex-col p-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 rounded bg-white" />
          <span className="font-semibold tracking-tight text-white/90">HabitPulse</span>
        </div>
        <div className="flex justify-center md:hidden mb-8">
          <div className="w-6 h-6 rounded bg-white" />
        </div>
        
        <div className="space-y-2 flex-1">
          {[ 
            { icon: LayoutGrid, label: "Dashboard", active: true },
            { icon: Activity, label: "Habits", active: false },
            { icon: Calendar, label: "Timeline", active: false },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 2, backgroundColor: "rgba(255,255,255,0.05)" }}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                item.active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium hidden md:block">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto">
          <motion.div
            whileHover={{ x: 2, backgroundColor: "rgba(255,255,255,0.05)" }}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer text-white/40 hover:text-white/80 transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium hidden md:block">Settings</span>
          </motion.div>
        </div>
      </div>

      {/* Main Content Mock */}
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden bg-gradient-to-b from-[#111115] to-[#0a0a0c]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white/90">Today</h2>
            <p className="text-xs text-white/40 mt-1">4 of 6 completed</p>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <Bell className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <div className="w-8 h-8 rounded-full bg-white/10 ml-2" />
          </div>
        </div>

        {/* Progress Mock */}
        <div className="w-full h-32 rounded-xl border border-white/5 bg-white/[0.02] p-4 flex gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="h-full aspect-square rounded-full border-[6px] border-[#345da8] border-r-white/5 flex items-center justify-center shrink-0">
             <span className="text-lg font-semibold text-white">66%</span>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className="h-2 w-1/3 bg-white/10 rounded-full" />
            <div className="h-2 w-full bg-[#345da8]/50 rounded-full overflow-hidden">
               <div className="h-full w-2/3 bg-[#345da8] rounded-full" />
            </div>
            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Habits List Mock */}
        <div className="space-y-3">
          {[ 
            { name: "Morning Workout", streak: 12, done: true },
            { name: "Read 10 Pages", streak: 5, done: true },
            { name: "Drink Water", streak: 0, done: false },
          ].map((habit, i) => (
             <motion.div
              key={i}
              onHoverStart={() => setHoveredHabit(i)}
              onHoverEnd={() => setHoveredHabit(null)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                habit.done 
                  ? "border-white/5 bg-white/[0.01]" 
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
             >
               <motion.div 
                 whileTap={{ scale: 0.8 }}
                 className={`w-5 h-5 rounded-md flex items-center justify-center mr-4 transition-colors ${
                 habit.done ? "bg-[#345da8] text-white" : "border border-white/20 hover:border-white/40"
               }`}>
                 {habit.done && <Check className="w-3 h-3" />}
               </motion.div>
               <div className="flex-1">
                 <p className={`text-sm font-medium transition-colors ${habit.done ? "text-white/40 line-through" : "text-white/90"}`}>
                   {habit.name}
                 </p>
               </div>
               <div className={`text-xs px-2 py-1 rounded-md transition-opacity ${hoveredHabit === i ? "opacity-100" : "opacity-50"} ${habit.done ? "bg-white/5 text-white/40" : "bg-white/10 text-white/70"}`}>
                 {habit.streak} 🔥
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-black pt-20">
      {/* Background radial gradient to give extremely dark but subtle premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] via-black to-black border-red-500 pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12 py-12 lg:py-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 min-h-[75vh]">
          {/* Left Column - Text */}
          <div className="w-full lg:w-5/12 flex-shrink-0">
            <HeroText />
          </div>
          
          {/* Right Column - Interactive Dashboard */}
          <div className="w-full lg:w-7/12 flex justify-end">
            <HeroDashboardPreview scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}
