"use client"

import type React from "react"
import { AlertTriangle, CheckCircle, Info, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "destructive" | "warning" | "success"
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export function Alert({ children, variant = "default", className = "", dismissible = false, onDismiss }: AlertProps) {
  const getAlertStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          container: "border-red-500/30 bg-red-500/10 text-red-400",
          icon: <AlertCircle className="h-4 w-4" />,
        }
      case "warning":
        return {
          container: "border-amber-500/30 bg-amber-500/10 text-amber-400",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      case "success":
        return {
          container: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
          icon: <CheckCircle className="h-4 w-4" />,
        }
      default:
        return {
          container: "border-blue-500/30 bg-blue-500/10 text-blue-400",
          icon: <Info className="h-4 w-4" />,
        }
    }
  }

  const styles = getAlertStyles()

  return (
    <div className={`relative rounded-lg border p-4 ${styles.container} ${className}`} role="alert">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">{children}</div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-current hover:bg-current/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function AlertTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>
}

export function AlertDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm opacity-90 ${className}`}>{children}</div>
}
