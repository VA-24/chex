"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock data for depression levels
const MOCK_DEPRESSION_DATA = {
  "john-doe": {
    daily: [
      { name: "Apr 1", value: 5, severity: "medium" },
      { name: "Apr 2", value: 6, severity: "medium" },
      { name: "Apr 3", value: 7, severity: "high" },
      { name: "Apr 4", value: 4, severity: "medium" },
      { name: "Apr 5", value: 8, severity: "high" },
      { name: "Apr 6", value: 5, severity: "medium" },
      { name: "Apr 7", value: 3, severity: "low" },
      { name: "Apr 8", value: 4, severity: "medium" },
      { name: "Apr 9", value: 5, severity: "medium" },
      { name: "Apr 10", value: 6, severity: "medium" },
      { name: "Apr 11", value: 4, severity: "medium" },
      { name: "Apr 12", value: 3, severity: "low" },
      { name: "Apr 13", value: 2, severity: "low" },
      { name: "Apr 14", value: 4, severity: "medium" },
    ],
    weekly: [
      { name: "Week 1", value: 5.5, severity: "medium" },
      { name: "Week 2", value: 4.8, severity: "medium" },
      { name: "Week 3", value: 4.2, severity: "medium" },
      { name: "Week 4", value: 3.7, severity: "medium" },
      { name: "Week 5", value: 4.5, severity: "medium" },
      { name: "Week 6", value: 3.9, severity: "medium" },
      { name: "Week 7", value: 3.2, severity: "low" },
      { name: "Week 8", value: 2.8, severity: "low" },
    ],
    monthly: [
      { name: "Jan", value: 6.2, severity: "medium" },
      { name: "Feb", value: 5.7, severity: "medium" },
      { name: "Mar", value: 4.9, severity: "medium" },
      { name: "Apr", value: 4.3, severity: "medium" },
    ],
  },
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const color = data.severity === "low" ? "#22c55e" : data.severity === "medium" ? "#eab308" : "#ef4444"

    return (
      <div className="bg-[#1a1a1a] p-3 border border-purple-500/20 rounded-md shadow-md">
        <p className="font-medium text-purple-200">{label}</p>
        <div className="flex items-center mt-1">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          <p className="text-sm text-purple-200">
            Depression Level: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
        <p className="text-xs text-purple-200/70 mt-1">
          Severity: {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
        </p>
      </div>
    )
  }

  return null
}

// Custom dot component for the line chart
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props

  // Check if payload exists and has a severity property
  if (!payload || !payload.severity) {
    // Default color if severity is not available
    return <circle cx={cx} cy={cy} r={5} fill="#94a3b8" stroke="white" strokeWidth={2} />
  }

  const color = payload.severity === "low" ? "#22c55e" : payload.severity === "medium" ? "#eab308" : "#ef4444"

  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />
}

interface DepressionHeatmapProps {
  patientId: string
}

export default function DepressionHeatmap({ patientId }: DepressionHeatmapProps) {
  const [activeTab, setActiveTab] = useState("daily")
  const patientData = MOCK_DEPRESSION_DATA[patientId as keyof typeof MOCK_DEPRESSION_DATA]

  if (!patientData) {
    return <div>No data available for this patient</div>
  }

  // Calculate statistics
  const dailyData = patientData.daily
  const averageLevel = (dailyData.reduce((sum, item) => sum + item.value, 0) / dailyData.length).toFixed(1)
  const highestLevel = Math.max(...dailyData.map((item) => item.value))
  const highestLevelDate = dailyData.find((item) => item.value === highestLevel)?.name

  // Calculate trend (difference between average of first 7 days and last 7 days)
  const firstWeekAvg = dailyData.slice(0, 7).reduce((sum, item) => sum + item.value, 0) / 7
  const lastWeekAvg = dailyData.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7
  const trend = (lastWeekAvg - firstWeekAvg).toFixed(1)
  const trendImproving = lastWeekAvg < firstWeekAvg

  return (
    <div className="space-y-6">
      <Card className="bg-[#1a1a1a] border-purple-500/20">
        <CardHeader className="pb-0">
          <CardTitle className="text-purple-200">Depression Level Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-[#1a1a1a] border-purple-500/20">
              <TabsTrigger value="daily" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200 text-purple-200/70">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200 text-purple-200/70">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200 text-purple-200/70">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientData.daily} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d2d" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={<CustomDot />}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="weekly" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientData.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d2d" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={<CustomDot />}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientData.monthly} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d2d" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#a78bfa" }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {patientData.monthly.map((entry, index) => (
                      <rect
                        key={`rect-${index}`}
                        x={0}
                        y={0}
                        width={20}
                        height={20}
                        fill={
                          entry.severity === "low" ? "#22c55e" : entry.severity === "medium" ? "#eab308" : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-200">Average Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-purple-400">{averageLevel}</div>
            <p className="text-sm text-center text-purple-200/70">Last 14 days</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-200">Highest Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-red-400">{highestLevel.toFixed(1)}</div>
            <p className="text-sm text-center text-purple-200/70">{highestLevelDate}, 2025</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-200">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold text-center ${trendImproving ? "text-green-400" : "text-red-400"}`}>
              <span className="flex items-center justify-center">
                {trendImproving ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
                {trendImproving ? "Improving" : "Worsening"}
              </span>
            </div>
            <p className="text-sm text-center text-purple-200/70">
              {trendImproving ? "" : "+"}
              {trend} over 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a1a1a] border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500/50 rounded">
              <h4 className="font-medium text-yellow-200">Trigger Events</h4>
              <p className="text-sm text-yellow-200/70 mt-1">
                Depression levels spike around academic exams and large social gatherings. Consider additional support
                during these periods.
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border-l-4 border-green-500/50 rounded">
              <h4 className="font-medium text-green-200">Positive Patterns</h4>
              <p className="text-sm text-green-200/70 mt-1">
                Regular therapy sessions correlate with improved mood in the following days. Maintaining consistent
                session schedule is recommended.
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500/50 rounded">
              <h4 className="font-medium text-purple-200">Suggested Actions</h4>
              <p className="text-sm text-purple-200/70 mt-1">
                Schedule additional check-ins before upcoming exams. Consider implementing stress management techniques
                and providing resources for social anxiety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

