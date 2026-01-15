"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Feature {
  icon: ReactNode
  title: string
  description: string
  color?: string
}

interface FeaturesGridProps {
  title: string
  titleHighlight?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
  backgroundColor?: "white" | "gray-50" | "transparent"
}

const colorClasses = {
  purple: "bg-purple-500",
  orange: "bg-orange-500", 
  blue: "bg-blue-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  pink: "bg-pink-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  cyan: "bg-cyan-500"
}

const backgroundClasses = {
  white: "bg-white",
  "gray-50": "bg-gray-50",
  transparent: ""
}

export function FeaturesGrid({
  title,
  titleHighlight,
  features,
  columns = 3,
  className,
  backgroundColor = "gray-50"
}: FeaturesGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3", 
    4: "md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <section className={cn("py-20", backgroundClasses[backgroundColor], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title} {titleHighlight && (
            <span className="text-purple-600">{titleHighlight}</span>
          )}
        </h2>

        <div className={cn("grid gap-8", gridCols[columns])}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                feature.color ? colorClasses[feature.color as keyof typeof colorClasses] : "bg-purple-500"
              )}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}