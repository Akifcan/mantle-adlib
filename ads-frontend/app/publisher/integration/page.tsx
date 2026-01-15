"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Code, Download, ArrowLeft, Terminal, BookOpen, Zap } from "lucide-react"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth/auth-guard"
import Layout from "../layout/layout"

function IntegrationPageContent() {
  const { isConnected, account } = useWeb3()
  const router = useRouter()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [sites, setSites] = useState<{ id: number; name: string }[]>([])
  const [selectedSite, setSelectedSite] = useState<number | null>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [loadingSites, setLoadingSites] = useState(false)
  const [loadingKey, setLoadingKey] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  useEffect(() => {
    const fetchSites = async () => {
      if (!account) return
      setLoadingSites(true)
      try {
        const res = await api.get("/sites", { headers: { wallet: account } })
        setSites(res.data)
      } catch {
        setSites([])
      } finally {
        setLoadingSites(false)
      }
    }
    fetchSites()
  }, [account])

  useEffect(() => {
    const fetchApiKey = async () => {
      if (!selectedSite || !account) {
        setApiKey("")
        return
      }
      setLoadingKey(true)
      try {
        const res = await api.get(`/sites/${selectedSite}`, { headers: { wallet: account } })
        setApiKey(res.data.apiKey)
      } catch {
        setApiKey("")
      } finally {
        setLoadingKey(false)
      }
    }
    fetchApiKey()
  }, [selectedSite, account])

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const npmInstallCode = `npm install @adlib/sdk`

  const reactCode = `import { AdLib } from '@adlib/sdk'

function App() {
  return (
    <div>
      <AdLib
        apiKey="${apiKey || 'your-api-key'}"
        adUnitId="banner-top"
        size="728x90"
        className="my-4"
      />
    </div>
  )
}`

  const vanillaJsCode = `<script src="https://cdn.adlib.com/sdk.js"></script>
<div id="ad-banner"></div>

<script>
  AdLib.init({
    apiKey: '${apiKey || 'your-api-key'}'
  })
  
  Web3Ads.createUnit({
    containerId: 'web3-ad-banner',
    adUnitId: 'banner-top',
    size: '728x90'
  })
</script>`

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => router.push("/publisher")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <div className="h-4 w-px bg-slate-700"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">SDK Integration</h1>
              <p className="text-slate-400 text-sm">Integrate our SDK into your website</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Integration Guide */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site Selection Card */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Site Configuration</h3>
                    <p className="text-slate-400 text-sm">Select your site and get API key</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">Select Site</label>
                    <select
                      className="w-full p-3 rounded-lg bg-slate-800/50 border-slate-600 text-white h-11"
                      value={selectedSite ?? ""}
                      onChange={e => setSelectedSite(Number(e.target.value) || null)}
                      disabled={loadingSites}
                    >
                      <option value="">Select a site...</option>
                      {sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">API Key</label>
                    <div className="relative">
                      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white font-mono flex items-center justify-between">
                        <span className="text-sm truncate mr-2">{loadingKey ? "Loading..." : (apiKey || "Select a site")}</span>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(apiKey, "apiKey")} disabled={!apiKey} className="flex-shrink-0">
                          {copiedCode === "apiKey" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Installation Card */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Terminal className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Installation</h3>
                    <p className="text-slate-400 text-sm">Install the SDK package</p>
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-medium mb-2 block">Install with NPM</label>
                  <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-emerald-400 font-mono flex items-center justify-between">
                    <span className="text-sm">{npmInstallCode}</span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(npmInstallCode, "npm")} className="flex-shrink-0">
                      {copiedCode === "npm" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Code Examples Card */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Implementation Examples</h3>
                    <p className="text-slate-400 text-sm">Code examples for different frameworks</p>
                  </div>
                </div>
                <Tabs defaultValue="react" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="react">React</TabsTrigger>
                    <TabsTrigger value="vanilla">Vanilla JS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="react" className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium block">Usage with React</label>
                      <div className="relative">
                        <pre className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-white font-mono text-xs overflow-x-auto">
                          <code>{reactCode}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute top-3 right-3" 
                          onClick={() => copyToClipboard(reactCode, "react")}
                        >
                          {copiedCode === "react" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="vanilla" className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium block">Usage with Vanilla JS</label>
                      <div className="relative">
                        <pre className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-white font-mono text-xs overflow-x-auto">
                          <code>{vanillaJsCode}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute top-3 right-3" 
                          onClick={() => copyToClipboard(vanillaJsCode, "vanilla")}
                        >
                          {copiedCode === "vanilla" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-emerald-400" />
                  SDK Features
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Easy Integration</div>
                      <div className="text-slate-400">Simple copy-paste integration</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Real-time Earnings</div>
                      <div className="text-slate-400">Track revenue in real-time</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Multiple Formats</div>
                      <div className="text-slate-400">Banner, popup, and reward ads</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Support */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">Having trouble with integration? We're here to help!</p>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50">
                    <Download className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50">
                    <Code className="h-4 w-4 mr-2" />
                    Examples
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function IntegrationPage() {
  return <AuthGuard>
    <IntegrationPageContent />
  </AuthGuard>
}