import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/providers/web3-provider"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${APP_NAME} - Decentralized Advertising Platform`,
  description: APP_DESCRIPTION,
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100`}>
        <Web3Provider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  )
}
