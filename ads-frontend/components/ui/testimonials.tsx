"use client"

import { cn } from "@/lib/utils"

interface Testimonial {
  name: string
  role: string
  company?: string
  avatar: string // 2-3 letter initials
  testimonial: string
  rating: number // 1-5 stars
  highlight: string // The key metric or benefit
  color: string // Color theme
}

interface TestimonialsProps {
  title: string
  testimonials: Testimonial[]
  columns?: 2 | 3
  className?: string
  backgroundColor?: "white" | "gray-50" | "transparent"
}

const colorClasses = {
  purple: "from-purple-50 to-indigo-100 border-purple-200 bg-purple-500",
  green: "from-green-50 to-emerald-100 border-green-200 bg-green-500",
  orange: "from-orange-50 to-red-100 border-orange-200 bg-orange-500",
  blue: "from-blue-50 to-sky-100 border-blue-200 bg-blue-500",
  red: "from-red-50 to-rose-100 border-red-200 bg-red-500",
  indigo: "from-indigo-50 to-purple-100 border-indigo-200 bg-indigo-500"
}

const highlightColors = {
  purple: "text-purple-600",
  green: "text-green-600", 
  orange: "text-orange-600",
  blue: "text-blue-600",
  red: "text-red-600",
  indigo: "text-indigo-600"
}

const backgroundClasses = {
  white: "bg-white",
  "gray-50": "bg-gray-50", 
  transparent: ""
}

export function Testimonials({
  title,
  testimonials,
  columns = 3,
  className,
  backgroundColor = "white"
}: TestimonialsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3"
  }

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating)
  }

  return (
    <section className={cn("py-20", backgroundClasses[backgroundColor], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title}
        </h2>

        <div className={cn("grid gap-8", gridCols[columns])}>
          {testimonials.map((testimonial, index) => {
            const colorClass = colorClasses[testimonial.color as keyof typeof colorClasses]
            const highlightColor = highlightColors[testimonial.color as keyof typeof highlightColors]
            const [gradientBg, borderColor, avatarBg] = colorClass.split(' ')
            
            return (
              <div 
                key={index}
                className={cn(
                  "rounded-2xl p-6 shadow-lg border",
                  `bg-gradient-to-br ${gradientBg} ${borderColor}`
                )}
              >
                <div className="flex items-center mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4",
                    avatarBg
                  )}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.role}
                      {testimonial.company && ` - ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.testimonial}"
                </p>
                
                <div className="flex mt-4 text-yellow-400">
                  {renderStars(testimonial.rating)}
                </div>
                
                <div className={cn("mt-3 font-bold", highlightColor)}>
                  {testimonial.highlight}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}