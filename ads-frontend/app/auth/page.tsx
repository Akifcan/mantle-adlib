"use client"

import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { Button } from "@/components/ui/button"
import { Zap, Shield, TrendingUp, Users, Globe, Star, ArrowRight, Wallet, ChevronRight, Lock, Layers, BarChart3 } from "lucide-react"
import { useWeb3 } from "@/components/providers/web3-provider"

export default function Auth() {

    const { publisherDemoConnect, advertiserDemoConnect, isLoading } = useWeb3()


    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Left Side - Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%229C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                
                {/* Gradient overlays */}
                <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />

                <div className="relative z-10 h-full flex flex-col justify-center p-12">
                    {/* Logo & Branding */}
                    <div className="mb-12">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                                <Zap className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Web3Ads</h1>
                        </div>
                        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                            The Future of
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                                Digital Advertising
                            </span>
                        </h2>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                            Decentralized, transparent, and efficient advertising powered by blockchain technology.
                        </p>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Lock className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Secure & Transparent</h3>
                                <p className="text-slate-400 text-sm">Blockchain-powered smart contracts ensure transparency</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Higher ROI</h3>
                                <p className="text-slate-400 text-sm">40% better returns than traditional platforms</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <Globe className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Global Reach</h3>
                                <p className="text-slate-400 text-sm">Connect with audiences worldwide instantly</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-blue-400">10K+</div>
                            <div className="text-slate-400 text-sm">Active Users</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-400">$2M+</div>
                            <div className="text-slate-400 text-sm">Volume</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-400">500+</div>
                            <div className="text-slate-400 text-sm">Campaigns</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Authentication */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Web3Ads</h1>
                        </div>
                        <p className="text-slate-400">Connect your wallet to get started</p>
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                        <p className="text-slate-400">Choose your path to get started with Web3 advertising</p>
                    </div>

                    {/* Demo Accounts */}
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Try Demo Accounts</h3>
                            <p className="text-slate-400 text-sm">Experience the platform without connecting a wallet</p>
                        </div>
                        
                        {!isLoading ? (
                            <div className="space-y-3">
                                <Button 
                                    onClick={publisherDemoConnect} 
                                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 rounded-xl font-medium group"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                <Layers className="h-4 w-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold">Publisher Demo</div>
                                                <div className="text-xs opacity-90">Monetize your content</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Button>
                                
                                <Button 
                                    onClick={advertiserDemoConnect} 
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 rounded-xl font-medium group"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold">Advertiser Demo</div>
                                                <div className="text-xs opacity-90">Promote your brand</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                <span className="ml-3 text-slate-400">Connecting...</span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="px-4 text-slate-500 text-sm font-medium">OR</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Wallet Connection */}
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
                            <p className="text-slate-400 text-sm">Use your own wallet for full access and real transactions</p>
                        </div>
                        
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <Wallet className="h-5 w-5 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">MetaMask Wallet</h4>
                                    <p className="text-slate-400 text-sm">Connect using MetaMask browser extension</p>
                                </div>
                            </div>
                            <WalletConnectButton disableLoading={true} />
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 p-4 bg-slate-900/30 border border-slate-700/30 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">Secure & Private</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    We never store your private keys. Your wallet connection is secure and you maintain full control of your assets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}