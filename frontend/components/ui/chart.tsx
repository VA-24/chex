import type * as React from "react"

const Chart = () => {
  return null
}

type ChartTooltipContentProps = {
  children: React.ReactNode
}

const ChartTooltipContent = ({ children }: ChartTooltipContentProps) => {
  return <div className="rounded-md border bg-popover p-4 shadow-sm">{children}</div>
}

type ChartTooltipItemProps = {
  label: string
  value: string | number
  color: string
}

const ChartTooltipItem = ({ label, value, color }: ChartTooltipItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export { Chart, ChartTooltip, ChartTooltipContent, ChartTooltipItem, ChartContainer }

