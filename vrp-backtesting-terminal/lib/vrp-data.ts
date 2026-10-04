import raw from "./history.json"

export interface Trade {
  Date: string
  State: string
  Spot_Entry: number
  Strike: number
  Premium: number
  Cost_Basis: number
  PnL: number
  Outcome: string
  Cumulative_PnL: number
}

export type OutcomeKind = "win" | "assigned" | "loss"
export type FsmState = "cash" | "long"

// Place your real backtest export at lib/history.json
export const history: Trade[] = raw as Trade[]

export function outcomeKind(t: Trade): OutcomeKind {
  const o = t.Outcome.toUpperCase()
  if (o.startsWith("ASSIGNED")) return "assigned"
  if (o.startsWith("LOSS")) return "loss"
  return "win"
}

/** FSM state AFTER the trade resolves (what the HUD should show). */
export function stateAfter(t: Trade): FsmState {
  const o = t.Outcome.toUpperCase()
  return o.startsWith("ASSIGNED") || o.includes("CALL OTM") ? "long" : "cash"
}

export function fsmAction(t: Trade) {
  return t.State.toUpperCase().startsWith("LONG") ? "SELL CALL (COVERED)" : "SELL PUT"
}

/** OTM cushion in %, measured from spot at entry. */
export function otmPct(t: Trade) {
  const isCall = t.State.toUpperCase().startsWith("LONG")
  const diff = isCall ? t.Strike - t.Spot_Entry : t.Spot_Entry - t.Strike
  return (diff / t.Spot_Entry) * 100
}

/** Share of trades that did not end in assignment. */
export function winRate(trades: Trade[]) {
  if (trades.length === 0) return 0
  const wins = trades.filter((t) => outcomeKind(t) !== "assigned").length
  return Math.round((wins / trades.length) * 100)
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/** Timezone-safe (avoids SSR/client hydration mismatches). */
export function formatTradeDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

export function shortDate(iso: string) {
  return iso.slice(0, 10)
}
