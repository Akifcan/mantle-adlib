"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Clock, Eye, Target as TargetIcon, Wallet, Copy, ExternalLink, ChevronDown, MoreVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AuthGuard } from "@/components/auth/auth-guard"
import Web3AdvertiserComponent from "@/components/package/Web3AdvertiserComponent"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/components/providers/web3-provider"
import { ethers } from "ethers"
import Layout from "../../layout/layout"
import { ABI } from "@/lib/abi"

type Variant = {
  id: number;
  type: string;
  url: string;
  title?: string;
  subtitle?: string;
  redirectLink?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Campaign = {
  id: number;
  name: string;
  adTitle: string;
  adDescription: string;
  target: string;
  totalAmount: string;
  totalView: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  variants: Variant[];
};

type Transaction = {
  id: number;
  transaction: string;
  createdAt: string;
  serviceFee: string;
  amount: string;
  totalFee: string;
  updatedAt: string;
  deletedAt: string | null;
};



function CampaignDetailContent() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const { account } = useWeb3()
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txLoading, setTxLoading] = useState(true)
  const { toast } = useToast()

  // Modal state for image preview
  const [openImage, setOpenImage] = useState<{ url: string; type: string } | null>(null)

  // Budget dialog state
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetLoading, setBudgetLoading] = useState(false)

  // Fee preview state
  const [feePreview, setFeePreview] = useState<{ serviceFee: string; totalFee: string; amount: string } | null>(null)
  const [feeLoading, setFeeLoading] = useState(false)

  // AI Personalization state
  const [aiPersonalizationEnabled, setAiPersonalizationEnabled] = useState(false)

  // Contract refs
  const contract = useRef<ethers.Contract | null>(null)
  const signer = useRef<ethers.JsonRpcSigner | null>(null)

  const getCampaign = async (campaignId: string) => {
    setLoading(true)
    try {
      const res = await api.get(`/campaign/${campaignId}`)
      setCampaign(res.data.campaign)
    } catch (e) {
      setCampaign(null)
      toast({
        title: "Campaign details could not be retrieved!",
        description: "An error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTransactions = async (campaignId: string) => {
    setTxLoading(true)
    try {
      const res = await api.get(`/campaign/${campaignId}/transactions`)
      setTransactions(res.data)
    } catch (e) {
      setTransactions([])
      toast({
        title: "Transactions could not be retrieved!",
        description: "An error occurred. Please try again.",
      })
    } finally {
      setTxLoading(false)
    }
  }

  // Fee preview function
  const getFeePreview = async (budget: string) => {
    setFeeLoading(true)
    try {
      const res = await api.post("/campaign/fee-preview", { budget })
      setFeePreview(res.data)
    } catch (error) {
      console.error("Fee preview error:", error)
      setFeePreview(null)
    } finally {
      setFeeLoading(false)
    }
  }

  // Initialize contract
  const initializeContract = async () => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      signer.current = await provider.getSigner()
            const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AD_CONTRACT_ADDRESS

    
      contract.current = new ethers.Contract(CONTRACT_ADDRESS!, ABI, signer.current)
    } catch (error) {
      console.error("Contract initialization error:", error)
    }
  }

  // Add budget function
  const handleAddBudget = async () => {
    if (!budgetAmount || !contract.current) return

    setBudgetLoading(true)
    try {
      // Budget + service fee total
      const totalAmount = (parseFloat(budgetAmount) + parseFloat(feePreview?.serviceFee || "0")).toString()

      // First send money to smart contract
      const tx = await contract.current.sendToMasterWallet(
        {
          value: ethers.parseEther(totalAmount),
        }
      )

      const receipt = await tx.wait()
      const log = receipt.logs[0]

      // Send budget addition request to API
      const response = await api.patch(`/campaign/${id}/budget`, {
        budget: budgetAmount,
        transaction: tx.hash
      })

      if (response.status === 200) {
        toast({
          title: "Budget added successfully!",
          description: `${budgetAmount} ETH added to campaign.`,
        })

        // Refresh campaign data
        await getCampaign(id as string)

        // Close dialog
        setBudgetDialogOpen(false)
        setBudgetAmount("")
      }
    } catch (error: any) {
      console.error("Budget addition error:", error)
      toast({
        title: "Budget could not be added!",
        description: error?.message || "An error occurred. Please try again.",
      })
    } finally {
      setBudgetLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    Promise.all([
      getCampaign(id as string),
      getTransactions(id as string)
    ])
  }, [id])

  useEffect(() => {
    if (account) {
      initializeContract()
    }
  }, [account])

  // Debounced fee preview API call
  useEffect(() => {
    if (!budgetAmount || isNaN(Number(budgetAmount)) || Number(budgetAmount) <= 0) {
      setFeePreview(null)
      return
    }

    const timeoutId = setTimeout(() => {
      getFeePreview(budgetAmount)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [budgetAmount])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => router.push("/advertiser")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <div className="h-4 w-px bg-slate-700"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">{loading ? "Loading..." : campaign?.name || "Campaign Details"}</h1>
              <p className="text-slate-400 text-sm">Manage and monitor your campaign performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setBudgetDialogOpen(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : campaign ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glassmorphism border-slate-700/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Wallet className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Budget</p>
                    <p className="text-lg font-bold text-white">{parseFloat(campaign.totalAmount).toFixed(4)} ETH</p>
                  </div>
                </div>
              </Card>
              <Card className="glassmorphism border-slate-700/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Eye className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Views</p>
                    <p className="text-lg font-bold text-white">{campaign.totalView?.toLocaleString() || "0"}</p>
                  </div>
                </div>
              </Card>
              <Card className="glassmorphism border-slate-700/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <TargetIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Category</p>
                    <p className="text-lg font-bold text-white capitalize">{campaign.target}</p>
                  </div>
                </div>
              </Card>
              <Card className="glassmorphism border-slate-700/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Created</p>
                    <p className="text-lg font-bold text-white">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Campaign Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <Card className="glassmorphism border-slate-700/30">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Campaign Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wide">Campaign Name</label>
                          <p className="text-white font-medium mt-1">{campaign.name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wide">Ad Title</label>
                          <p className="text-white font-medium mt-1">{campaign.adTitle}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 uppercase tracking-wide">Description</label>
                        <p className="text-slate-300 mt-1">{campaign.adDescription}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Creative Variants */}
                <Card className="glassmorphism border-slate-700/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Creative Variants</h3>
                      <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                        {campaign.variants?.length || 0} variants
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {campaign.variants && campaign.variants.length > 0 ? campaign.variants.map((v) => (
                        <div key={v.id} className="border border-slate-700/30 rounded-lg p-4 hover:border-slate-600/50 transition-colors">
                          <div className="flex items-start space-x-4">
                            {/* Image Preview */}
                            <div className="relative">
                              <img
                                src={v.url}
                                alt={v.type}
                                className="h-16 w-16 object-cover rounded-lg border border-slate-600 cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setOpenImage({ url: v.url, type: v.type })}
                              />
                              <Badge 
                                className="absolute -top-2 -right-2 text-xs"
                                style={{
                                  backgroundColor: v.type === "popup" ? "#7c3aed" :
                                    v.type === "reward" ? "#10b981" :
                                      v.type === "square" ? "#3b82f6" : "#f59e0b",
                                  color: "white"
                                }}
                              >
                                {v.type}
                              </Badge>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  {v.title && (
                                    <h4 className="text-white font-medium">{v.title}</h4>
                                  )}
                                  {v.subtitle && (
                                    <p className="text-slate-400 text-sm">{v.subtitle}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  {v.redirectLink && (
                                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {v.redirectLink && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-slate-500">Redirect:</span>
                                  <a
                                    href={v.redirectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 text-xs hover:underline truncate max-w-xs"
                                  >
                                    {v.redirectLink}
                                  </a>
                                </div>
                              )}

                              {/* Integration Accordion */}
                              <div className="mt-3">
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="integration" className="border-slate-700/30">
                                    <AccordionTrigger className="text-slate-300 hover:text-white text-sm py-2 hover:no-underline">
                                      <div className="flex items-center space-x-2">
                                        <span>🔗</span>
                                        <span>Integration & Preview</span>
                                      </div>
                                      <ChevronDown className="h-4 w-4" />
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                      <div className="space-y-4">
                                        {/* Component Example */}
                                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                                          <h4 className="text-slate-300 font-medium mb-3 text-sm">🚀 Live Preview</h4>
                                          <div className="flex justify-center items-center min-h-[200px] bg-slate-800/30 rounded-lg border border-slate-600">
                                            {v.type !== 'reward' && v.type !== 'popup' ? (
                                              <Web3AdvertiserComponent
                                                id={v.id}
                                                type={v.type}
                                              />
                                            ) : <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] p-6">
                                              {/* Timer ve kapatma butonu */}

                                              {v.type === 'popup' && (
                                                <>
                                                  <div className="absolute -top-3 -right-3 flex flex-col items-center gap-2">
                                                    {/* Timer göstergesi */}
                                                    <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                                      15s
                                                    </div>

                                                    {/* Kapatma butonu */}
                                                    <button
                                                      className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors shadow-lg`}
                                                    >
                                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                      </svg>
                                                    </button>
                                                  </div>

                                                  {/* Reward Badge */}
                                                  <div className="absolute top-4 left-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    REWARD
                                                  </div>
                                                </>
                                              )}



                                              {/* Reklam resmi - img tag ile */}
                                              <div className="flex items-center justify-center min-h-[300px] mt-8 relative">
                                                {v.url ? (
                                                  <div className="relative group cursor-pointer" onClick={() => {
                                                    if (v.redirectLink) {
                                                      window.open(v.redirectLink, '_blank')
                                                    }
                                                  }}>
                                                    <img
                                                      src={v.url}
                                                      alt="Reward Advertisement"
                                                      className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                                                      onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                      }}
                                                      onLoad={(e) => {
                                                        console.log('Reward ad image loaded:', v.url)
                                                      }}
                                                    />

                                                    {/* Title/Subtitle overlay - sol alt */}
                                                    {(v.title || v.subtitle) && (
                                                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg max-w-[300px]">
                                                        {v.title && (
                                                          <h3 className="font-bold text-lg mb-1">{v.title}</h3>
                                                        )}
                                                        {v.subtitle && (
                                                          <p className="text-sm text-gray-200">{v.subtitle}</p>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center justify-center min-h-[300px] text-gray-500">
                                                    <p>Reward reklamı yüklenemedi</p>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Info etiketi - sağ alt */}
                                              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                <svg
                                                  className="w-3 h-3"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                                <span>web3 ads</span>
                                              </div>


                                            </div>}

                                          </div>
                                        </div>

                                        {/* Code Example */}
                                        <div className="bg-slate-950/70 rounded-lg p-4 border border-slate-600">
                                          <h4 className="text-slate-300 font-medium mb-3 text-sm">📋 Usage Code</h4>
                                          <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                                            {`import Web3AdvertiserComponent from '@/components/package/Web3AdvertiserComponent'

// Basic usage
<AdLibAd 
  id="${v.id}"
  type="${v.type}"
/>
`}
                                          </pre>
                                        </div>



                                        {/* Features */}
                                        <div className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-800/50">
                                          <h4 className="text-emerald-300 font-medium mb-3 text-sm">✨ This Creative's Features</h4>
                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="text-slate-300">
                                              <span className="text-emerald-200">Type:</span> {v.type}
                                            </div>
                                            <div className="text-slate-300">
                                              <span className="text-emerald-200">ID:</span> {v.id}
                                            </div>
                                            {v.title && (
                                              <div className="text-slate-300 col-span-2">
                                                <span className="text-emerald-200">Title:</span> {v.title}
                                              </div>
                                            )}
                                            {v.subtitle && (
                                              <div className="text-slate-300 col-span-2">
                                                <span className="text-emerald-200">Subtitle:</span> {v.subtitle}
                                              </div>
                                            )}
                                            {v.redirectLink && (
                                              <div className="text-slate-300 col-span-2">
                                                <span className="text-emerald-200">Redirect:</span>
                                                <a href={v.redirectLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1 break-all">
                                                  {v.redirectLink}
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TargetIcon className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-slate-400">No creative variants found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* AI Personalization Section */}
                <Card className="glassmorphism border-slate-700/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">AI Personalization</h3>
                          <p className="text-slate-400 text-sm">Optimize ads for different audiences</p>
                        </div>
                      </div>

                      {/* AI Personalization Switch */}
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs ${aiPersonalizationEnabled ? 'text-slate-400' : 'text-slate-300'}`}>Off</span>
                        <Switch
                          checked={aiPersonalizationEnabled}
                          onCheckedChange={setAiPersonalizationEnabled}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
                        />
                        <span className={`text-xs ${aiPersonalizationEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>On</span>
                      </div>
                    </div>

                    {/* AI Personalization Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                        <div className="text-xl mb-2">🎯</div>
                        <h4 className="text-white font-medium mb-2 text-sm">Smart Targeting</h4>
                        <p className="text-slate-400 text-xs">AI analyzes user behavior automatically</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                        <div className="text-xl mb-2">📈</div>
                        <h4 className="text-white font-medium mb-2 text-sm">Higher CTR</h4>
                        <p className="text-slate-400 text-xs">Personalized content improves engagement</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                        <div className="text-xl mb-2">⚡</div>
                        <h4 className="text-white font-medium mb-2 text-sm">Auto-Optimization</h4>
                        <p className="text-slate-400 text-xs">Content adapts to demographics</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`p-3 rounded-lg border transition-all duration-300 ${aiPersonalizationEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-slate-800/30 border-slate-700/30'
                      }`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${aiPersonalizationEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></div>
                        <span className={`text-sm ${aiPersonalizationEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {aiPersonalizationEnabled 
                            ? `AI is optimizing for ${campaign?.target || 'fashion'} audience`
                            : `Ready to optimize for ${campaign?.target || 'fashion'} audience`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Transactions Section */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                    {transactions.length} transactions
                  </Badge>
                </div>
                {txLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {transactions.length > 0 ? (
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-slate-700/30">
                            <th className="text-left py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wide">Transaction</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wide">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wide">Amount</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wide">Fee</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wide">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {transactions.map((t, i) => (
                            <tr key={t.id} className="hover:bg-slate-800/20">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <code className="text-cyan-400 text-sm">{t.transaction.slice(0, 10)}...{t.transaction.slice(-8)}</code>
                                  <Button onClick={async() => {
                                    await navigator.clipboard.writeText(t.transaction)
                                    alert('copied transaction to clipboard!')
                                  }} size="sm" variant="ghost" className="text-slate-400 hover:text-white p-1">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-white font-mono text-sm">{t.amount} ETH</td>
                              <td className="py-3 px-4 text-slate-400 font-mono text-sm">{t.serviceFee} ETH</td>
                              <td className="py-3 px-4 text-emerald-400 font-mono text-sm">{t.totalFee} ETH</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Wallet className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-400">No transactions found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Campaign not found</p>
          </div>
        )}
      </div>


      {/* Add Budget Dialog */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="glassmorphism border-slate-700/50 bg-slate-900/90">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Add Campaign Budget</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-slate-300 text-sm">Amount (ETH)</Label>
              <Input
                id="budget"
                type="text"
                placeholder="0.05"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 h-12"
              />
              <p className="text-xs text-slate-400">Minimum: 0.0001 ETH</p>
            </div>

            {/* Fee Preview */}
            {feePreview && (
              <Card className="glassmorphism border-slate-700/30 p-4">
                <h4 className="text-slate-300 font-medium mb-3 text-sm flex items-center">
                  <span className="mr-2">💰</span>
                  Fee Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Budget Amount:</span>
                    <span className="text-white font-mono">{budgetAmount} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Service Fee:</span>
                    <span className="text-slate-400 font-mono">{feePreview.serviceFee} ETH</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total Cost:</span>
                      <span className="text-emerald-400 font-mono font-bold">{feePreview.totalFee} ETH</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {feeLoading && (
              <div className="flex items-center space-x-2 p-3 bg-slate-800/30 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-slate-400 text-sm">Calculating fees...</span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setBudgetDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBudget}
                disabled={!budgetAmount || budgetLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
              >
                {budgetLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm & Add Budget"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Danger Section */}
      <Card className="glassmorphism border-red-900/30 bg-red-950/20">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-400 font-medium">Danger Zone</h3>
              <p className="text-red-300/60 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" className="opacity-60 hover:opacity-80">
            Delete Campaign
          </Button>
        </div>
      </Card>
      {/* Image Preview Modal */}
      <Dialog open={!!openImage} onOpenChange={() => setOpenImage(null)}>
        <DialogContent className="glassmorphism border-slate-700/50 bg-slate-900/90 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Creative Preview</DialogTitle>
          </DialogHeader>
          {openImage && (
            <div className="space-y-4">
              <img
                src={openImage.url}
                alt={openImage.type}
                className="max-w-full max-h-[70vh] rounded-lg shadow-lg border border-slate-700 mx-auto"
              />
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <code className="text-cyan-400 text-sm break-all">{openImage.url}</code>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Budget Dialog */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="glassmorphism border-slate-700/50 bg-slate-900/90">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Add Campaign Budget</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-slate-300 text-sm">Amount (ETH)</Label>
              <Input
                id="budget"
                type="text"
                placeholder="0.05"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 h-12"
              />
              <p className="text-xs text-slate-400">Minimum: 0.0001 ETH</p>
            </div>

            {/* Fee Preview */}
            {feePreview && (
              <Card className="glassmorphism border-slate-700/30 p-4">
                <h4 className="text-slate-300 font-medium mb-3 text-sm flex items-center">
                  <span className="mr-2">💰</span>
                  Fee Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Budget Amount:</span>
                    <span className="text-white font-mono">{budgetAmount} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Service Fee:</span>
                    <span className="text-slate-400 font-mono">{feePreview.serviceFee} ETH</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total Cost:</span>
                      <span className="text-emerald-400 font-mono font-bold">{feePreview.totalFee} ETH</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {feeLoading && (
              <div className="flex items-center space-x-2 p-3 bg-slate-800/30 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-slate-400 text-sm">Calculating fees...</span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setBudgetDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBudget}
                disabled={!budgetAmount || budgetLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
              >
                {budgetLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm & Add Budget"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default function CampaignDetailPage() {
  return <AuthGuard>
    <CampaignDetailContent />
  </AuthGuard>
}