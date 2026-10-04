"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Play, Pause, SkipForward, Zap } from "lucide-react"
import { formatTradeDate, type Trade } from "@/lib/vrp-data"

const SPEEDS = ["1x", "5x", "10x", "30x"]

export function ReplayEngine({
  trades,
  currentIndex,
  onIndexChange,
}: {
  trades: Trade[]
  currentIndex: number
  onIndexChange: (index: number) => void
}) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [speed, setSpeed] = React.useState<string[]>(["1x"])

  const lastIndex = trades.length - 1
  const activeTrade = trades[currentIndex]

  // One trade per tick; tick rate scales with playback speed.
  React.useEffect(() => {
    if (!isPlaying) return
    if (currentIndex >= lastIndex) {
      setIsPlaying(false)
      return
    }
    const multiplier = Number(speed[0]?.replace("x", "") ?? 1)
    const timeout = setTimeout(
      () => onIndexChange(currentIndex + 1),
      1000 / multiplier
    )
    return () => clearTimeout(timeout)
  }, [isPlaying, speed, currentIndex, lastIndex, onIndexChange])

  const handlePlay = () => {
    if (currentIndex >= lastIndex) onIndexChange(0)
    setIsPlaying(true)
  }

  const jumpToVolSpike = () => {
    const idx = trades.findIndex((t) => t.Date.startsWith("2024-08"))
    if (idx >= 0) {
      setIsPlaying(false)
      onIndexChange(idx)
    }
  }

  return (
    <div className="sticky bottom-0 z-40 border-t border-[#262833] bg-[#090A0F]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-1.5">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="icon"
            aria-label="Play"
            onClick={handlePlay}
          >
            <Play />
          </Button>
          <Button
            variant={!isPlaying ? "default" : "outline"}
            size="icon"
            aria-label="Pause"
            onClick={() => setIsPlaying(false)}
          >
            <Pause />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Step forward"
            onClick={() => {
              setIsPlaying(false)
              onIndexChange(Math.min(lastIndex, currentIndex + 1))
            }}
          >
            <SkipForward />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {formatTradeDate(trades[0].Date)}
            </span>
            <span className="font-mono text-xs font-medium tabular-nums text-foreground">
              Simulating: {formatTradeDate(activeTrade.Date)}
            </span>
            <span className="text-[11px] text-muted-foreground">Present</span>
          </div>
          <Slider
            value={[currentIndex]}
            onValueChange={(v) => {
              const next = Array.isArray(v) ? v[0] : v
              setIsPlaying(false)
              onIndexChange(next)
            }}
            min={0}
            max={lastIndex}
            step={1}
          />
        </div>

        <div className="flex items-center gap-3">
          <ToggleGroup
            value={speed}
            onValueChange={(v) => v.length > 0 && setSpeed(v as string[])}
            variant="outline"
            spacing={0}
            aria-label="Playback speed"
          >
            {SPEEDS.map((s) => (
              <ToggleGroupItem
                key={s}
                value={s}
                className="font-mono text-xs tabular-nums"
              >
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={jumpToVolSpike}
          >
            <Zap data-icon="inline-start" />
            Jump to Vol Spike (Aug 2024)
          </Button>
        </div>
      </div>
    </div>
  )
}