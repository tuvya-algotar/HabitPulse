"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { ArrowUp, Bell } from "lucide-react"

export function GlobalPolish() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress, scrollY } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    setMounted(true)

    // Page loader
    const timer = setTimeout(() => setLoading(false), 800)

    // Ambient glow follows mouse
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--glow-x", `${e.clientX}px`)
        glowRef.current.style.setProperty("--glow-y", `${e.clientY + window.scrollY}px`)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 500)
    })
  }, [scrollY])

  if (!mounted) return null

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Page Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#050505] pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Bell className="h-8 w-8 text-black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Cursor Glow — soft radial gradient that follows the mouse */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-700 hidden md:block"
        style={{
          background: "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255, 255, 255, 0.03), transparent 70%)",
        }}
      />

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur transition-colors hover:bg-neutral-200"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
