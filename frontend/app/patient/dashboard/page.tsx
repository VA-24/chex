"use client"

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MonthlyCalendar from "@/components/patient/monthly-calendar"
import CheckInHistory from "@/components/patient/check-in-history"
import UpcomingSessions from "@/components/patient/upcoming-sessions"

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#1a1a1a] border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Chex</h1>
                <span className="ml-2 text-sm bg-green-900/20 text-green-900 py-1 px-2 rounded-md">Patient</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-green-900/20 text-green-900">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#1a1a1a]">
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-green-900 data-[state=active]:text-white text-gray-400"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-green-900 data-[state=active]:text-white text-gray-400"
            >
              Check-in History
            </TabsTrigger>
            <TabsTrigger 
              value="sessions"
              className="data-[state=active]:bg-green-900 data-[state=active]:text-white text-gray-400"
            >
              Upcoming Sessions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MonthlyCalendar />
              </div>

              <div className="space-y-6">
                <div className="bg-[#1a1a1a] rounded-lg border border-green-900/20 p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Your Therapist</h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Smith" />
                      <AvatarFallback className="bg-green-900/20 text-green-900">DS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">Dr. Sarah Smith</p>
                      <p className="text-sm text-gray-400">Next session: Friday, 3:00 PM</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-green-900 hover:bg-green-900/90 text-white border-0">
                    Message Therapist
                  </Button>
                </div>

                
              
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <CheckInHistory />
          </TabsContent>
          <TabsContent value="sessions" className="mt-0">
            <UpcomingSessions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

