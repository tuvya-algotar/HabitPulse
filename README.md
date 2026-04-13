# HabitPulse — Local-First Habit Execution System

HabitPulse is a high-performance, local-first habit execution platform built as a Progressive Web App (PWA). It is designed to bridge the gap between "tracking" and "execution" by eliminating the friction, clutter, and guilt often associated with traditional habit applications.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)
![Privacy](https://img.shields.io/badge/Privacy-Local--First-9cf.svg)

## 🎯 The Philosophy

Most habit trackers fail because they prioritize data entry over human behavior. They become overwhelming checklists that punish users for missing a single day. 

**HabitPulse** is built on four core principles:
1. **Action over Tracking**: Focus exclusively on what needs to be done *right now*.
2. **Guidance over Overload**: Reduce cognitive load by hiding irrelevant data until it matters.
3. **Recovery over Guilt**: Provide frictionless "catch-up" mechanics instead of failure indicators.
4. **Privacy by Default**: Your behavior data is yours alone. It never leaves your device.

---

## 🔥 Key Features

### 1. Today Focus System
The dashboard intelligently filters your habits to show only the 3–5 most relevant tasks. By dynamically adjusting based on the current time and completion status, it ensures you always know your next move without scanning a long list.

### 2. Missed Habits Recovery UX
Life happens. When habits are overdue, HabitPulse detects them and moves them into a specialized "Recovery" section. Instead of red "failed" marks, users are given gentle options to **Complete Now** or **Snooze**, allowing the routine to stay alive without the psychological weight of failure.

### 3. Intelligent Streak Engine
Unlike simple counters, our streak system understands context. It iterates backwards through history and protects your momentum by "pausing" the streak for the current day until it's finished, rather than breaking it prematurely.

### 4. Behavior-Driven Insight Engine
A priority-based heuristic engine analyzes your weekly performance. It detects patterns like "Morning Prime Time" or "High Friction Tasks" and provides non-repetitive, actionable feedback to help you refine your routines.

### 5. Robust Notification System
Built for the realities of mobile browsers, the reminder engine uses a 30-second heartbeat with a 60-second execution window. It handles missed recovery, ensuring that if you open the app after a scheduled time, you are still notified of what you missed.

### 6. Local-First Architecture
- **No Backend**: All data persists in `localStorage` with safe `try/catch` wrappers.
- **Offline Ready**: Full service worker support allows the app to function perfectly without an internet connection.
- **Backup & Portability**: Integrated JSON export/import system ensures you can move your data between devices without a central server.

---

## 🏗️ Technical Architecture

HabitPulse is engineered for stability and speed.

- **Data Model**: Uses an immutable history-based model. Every habit stores a log of completion dates rather than a simple boolean. 
- **Derived Metrics**: All UI states (streaks, percentages, insights) are computed on-the-fly from the history array. This eliminates "state desync" bugs where cached values don't match actual data.
- **Performance**: Leverages `Framer Motion` for layout transitions and `Memoization` to ensure the heartbeat loop doesn't impact UI responsiveness.

**Stack:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Noir Theme)
- **Animations**: Framer Motion
- **Persistence**: LocalStorage API

---

## 🚀 The User Flow

1. **Add**: Define a habit with a specific time and tracking type (Binary, Count, or Timer).
2. **Execute**: See your next 3 priorities in the "Today Focus" section.
3. **Recover**: If life gets busy, use the "You missed earlier" section to catch up or snooze tasks.
4. **Refine**: Check the Insight Engine to see which habits are locking in and which ones need timing adjustments.
5. **Persist**: Build unbreakable streaks and visualize your last 7 days of activity on every card.

---

## 📱 Installation (PWA)

HabitPulse is fully installable and feels like a native app.

**iPhone (Safari):**
1. Open the app URL in Safari.
2. Tap the **Share** button.
3. Scroll down and select **Add to Home Screen**.

**Android (Chrome):**
1. Open the app URL in Chrome.
2. Tap the **three dots** in the top right.
3. Select **Install App** or **Add to Home Screen**.

---

## 🧪 Future Roadmap
- [ ] Secure Multi-device Sync (P2P/Encrypted)
- [ ] Advanced Category Analytics
- [ ] Custom Soundscapes for Habit Timers

---

*Built with focus and precision for those who care about their time.*
