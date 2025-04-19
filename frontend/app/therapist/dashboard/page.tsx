"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import PatientList from "@/components/therapist/patient-list"
import PatientCalendar from "@/components/therapist/patient-calendar"
import DepressionHeatmap from "@/components/therapist/depression-heatmap"

export default function TherapistDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedPatient, setSelectedPatient] = useState<string | null>("john-doe")

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="bg-[#1a1a1a] border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-green-200">Chex</h1>
                <span className="ml-2 text-sm bg-green-500/20 text-green-200 py-1 px-2 rounded-md">Therapist</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Smith" />
                <AvatarFallback className="bg-green-500/20 text-green-200">DS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-[#1a1a1a] border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Patients</CardTitle>
                <div className="mt-2">
                  <Input placeholder="Search patients..." className="w-full bg-[#1a1a1a] border-green-500/20 text-green-200 placeholder-green-200/50" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <PatientList selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedPatient ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="John Doe" />
                      <AvatarFallback className="bg-green-500/20 text-green-200">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-white">John Doe</h2>
                      <p className="text-gray-600">Student, 21 years old</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white">Schedule Session</Button>
                  </div>
                </div>

                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#1a1a1a] border-green-500/20">
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-white">Calendar & Check-ins</TabsTrigger>
                    <TabsTrigger value="heatmap" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-white">Depression Heatmap</TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar" className="mt-0">
                    <PatientCalendar patientId={selectedPatient} />
                  </TabsContent>
                  <TabsContent value="heatmap" className="mt-0">
                    <DepressionHeatmap patientId={selectedPatient} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-green-200/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-green-200">Select a patient</h3>
                  <p className="mt-1 text-green-200/70">Choose a patient from the list to view their details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

