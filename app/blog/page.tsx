"use client"

import { InfoPageLayout } from "@/components/info-page-layout"
import { motion } from "framer-motion"

const posts = [
  {
    title: "Why Small Habits Matter More Than Big Goals",
    excerpt: "Research shows that building small, consistent habits leads to far greater long-term success than setting ambitious goals. Here's how to start small.",
    date: "March 2026",
    readTime: "5 min read",
    category: "Habits",
  },
  {
    title: "The Science of Forgetting — And How to Beat It",
    excerpt: "Our brains are wired to forget routine tasks. Understanding the forgetting curve can help you design better reminder systems for daily life.",
    date: "March 2026",
    readTime: "7 min read",
    category: "Productivity",
  },
  {
    title: "Designing for Real People: A Design Thinking Approach",
    excerpt: "How we used empathy maps, user interviews, and rapid prototyping to build a habit reminder system that people actually want to use.",
    date: "February 2026",
    readTime: "6 min read",
    category: "Design",
  },
  {
    title: "Morning Routines That Actually Stick",
    excerpt: "Forget waking up at 5 AM. The best morning routine is the one you can actually maintain. Here are practical tips for building a sustainable start to your day.",
    date: "February 2026",
    readTime: "4 min read",
    category: "Routines",
  },
]

export default function BlogPage() {
  return (
    <InfoPageLayout>
      <section className="relative px-6 py-32 bg-black min-h-screen">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-neutral-400">
              COMPANY
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Blog
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-neutral-400 tracking-wide">
              Insights on habit formation, productivity techniques, and daily routine management.
            </p>
          </motion.div>

          <div className="mt-20 flex flex-col gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-2xl border border-white/5 bg-[#0a0a0c] p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0d0d10] cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-mono font-bold tracking-widest text-white">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{post.date}</span>
                  <span className="text-xs text-neutral-600 font-mono">·</span>
                  <span className="text-xs font-mono text-neutral-500">{post.readTime}</span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white group-hover:text-neutral-300 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-neutral-400 leading-relaxed font-mono text-sm max-w-3xl">{post.excerpt}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </InfoPageLayout>
  )
}
