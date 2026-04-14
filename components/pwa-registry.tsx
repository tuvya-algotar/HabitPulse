"use client"

import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"

export function PWARegistry() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("Service Worker registration failed:", err)
        })
      })
    }
  }, [])
  
  return null
}
