"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { stateAfter, type Trade } from "@/lib/vrp-data"

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const CARD = "gap-3 border border-[#262833] bg-[#12131A] py-5 shadow-none ring-0"

export function FsmHud({
  trade,
  winRate,
}: {
  trade: Trade
  winRate: number
}) {
  const isCash = stateAfter(trade) === "cash"
  const costBasis = trade.Cost_Basis
  // 1 contract = 100 shares; only capital tied up while holding shares.
  const deployed = isCash ? 0 : costBasis * 100
  const pnl = trade.Cumulative_PnL
  const pnlPositive = pnl >= 0

  return (
    <section
      aria-label="Finite state machine live risk metrics"
      className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-3"
    >
      <Card className={CARD}>
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active State
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5">
          <Badge
            className={cn(
              "w-fit font-mono text-xs tracking-wide",
              isCash
                ? "border-primary/30 bg-primary/15 text-primary"
                : "border-amber-500/30 bg-amber-500/15 text-amber-400"
            )}
          >
            {isCash
              ? "STATE 0: CASH (Short Variance)"
              : "STATE 1: LONG ASSET (Covered Call)"}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {isCash
              ? "Hunting for VRP entry signal."
              : "Holding assigned shares, writing covered calls."}
          </p>
        </CardContent>
      </Card>

      <Card className={CARD}>
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cost Basis &amp; Capital
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-muted-foreground" />
            <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              {usd.format(costBasis)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Current Cost Basis (per share)
          </p>
          <div className="mt-2 flex items-center gap-2">
            <DollarSign className="size-4 text-muted-foreground" />
            <span className="font-mono text-sm tabular-nums text-foreground">
              Deployed: {usd.format(deployed)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD}>
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-5">
          <div className="flex items-center gap-2">
            {pnlPositive ? (
              <TrendingUp className="size-4 text-primary" />
            ) : (
              <TrendingDown className="size-4 text-red-400" />
            )}
            <span
              className={cn(
                "font-mono text-2xl font-semibold tabular-nums",
                pnlPositive ? "text-primary" : "text-red-400"
              )}
            >
              {pnlPositive ? "+" : "-"}
              {usd.format(Math.abs(pnl))}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Cumulative P&amp;L (per share)
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Win Rate</span>
            <span className="font-mono text-sm tabular-nums text-foreground">
              {winRate}%
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
