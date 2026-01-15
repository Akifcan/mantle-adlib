"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useWeb3 } from "@/components/providers/web3-provider"
import Layout from "../layout/layout"
import { ArrowLeft, Plus, Globe, CheckCircle, Info } from "lucide-react"

function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function CreateSiteContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { account } = useWeb3()
  const [form, setForm] = useState({ name: "", url: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/sites", form, { headers: { wallet: account } })
      toast({
        title: "Your site has been created!",
        description: "Redirecting...",
      })
      router.push(`/publisher/site/${res.data.id}`)
    } catch (err: any) {
      let message = "An unexpected error occurred."
      if (err?.response?.data?.error?.message) {
        message = err.response.data.error.message
      }
      toast({
        title: "Site could not be added!",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
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
                <h1 className="text-2xl font-bold text-white">Add New Site</h1>
                <p className="text-slate-400 text-sm">Register your website to start earning</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Site Information Card */}
              <Card className="glassmorphism border-slate-700/30">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Site Information</h3>
                      <p className="text-slate-400 text-sm">Enter your website details</p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-300 font-medium mb-2 block">
                        Site Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={100}
                        required
                        placeholder="e.g., My Blog, Tech News Site"
                        className="bg-slate-800/50 border-slate-600 text-white h-11"
                        disabled={loading}
                      />
                      <p className="text-slate-400 text-xs mt-1">Choose a memorable name for your site</p>
                    </div>
                    <div>
                      <Label htmlFor="url" className="text-slate-300 font-medium mb-2 block">
                        Site URL
                      </Label>
                      <Input
                        id="url"
                        name="url"
                        value={form.url}
                        onChange={handleChange}
                        type="url"
                        required
                        placeholder="https://example.com"
                        className="bg-slate-800/50 border-slate-600 text-white h-11"
                        disabled={loading}
                      />
                      <p className="text-slate-400 text-xs mt-1">Must be a valid URL starting with https://</p>
                    </div>
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 h-12 text-lg font-medium"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Adding Site...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Plus className="h-5 w-5" />
                            <span>Add Site</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="glassmorphism border-slate-700/30">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
                    What happens next?
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 font-bold text-xs">1</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">API Key Generated</div>
                        <div className="text-slate-400">Unique key for your site</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 font-bold text-xs">2</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">SDK Integration</div>
                        <div className="text-slate-400">Add ads to your website</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 font-bold text-xs">3</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Start Earning</div>
                        <div className="text-slate-400">Revenue from ad views</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Requirements */}
              <Card className="glassmorphism border-slate-700/30">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-cyan-400" />
                    Requirements
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Valid Domain</div>
                        <div className="text-slate-400">Must be accessible via HTTPS</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Content Policy</div>
                        <div className="text-slate-400">Family-friendly content only</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Active Website</div>
                        <div className="text-slate-400">Regular traffic and updates</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
} 

export default function CreateSitePage() {
  return <CreateSiteContent />
}