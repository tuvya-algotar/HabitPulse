# HabitPulse

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**HabitPulse** is a high-performance, local-first habit management system designed for the modern user. Built with a focus on visual excellence and zero-friction interaction, it helps users build lasting routines through smart reminders and intuitive progress tracking.

---

## 💎 The Vision (Why it exists)

In an era of notification fatigue and complex "all-in-one" productivity suites, **HabitPulse** takes a different approach. We believe that habit formation should be **invisible yet present**. 

Most habit trackers fail because of high entry barriers: forced sign-ups, complex configurations, and cluttered UIs. HabitPulse exists to solve the "forgetting curve" of daily routines—medication, hydration, and essentials—using Human-Centered Design (HCD) principles to create a system that feels like an extension of the user's brain, not another chore.

---

## ⚡ Key Features

- **Premium Noir Aesthetic**: A meticulously crafted midnight-black UI with high-contrast minimalist accents, designed to reduce eye strain and focus the user.
- **Micro-Interaction Storytelling**: Every completion, delete, or snooze action is accompanied by fluid, Apple-level animations via Framer Motion.
- **Local-First Privacy**: Zero data leaves your device. We use browser-native storage to ensure your habits stay private and accessible even without a backend.
- **Smart Category Engine**: Context-aware categories for Health, Hydration, Morning/Evening Routines, and physical Item checks.
- **Dynamic Progress Visualization**: Real-time SVG-based progress rings that update instantly as you complete your day.

---

## 🏗️ System Architecture

HabitPulse follows a modern, decoupled React architecture optimized for speed and maintainability.

### High-Level Flow
1. **Interaction Layer**: React components triggered by user actions (Add/Complete/Edit).
2. **State Management**: Centralized custom hooks and local storage synchronization patterns.
3. **Notification Engine**: Service-layer implementation of the Web Notification API for system-level pings.
4. **Persistence Layer**: Abstracted `localStorage` wrapper for non-blocking data operations.

### Directory Structure
```text
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           
│   ├── dashboard/       # Feature-specific dashboard logic
│   ├── landing/         # Marketing & Hero components
│   └── ui/              # Atomized base components (Radix/Shadcn)
├── hooks/                # Custom hooks for state and lifecycle
├── lib/                  # Utility functions and storage logic
└── public/               # Static assets and icons
```

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (Utility-first) |
| **Animations** | Framer Motion (Orchestration & Micro-interactions) |
| **Icons** | Lucide React |
| **Components** | Radix UI / Shadcn UI |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tuvya-algotar/HabitPulse.git
   cd HabitPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Launch Project**
   ```bash
   npm run dev
   ```

Navigate to `http://localhost:3000` to experience the pulse of your habits.

---

## 🛡️ Privacy & Security

HabitPulse is a **Local-First** application. 
- **No Cookies**: We don't track you across sessions.
- **No Database**: Your data is stored in your browser's `localStorage`.
- **No Analytics**: We respect your digital footprint.

---

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, feature request, or design improvement, feel free to open an issue or submit a pull request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Created by **Tuvya Algotar** — Focused on building tools that simplify life.
