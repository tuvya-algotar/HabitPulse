"use client"

import { useState } from "react"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_CONFIG } from "@/lib/reminders"
import type { Reminder, ReminderCategory } from "@/lib/reminders"
import { motion } from "framer-motion"

interface EditReminderDialogProps {
  reminder: Reminder
  onEdit: (id: string, updates: Partial<Reminder>) => void
}

export function EditReminderDialog({ reminder, onEdit }: EditReminderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(reminder.name)
  const [time, setTime] = useState(reminder.time)
  const [category, setCategory] = useState<ReminderCategory>(reminder.category)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onEdit(reminder.id, { name: name.trim(), time, category })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Edit reminder"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0a0a0c] sm:max-w-md shadow-2xl p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Edit Reminder</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Update the details of your reminder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name" className="text-sm font-medium text-white/80">Task Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g. Take vitamin D"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="rounded-xl border-white/10 bg-black text-white focus-visible:ring-1 focus-visible:ring-white/30 h-11"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="edit-time" className="text-sm font-medium text-white/80">Reminder Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="rounded-xl border-white/10 bg-black text-white focus-visible:ring-1 focus-visible:ring-white/30 h-11 leading-tight"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="edit-category" className="text-sm font-medium text-white/80">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ReminderCategory)}
              >
                <SelectTrigger className="w-full rounded-xl border-white/10 bg-black text-white h-11 focus:ring-1 focus:ring-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0d0d10] text-white">
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="focus:bg-white/10 focus:text-white">
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-white/60 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="rounded-xl bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
