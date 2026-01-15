"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { LoadingIndicator } from "../ui/loaading-indicator"
import { api } from "@/lib/api"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, account, isLoading, disconnectWallet, autoConnectWallet, isDemo } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if(isDemo){
      return
    }
    autoConnectWallet()
    // if(isLoading){
    //   return
    // }
    // if(!isConnected){
    //   return router.push("/")
    // }
    // if(account === null){
    //   return router.push("/")
    // }
    // api.post('/wallet', {
    //   address: account
    // }).catch(() => {
    //   disconnectWallet()
    //   router.push("/")
    // })
    // Loading bittiğinde ve hesap bağlı değilse ana sayfaya yönlendir
    // if (!isLoading && !isConnected) {
    // }
  }, [isDemo])

  // Hala yükleniyor
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 relative flex justify-center items-center">
        <LoadingIndicator size="lg" variant="web3" text="Giriş Yapılıyor..." />
      </div>
    )
  }

  // Hesap bağlı değil
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 relative flex justify-center items-center">
        <LoadingIndicator size="lg" variant="web3" text="Redirecting..." />
      </div>
    )
  }

  // Hesap bağlı, children'ı render et
  return <>{children}</>
}
