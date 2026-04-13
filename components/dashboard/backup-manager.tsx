"use client"

import { useState, useRef } from "react"
import { Download, Upload, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { getReminders, saveReminders, Reminder } from "@/lib/reminders"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BackupManagerProps {
  onImportComplete: () => void
}

export function BackupManager({ onImportComplete }: BackupManagerProps) {
  const [open, setOpen] = useState(false)
  const [pendingData, setPendingData] = useState<Reminder[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      const data = getReminders()
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const dateStr = new Date().toISOString().split("T")[0]
      const a = document.createElement("a")
      a.href = url
      a.download = `habitpulse-backup-${dateStr}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Backup exported successfully")
    } catch (err) {
      toast.error("Failed to export backup")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        
        // Basic Validation
        if (!Array.isArray(parsed)) throw new Error("Invalid structure: Not an array")
        
        // Ensure standard fields exist on first object if it isn't empty
        if (parsed.length > 0) {
            const first = parsed[0]
            if (!first.id || !first.name || !first.time || !first.createdAt) {
               throw new Error("Invalid structure: Missing required Reminder fields")
            }
        }
        
        setPendingData(parsed)
        setOpen(true) // Open confirmation dialog

      } catch (err) {
        console.error(err)
        toast.error("Invalid backup file")
      }
      
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    
    reader.onerror = () => toast.error("Error reading file")
    reader.readAsText(file)
  }

  const confirmImport = () => {
    setIsProcessing(true)
    try {
      saveReminders(pendingData)
      toast.success("Data imported successfully")
      setOpen(false)
      onImportComplete()
    } catch (err) {
      toast.error("Failed to apply backup")
    } finally {
      setIsProcessing(false)
      setPendingData([])
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import Data"
          className="p-2 rounded-xl border border-theme-border-strong text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-colors flex items-center justify-center overflow-hidden w-[34px] h-[34px]"
        >
          <Upload size={16} />
        </button>

        <button
          onClick={handleExport}
          title="Export Data"
          className="p-2 rounded-xl border border-theme-border-strong text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-colors flex items-center justify-center overflow-hidden w-[34px] h-[34px]"
        >
          <Download size={16} />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-theme-border bg-theme-card sm:max-w-md shadow-2xl p-6 rounded-2xl text-theme-text">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-theme-text">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Overwrite Data?
            </DialogTitle>
            <DialogDescription className="text-theme-text-muted pt-2 text-sm leading-relaxed">
              You are about to replace all current data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex gap-2">
            <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isProcessing}
                className="rounded-xl text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover"
            >
                Cancel
            </Button>
            <Button
                onClick={confirmImport}
                disabled={isProcessing}
                className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
                {isProcessing ? "Processing..." : "Confirm Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
