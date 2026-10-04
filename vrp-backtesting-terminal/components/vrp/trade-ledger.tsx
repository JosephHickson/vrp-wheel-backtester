import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  fsmAction,
  otmPct,
  outcomeKind,
  shortDate,
  type OutcomeKind,
  type Trade,
} from "@/lib/vrp-data"

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const outcomeColor: Record<OutcomeKind, string> = {
  win: "text-emerald-400",
  assigned: "text-amber-400",
  loss: "text-red-400",
}

export function TradeLedger({ rows }: { rows: Trade[] }) {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-5">
      <Card className="gap-3 border border-[#262833] bg-[#12131A] py-5 shadow-none ring-0">
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-medium text-foreground">
            Trade Ledger &amp; VRP Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table className="font-mono text-xs tabular-nums">
              <TableHeader>
                <TableRow className="border-[#262833] hover:bg-transparent">
                  <TableHead className="pl-5 text-left">Date</TableHead>
                  <TableHead className="text-right">Spot Price</TableHead>
                  <TableHead className="text-right">Target Strike</TableHead>
                  <TableHead className="text-right">OTM Cushion</TableHead>
                  <TableHead className="text-left">FSM Action</TableHead>
                  <TableHead className="text-right">Premium Collected</TableHead>
                  <TableHead className="text-right">Trade P&amp;L</TableHead>
                  <TableHead className="text-right">Cumulative P&amp;L</TableHead>
                  <TableHead className="pr-5 text-left">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const kind = outcomeKind(row)
                  return (
                    <TableRow
                      key={row.Date}
                      className="border-[#262833] hover:bg-white/[0.02]"
                    >
                      <TableCell className="pl-5 text-left text-foreground">
                        {shortDate(row.Date)}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {usd.format(row.Spot_Entry)}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {usd.format(row.Strike)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {otmPct(row).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-left font-sans text-foreground">
                        {fsmAction(row)}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {usd.format(row.Premium)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right",
                          row.PnL > 0 ? "text-emerald-400" : "text-muted-foreground"
                        )}
                      >
                        {usd.format(row.PnL)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {usd.format(row.Cumulative_PnL)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "pr-5 text-left font-sans font-medium",
                          outcomeColor[kind]
                        )}
                      >
                        {row.Outcome.replace("->", "→")}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
