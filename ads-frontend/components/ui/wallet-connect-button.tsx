"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export function WalletConnectButton({disableLoading}: {disableLoading?: boolean}) {
  const { account, isConnected, isLoading, balance,  connectWallet, disconnectWallet, isAuthenticated, userType, setLoading } = useWeb3()
  const [publisherEarnings, setPublisherEarnings] = useState<string>("0")

  useEffect(() => {
    if(!disableLoading){
        return
    } 
    setLoading(false)
  }, [])

  // Fetch publisher earnings when user is authenticated as publisher
  useEffect(() => {
    const fetchPublisherEarnings = async () => {
      if (isAuthenticated && userType === 'publisher' && account) {
        try {
          const res = await api.get("/publisher/stats", { headers: { wallet: account } })
          setPublisherEarnings(res.data.totalEarn)
        } catch (err) {
          setPublisherEarnings("0")
        }
      }
    }

    fetchPublisherEarnings()
  }, [isAuthenticated, userType, account])

  if (isLoading) {
    return (
      <Button disabled className="glow-blue text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Bağlanıyor...
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} className="gradient-blue-purple hover:glow-blue transition-all duration-300 text-white">
        <Wallet className="mr-2 h-4 w-4" />
        Connect with Metamask
      </Button>
    )
  }

  // Determine what balance to show based on user type
  const getBalanceDisplay = () => {
    if (isAuthenticated && userType === 'publisher') {
      return {
        label: "Total Earnings",
        value: `${publisherEarnings} ETH`
      }
    } else if (isAuthenticated && userType === 'advertiser') {
      return {
        label: "Wallet Balancei",
        value: `${Number.parseFloat(balance).toFixed(4)} ETH`
      }
    } else {
      return {
        label: "Wallet Balance",
        value: `${Number.parseFloat(balance).toFixed(4)} ETH`
      }
    }
  }

  const balanceInfo = getBalanceDisplay()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glassmorphism border-blue-500/30 bg-transparent">
          <Wallet className="mr-2 h-4 w-4" />
          {account?.slice(0, 6)}...{account?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glassmorphism border-slate-700">
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-sm text-slate-400">{balanceInfo.label}</span>
          <span className="font-mono">{balanceInfo.value}</span>
        </DropdownMenuItem>
        
        {isAuthenticated && userType && (
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="text-sm text-slate-400">Account Type</span>
            <span className="font-semibold capitalize text-green-400">
              {userType === 'advertiser' ? 'Advertiser' : 'Publisher'}
            </span>
          </DropdownMenuItem>
        )}
        
        {!isAuthenticated && (
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="text-sm text-yellow-400">
              Belirli bir sayfaya gidin (advertiser/publisher)
            </span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
