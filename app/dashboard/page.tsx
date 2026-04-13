import type { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | Smart Habit Reminder System",
  description: "View and manage your daily habit reminders.",
}

export default function DashboardPage() {
  return <DashboardContent />
}
