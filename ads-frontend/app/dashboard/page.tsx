"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Users, Megaphone, Zap } from "lucide-react"
import { api } from "@/lib/api"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/error-alert"
import { LoadingIndicator } from "@/components/ui/loaading-indicator"
import { AuthGuard } from "@/components/auth/auth-guard"
import { APP_NAME } from "@/lib/constants"

const Container = () => {
  const { account, isConnected } = useWeb3()
  const router = useRouter()

  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)

  const [isPublsiherLoading, setPublisherLoading] = useState(false)
  const [isAdvertiserLoading, setAdvertiserLoading] = useState(false)

  const {loginToBackend} = useWeb3()


  const handlePublisherRegistration = async () => {
    try {
      setPublisherLoading(true)
      await api.post('/wallet/publisher', {
        address: account
      })
      loginToBackend(account!)
    } catch (e) {
      setError(true)
    } finally {
      setPublisherLoading(false)
    }
  }

  const handleAdvertiserRegistration = async () => {
    try {
      setAdvertiserLoading(true)
      await api.post('/wallet/advertiser', {
        address: account
      })
      loginToBackend(account!)
    } catch (e) {
      setError(true)
    } finally {
      setAdvertiserLoading(false)
    }
  }

  const handleUser = async () => {
    try {


      console.log("adfasdf")
      setLoading(true)
      const user = await api.post<WalletProps>('/wallet', {
        address: account
      })

      if(user.data.type === 'publisher'){
        router.push("/publisher")
        return
      }

      if(user.data.type === 'advertiser'){
        router.push("/advertiser")
        return
      }
      setLoading(false)
      router.push('/')
    } catch (e: any) {
      if (e.response.data?.error?.errorCode === 'account.not_found') {
        return
      }
      setError(true)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (!account || !isConnected) {
      return router.push("/")
    }
    handleUser()
  }, [router, account, isConnected])

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 relative flex justify-center items-center">
      <ParticleBackground />
      <div className="relative z-10">
        <LoadingIndicator size="lg" variant="web3" text="Signing In..." />
      </div>
    </div>
  }

  return <div className="min-h-screen bg-slate-950 relative">
    <ParticleBackground />
    {/* Header */}
    <header className="relative z-20 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/30 p-4">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{APP_NAME}</h1>
            <p className="text-xs text-slate-400">Select your role</p>
          </div>
        </div>
        <Link href="/auth">
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 transition-opacity">
            Sign In
          </Button>
        </Link>
      </nav>
    </header>
    <main className="relative z-10 max-w-7xl mx-auto p-4 lg:p-6">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
          Choose Your Role
        </h2>
        <p className="text-slate-400 text-base lg:text-lg">How would you like to participate in the {APP_NAME} platform?</p>
      </div>
      {isError && <Alert variant="destructive" className="mb-5">
        <AlertTitle>Sign In Failed</AlertTitle>
        <AlertDescription>An unexpected error occurred while signing in, please try again.</AlertDescription>
      </Alert>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* Publisher Card */}
        <Card className="glassmorphism border-slate-700/30 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Publisher</h3>
                <p className="text-slate-400 text-sm">Monetize your website</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6">
              Earn ETH by displaying ads on your website. Transparent revenue sharing and instant payments.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Easy SDK integration</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Real-time revenue tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Instant ETH payments</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Detailed analytics reports</span>
              </div>
            </div>
            
            <Button
              loading={isPublsiherLoading}
              isDisabled={isAdvertiserLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 transition-opacity" 
              onClick={handlePublisherRegistration}
            >
              Continue as Publisher
            </Button>
          </div>
        </Card>

        {/* Advertiser Card */}
        <Card className="glassmorphism border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Megaphone className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Advertiser</h3>
                <p className="text-slate-400 text-sm">Promote your brand</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6">
              Publish your ads in the Web3 ecosystem. Create targeted advertising campaigns.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Smart targeting system</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Real-time campaign tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Transparent pricing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>ROI optimization</span>
              </div>
            </div>
            
            <Button
              loading={isAdvertiserLoading}
              isDisabled={isPublsiherLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity"
              onClick={handleAdvertiserRegistration}
            >
              Continue as Advertiser
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
        <Card className="glassmorphism border-slate-700/30">
          <div className="p-4 lg:p-6 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-emerald-400 mb-2">1,247</div>
            <div className="text-slate-400 text-sm lg:text-base">Active Publishers</div>
          </div>
        </Card>
        <Card className="glassmorphism border-slate-700/30">
          <div className="p-4 lg:p-6 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-2">523</div>
            <div className="text-slate-400 text-sm lg:text-base">Active Campaigns</div>
          </div>
        </Card>
        <Card className="glassmorphism border-slate-700/30">
          <div className="p-4 lg:p-6 text-center">
            <div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2">12.5M</div>
            <div className="text-slate-400 text-sm lg:text-base">Total Views</div>
          </div>
        </Card>
      </div>
    </main>
  </div>

}

export default function DashboardPage() {
  return <Container />
}
