"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { useErrorDialog } from "@/hooks/use-error-dialog"
import { useRouter, usePathname } from "next/navigation"
import { api, authAPI, tokenManager } from "@/lib/api"
import { STORAGE_KEYS } from "@/lib/constants"
import Cookies from "js-cookie"

interface WalletProps {
  token: string
  type: 'advertiser' | 'publisher'
}

interface Web3ContextType {
  loginToBackend: (address: string) => any
  autoConnectWallet: () => any
  setLoading: (loading: boolean) => any
  account: string | null
  isConnected: boolean
  isLoading: boolean
  balance: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  provider: ethers.BrowserProvider | null
  isAuthenticated: boolean
  userType: 'advertiser' | 'publisher' | null
  advertiserDemoConnect: () => void
  publisherDemoConnect: () => void
  isDemo: boolean
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {

  const [isDemo, setDemo] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Başlangıçta true
  const [balance, setBalance] = useState("0.0")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<'advertiser' | 'publisher' | null>(null)
  const { toast } = useToast()
  const { showWalletError, showNetworkError, showSuccess } = useErrorDialog()
  const router = useRouter()
  const pathname = usePathname()

  const handleRedirect = (wallet: any) => {

    Cookies.set(STORAGE_KEYS.TOKEN, wallet.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${wallet.token}`
    setIsAuthenticated(true)

    if (wallet.type === 'publisher') {
      router.push('/publisher')
      setUserType('publisher')
      showSuccess(`Welcome! You’re now logged in as a Publisher!`)
      return
    }

    if (wallet.type === 'advertiser') {
      router.push('/advertiser')
      setUserType('advertiser')
      showSuccess('Welcome! You’re now logged in as an Advertiser!')
      return
    }

    return null
  }
  // Backend'e login yap
  const loginToBackend = async (address: string) => {
    try {

      const response = await api.post<WalletProps>('/wallet', {
        address
      })

      return handleRedirect(response.data)

    } catch (error: any) {
      if (error?.response?.data?.error?.errorCode === 'account.not_found') {
        return router.push('/dashboard')
      }
      showWalletError('Lütfen tekrar giriş yapın.')
      return null
    }
  }



  // Wallet bilgilerini localStorage'a kaydet
  const saveWalletConnection = (address: string) => {
    localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, "true")
    localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address)
  }

  // Wallet bilgilerini localStorage'dan temizle
  const clearWalletConnection = () => {
    localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED)
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS)
    Cookies.remove(STORAGE_KEYS.TOKEN)
    setIsAuthenticated(false)
    setUserType(null)
    tokenManager.removeToken()
    router.push('/')
  }

  // Wallet'ı otomatik bağla
  const autoConnectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setIsLoading(false)
      return
    }

    try {

      const token = Cookies.get(STORAGE_KEYS.TOKEN)

      if (!token) {
        return clearWalletConnection()
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()

      if (accounts.length > 0) {
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)

        setProvider(provider)
        setAccount(address)
        setIsConnected(true)
        setBalance(ethers.formatEther(balance))
        saveWalletConnection(address)

        const response = await api.post<WalletProps>('/wallet', {
          address
        })

        Cookies.set(STORAGE_KEYS.TOKEN, response.data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        setIsAuthenticated(true)

    if (response.data.type === 'advertiser' && !userType) {
      setUserType('advertiser')
      toast({
        title: 'Welcome',
        description: 'Welcome! You’re now logged in as an Advertiser!',
      })
      return
    }

      if (response.data.type === 'publisher' && !userType) {
        setUserType('publisher')
        toast({
          title: 'Welcome! ',
          description: 'You’re now logged in as a Publisher!',
        })
        return
      }


      }
    } catch (error) {
      console.error("Auto connect error:", error)
      clearWalletConnection()
    } finally {
      setIsLoading(false)
    }
  }


  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      showWalletError("MetaMask bulunamadı. Lütfen MetaMask browser extension'ını yükleyin ve tekrar deneyin.")
      return
    }

    setIsLoading(true)
    try {

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)

      setDemo(false)
      setProvider(provider)
      setAccount(address)
      setIsConnected(true)
      setBalance(ethers.formatEther(balance))
      saveWalletConnection(address)
      await loginToBackend(address)
    } catch (error: any) {
      console.error("Wallet connection error:", error)

      // if (error.code === 4001) {
      //   showWalletError("MetaMask bağlantısı kullanıcı tarafından reddedildi.")
      // } else if (error.code === -32002) {
      //   showWalletError("MetaMask'ta bekleyen bir bağlantı isteği var. Lütfen MetaMask'ı kontrol edin.")
      // } else {
      //   showWalletError("MetaMask bağlantısı başarısız oldu. Lütfen tekrar deneyin.")
      // }
    } finally {
      setIsLoading(false)
    }
  }


  const advertiserDemoConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      showWalletError("MetaMask bulunamadı. Lütfen MetaMask browser extension'ını yükleyin ve tekrar deneyin.")
      return
    }

    setDemo(true)
    setIsLoading(true)
    try {

      // const provider = new ethers.BrowserProvider(window.ethereum)
      const address = "0xF739AF0C0cC448B41c47cc38070f10a0B4BE50b4"

      // setProvider(provider)
      setAccount(address)
      setIsConnected(true)
      setBalance("0.10")
      saveWalletConnection(address)
      await loginToBackend(address)
    } catch (error: any) {
      console.error("Wallet connection error:", error)

      // if (error.code === 4001) {
      //   showWalletError("MetaMask bağlantısı kullanıcı tarafından reddedildi.")
      // } else if (error.code === -32002) {
      //   showWalletError("MetaMask'ta bekleyen bir bağlantı isteği var. Lütfen MetaMask'ı kontrol edin.")
      // } else {
      //   showWalletError("MetaMask bağlantısı başarısız oldu. Lütfen tekrar deneyin.")
      // }
    } finally {
      setIsLoading(false)
    }
  }


  const publisherDemoConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      showWalletError("MetaMask bulunamadı. Lütfen MetaMask browser extension'ını yükleyin ve tekrar deneyin.")
      return
    }

    setDemo(true)
    setIsLoading(true)
    try {

      // const provider = new ethers.BrowserProvider(window.ethereum)
      const address = "0x1B8Fb4663b2215B28d1a07AC9a9a6504273a84EE"

      // setProvider(provider)
      setAccount(address)
      setIsConnected(true)
      setBalance("0.10")
      saveWalletConnection(address)
      await loginToBackend(address)
    } catch (error: any) {
      console.error("Wallet connection error:", error)

      // if (error.code === 4001) {
      //   showWalletError("MetaMask bağlantısı kullanıcı tarafından reddedildi.")
      // } else if (error.code === -32002) {
      //   showWalletError("MetaMask'ta bekleyen bir bağlantı isteği var. Lütfen MetaMask'ı kontrol edin.")
      // } else {
      //   showWalletError("MetaMask bağlantısı başarısız oldu. Lütfen tekrar deneyin.")
      // }
    } finally {
      setIsLoading(false)
    }
  }


  const disconnectWallet = () => {
    setAccount(null)
    setIsConnected(false)
    setBalance("0.0")
    setProvider(null)
    clearWalletConnection()
    showSuccess("Wallet bağlantısı başarıyla kesildi.")
    router.push('/')
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } 
      })

      window.ethereum.on("chainChanged", () => {
        showNetworkError("Ağ değiştirildi. Sayfa yeniden yüklenecek.")
        setTimeout(() => window.location.reload(), 2000)
      })

      // Cleanup function
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener("accountsChanged", () => { })
          window.ethereum.removeListener("chainChanged", () => { })
        }
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        isDemo,
        publisherDemoConnect,
        advertiserDemoConnect,
        setLoading: setIsLoading,
        autoConnectWallet,
        loginToBackend,
        account,
        isConnected,
        isLoading,
        balance,
        connectWallet,
        disconnectWallet,
        provider,
        isAuthenticated,
        userType,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
