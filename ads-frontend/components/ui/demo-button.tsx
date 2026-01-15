"use client"

import Link from "next/link"
import { Play, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type DemoButtonVariant = "header" | "hero" | "default"
type DemoButtonSize = "sm" | "md" | "lg"

interface DemoButtonProps {
  variant?: DemoButtonVariant
  size?: DemoButtonSize
  showSubtext?: boolean
  className?: string
}

const variantStyles = {
  header: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:shadow-xl",
  hero: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 hover:shadow-orange-500/50 animate-pulse hover:animate-none border-2 border-yellow-300/30 hover:border-yellow-200/50",
  default: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
}

const sizeStyles = {
  sm: {
    button: "px-4 py-2 text-sm gap-1.5",
    icon: "w-3 h-3",
    sparkles: "w-3 h-3"
  },
  md: {
    button: "px-6 py-2.5 text-base gap-2",
    icon: "w-4 h-4", 
    sparkles: "w-3 h-3"
  },
  lg: {
    button: "px-8 py-4 text-lg gap-3",
    icon: "w-6 h-6",
    sparkles: "w-5 h-5"
  }
}

export function DemoButton({ 
  variant = "default", 
  size = "md", 
  showSubtext = false,
  className 
}: DemoButtonProps) {
  const styles = sizeStyles[size]
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Link 
        href="/demo" 
        className={cn(
          // Base styles
          "group relative inline-flex items-center text-white font-semibold rounded-full transform hover:scale-105 transition-all duration-[2000s] shadow-2xl",
          // Variant styles
          variantStyles[variant],
          // Size styles
          styles.button,
          // Hero specific styles
          variant === "hero" && "font-bold",
          variant === "header" && "font-semibold"
        )}
      >
        <Play className={cn(
          "group-hover:scale-110 transition-transform duration-300 fill-current",
          styles.icon,
          variant === "hero" && "group-hover:scale-125 duration-500"
        )} />
        
        <span className={cn(
          "relative",
          variant === "hero" && "font-extrabold tracking-wide"
        )}>
          {variant === "hero" ? "🚀 Show Demo App" : "Demo App"}
          {variant === "header" && size === "md" && (
            <Sparkles className={cn(
              "absolute -top-1 -right-1 text-yellow-300 animate-pulse",
              styles.sparkles
            )} />
          )}
        </span>
        
        {variant === "hero" && (
          <Sparkles className={cn(
            "text-yellow-200 animate-bounce",
            styles.sparkles
          )} />
        )}
      </Link>
      
      {showSubtext && variant === "hero" && (
        <p className="mt-3 text-sm text-blue-200/80">
          ✨ See how it works in 30 seconds
        </p>
      )}
    </div>
  )
}