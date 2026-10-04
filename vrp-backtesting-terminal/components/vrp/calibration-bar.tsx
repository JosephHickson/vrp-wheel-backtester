"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"

const TENORS = ["7d", "14d", "21d", "45d"] as const

const first = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number))

export function CalibrationBar({
  ticker,
  onTickerChange,
}: {
  ticker: string
  onTickerChange: (ticker: string) => void
}) {
  const [vrpHurdle, setVrpHurdle] = React.useState(0.12)
  const [otmCushion, setOtmCushion] = React.useState(15)
  const [tenor, setTenor] = React.useState<string[]>(["21d"])

  return (
    <header className="bg-[#090A0F]">
      <div className="mx-auto max-w-[1600px] px-6 py-5">
        <Card className="gap-5 border border-[#262833] bg-[#12131A] py-5 shadow-none ring-0">
          <CardContent className="flex flex-col gap-5 px-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="font-sans text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Volatility Risk Premium &amp; Wheel Strategy Backtester
                </h1>
                <p className="font-mono text-xs text-muted-foreground">
                  VRP Engine // MSTU &amp; MSTR High-Beta Proxy
                </p>
              </div>

              <ToggleGroup
                value={[ticker]}
                onValueChange={(v) => v[0] && onTickerChange(v[0])}
                variant="outline"
                spacing={0}
                aria-label="Ticker selection"
              >
                <ToggleGroupItem value="MSTR" className="font-mono text-xs">
                  MSTR (Proxy Backtest)
                </ToggleGroupItem>
                <ToggleGroupItem value="MSTU" className="font-mono text-xs">
                  MSTU (Live Execution)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex min-w-48 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Min VRP Hurdle
                  </span>
                  <span className="font-mono text-xs tabular-nums text-foreground">
                    {vrpHurdle.toFixed(2)} Spread
                  </span>
                </div>
                <Slider
                  value={[vrpHurdle]}
                  onValueChange={(v) => setVrpHurdle(first(v))}
                  min={0}
                  max={0.3}
                  step={0.01}
                />
              </div>

              <Separator orientation="vertical" className="hidden h-10 bg-[#262833] sm:block" />

              <div className="flex min-w-48 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Target OTM Cushion
                  </span>
                  <span className="font-mono text-xs tabular-nums text-foreground">
                    {otmCushion}% OTM
                  </span>
                </div>
                <Slider
                  value={[otmCushion]}
                  onValueChange={(v) => setOtmCushion(first(v))}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>

              <Separator orientation="vertical" className="hidden h-10 bg-[#262833] sm:block" />

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Contract Tenor
                </span>
                <ToggleGroup
                  value={tenor}
                  onValueChange={(v) => v.length > 0 && setTenor(v as string[])}
                  variant="outline"
                  spacing={0}
                  aria-label="Contract tenor"
                >
                  {TENORS.map((t) => (
                    <ToggleGroupItem
                      key={t}
                      value={t}
                      className="font-mono text-xs tabular-nums"
                    >
                      {t}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </header>
  )
}