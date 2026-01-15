"use client"
import { useWeb3 } from "@/components/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ui/particle-background";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { APP_NAME } from "@/lib/constants";
import { BarChart3, Code, Plus, Zap, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
    const { account } = useWeb3()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return <div className="min-h-screen bg-slate-950 relative">
        <ParticleBackground />
        
        {/* Mobile overlay */}
        {sidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}
        
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 z-50 h-full w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="p-6">
                {/* Logo and close button */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">{APP_NAME}</h1>
                            <p className="text-xs text-slate-400">Publisher</p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    <button
                        onClick={() => {
                            router.push("/publisher")
                            setSidebarOpen(false)
                        }}
                        className="w-full bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/70 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <BarChart3 className="h-5 w-5 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Dashboard</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            router.push("/publisher/create-site")
                            setSidebarOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded-lg transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="text-sm">Add Site</span>
                    </button>
                    <button
                        onClick={() => {
                            router.push("/publisher/integration")
                            setSidebarOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded-lg transition-colors"
                    >
                        <Code className="h-5 w-5" />
                        <span className="text-sm">SDK Integration</span>
                    </button>
                </nav>
                
                {/* Wallet Connection in Sidebar */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wallet</p>
                        {!account ? (
                            <Link href="/auth" onClick={() => setSidebarOpen(false)}>
                                <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600">
                                    Connect Wallet
                                </Button>
                            </Link>
                        ) : (
                            <div className="w-full">
                                <WalletConnectButton />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Main content */}
        <div className="lg:ml-64">
            {/* Top Header */}
            <header className="relative z-20 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/30 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger menu button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                        >
                            <Menu className="h-6 w-6 text-slate-300" />
                        </button>
                        
                        {/* Header content */}
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-white">Publisher Dashboard</h2>
                            <p className="text-sm text-slate-400 hidden sm:block">Manage your sites and track revenue</p>
                        </div>
                    </div>
                    
                    {/* Wallet connection - Desktop only */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {!account ? (
                            <Link href="/auth">
                                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-600">
                                    Connect Wallet
                                </Button>
                            </Link>
                        ) : (
                            <WalletConnectButton />
                        )}
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <main className="relative z-10 p-4 lg:p-6">
                {children}
            </main>
        </div>
    </div>
}