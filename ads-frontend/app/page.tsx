'use client'

import Link from 'next/link'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { DemoButton } from "@/components/ui/demo-button"
import { api } from "@/lib/api"
import { APP_NAME } from "@/lib/constants"

export default function HomePage() {
  const { isConnected, account, disconnectWallet } = useWeb3()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex flex-wrap gap-5 justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/logo-icon.svg" alt="GalacticReachers Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
          </div>
          
          {/* Mobile Demo Button */}
          <div className="flex md:hidden flex-col  items-start gap-3">
            <DemoButton variant="header" size="sm" />
            <Link href="/auth">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                Sign In
              </button>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <DemoButton variant="header" size="md" />
            
            {/* <a href="#" className="text-white/80 hover:text-white transition-colors">About</a> */}
            {/* <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a> */}
            <Link href="/auth">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                Sign In
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
            The Future of
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Advertising
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
            AI-powered, blockchain-based advertising platform. 
            Higher revenue, transparent metrics, and personalized ads.
          </p>

          {/* Demo CTA Button */}
          <DemoButton variant="hero" size="lg" showSubtext={true} className="mb-12" />

          {/* Target Audience Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            
            {/* Publishers Card */}
            <Link href="/for-publishers">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-white mb-4">I'm a Publisher</h3>
                <p className="text-blue-100 mb-6">
                  Earn money by adding ads to your site. 
                  70% higher revenue than Google AdSense.
                </p>
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-green-400 transition-colors">
                  💰 Earn Revenue
                </div>
                <div className="mt-4 text-sm text-green-200">
                  • 10% commission
                  • 5-minute setup
                </div>
              </div>
            </Link>

            {/* Advertisers Card */}
            <Link href="/for-advertisers">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-4">I'm an Advertiser</h3>
                <p className="text-blue-100 mb-6">
                  AI-powered personalized ads. 
                  300% higher CTR, no ETH required system.
                </p>
                <div className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-purple-400 transition-colors">
                  🎯 Create Campaign
                </div>
                <div className="mt-4 text-sm text-purple-200">
                  • Personalized ads
                  • Place ads
                  • Publish your own ads
                </div>
              </div>
            </Link>
          </div>

          {/* Demo Button */}
          <Link href="/demo">
            <button className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300">
              🎮 Watch Live Demo
            </button>
          </Link>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto pb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-blue-200 text-sm">Active Publishers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-blue-200 text-sm">Daily Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">300%</div>
              <div className="text-blue-200 text-sm">CTR Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$2M+</div>
              <div className="text-blue-200 text-sm">Monthly Revenue</div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
