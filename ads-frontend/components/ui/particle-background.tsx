"use client"

import { useEffect } from "react"

export function ParticleBackground() {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 6 + "s"
      particle.style.animationDuration = Math.random() * 3 + 3 + "s"

      const colors = ["#00FFFF", "#3B82F6", "#10B981", "#F59E0B"]
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]

      document.querySelector(".particle-bg")?.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 6000)
    }

    const interval = setInterval(createParticle, 300)
    return () => clearInterval(interval)
  }, [])

  return <div className="particle-bg" />
}
