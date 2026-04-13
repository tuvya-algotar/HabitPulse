"use client"

import { useState, useEffect } from "react"
import { Minus, Plus } from "lucide-react"

interface TimePickerProps {
  value: string // format HH:mm (24hr internally)
  onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hour, setHour] = useState("12")
  const [minute, setMinute] = useState("00")
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM")

  useEffect(() => {
    if (!value) return
    const [h, m] = value.split(":")
    let hNum = parseInt(h, 10)
    const isPM = hNum >= 12
    setAmpm(isPM ? "PM" : "AM")
    
    if (hNum === 0) hNum = 12
    else if (hNum > 12) hNum -= 12
    
    setHour(hNum.toString().padStart(2, "0"))
    setMinute(m)
  }, [value])

  const notifyChange = (newH: string, newM: string, newAmPm: "AM" | "PM") => {
    let hNum = parseInt(newH, 10)
    if (isNaN(hNum)) hNum = 12
    
    if (newAmPm === "PM" && hNum < 12) hNum += 12
    if (newAmPm === "AM" && hNum === 12) hNum = 0
    
    onChange(`${hNum.toString().padStart(2, "0")}:${newM.padStart(2, "0")}`)
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "")
    if (val.length > 2) val = val.slice(0, 2)
    let num = parseInt(val, 10)
    if (val !== "" && num > 12) val = "12"
    setHour(val)
    if (val.length === 2 && num >= 1 && num <= 12) {
      notifyChange(val, minute, ampm)
    }
  }

  const handleHourBlur = () => {
    let num = parseInt(hour, 10)
    if (isNaN(num) || num < 1) num = 12
    const formatted = num.toString().padStart(2, "0")
    setHour(formatted)
    notifyChange(formatted, minute, ampm)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "")
    if (val.length > 2) val = val.slice(0, 2)
    let num = parseInt(val, 10)
    if (val !== "" && num > 59) val = "59"
    setMinute(val)
    if (val.length === 2) {
      notifyChange(hour, val, ampm)
    }
  }

  const handleMinuteBlur = () => {
    let num = parseInt(minute, 10)
    if (isNaN(num)) num = 0
    const formatted = num.toString().padStart(2, "0")
    setMinute(formatted)
    notifyChange(hour, formatted, ampm)
  }

  const toggleAmPm = (newAmPm: "AM" | "PM") => {
    setAmpm(newAmPm)
    notifyChange(hour, minute, newAmPm)
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-2 focus-within:border-white/30 transition-colors h-11">
        <input
          type="text"
          value={hour}
          onChange={handleHourChange}
          onBlur={handleHourBlur}
          className="w-8 bg-transparent text-center text-white outline-none font-mono text-sm"
          placeholder="12"
        />
        <span className="text-white/40 font-mono">:</span>
        <input
          type="text"
          value={minute}
          onChange={handleMinuteChange}
          onBlur={handleMinuteBlur}
          className="w-8 bg-transparent text-center text-white outline-none font-mono text-sm"
          placeholder="00"
        />
      </div>
      <div className="flex items-center rounded-xl border border-white/10 bg-black p-1 h-11">
        <button
          type="button"
          onClick={() => toggleAmPm("AM")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            ampm === "AM" ? "bg-white text-black" : "text-white/60 hover:text-white"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => toggleAmPm("PM")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            ampm === "PM" ? "bg-white text-black" : "text-white/60 hover:text-white"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  )
}

interface DurationStepperProps {
  value: number
  onChange: (days: number) => void
}

export function DurationStepper({ value, onChange }: DurationStepperProps) {
  const presets = [1, 3, 5, 7]

  const handleDecrement = () => {
    if (value > 1) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < 7) onChange(value + 1)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black p-1 h-11">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 1}
          className="flex h-full w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm font-mono font-bold text-white tracking-widest">
          {value} {value === 1 ? "DAY" : "DAYS"}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= 7}
          className="flex h-full w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`flex-1 rounded-lg border py-1.5 text-xs font-mono font-bold transition-all ${
              value === preset 
                ? "border-white bg-white text-black" 
                : "border-white/10 bg-black text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {preset}D
          </button>
        ))}
      </div>
    </div>
  )
}
