"use client"

import * as React from "react"
import { CalibrationBar } from "@/components/vrp/calibration-bar"
import { FsmHud } from "@/components/vrp/fsm-hud"
import { TradeLedger } from "@/components/vrp/trade-ledger"
import { ReplayEngine } from "@/components/vrp/replay-engine"
import { history, winRate } from "@/lib/vrp-data"

export default function Page() {
  const [ticker, setTicker] = React.useState("MSTR")
  const [currentIndex, setCurrentIndex] = React.useState(history.length - 1)

  const activeTrade = history[currentIndex]

  // Chronological slice up to the cursor; ledger shows newest first.
  const visibleTrades = React.useMemo(
    () => history.slice(0, currentIndex + 1),
    [currentIndex]
  )
  const ledgerRows = React.useMemo(
    () => history.slice(0, currentIndex + 1).reverse(),
    [currentIndex]
  )

  return (
    <main className="flex min-h-screen flex-col bg-[#090A0F] text-foreground">
      <CalibrationBar ticker={ticker} onTickerChange={setTicker} />
      <div className="flex-1 pb-4">
        <FsmHud trade={activeTrade} winRate={winRate(visibleTrades)} />
        <TradeLedger rows={ledgerRows} />
      </div>
      <ReplayEngine
        trades={history}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </main>
  )
}

