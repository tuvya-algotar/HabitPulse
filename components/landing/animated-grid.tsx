"use client"

import { motion } from "framer-motion"

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* Deep Space Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-black to-black" />

      {/* Structured Dark Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      {/* Subtle Lighting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-white/[0.015] blur-[100px] rounded-[100%]"
      />
    </div>
  )
}
