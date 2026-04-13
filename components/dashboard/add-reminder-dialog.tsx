"use client"

import { useState } from "react"
import { Plus, Zap, Pill, Droplets, Key, ListChecks, Dumbbell, Clock } from "lucide-react"
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
import { CATEGORY_CONFIG, PRESET_REMINDERS } from "@/lib/reminders"
import type { ReminderCategory } from "@/lib/reminders"
import { motion, AnimatePresence } from "framer-motion"
import { TimePicker, DurationStepper } from "@/components/dashboard/scheduler-components"

const presetIcons = [Pill, Droplets, Key, Pill, Droplets, Dumbbell]

interface AddReminderDialogProps {
  onAdd: (reminder: { 
    name: string; 
    time: string; 
    category: ReminderCategory; 
    duration: number;
    type?: "binary" | "count" | "timer";
    targetValue?: number;
    currentValue?: number;
    targetDuration?: number;
    currentDuration?: number;
  }) => void
}

export function AddReminderDialog({ onAdd }: AddReminderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [time, setTime] = useState("09:00")
  const [category, setCategory] = useState<ReminderCategory>("routine")
  const [duration, setDuration] = useState(7)
  
  const [type, setType] = useState<"binary" | "count" | "timer">("binary")
  const [targetValue, setTargetValue] = useState(5)
  const [targetDuration, setTargetDuration] = useState(15)
  
  const [showPresets, setShowPresets] = useState(true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    
    // Construct reminder base
    const reminderData: any = { name: name.trim(), time, category, duration, type }
    if (type === "count") {
      reminderData.targetValue = targetValue
      reminderData.currentValue = 0
    } else if (type === "timer") {
      reminderData.targetDuration = targetDuration
      reminderData.currentDuration = 0
    }

    onAdd(reminderData)
    setName("")
    setTime("09:00")
    setCategory("routine")
    setDuration(7)
    setType("binary")
    setTargetValue(5)
    setTargetDuration(15)
    setShowPresets(true)
    setOpen(false)
  }

  function handlePreset(preset: (typeof PRESET_REMINDERS)[number]) {
    onAdd({ name: preset.name, time: preset.time, category: preset.category, duration: preset.duration, type: "binary" })
    setOpen(false)
    setShowPresets(true)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setShowPresets(true) }}>
      <DialogTrigger asChild>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:bg-neutral-200 w-full md:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Reminder
        </motion.button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0a0a0c] sm:max-w-md shadow-2xl p-6 rounded-2xl text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add a Reminder</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Choose a preset or create a custom reminder.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showPresets ? (
            <motion.div
              key="presets"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 mt-2"
            >
              <p className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-widest">
                <Zap className="h-4 w-4 text-white" />
                Quick Presets
              </p>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_REMINDERS.map((preset, i) => {
                  const config = CATEGORY_CONFIG[preset.category]
                  const PresetIcon = presetIcons[i]
                  return (
                    <motion.button
                      key={preset.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreset(preset)}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left transition-all duration-200 hover:border-white/20 hover:bg-white/10 group"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-black border border-white/10`}>
                        <PresetIcon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                      <span className="flex-1 text-sm font-semibold text-white/90">
                        {preset.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                        <Clock className="h-3 w-3" />
                        {preset.time}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
               </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-mono">
                  <span className="bg-[#0a0a0c] px-3 text-neutral-600">or</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPresets(false)}
                className="w-full rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-11 border"
              >
                Create Custom Reminder
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 mt-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm font-medium text-white/80">Task Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Take vitamin D"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="rounded-xl border-white/10 bg-black text-white focus-visible:ring-1 focus-visible:ring-white/30 h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="text-sm font-medium text-white/80">Tracking Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as "binary" | "count" | "timer")}
                >
                  <SelectTrigger className="w-full rounded-xl border-white/10 bg-black text-white h-11 focus:ring-1 focus:ring-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0d0d10] text-white">
                    <SelectItem value="binary" className="focus:bg-white/10 focus:text-white">Simple Check-off</SelectItem>
                    <SelectItem value="count" className="focus:bg-white/10 focus:text-white">Count / Amount</SelectItem>
                    <SelectItem value="timer" className="focus:bg-white/10 focus:text-white">Timer / Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === "count" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="targetValue" className="text-sm font-medium text-white/80">Target Amount</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    min="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                    className="rounded-xl border-white/10 bg-black text-white focus-visible:ring-1 focus-visible:ring-white/30 h-11"
                  />
                </div>
              )}

              {type === "timer" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="targetDuration" className="text-sm font-medium text-white/80">Target Duration (minutes)</Label>
                  <Input
                    id="targetDuration"
                    type="number"
                    min="1"
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(parseInt(e.target.value) || 1)}
                    className="rounded-xl border-white/10 bg-black text-white focus-visible:ring-1 focus-visible:ring-white/30 h-11"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Label className="text-sm font-medium text-white/80">Reminder Time</Label>
                  <TimePicker value={time} onChange={setTime} />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="category" className="text-sm font-medium text-white/80">Category</Label>
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

              <div className="flex flex-col gap-2 mt-1">
                <Label className="text-sm font-medium text-white/80">Duration (Days)</Label>
                <DurationStepper value={duration} onChange={setDuration} />
              </div>

              <DialogFooter className="mt-6 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPresets(true)}
                  className="rounded-xl text-white/60 hover:text-white hover:bg-white/5"
                >
                  Back to Presets
                </Button>
                <Button type="submit" disabled={!name.trim()} className="rounded-xl bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  Add Reminder
                </Button>
              </DialogFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
