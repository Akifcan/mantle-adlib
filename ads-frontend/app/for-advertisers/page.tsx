'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useWeb3 } from "@/components/providers/web3-provider"
import { Menu, X } from 'lucide-react'

import { FeaturesGrid } from "@/components/ui/features-grid"
import { Testimonials } from "@/components/ui/testimonials"
import { APP_NAME } from "@/lib/constants"
import Footer from '@/components/footer'

export default function ForAdvertisersPage() {
  const { connectWallet } = useWeb3()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [selectedPersona, setSelectedPersona] = useState<'footballer' | 'gamer' | 'movieLover'>('footballer')

  // Features data for reusable component
  const advertiserFeatures = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Personalization",
      description: "One creative → Thousands of personalized variants. Automatic optimization based on target audience.",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "No Crypto Required",
      description: "No need to learn ETH. Simple wallet connection, transparent pricing, familiar interface.",
      color: "orange"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Transparent Metrics",
      description: "Blockchain-based reliable data. No fake clicks, every metric is verifiable.",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "Dual-Role",
      description: "Both place ads and earn revenue. Reduce your advertising costs by 30-50%.",
      color: "green"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "High ROI",
      description: "Up to 300% CTR increase with AI optimization. Less spending, more sales.",
      color: "indigo"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "User Rewards",
      description: "Users earn rewards by watching ads. Positive ad experience, high engagement.",
      color: "pink"
    }
  ]

  const personaExamples = {
    footballer: {
      emoji: '🏈',
      title: 'For Football Lovers',
      image: 'TV + Stadium + Fans',
      headline: 'Experience the match like you\'re in the stands!',
      cta: 'Watch Champions League at home',
      colors: 'from-green-400 to-emerald-600'
    },
    gamer: {
      emoji: '🎮',
      title: 'For Gamers',
      image: 'TV + Gaming Setup + LED Lights',
      headline: 'Leave your opponents behind with 120Hz!',
      cta: 'Upgrade your gaming experience',
      colors: 'from-purple-400 to-indigo-600'
    },
    movieLover: {
      emoji: '🎬',
      title: 'For Movie Lovers',
      image: 'TV + Home Theater + Popcorn',
      headline: 'Bring Hollywood to your home!',
      cta: 'Experience cinema quality',
      colors: 'from-red-400 to-pink-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  {APP_NAME}
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/for-publishers" className="text-gray-700 hover:text-gray-900">For Publishers</Link>
              <Link href="/demo" className="text-gray-700 hover:text-gray-900">Demo</Link>
            </nav>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                  Sign In
                </button>
              </Link>
              <Link href={'/auth'}>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  🚀 Create Campaign
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/for-publishers">
                  <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    For Publishers
                  </div>
                </Link>
                <Link href="/demo">
                  <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Demo
                  </div>
                </Link>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <Link href="/auth">
                    <button className="w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link href={'/auth'}>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      🚀 Create Campaign
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-purple-200 text-sm font-medium">🚀 Special for Advertisers</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Ads with AI are
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              300% More Effective
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto">
            One ad, thousands of personalized impressions. Both place ads and earn revenue.
          </p>

          {/* Performance Comparison */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">📊 Performance Comparison</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-red-300 font-semibold mb-2">Traditional Ads</div>
                <div className="text-3xl font-bold text-red-300">2.5%</div>
                <div className="text-purple-200 text-sm">CTR Rate</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-300 font-semibold mb-2">Targeted Ads</div>
                <div className="text-3xl font-bold text-yellow-300">4.2%</div>
                <div className="text-purple-200 text-sm">CTR Rate</div>
              </div>
              <div className="text-center">
                <div className="text-green-300 font-semibold mb-2">AI Personalized</div>
                <div className="text-3xl font-bold text-green-300">9.8%</div>
                <div className="text-purple-200 text-sm">CTR Rate</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="bg-green-400 text-purple-800 px-4 py-2 rounded-full font-bold">
                300%+ Higher CTR! 🎯
              </span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link href={'/auth'}>
          <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl">
              🎯 Create Campaign
            </button>
          </Link>
         
            <Link href="/demo">
              <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
                🎮 Watch AI Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Personalization Demo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 How Does <span className="text-purple-600">AI Personalization</span> Work?
            </h2>
            <p className="text-xl text-gray-600">
              Same ad, automatic customization for different audiences
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              📺 Samsung TV Ad - Live Personalization
            </h3>

            {/* Persona Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
                {Object.entries(personaExamples).map(([key, persona]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPersona(key as any)}
                    className={`px-4 py-2 rounded-md transition-all text-sm ${selectedPersona === key
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white hover:bg-white/20'
                      }`}
                  >
                    {persona.emoji} {persona.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Persona Ad */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-xl">
                <div className={`h-64 bg-gradient-to-br ${personaExamples[selectedPersona].colors} rounded-lg flex items-center justify-center mb-4`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">{personaExamples[selectedPersona].emoji}</div>
                    <div className="text-sm font-medium">{personaExamples[selectedPersona].image}</div>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {personaExamples[selectedPersona].headline}
                </h4>
                <p className="text-gray-600 mb-4">
                  55" Samsung Neo QLED 8K TV - Quantum HDR 64x technology
                </p>
                <button className={`w-full bg-gradient-to-r ${personaExamples[selectedPersona].colors} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                  {personaExamples[selectedPersona].cta}
                </button>
              </div>
            </div>

            <p className="text-center text-purple-300 mt-6">
              ✨ Same product, same budget - message optimized for 3 different target audiences!
            </p>
          </div>
        </div>
      </section>

      {/* No Crypto Required */}
      <section className="py-20 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            🔗 No Crypto Knowledge Required!
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            No need to learn ETH, Bitcoin. Simple wallet connection,
            start advertising immediately. Ideal for mainstream businesses.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">Simple Wallet Connection</h3>
              <p className="text-orange-100">Connect your wallet, start advertising</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Familiar Dashboard</h3>
              <p className="text-orange-100">Google Ads-like user-friendly interface</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesGrid
        title="Why"
        titleHighlight={APP_NAME + "?"}
        features={advertiserFeatures}
        columns={3}
        backgroundColor="gray-50"
      />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Future of Advertising is Here! 🚀
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Ads 300% more effective with AI power. No ETH required,
            reduce your costs by half with dual-role.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link href={'/auth'}>
          <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl">
              🚀 Create Campaign
            </button>
          </Link>
        
            <Link href="/demo">
              <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
                🎮 Watch AI Demo
              </button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">300%</div>
              <div className="text-purple-200">CTR Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50%</div>
              <div className="text-purple-200">Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$0</div>
              <div className="text-purple-200">Setup Fee</div>
            </div>
          </div>
        </div>
      </section>

      <Footer description="An AI-powered advertising platform for advertisers." />
    </div>
  )
} 