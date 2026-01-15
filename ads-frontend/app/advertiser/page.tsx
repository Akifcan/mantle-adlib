"use client"

import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/ui/dashboard-card"
import Link from "next/link"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, Eye, MousePointer, TrendingUp, Zap, Plus, Settings, Play, Pause, BarChart3, Users, Calendar, Target, Activity, ArrowUpRight, Filter, Search } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { api } from "@/lib/api"
import { useWeb3 } from "@/components/providers/web3-provider"
import { useEffect, useState } from "react"
import { APP_NAME } from "@/lib/constants"
import Layout from "./layout/layout"

type Campaign = {
  id: number;
  name: string;
  adTitle: string;
  adDescription: string;
  target: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const AdvertiserDashboardContent = () => {
  const router = useRouter()
  const { account } = useWeb3()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<{ createdCampaigns: number; activeCampaigns: number; totalCampaignViews: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const getStats = async () => {
    setStatsLoading(true)
    try {
      const res = await api.get("/advertiser/stats")
      setStats(res.data)
    } catch {
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  const getCampaigns = async (wallet: string) => {
    setLoading(true)
    try {
      const res = await api.get("/campaign", { headers: { wallet } })
      setCampaigns(res.data)
    } catch (e) {
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!account) return
    getCampaigns(account)
  }, [account])


  useEffect(() => {
    getStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dashboardData = [
    {
      title: "Total Campaigns",
      value: statsLoading ? "..." : (stats ? String(stats.createdCampaigns) : "-"),
      change: "+12%",
      description: "from last month",
      icon: Target,
      color: "blue"
    },
    {
      title: "Active Campaigns",
      value: statsLoading ? "..." : (stats ? String(stats.activeCampaigns) : "-"),
      change: "+8%", 
      description: "from last month",
      icon: Play,
      color: "emerald"
    },
    // { 
    //   title: "Total Impressions", 
    //   value: statsLoading ? "..." : (stats ? stats.totalCampaignViews.toLocaleString() : "-"), 
    //   change: "+23%", 
    //   description: "from last month",
    //   icon: Eye,
    //   color: "purple"
    // },
    // {
    //   title: "Click Rate",
    //   value: "3.2%",
    //   change: "+0.4%",
    //   description: "from last month",
    //   icon: MousePointer,
    //   color: "orange"
    // }
  ]

  return <Layout>
    <main className="relative z-10 p-4 sm:p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {dashboardData.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} className="glassmorphism border-slate-700/30 p-3 sm:p-4">
                <div className="flex items-center justify-between sm:flex-col sm:items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg bg-${metric.color}-500/10`}>
                        <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 text-${metric.color}-400`} />
                      </div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide hidden sm:block">{metric.title}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 sm:hidden">{metric.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mb-1">{metric.value}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-emerald-400">{metric.change}</span>
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-slate-400 hidden sm:inline">{metric.description}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Campaigns Table */}
          <Card className="glassmorphism border-slate-700/30 lg:col-span-2">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">Campaign Overview</h3>
                  <p className="text-sm text-slate-400 hidden sm:block">Manage your active advertising campaigns</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 w-full sm:w-auto"
                    onClick={() => router.push("/advertiser/create-campaign")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="sm:hidden">Create Campaign</span>
                    <span className="hidden sm:inline">New</span>
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="py-8 sm:py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-slate-400 mt-3 text-sm">Loading campaigns...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-800/50 transition-colors space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{campaign.name}</h4>
                            <p className="text-sm text-slate-400 truncate">{campaign.adTitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                              {campaign.target}
                            </Badge>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              Active
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-slate-400 hover:text-white flex-shrink-0"
                            onClick={() => router.push(`/advertiser/campaign/${campaign.id}`)}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="ml-1 text-xs hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-6 w-6 text-slate-400" />
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">No campaigns found</h4>
                      <p className="text-slate-400 mb-4 text-sm px-4">Create your first campaign to get started</p>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 w-full sm:w-auto"
                        onClick={() => router.push("/advertiser/create-campaign")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions & Stats */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="glassmorphism border-slate-700/30 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push("/advertiser/create-campaign")}
                  className="w-full flex items-center justify-center sm:justify-start space-x-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-lg hover:from-blue-500/20 hover:to-purple-600/20 transition-all"
                >
                  <Plus className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">New Campaign</span>
                </button>
                <div className="w-full flex items-center justify-center sm:justify-start space-x-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">View Analytics</span>
                </div>
                <div className="w-full flex items-center justify-center sm:justify-start space-x-3 p-3 bg-slate-800/50 border border-slate-700/30 rounded-lg hover:bg-slate-800 transition-all cursor-pointer">
                  <Settings className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-white">Settings</span>
                </div>
              </div>
            </Card>

            <Card className="glassmorphism border-slate-700/30 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">Campaign "Summer Sale" went live</p>
                    <p className="text-xs text-slate-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">New impression milestone reached</p>
                    <p className="text-xs text-slate-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">Budget updated for "Tech Launch"</p>
                    <p className="text-xs text-slate-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
  </Layout>
}


export default function AdvertiserDashboard() {
  return <AuthGuard>
    <AdvertiserDashboardContent />
  </AuthGuard>

}
