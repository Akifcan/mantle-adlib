'use client'

import Web3AdComponent from '@/components/package/Web3AdComponent'
import AdlibBranding from '@/components/AdlibBranding'
import { useState, useEffect } from 'react'




export default function DemoPage() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Categories</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-700 hover:text-gray-900 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rectangle Banner Ad - Below Header */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2 justify-center">
          <Web3AdComponent 
            type="rectangle"
            apiKey="ads-app-650d48a3-9b6b-4761-a141-1a6367512549"
            category="technology"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Latest Technology Products</h2>
          <p className="text-xl mb-8">Get your dream technology products at special prices</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Shopping
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Square Ad */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Computer</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Phone</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Tablet</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Accessories</a></li>
              </ul>
            </div>
            
            {/* Square Ad - Sidebar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <p className="text-sm text-gray-500 mb-3 text-center">Sponsored Content</p>
              <div className="flex flex-col gap-2 justify-center">
                <Web3AdComponent 
                  type="square"
            apiKey="ads-app-650d48a3-9b6b-4761-a141-1a6367512549"
            category="technology"
                /> 
                 <Web3AdComponent 
                  type="square"
            apiKey="ads-app-650d48a3-9b6b-4761-a141-1a6367512549"
            category="technology"
                />
              </div>
            </div>

            {/* Reward Ad Button */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow p-4 text-center">
              <h4 className="font-bold text-white mb-2">🎁 Special Reward</h4>
              <p className="text-yellow-100 text-sm mb-3">Watch ads to earn rewards!</p>
              <Web3AdComponent 
                type="reward"
            apiKey="ads-app-650d48a3-9b6b-4761-a141-1a6367512549"
            category="technology"
                onReward={() => {
                  alert('🎉 Congratulations! You won a 50$ discount coupon!')
                  setIsVisible(true)
                }}
              />
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h3>
              
              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Product 1 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">MacBook Pro</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">MacBook Pro 14"</h4>
                    <p className="text-gray-600 text-sm">M3 Pro Chip, 18GB RAM</p>
                    <p className="text-blue-600 font-bold mt-2">₺45,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">iPhone 15</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">iPhone 15 Pro</h4>
                    <p className="text-gray-600 text-sm">128GB, Natural Titanium</p>
                    <p className="text-blue-600 font-bold mt-2">₺52,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">AirPods Pro</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">AirPods Pro</h4>
                    <p className="text-gray-600 text-sm">2nd Generation, USB-C</p>
                    <p className="text-blue-600 font-bold mt-2">₺8,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product 4 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">iPad Air</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">iPad Air</h4>
                    <p className="text-gray-600 text-sm">M2 Chip, 128GB</p>
                    <p className="text-blue-600 font-bold mt-2">₺18,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product 5 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Apple Watch</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">Apple Watch Series 9</h4>
                    <p className="text-gray-600 text-sm">GPS, 45mm</p>
                    <p className="text-blue-600 font-bold mt-2">₺12,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product 6 */}
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Magic Keyboard</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">Magic Keyboard</h4>
                    <p className="text-gray-600 text-sm">Touch ID, Turkish Q</p>
                    <p className="text-blue-600 font-bold mt-2">₺4,999</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Ad - Visible after reward is received */}
      {isVisible && (
        <Web3AdComponent 
        type="popup"
                      apiKey="ads-app-650d48a3-9b6b-4761-a141-1a6367512549"
            category="technology"

        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TechStore</h3>
              <p className="text-gray-400">Highest quality technology products</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Computer</li>
                <li>Phone</li>
                <li>Tablet</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact</li>
                <li>FAQ</li>
                <li>Returns & Exchanges</li>
                <li>Shipping</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Facebook</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Adlib Branding FAB */}
      <AdlibBranding theme="light" />
    </div>
  )
}