"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCheckInData } from "@/hooks/useCheckInData"

export default function CheckInHistory() {
  const { checkInData, loading, error } = useCheckInData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-900" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-400 py-4">Failed to load check-in history</div>
  }

  if (!checkInData?.has_occurred) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Recent Check-ins</h3>
        </div>
        <Card className="bg-[#1a1a1a] border-green-900/20">
          <CardContent className="p-6 text-center text-gray-400">No check-in history available</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Recent Check-ins</h3>
      </div>

      <div className="space-y-4">
        <Card className="bg-[#1a1a1a] border-green-900/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="w-2 bg-green-900"></div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-white">Chex Check-in</h4>
                      <Badge className="bg-green-900/20 text-green-900">Completed</Badge>
                    </div>
                    <p className="text-sm text-gray-400">April 18, 2025 at 2:45 PM</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#111111] rounded-lg">
                  <p className="text-sm text-gray-400 whitespace-pre-line font-mono">{checkInData.transcript}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-white">Summary: </span>
                    {checkInData.summary}
                  </p>
                  {checkInData.appointment_recommended && (
                    <p className="mt-2 text-sm text-green-900">
                      ⚡ Therapy appointment recommended and scheduled for April 19, 2025 at 3:00 PM
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

