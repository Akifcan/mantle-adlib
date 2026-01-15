"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Target, ImageIcon, Plus, X, Save, Eye, DollarSign, Users, Upload, Edit3, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"
import { APP_NAME } from "@/lib/constants"
import { useWeb3 } from "@/components/providers/web3-provider"
import { useToast } from "@/hooks/use-toast"
import { useRef } from "react"
import { ethers } from "ethers"
import Layout from "../layout/layout"
import { ABI } from "@/lib/abi"

interface CreativeItem {
  type: "popup" | "reward" | "square" | "rectangle"
  url: string
  title?: string
  subtitle?: string
  redirectLink?: string
}

interface FormData {
  name: string
  adTitle: string
  adDescription: string
  budget: string
  target: string
  creative: CreativeItem[]
}

const targetOptions = [
  "automotive",
  "technology",
  "travel",
  "fashion",
  "fitness",
  "crypto",
  "e-commerce",
  "home-decor",
  "food-cooking",
  "gaming",
  "mobile-apps",
  "luxury-lifestyle",
  "photography",
  "music",
  "movies-tv-shows",
  "health-wellness",
  "parenting-baby-products",
  "career-investing",
  "sports-football-basketball",
  "second-hand-shopping",
]

function CreateCampaignContent() {
  const router = useRouter()
  const { account } = useWeb3()
  const { toast, dismiss } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    adTitle: "",
    adDescription: "",
    budget: "",
    target: "",
    creative: [],
  })
  const [loading, setLoading] = useState(false)
  const [feePreview, setFeePreview] = useState<{ serviceFee: string; totalFee: string; amount: string } | null>(null)
  const [feeLoading, setFeeLoading] = useState(false)
  const feeTimeout = useRef<NodeJS.Timeout | null>(null)

  // Contract refs
  const contract = useRef<ethers.Contract | null>(null)
  const signer = useRef<ethers.JsonRpcSigner | null>(null)
  const wallet = useRef<string | undefined>(undefined)
  const [contractConnected, setContractConnected] = useState(false)

  const handleStart = async () => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      signer.current = await provider.getSigner()
      const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AD_CONTRACT_ADDRESS
      

      if (CONTRACT_ADDRESS) {
        contract.current = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer.current);
        // console.log(contract.current)
        // console.log(adContract.current)
        wallet.current = (contract.current.runner as unknown as { address: string }).address
        setContractConnected(true)
      } else {
        console.error('Contract addresses are not defined in environment variables.')
        setContractConnected(false)
      }
    } catch (e) {
      console.log(e)
      setContractConnected(false)
    }
  }

  useEffect(() => {
    handleStart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Async function for fee preview
  const getFeePreview = async (budget: string) => {
    setFeeLoading(true)
    try {
      const res = await api.post("/campaign/fee-preview", { budget })
      setFeePreview(res.data)
    } catch {
      setFeePreview(null)
    } finally {
      setFeeLoading(false)
    }
  }

  const [newCreative, setNewCreative] = useState<CreativeItem>({
    type: "popup",
    url: "",
    title: "",
    subtitle: "",
    redirectLink: "",
  })

  const addCreative = () => {
    if (newCreative.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        creative: [...prev.creative, { ...newCreative }],
      }))
      setNewCreative({ type: "popup", url: "", title: "", subtitle: "", redirectLink: "" })
    }
  }

  const removeCreative = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      creative: prev.creative.filter((_, i) => i !== index),
    }))
  }

  const handleCreate = async () => {
    // Bütçe + servis ücreti toplamı
    const totalAmount = (parseFloat(formData.budget) + parseFloat(feePreview?.serviceFee || "0")).toString()
    
    const tx = await contract.current?.sendToMasterWallet(
      {
        value: ethers.parseEther(totalAmount),
      }
    )
    console.log("START")
    const w = await tx.wait();
    console.log("END")
    console.log(tx)
    console.log(w)
    const log = w.logs[0];
    const adAddress = ethers.getAddress("0x" + log.data.slice(26))
    console.log(adAddress)
    return adAddress
  }

  const handleSubmit = async () => {

    if (!contractConnected) {
      return
    }


    setLoading(true)
    try {
      const txToastObj = toast({
        title: "Blockchain transaction starting...",
        description: "Ad contract is being created, please approve in your wallet.",
      })
      // Call contract and get ad address
      const adAddress = await handleCreate();
      dismiss(txToastObj.id)
      if (!adAddress) {
        setLoading(false)
        return
      }
      await api.post("/campaign", {
        name: formData.name,
        adTitle: formData.adTitle,
        adDescription: formData.adDescription,
        budget: formData.budget,
        target: formData.target,
        wallet: account,
        creative: formData.creative,
        transactionId: adAddress
      })
      toast({
        title: "Campaign created successfully!",
        description: "Your campaign has been saved successfully.",
      })
      router.push("/advertiser")
    } catch (error) {
      toast({
        title: "Campaign could not be created!",
        description: "An error occurred. Please try again.",
      })
      console.error("Error creating campaign:", error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced fee preview API call
  useEffect(() => {
    if (feeTimeout.current) clearTimeout(feeTimeout.current)
    if (!formData.budget || isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      setFeePreview(null)
      return
    }
    feeTimeout.current = setTimeout(() => {
      getFeePreview(formData.budget)
    }, 500)
    // Cleanup on unmount
    return () => {
      if (feeTimeout.current) clearTimeout(feeTimeout.current)
    }
  }, [formData.budget])

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
              <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
              <p className="text-slate-400 text-sm">Set up your targeted advertising campaign</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <span className="text-white font-medium">Campaign Info</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information Card */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Edit3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Campaign Information</h3>
                    <p className="text-slate-400 text-sm">Basic details about your campaign</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Campaign Name */}
                  <div>
                    <Label htmlFor="name" className="text-slate-300 font-medium mb-2 block">
                      Campaign Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., DeFi Protocol Launch"
                      className="bg-slate-800/50 border-slate-600 text-white h-11"
                    />
                  </div>

                  {/* Ad Title */}
                  <div>
                    <Label htmlFor="adTitle" className="text-slate-300 font-medium mb-2 block">
                      Ad Title
                    </Label>
                    <Input
                      id="adTitle"
                      value={formData.adTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adTitle: e.target.value }))}
                      placeholder="Attention-grabbing title..."
                      className="bg-slate-800/50 border-slate-600 text-white h-11"
                    />
                  </div>

                  {/* Ad Description */}
                  <div>
                    <Label htmlFor="adDescription" className="text-slate-300 font-medium mb-2 block">
                      Ad Description
                    </Label>
                    <Textarea
                      id="adDescription"
                      value={formData.adDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adDescription: e.target.value }))}
                      placeholder="Describe your product/service..."
                      className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget & Targeting Card */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Budget & Targeting</h3>
                    <p className="text-slate-400 text-sm">Set your budget and target audience</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget" className="text-slate-300 font-medium mb-2 block">
                      Campaign Budget
                    </Label>
                    <div className="relative">
                      <Input
                        id="budget"
                        type="number"
                        step="0.001"
                        value={formData.budget}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                        placeholder="5.0"
                        className="bg-slate-800/50 border-slate-600 text-white h-11 pr-16"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        <span className="text-slate-400 font-mono text-sm">ETH</span>
                        <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Ξ</span>
                        </div>
                      </div>
                    </div>
                    {/* Fee Preview */}
                    {feeLoading ? (
                      <p className="text-slate-400 text-sm mt-2">Calculating fees...</p>
                    ) : feePreview ? (
                      <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Budget Amount:</span>
                            <span className="text-white font-mono">{feePreview.amount} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Service Fee:</span>
                            <span className="text-slate-400 font-mono">{feePreview.serviceFee} ETH</span>
                          </div>
                          <div className="border-t border-slate-700 pt-1 mt-2">
                            <div className="flex justify-between">
                              <span className="text-white font-medium">Total Cost:</span>
                              <span className="text-emerald-400 font-mono font-bold">{feePreview.totalFee} ETH</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Target Categories */}
                  <div>
                    <Label className="text-slate-300 font-medium mb-2 block">Target Category</Label>
                    <Select
                      value={formData.target}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, target: value }))}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {targetOptions.map((target) => (
                          <SelectItem key={target} value={target}>
                            {target.replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Creative Assets */}
            <div>
              <Label className="text-slate-300 text-lg font-medium mb-3 block">Ad Creatives</Label>
              
              {/* Creative Types Info Section */}
              <div className="glassmorphism p-4 rounded-lg border border-slate-700/50 mb-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Creative Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="text-purple-400 font-medium">Popup:</span>
                        <span className="text-slate-300 ml-1">Displayed as full-screen overlay. Ideal for capturing user attention.</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="text-emerald-400 font-medium">Reward:</span>
                        <span className="text-slate-300 ml-1">15-second reward ad. User earns reward when time expires.</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="text-blue-400 font-medium">Square:</span>
                        <span className="text-slate-300 ml-1">200x200px square format. Displayed in sidebar and content areas.</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="text-orange-400 font-medium">Rectangle:</span>
                        <span className="text-slate-300 ml-1">320x180px banner format. Shown in header and footer areas.</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <span className="text-cyan-400 font-medium text-sm">Tip:</span>
                      <span className="text-slate-300 text-sm ml-1">
                        You can add title, subtitle, and redirect link for each creative. This information increases ad effectiveness.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Creative */}
              <div className="glassmorphism p-6 rounded-lg border border-slate-700/50 mb-4">
                <div className="space-y-4">
                  {/* First row - Type and URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 text-sm mb-2 block">Type</Label>
                      <Select
                        value={newCreative.type}
                        onValueChange={(value: "popup" | "reward" | "square" | "rectangle") =>
                          setNewCreative((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger className="glassmorphism border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glassmorphism border-slate-700">
                          <SelectItem value="popup">Popup</SelectItem>
                          <SelectItem value="reward">Reward</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm mb-2 block">Image URL</Label>
                      <Input
                        value={newCreative.url}
                        onChange={(e) => setNewCreative((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="glassmorphism border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  {/* Second row - Title and Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 text-sm mb-2 block">Title</Label>
                      <Input
                        value={newCreative.title}
                        onChange={(e) => setNewCreative((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Ad title"
                        className="glassmorphism border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm mb-2 block">Subtitle</Label>
                      <Input
                        value={newCreative.subtitle}
                        onChange={(e) => setNewCreative((prev) => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Description text"
                        className="glassmorphism border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  {/* Third row - Redirect Link */}
                  <div>
                    <Label className="text-slate-300 text-sm mb-2 block">Redirect Link</Label>
                    <Input
                      value={newCreative.redirectLink}
                      onChange={(e) => setNewCreative((prev) => ({ ...prev, redirectLink: e.target.value }))}
                      placeholder="https://example.com/landing-page"
                      className="glassmorphism border-slate-600 text-white"
                    />
                  </div>

                  {/* Add Button */}
                  <div className="flex justify-end">
                    <Button onClick={addCreative} className="gradient-blue-purple hover:glow-blue">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Creative
                    </Button>
                  </div>
                </div>
              </div>

              {/* Creative List */}
              <div className="space-y-3">
                {formData.creative.map((creative, index) => (
                  <div
                    key={index}
                    className="glassmorphism p-4 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header with type and delete button */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={
                              creative.type === "popup"
                                ? "bg-purple-500/20 text-purple-400"
                                : creative.type === "reward"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : creative.type === "square"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-orange-500/20 text-orange-400"
                            }
                          >
                            {creative.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCreative(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Creative details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <ImageIcon className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-400">URL:</span>
                              <span className="text-slate-300 font-mono truncate">{creative.url}</span>
                            </div>
                            {creative.title && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Title:</span>
                                <span className="text-white">{creative.title}</span>
                              </div>
                            )}
                            {creative.subtitle && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Subtitle:</span>
                                <span className="text-slate-300">{creative.subtitle}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {creative.redirectLink && (
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Redirect:</span>
                                <span className="text-cyan-400 font-mono truncate">{creative.redirectLink}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.creative.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No ad creatives added yet</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Summary */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
                  Campaign Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white">{formData.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget:</span>
                    <span className="text-white font-mono">{formData.budget || "0"} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white">{formData.target ? formData.target.replace("-", " ") : "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Creatives:</span>
                    <span className="text-white">{formData.creative.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400">Ready to launch</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="glassmorphism border-slate-700/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Campaign
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Launch Button */}
        <Card className="glassmorphism border-slate-700/30">
          <div className="p-6">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !formData.name || !formData.budget || !formData.target}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 text-lg font-medium"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Campaign...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-lg font-bold">Ξ</span>
                  <span>Launch Campaign</span>
                </div>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default function CreateCampaignPage() {
  return (
    <AuthGuard>
      <CreateCampaignContent />
    </AuthGuard>
  )
}
