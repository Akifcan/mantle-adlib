"use client"
import { Loader2, Zap } from "lucide-react"

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "pulse" | "spin" | "web3"
  text?: string
  className?: string
}

export function LoadingIndicator({ size = "md", variant = "default", text, className = "" }: LoadingIndicatorProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-8 w-8"
      case "xl":
        return "h-12 w-12"
      default:
        return "h-6 w-6"
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs"
      case "lg":
        return "text-lg"
      case "xl":
        return "text-xl"
      default:
        return "text-sm"
    }
  }

  const renderSpinner = () => {
    const sizeClass = getSizeClasses()

    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            <div
              className={`${size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"} bg-blue-400 rounded-full animate-bounce`}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={`${size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"} bg-blue-400 rounded-full animate-bounce`}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={`${size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"} bg-blue-400 rounded-full animate-bounce`}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )

      case "pulse":
        return <div className={`${sizeClass} bg-blue-400 rounded-full animate-pulse`} />

      case "web3":
        return (
          <div className={`${sizeClass} relative`}>
            <Zap className={`${sizeClass} text-cyan-400 animate-pulse`} />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          </div>
        )

      case "spin":
      case "default":
      default:
        return <Loader2 className={`${sizeClass} text-blue-400 animate-spin`} />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderSpinner()}
      {text && <p className={`${getTextSize()} text-slate-300 animate-pulse`}>{text}</p>}
    </div>
  )
}

// Inline Loading (for buttons, etc.)
export function InlineLoading({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md"
  className?: string
}) {
  return <Loader2 className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} animate-spin ${className}`} />
}

// Full Screen Loading
export function FullScreenLoading({
  text = "Yükleniyor...",
}: {
  text?: string
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glassmorphism p-8 rounded-xl border border-slate-700/50 text-center">
        <LoadingIndicator size="xl" variant="web3" text={text} />
      </div>
    </div>
  )
}

// Card Loading Skeleton
export function LoadingSkeleton() {
  return (
    <div className="glassmorphism border-slate-700/50 p-6 rounded-xl">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-slate-700 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-slate-700 rounded" />
          <div className="h-3 bg-slate-700 rounded w-5/6" />
          <div className="h-3 bg-slate-700 rounded w-4/6" />
        </div>
      </div>
    </div>
  )
}
