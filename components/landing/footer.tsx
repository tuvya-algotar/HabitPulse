"use client"

import Link from "next/link"
import { Bell, Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

const footerLinks = {
  product: [
    { label: "Features", href: "/#features", title: "Manage daily routines through simple reminders." },
    { label: "Pricing", href: "/#pricing", title: "Currently free." },
    { label: "Dashboard", href: "/dashboard", title: "Access your dashboard directly." },
  ],
  company: [
    { label: "About", href: "/about", title: "A project solving everyday forgetfulness." },
    { label: "Blog", href: "/blog", title: "Insights on habit formation." },
    { label: "Contact", href: "/contact", title: "Reach out for questions." },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", title: "Data stored locally." },
    { label: "Terms of Service", href: "/terms", title: "Prototype." },
  ],
}

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black border-t border-white/5 px-6 pt-24 pb-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <Bell className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">HabitPulse</span>
            </Link>
            <p className="text-sm font-mono text-neutral-500 max-w-xs leading-relaxed">
              A smarter way to build better routines and remember what matters. No login required.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="https://github.com/tuvya-algotar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 transition-colors hover:text-white"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/tuvya-algotar-8b4b07374/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 transition-colors hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white mb-2">Product</h3>
            {footerLinks.product.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.title}
                className="text-sm font-mono text-neutral-500 w-fit hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white mb-2">Company</h3>
            {footerLinks.company.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.title}
                className="text-sm font-mono text-neutral-500 w-fit hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-white mb-2">Legal</h3>
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.title}
                className="text-sm font-mono text-neutral-500 w-fit hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-neutral-600">
            © 2026 HabitPulse. All rights reserved.
          </p>
          <p className="text-xs font-mono text-neutral-600 flex items-center gap-1.5 focus:outline-none">
            Made with <span className="text-neutral-500 pulse">❤️</span> for better habits
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
