import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string
  icon?: React.ReactNode
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {

  return (
    <Card className="glassmorphism border-slate-700/50 hover:glow-blue transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  )
}
