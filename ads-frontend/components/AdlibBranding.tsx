'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdlibBrandingProps {
  theme?: 'light' | 'dark' | 'colorful'
}

export default function AdlibBranding({ theme = 'colorful' }: AdlibBrandingProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const router = useRouter()

  const themeStyles = {
    light: {
      bg: 'bg-white border border-gray-200 shadow-lg',
      text: 'text-gray-800',
      accent: 'text-blue-600',
      hover: 'hover:shadow-xl'
    },
    dark: {
      bg: 'bg-gray-800 border border-gray-700 shadow-lg',
      text: 'text-white',
      accent: 'text-blue-400',
      hover: 'hover:shadow-xl'
    },
    colorful: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg',
      text: 'text-white',
      accent: 'text-yellow-300',
      hover: 'hover:shadow-xl hover:scale-105'
    }
  }

  const currentTheme = themeStyles[theme]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main FAB Button */}
      <div
        className={`
          ${currentTheme.bg} ${currentTheme.text} ${currentTheme.hover}
          rounded-full p-4 cursor-pointer transition-all duration-300 ease-in-out
          flex items-center justify-center min-w-[56px] h-[56px]
          ${isExpanded ? 'rounded-2xl px-6' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Logo/Icon */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-6 h-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
            </svg>
          </div>
          
          {/* Expanded text */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
              ${isExpanded ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}
            `}
          >
            <span className="font-semibold">Powered by Adlib</span>
          </div>
        </div>
      </div>

      {/* Tooltip/Info when expanded */}
      {isExpanded && (
        <div
          className={`
            absolute bottom-16 right-0 ${currentTheme.bg} ${currentTheme.text}
            rounded-lg p-3 shadow-lg min-w-[200px] transition-all duration-300 ease-in-out
            transform origin-bottom-right
          `}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className={`font-bold text-lg ${currentTheme.accent}`}>Adlib</span>
            <span className="text-sm opacity-75">Web3 Ads</span>
          </div>
          <p className="text-xs opacity-75 mb-3">
            This demo showcases Web3 advertising powered by Adlib platform
          </p>
          <div className="flex space-x-2">
            <button
              className={`
                px-3 py-1 text-xs rounded-full border transition-colors
                ${theme === 'colorful' 
                  ? 'border-white/30 hover:bg-white/10' 
                  : 'border-current/30 hover:bg-current/10'
                }
              `}
              onClick={(e) => {
                e.stopPropagation()
                router.push('/')
              }}
            >
              Learn More
            </button>
            <button
              className={`
                px-3 py-1 text-xs rounded-full transition-colors
                ${theme === 'colorful'
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'bg-current/20 hover:bg-current/30'
                }
              `}
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}