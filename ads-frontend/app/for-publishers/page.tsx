'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useWeb3 } from "@/components/providers/web3-provider"
import { Menu, X } from 'lucide-react'
import { FeaturesGrid } from "@/components/ui/features-grid"
import { APP_NAME } from "@/lib/constants"
import Footer from '@/components/footer'

export default function ForPublishersPage() {
  const { connectWallet } = useWeb3()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  // Publisher features data
  const publisherFeatures = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "70% Higher Revenue",
      description: "Thanks to blockchain technology, we only take 10% commission. Get maximum revenue with transparent, intermediary-free payments.",
      color: "green"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Setup",
      description: "5-minute installation with NPM package. React, Vue, Vanilla JS supported. Start working immediately with copy-paste.",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Transparent Analytics",
      description: "Blockchain-based transparent metrics. No fake clicks, real-time data, reliable statistics.",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Every Framework",
      description: "React, Vue, Angular, Vanilla JS. Next.js, Nuxt.js compatible. Whatever technology you use, we integrate with it.",
      color: "orange"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "User Friendly",
      description: "User-friendly ad formats. Your visitors will love watching ads with the reward system.",
      color: "red"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "High CTR",
      description: "Up to 300% CTR increase with AI personalization. Quality, targeted advertisements.",
      color: "indigo"
    }
  ]

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
              <Link href="/for-advertisers" className="text-gray-700 hover:text-gray-900">For Advertisers</Link>
              <Link href="/demo" className="text-gray-700 hover:text-gray-900">Demo</Link>
            </nav>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                  Sign In
                </button>
              </Link>
              <Link href="/auth">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  📱 Become Publisher
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
                <Link href="/for-advertisers">
                  <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    For Advertisers
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
                  <Link href="/auth">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      📱 Become Publisher
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-green-200 text-sm font-medium">💰 Special for Publishers</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Earn 
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              3x More Money
            </span>
            From Your Site
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-4xl mx-auto">
            Transparent advertising ecosystem powered by blockchain technology. 
            Earn high revenue with only 10% commission and integrate with just one line of code.
          </p>
          
          {/* Value Proposition */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">🚀 {APP_NAME} Advantages</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  💰
                </div>
                <div className="text-yellow-300 font-semibold mb-2">Low Commission</div>
                <div className="text-3xl font-bold text-yellow-300">10%</div>
                <div className="text-green-200 text-sm">Lowest in the industry</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-cyan-300 font-semibold mb-2">Quick Setup</div>
                <div className="text-3xl font-bold text-cyan-300">5min</div>
                <div className="text-blue-200 text-sm">One line of code</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div className="text-purple-300 font-semibold mb-2">Blockchain</div>
                <div className="text-3xl font-bold text-purple-300">100%</div>
                <div className="text-purple-200 text-sm">Transparency</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-200 font-semibold">✨ Next-generation advertising technology!</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link href="/auth">
          <button className="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl">
              🎯 Start Now - 5 Minutes
            </button>
          </Link>
          
            <Link href="/demo">
              <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
                🎮 Watch Live Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Easy Integration */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              It's That <span className="text-green-600">Simple!</span>
            </h2>
            <p className="text-xl text-gray-600">
              Integrate into your site in 3 steps, start earning money
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Install NPM Package</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-left">
                <code className="text-green-400 text-sm">npm install @adlib/react</code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Component</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-left">
                <pre className="text-green-400 text-xs overflow-x-auto">
{`<Adlib 
  apiKey="your-key"
  type="rectangle"
  category="tech"
/>`}
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Earning Money</h3>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-center">
                <span className="text-white font-bold">💰 Instant Revenue!</span>
              </div>
            </div>
          </div>

          {/* Full Code Example */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">📝 Complete Code Example</h3>
            <div className="bg-black/30 rounded-lg p-6">
              <pre className="text-green-400 text-sm md:text-base overflow-x-auto">
              {`import { Web3AdComponent } from '@adlib/react'

function MyWebsite() {
  return (
    <div>
      <h1>Hello My Website</h1>
      
      {/* Square ad - Sidebar */}
      <Adlib 
        apiKey="your-api-key"
        type="square"
        category="tech"
      />
      
      {/* Rectangle banner - Below header */}
      <Adlib 
        apiKey="your-api-key"
        type="rectangle"
        category="lifestyle"
      />
      
      {/* Reward ad - Special rewards */}
      <Adlib 
        apiKey="your-api-key"
        type="reward"
        category="gaming"
        onReward={() => alert('User earned a reward!')}
      />
    </div>
  )
}`}
              </pre>
            </div>
            <p className="text-green-200 mt-4 text-center">✨ That's it! You're now earning money.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <FeaturesGrid 
        title="Why"
        titleHighlight={APP_NAME + "?"}
        features={publisherFeatures}
        columns={3}
        backgroundColor="gray-50"
      />

      {/* Ad Formats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            🎨 Ad Formats
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Choose the format that fits your site, earn maximum revenue
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Square */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-4 mx-auto" style={{width: '200px', height: '200px'}}>
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 rounded flex items-center justify-center">
                  <span className="text-blue-800 font-semibold">Square<br/>200x200</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Square Ad</h4>
              <p className="text-gray-600 text-sm">Ideal for sidebar, corner areas</p>
            </div>

            {/* Rectangle */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 mx-auto" style={{width: '200px', height: '120px'}}>
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400 rounded flex items-center justify-center">
                  <span className="text-green-800 font-semibold">Rectangle<br/>320x180</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Rectangle Banner</h4>
              <p className="text-gray-600 text-sm">Below header, banner areas</p>
            </div>

            {/* Popup */}
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-8 mb-4 mx-auto relative" style={{width: '200px', height: '140px'}}>
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-400 rounded flex items-center justify-center">
                  <span className="text-purple-800 font-semibold">Popup<br/>Modal</span>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">×</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Popup Modal</h4>
              <p className="text-gray-600 text-sm">Eye-catching, high conversion</p>
            </div>

            {/* Reward */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg p-8 mb-4 mx-auto relative" style={{width: '200px', height: '140px'}}>
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded flex items-center justify-center">
                  <span className="text-orange-800 font-semibold">🎁 Reward<br/>15s Timer</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 h-2 bg-orange-200 rounded-full">
                  <div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Reward Ad</h4>
              <p className="text-gray-600 text-sm">Reward system, user love</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Now! 🚀
          </h2>
          <p className="text-xl text-green-100 mb-8">
            5-minute setup, start earning money instantly. 
            Free trial, no credit card required.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href={'/auth'}>
            <button className="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl">
              💰 Start Free
            </button>
            </Link>
           
            <Link href="/demo">
              <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
                🎮 Watch Live Demo
              </button>
            </Link>
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">5 min</div>
              <div className="text-green-200">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold">70%</div>
              <div className="text-green-200">More Revenue</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$0</div>
              <div className="text-green-200">Startup Cost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer description="High revenue, easy integration for Publishers." />
    </div>
  )
} 