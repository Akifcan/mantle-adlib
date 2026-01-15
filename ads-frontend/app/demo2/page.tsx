'use client'

import { useState } from 'react'
import Web3AdComponent from '@/components/package/Web3AdComponent'
import Web3AdvertiserComponent from '@/components/package/Web3AdvertiserComponent'
import AdlibBranding from '@/components/AdlibBranding'

export default function Demo2Page() {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-pink-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                Beauty Blog
                            </h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="text-gray-700 hover:text-pink-600">Home</a>
                            <a href="#" className="text-gray-700 hover:text-pink-600">Makeup Tips</a>
                            <a href="#" className="text-gray-700 hover:text-pink-600">Skincare</a>
                            <a href="#" className="text-gray-700 hover:text-pink-600">Product Reviews</a>
                            <a href="#" className="text-gray-700 hover:text-pink-600">Trend News</a>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-700 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <button className="text-gray-700 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm hover:from-pink-600 hover:to-purple-700 transition-colors">
                                ✍️ Become Writer
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Rectangle Banner Ad - Below Header */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    {/* <Web3AdComponent 
            apiKey="ads-app-fca5c252-a14d-4cc3-a4f1-5ff277e14eb6"
            type="rectangle"
            category="fashion"
          /> */}
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">✨ Beauty Blog ✨</h2>
                    <p className="text-xl mb-8">Latest trends, tips and expert advice in the beauty world</p>
                    <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors">
                        📖 Discover Articles
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar - Square Ads */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-pink-100">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                📝 Categories
                            </h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-pink-600 flex items-center">💄 Makeup Tips</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-pink-600 flex items-center">🌟 Skincare</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-pink-600 flex items-center">💅 Hair Care</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-pink-600 flex items-center">🛍️ Product Reviews</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-pink-600 flex items-center">🎯 Trend News</a></li>
                            </ul>
                        </div>

                        {/* Square Ads - Sidebar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-pink-100">
                            <p className="text-sm text-gray-500 mb-3 text-center">✨ Special Content</p>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <Web3AdvertiserComponent
                                    id={"35"}
                                    type="square"
                                />
                                <Web3AdvertiserComponent
                                    id={"39"}
                                    type="square"
                                />
                                <Web3AdvertiserComponent
                                    id={"38"}
                                    type="reward"
                                />
                                {/* <Web3AdComponent 
                  apiKey="ads-app-fca5c252-a14d-4cc3-a4f1-5ff277e14eb6"
                  type="square"
                  category="fashion"
                /> */}
                            </div>
                        </div>

                        {/* Reward Ad Button */}
                        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg shadow-sm p-4 text-center">
                            <h4 className="font-bold text-white mb-2">🎁 Special Content</h4>
                            <p className="text-pink-100 text-sm mb-3">Read premium articles!</p>
                            {/* <Web3AdComponent 
                apiKey="ads-app-fca5c252-a14d-4cc3-a4f1-5ff277e14eb6"
                type="reward"
                category="fashion"
                onReward={() => {
                  alert('🎉 Congratulations! You won premium membership!')
                  setIsVisible(true)
                }}
              /> */}
                        </div>
                    </div>

                    {/* Main Content - Blog Articles */}


                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                ✨ Latest Articles
                            </h3>

                            {/* Blog Articles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

                                {/* Blog Article 1 */}
                                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-pink-100">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-pink-100 to-purple-100">
                                        <div className="h-48 flex items-center justify-center">
                                            <span className="text-4xl">💄</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">Makeup Tips</span>
                                            <span className="text-gray-400 text-xs ml-2">5 min read</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">2024 Lipstick Trends: Which Colors Are in Fashion?</h4>
                                        <p className="text-gray-600 text-sm mb-3">Which lipstick colors will be trending this year? Experts share about 2024's most popular lip colors...</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-pink-300 rounded-full mr-2"></div>
                                                <span className="text-gray-500 text-xs">Ayşe Güzel</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">2 hours ago</span>
                                        </div>
                                        <button className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors">
                                            📖 Continue Reading
                                        </button>
                                    </div>
                                </div>
                                <Web3AdvertiserComponent
                                    id="36"
                                    type="rectangle"
                                />

                                {/* Blog Article 2 */}
                                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-pink-100">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-pink-100 to-purple-100">
                                        <div className="h-48 flex items-center justify-center">
                                            <span className="text-4xl">👁️</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Eye Makeup</span>
                                            <span className="text-gray-400 text-xs ml-2">7 min read</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">How to Do Smoky Eyes? Step by Step</h4>
                                        <p className="text-gray-600 text-sm mb-3">All the techniques and tips you need for professional smoky eyes makeup...</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-purple-300 rounded-full mr-2"></div>
                                                <span className="text-gray-500 text-xs">Melis Çelik</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">4 hours ago</span>
                                        </div>
                                        <button className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors">
                                            📖 Continue Reading
                                        </button>
                                    </div>
                                </div>

                                {/* Blog Article 3 */}
                                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-pink-100">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-pink-100 to-purple-100">
                                        <div className="h-48 flex items-center justify-center">
                                            <span className="text-4xl">🌟</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Skincare</span>
                                            <span className="text-gray-400 text-xs ml-2">8 min read</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Winter Skincare Routine: 5 Golden Rules</h4>
                                        <p className="text-gray-600 text-sm mb-3">5 golden rules you must know to protect your skin in cold weather...</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-blue-300 rounded-full mr-2"></div>
                                                <span className="text-gray-500 text-xs">Dr. Selin Yılmaz</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">6 hours ago</span>
                                        </div>
                                        <button className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors">
                                            📖 Continue Reading
                                        </button>
                                    </div>
                                </div>

                                {/* Blog Article 4 */}
                                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-pink-100">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-pink-100 to-purple-100">
                                        <div className="h-48 flex items-center justify-center">
                                            <span className="text-4xl">🌸</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Product Review</span>
                                            <span className="text-gray-400 text-xs ml-2">6 min read</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">2024's Best Perfumes Review</h4>
                                        <p className="text-gray-600 text-sm mb-3">We tested this year's most popular and high-quality perfumes. Here are the results...</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-green-300 rounded-full mr-2"></div>
                                                <span className="text-gray-500 text-xs">Ela Kaya</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">1 day ago</span>
                                        </div>
                                        <button className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors">
                                            📖 Continue Reading
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Ad - Visible after reward is received 
      {isVisible && (
        // <Web3AdComponent 
        //   apiKey="ads-app-fca5c252-a14d-4cc3-a4f1-5ff277e14eb6"
        //   type="popup"
        //   category="fashion"
        // />
    //   )}*/}

            {/* Footer */}
            <footer className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">✨ Beauty Blog</h3>
                            <p className="text-pink-100">Most current content and expert advice in the beauty world</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">📝 Categories</h4>
                            <ul className="space-y-2 text-pink-100">
                                <li>Makeup Tips</li>
                                <li>Skincare</li>
                                <li>Product Reviews</li>
                                <li>Trend News</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">ℹ️ Information</h4>
                            <ul className="space-y-2 text-pink-100">
                                <li>About Us</li>
                                <li>Our Writers</li>
                                <li>Contact</li>
                                <li>Privacy Policy</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">📱 Social Media</h4>
                            <ul className="space-y-2 text-pink-100">
                                <li>Instagram</li>
                                <li>TikTok</li>
                                <li>YouTube</li>
                                <li>Pinterest</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-pink-500 mt-8 pt-8 text-center text-pink-100">
                        <p>&copy; 2024 Beauty Blog. Beauty articles and tips ✨</p>
                    </div>
                </div>
            </footer>

            {/* Adlib Branding FAB */}
            <AdlibBranding theme="colorful" />
        </div>
    )
}