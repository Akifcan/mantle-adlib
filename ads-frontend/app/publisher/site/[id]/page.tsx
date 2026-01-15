"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowLeft, Copy, Check, Globe, DollarSign, Eye, BarChart3, Code, ExternalLink, Key, Terminal, BookOpen } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"
import Layout from "../../layout/layout"

const mockEarningsData = [
  { date: "01", earnings: 0.02 },
  { date: "02", earnings: 0.03 },
  { date: "03", earnings: 0.01 },
  { date: "04", earnings: 0.04 },
  { date: "05", earnings: 0.02 },
  { date: "06", earnings: 0.05 },
  { date: "07", earnings: 0.03 },
]

function SiteDetailContent() {
  const router = useRouter()
  const params = useParams()
  const { account } = useWeb3()
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const fetchSite = async () => {
      if (!params?.id || !account) return
      setLoading(true)
      try {
        const res = await api.get(`/sites/${params.id}`, { headers: { wallet: account } })
        setSite(res.data)
      } catch {
        setSite(null)
      } finally {
        setLoading(false)
      }
    }
    fetchSite()
  }, [params?.id, account])

  const npmInstallCode = `npm install @adlib/sdk`
  const reactCode = `import { AdLib } from '@adlib/sdk'

function App() {
  return (
    <div>
      <AdLib
        apiKey="${site?.apiKey || 'your-api-key'}"
        adUnitId="banner-top"
        size="728x90"
        className="my-4"
      />
    </div>
  )
}`
  const vanillaJsCode = `<script src="https://cdn.web3ads.com/sdk.js"></script>
<div id="web3-ad-banner"></div>

<script>
  Web3Ads.init({
    apiKey: '${site?.apiKey || 'your-api-key'}'
  })
  
  Web3Ads.createAdUnit({
    containerId: 'web3-ad-banner',
    adUnitId: 'banner-top',
    size: '728x90'
  })
</script>`
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return <Layout>
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white self-start" onClick={() => router.push("/publisher")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="hidden sm:block h-4 w-px bg-slate-700"></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{loading ? "Loading..." : site?.name || "Site Details"}</h1>
            <p className="text-slate-400 text-sm">Performance analytics and integration</p>
          </div>
        </div>
        {site && (
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 self-start sm:self-auto" onClick={() => window.open(site.url, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Site
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading site details...</p>
        </div>
      ) : site ? (
        <>
          {/* Site Info Card */}
          <Card className="glassmorphism border-slate-700/30">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Site Information</h3>
                  <p className="text-slate-400 text-sm">Basic details and configuration</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Site Name</label>
                    <p className="text-white font-semibold break-words">{site.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Website URL</label>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1 break-all">
                      <span className="truncate">{site.url}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Created</label>
                    <p className="text-white text-sm sm:text-base">{new Date(site.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-medium">Last Updated</label>
                    <p className="text-white text-sm sm:text-base">{new Date(site.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
                    <p className="text-slate-400 text-sm">All-time earnings</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-400">0.123 ETH</div>
                <p className="text-slate-400 text-sm mt-1">≈ $245.67 USD</p>
              </div>
            </Card>
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Total Views</h3>
                    <p className="text-slate-400 text-sm">Ad impressions</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-400">12,345</div>
                <p className="text-slate-400 text-sm mt-1">+15% this month</p>
              </div>
            </Card>
          </div>

          {/* Revenue Analytics */}
          <Card className="glassmorphism border-slate-700/30">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Daily Revenue Analytics</h3>
                  <p className="text-slate-400 text-sm">Last 7 days performance</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockEarningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="earnings" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Integration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Configuration */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Key className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">API Configuration</h3>
                    <p className="text-slate-400 text-sm">Your unique site credentials</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">API Key</label>
                    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white font-mono flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm truncate min-w-0">{site?.apiKey || "Loading..."}</span>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(site?.apiKey || '', "apiKey")} disabled={!site?.apiKey} className="flex-shrink-0">
                        {copiedCode === "apiKey" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">Installation Command</label>
                    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-emerald-400 font-mono flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm truncate min-w-0">{npmInstallCode}</span>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(npmInstallCode, "npm")} className="flex-shrink-0">
                        {copiedCode === "npm" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Code Examples */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Implementation</h3>
                    <p className="text-slate-400 text-sm">Ready-to-use code examples</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block flex items-center space-x-2">
                      <Terminal className="h-4 w-4" />
                      <span>React Implementation</span>
                    </label>
                    <div className="relative">
                      <pre className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 pr-14 text-white font-mono text-xs overflow-x-auto">
                        <code>{reactCode}</code>
                      </pre>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute top-2 right-2 z-10" 
                        onClick={() => copyToClipboard(reactCode, "react")}
                      >
                        {copiedCode === "react" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Vanilla JavaScript</span>
                    </label>
                    <div className="relative">
                      <pre className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 pr-14 text-white font-mono text-xs overflow-x-auto">
                        <code>{vanillaJsCode}</code>
                      </pre>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute top-2 right-2 z-10" 
                        onClick={() => copyToClipboard(vanillaJsCode, "vanilla")}
                      >
                        {copiedCode === "vanilla" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="glassmorphism border-slate-700/30">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Site not found</h3>
            <p className="text-slate-400 mb-6">The requested site could not be found or you don't have access to it.</p>
            <Button onClick={() => router.push("/publisher")} className="bg-gradient-to-r from-emerald-500 to-cyan-600">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  </Layout>
} 

export default function SiteDetailPage() {
  return <AuthGuard>
    <SiteDetailContent />
  </AuthGuard>
}