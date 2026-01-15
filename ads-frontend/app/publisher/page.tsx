"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Eye, TrendingUp, Download, Settings, Code, Plus, ExternalLink, ArrowUpRight, Target, Users } from "lucide-react"
import Layout from "./layout/layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useToast } from "@/hooks/use-toast"

function PublisherDashboardContent() {
  const router = useRouter()
  const { account } = useWeb3()
  const { toast } = useToast()
  const [sites, setSites] = useState<{ id: number; name: string; url: string }[]>([])
  const [sitesLoading, setSitesLoading] = useState(false)
  const [stats, setStats] = useState<{
    totalViews: number
    monthlyViews: number
    totalEarn: string
    monthlyEarn: string
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const {isDemo} = useWeb3()
  
  const [availableEarn, setAvailableEarn] = useState<{ earn: number } | null>(null)
  const [availableEarnLoading, setAvailableEarnLoading] = useState(false)
  
  // Withdraw dialog state
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  const getSites = async (wallet: string) => {
    setSitesLoading(true)
    try {
      const res = await api.get("/sites", { headers: { wallet } })
      setSites(res.data)
    } catch (err: any) {
      setSites([])
      let message = "An unexpected error occurred."
      if (err?.response?.data?.error?.message) {
        message = err.response.data.error.message
      }
      toast({
        title: "Sites could not be loaded!",
        description: message,
      })
    } finally {
      setSitesLoading(false)
    }
  }

  const getStats = async (wallet: string) => {
    setStatsLoading(true)
    try {
      const res = await api.get("/publisher/stats", { headers: { wallet } })
      setStats(res.data)
    } catch (err: any) {
      setStats(null)
      let message = "An unexpected error occurred."
      if (err?.response?.data?.error?.message) {
        message = err.response.data.error.message
      }
      toast({
        title: "Statistics could not be loaded!",
        description: message,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const getAvailableEarn = async (wallet: string) => {
    setAvailableEarnLoading(true)
    try {
      const res = await api.get("/publisher/available-earn", { headers: { wallet } })
      setAvailableEarn(res.data)
    } catch (err: any) {
      setAvailableEarn(null)
      let message = "An unexpected error occurred."
      if (err?.response?.data?.error?.message) {
        message = err.response.data.error.message
      }
      toast({
        title: "Available earnings information could not be retrieved!",
        description: message,
      })
    } finally {
      setAvailableEarnLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!account || !availableEarn) return
    
    setWithdrawLoading(true)
    setWithdrawError(null) // Clear error state
    
    try {
      const response = await api.post("/publisher/withdraw", {}, { headers: { wallet: account } })
      
      console.log("Withdraw response:", response)
      
      // Close dialog immediately
      setWithdrawDialogOpen(false)
      
      // Show toast message
      toast({
        title: "Revenue withdrawal process initiated!",
        description: `${availableEarn.earn} ETH withdrawal process has been initiated. Balance will be updated after the transaction is completed.`,
      })
      
      // Refresh available balance information
      await getAvailableEarn(account)
      
    } catch (error: any) {
      console.error("Withdraw error:", error)
      let message = "An unexpected error occurred."
      if (error?.response?.data?.error?.message) {
        message = error.response.data.error.message
      }
      
      // Set error state
      setWithdrawError(message)
      
      // Show toast message
      toast({
        title: "Revenue withdrawal process could not be initiated!",
        description: message,
      })
    } finally {
      setWithdrawLoading(false)
    }
  }

  useEffect(() => {
    if (account) {
      getSites(account)
      getStats(account)
      getAvailableEarn(account)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  // Dynamic dashboard data based on API response
  const dashboardData = [
    {
      title: "Total Revenue",
      value: statsLoading ? "..." : (stats ? `${stats.totalEarn} ETH` : "0 ETH"),
      change: "+0%",
      description: "from last month",
      icon: DollarSign,
      color: "emerald"
    },
    {
      title: "Monthly Revenue",
      value: statsLoading ? "..." : (stats ? `${stats.monthlyEarn} ETH` : "0 ETH"),
      change: "+0%",
      description: "from last month",
      icon: TrendingUp,
      color: "cyan"
    },
    { 
      title: "Total Views", 
      value: statsLoading ? "..." : (stats ? stats.totalViews.toLocaleString() : "0"), 
      change: "+0%", 
      description: "from last month",
      icon: Eye,
      color: "purple"
    },
    { 
      title: "Monthly Views", 
      value: statsLoading ? "..." : (stats ? stats.monthlyViews.toLocaleString() : "0"), 
      change: "+0%", 
      description: "from last month",
      icon: Users,
      color: "blue"
    },
  ]

return <Layout>
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
                  {/* Sites Table */}
                  <Card className="glassmorphism border-slate-700/30 lg:col-span-2">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Your Sites</h3>
                          <p className="text-sm text-slate-400 hidden sm:block">Manage your registered websites</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-emerald-500 to-cyan-600 w-full sm:w-auto"
                            onClick={() => router.push("/publisher/create-site")}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="sm:hidden">Add Site</span>
                            <span className="hidden sm:inline">New Site</span>
                          </Button>
                        </div>
                      </div>
                      
                      {sitesLoading ? (
                        <div className="py-8 sm:py-12 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400 mx-auto"></div>
                          <p className="text-slate-400 mt-3 text-sm">Loading sites...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sites.length > 0 ? (
                            sites.map((site) => (
                              <div key={site.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-800/50 transition-colors space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{site.name}</h4>
                                    <p className="text-sm text-slate-400 truncate">{site.url}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                      Active
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-slate-400 hover:text-white flex-shrink-0"
                                      onClick={() => window.open(site.url, '_blank')}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="ml-1 text-xs hidden sm:inline">Visit</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-slate-400 hover:text-white flex-shrink-0"
                                      onClick={() => router.push(`/publisher/site/${site.id}`)}
                                    >
                                      <ArrowUpRight className="h-4 w-4" />
                                      <span className="ml-1 text-xs hidden sm:inline">View</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 sm:py-12">
                              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="h-6 w-6 text-slate-400" />
                              </div>
                              <h4 className="text-lg font-medium text-white mb-2">No sites added</h4>
                              <p className="text-slate-400 mb-4 text-sm px-4">Add your first website to start earning</p>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-emerald-500 to-cyan-600 w-full sm:w-auto"
                                onClick={() => router.push("/publisher/create-site")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Site
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
                      <h3 className="text-lg font-semibold text-white mb-4">Revenue Withdrawal</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                          <div className="text-sm text-slate-400 mb-1">Available Balance</div>
                          <div className="text-lg font-bold text-emerald-400">
                            {availableEarnLoading ? "Loading..." : (availableEarn ? `${availableEarn.earn} ETH` : "0 ETH")}
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setWithdrawDialogOpen(true)
                            setWithdrawError(null)
                          }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Withdraw ETH
                        </Button>
                      </div>
                    </Card>

                    <Card className="glassmorphism border-slate-700/30 p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => router.push("/publisher/create-site")}
                          className="w-full flex items-center justify-center sm:justify-start space-x-3 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-600/10 border border-emerald-500/20 rounded-lg hover:from-emerald-500/20 hover:to-cyan-600/20 transition-all"
                        >
                          <Plus className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm font-medium text-white">Add New Site</span>
                        </button>
                        <button
                          onClick={() => router.push("/publisher/integration")}
                          className="w-full flex items-center justify-center sm:justify-start space-x-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-all"
                        >
                          <Code className="h-5 w-5 text-cyan-400" />
                          <span className="text-sm font-medium text-white">SDK Integration</span>
                        </button>
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
                            <p className="text-sm text-white">Site "MyBlog" earned 0.003 ETH</p>
                            <p className="text-xs text-slate-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">New ad impression milestone reached</p>
                            <p className="text-xs text-slate-400">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">SDK updated to v2.1</p>
                            <p className="text-xs text-slate-400">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
        {/* Withdraw Dialog */}
        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogContent className="glassmorphism border-slate-700/50 bg-slate-900/90">
            <DialogHeader>
              <DialogTitle className="text-white">Revenue Withdrawal Confirmation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-slate-300 mb-2">Amount you want to withdraw:</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {availableEarn ? `${availableEarn.earn} ETH` : "0 ETH"}
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <h4 className="text-slate-300 font-medium mb-3 text-sm">⚠️ Important Information</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Revenue withdrawal process cannot be reversed</p>
                  <p>• Transaction is completed after blockchain confirmation</p>
                  <p>• Network fees will be deducted from your amount</p>
                  <p>• Processing time: 1-5 minutes</p>
                </div>
              </div>
              
              {/* Error Message */}
              {withdrawError && (
                <div className="bg-red-950/30 rounded-lg p-4 border border-red-800/50">
                  <h4 className="text-red-300 font-medium mb-3 text-sm">❌ Error</h4>
                  <p className="text-red-200 text-sm">{withdrawError}</p>
                </div>
              )}
              
              <div className="flex space-x-3 pt-2">
                {!isDemo ?  <Button
                  onClick={handleWithdraw}
                  disabled={withdrawLoading || !availableEarn || availableEarn.earn <= 0}
                  className="gradient-red-orange hover:glow-red text-white flex-1"
                >
                  {withdrawLoading ? "Processing..." : "Withdraw Revenue"}
                </Button> : <Button className="gradient-red-orange hover:glow-red text-white flex-1">Logged in with demo account withdraw wont work</Button>}
               
                <Button
                  variant="outline"
                  onClick={() => setWithdrawDialogOpen(false)}
                  className="border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </Layout>
}

export default function PublisherDashboard() {
  return <AuthGuard>
    <PublisherDashboardContent />
  </AuthGuard>
}