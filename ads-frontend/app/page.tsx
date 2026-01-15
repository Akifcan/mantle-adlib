'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Space_Grotesk, Sora } from 'next/font/google'
import { DemoButton } from '@/components/ui/demo-button'
import { APP_NAME } from '@/lib/constants'

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const bodyFont = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export default function HomePage() {
  const themeVars: CSSProperties = {
    '--ink': '#0b0b10',
    '--paper': '#f4f1ec',
    '--surface': '#11121a',
    '--surface-strong': '#1a1b26',
    '--accent': '#ff7a00',
    '--accent-2': '#10b981',
    '--ink-soft': '#2e2f3a',
    '--cream': '#e8e3da',
  }

  return (
    <div
      className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[color:var(--paper)] text-[color:var(--ink)]`}
      style={themeVars}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-10 h-56 w-56 rounded-full border border-black/10 bg-white/80 blur-2xl"></div>
        <div className="absolute bottom-16 right-16 h-64 w-64 rounded-full border border-black/10 bg-white/70 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 h-40 w-40 rounded-full border border-black/10 bg-white/60 blur-xl"></div>
      </div>

      <header className="relative z-10 px-6 pt-6">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-2xl border border-black/10 bg-white/90 px-6 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] animate-fade-in">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt={`${APP_NAME} logo`} className="h-10 w-10" />
            <div className={`${displayFont.className} text-2xl font-semibold tracking-tight`}>
              {APP_NAME}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/60">
              Mantle Powered Ads
            </div>
            <DemoButton variant="header" size="sm" />
            <Link href="/auth">
              <button className="rounded-full bg-[color:var(--accent)] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform duration-300 hover:-translate-y-0.5">
                Sign In
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 px-6">
        <section className="mx-auto grid max-w-7xl gap-10 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.5)] animate-fade-up">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-black/50">
              Mantle Infrastructure
            </p>
            <h1 className={`${displayFont.className} text-4xl font-semibold leading-tight sm:text-6xl`}>
              Earn crypto from
              <span className="block text-[color:var(--accent)]">advertising you control.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--ink-soft)]">
              A new ad economy where publishers and advertisers share revenue instantly on-chain.
              Build campaigns, verify performance, and distribute payouts through Mantle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* <DemoButton variant="hero" size="lg" showSubtext={true} /> */}
              <Link href="/demo">
                <button className="rounded-full border border-black/10 bg-[color:var(--cream)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:border-black/30">
                  Watch Live Demo
                </button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-sm text-black/60">
              <div className="rounded-2xl border border-black/10 bg-[color:var(--paper)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">Weekly Payouts</p>
                <p className="mt-2 text-lg font-semibold text-black">$2.4M</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[color:var(--paper)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">On-chain CTR</p>
                <p className="mt-2 text-lg font-semibold text-black">4.8%</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[color:var(--paper)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">Verified Impressions</p>
                <p className="mt-2 text-lg font-semibold text-black">1.2M</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-black/10 bg-[color:var(--surface)] p-6 text-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Live Ledger</p>
                  <h3 className={`${displayFont.className} mt-2 text-2xl font-semibold`}>
                    Mantle Yield Loop
                  </h3>
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/70">
                  Block 12,490,884
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Campaign Settlements</span>
                  <span className="text-white">$482k</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Publisher Rewards</span>
                  <span className="text-white">74%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Gas Saved</span>
                  <span className="text-white">38%</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white p-6 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">Built for teams</p>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <div className="flex items-center justify-between">
                  <span>Wallet-ready payouts</span>
                  <span className="text-black">Instant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Attribution oracle</span>
                  <span className="text-black">Real-time</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-chain launch</span>
                  <span className="text-black">1-click</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-black/60">
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">KYC optional</span>
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">Fraud guard</span>
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">Creative AI</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl pb-12">
          <div className="grid gap-6 rounded-[28px] border border-black/10 bg-white px-6 py-6 text-sm text-black/60 md:grid-cols-[auto_1fr] md:items-center animate-fade-up">
            <p className="uppercase tracking-[0.3em] text-black/40">Mantle Ecosystem</p>
            <div className="flex flex-wrap items-center gap-6 text-base text-black/80">
              <span className={`${displayFont.className} text-lg`}>Mantle Pay</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 pb-16 lg:grid-cols-2">
          <Link href="/for-publishers" className="group">
            <div className="h-full rounded-[30px] border border-black/10 bg-white p-8 transition-transform duration-300 group-hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-black/40">For Publishers</p>
              <h3 className={`${displayFont.className} mt-4 text-3xl font-semibold`}>
                Turn traffic into on-chain revenue streams.
              </h3>
              <p className="mt-4 text-black/70">
                One script installs everything. Track yield, settle instantly, and distribute rewards
                to your community.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-black/60">
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">70% higher revenue</span>
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">5-minute setup</span>
                <span className="rounded-full border border-black/10 bg-[color:var(--paper)] px-3 py-1">Instant payout</span>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-2)]">
                Start publishing
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>

          <Link href="/for-advertisers" className="group">
            <div className="h-full rounded-[30px] border border-black/10 bg-[color:var(--surface-strong)] p-8 text-white transition-transform duration-300 group-hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">For Advertisers</p>
              <h3 className={`${displayFont.className} mt-4 text-3xl font-semibold`}>
                Pay for verified outcomes on-chain.
              </h3>
              <p className="mt-4 text-white/80">
                Launch campaigns with transparent attribution, AI creative, and fraud-proof reporting
                on Mantle.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">300% CTR lift</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">No ETH needed</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Smart bidding</span>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Build a campaign
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        </section>

        <section className="mx-auto max-w-7xl pb-20">
          <div className="grid gap-6 rounded-[28px] border border-black/10 bg-white p-8 md:grid-cols-4 animate-fade-up">
            <div>
              <p className="text-sm text-black/60">Active Publishers</p>
              <p className={`${displayFont.className} mt-3 text-3xl font-semibold text-black`}>50K+</p>
            </div>
            <div>
              <p className="text-sm text-black/60">Daily Impressions</p>
              <p className={`${displayFont.className} mt-3 text-3xl font-semibold text-black`}>1M+</p>
            </div>
            <div>
              <p className="text-sm text-black/60">CTR Increase</p>
              <p className={`${displayFont.className} mt-3 text-3xl font-semibold text-black`}>3.2x</p>
            </div>
            <div>
              <p className="text-sm text-black/60">Monthly Revenue</p>
              <p className={`${displayFont.className} mt-3 text-3xl font-semibold text-black`}>$2M+</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 pb-24 lg:grid-cols-3">
          {[
            {
              title: 'Connect inventory',
              body: 'Install a lightweight SDK and map ad placements in minutes.',
            },
            {
              title: 'Launch campaigns',
              body: 'Generate AI creative, choose targeting, and set budgets.',
            },
            {
              title: 'Verify on-chain',
              body: 'Track outcomes and send crypto payouts with real-time proofs.',
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-black/10 bg-white p-6 animate-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">Step 0{index + 1}</p>
              <h4 className={`${displayFont.className} mt-4 text-xl font-semibold text-black`}>{item.title}</h4>
              <p className="mt-3 text-sm text-black/70">{item.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-black/10 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-sm text-black/60 md:flex-row md:items-center">
          <div className={`${displayFont.className} text-lg text-black`}>{APP_NAME}</div>
          <div className="flex flex-wrap gap-6">
            <Link href="/auth" className="hover:text-black">Launch Console</Link>
            <Link href="/demo" className="hover:text-black">Product Demo</Link>
            <Link href="/for-advertisers" className="hover:text-black">Advertisers</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-fade-up {
          animation: fade-up 0.8s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
