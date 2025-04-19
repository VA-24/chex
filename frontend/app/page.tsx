import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center 
            bg-gradient-to-br from-black to-green-900
            p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">Chex</h1>
          <p className="text-xl text-gray-400">AI-Driven Mental Health Voice Agent for Proactive Student Support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-green-900/20 hover:border-green-900/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Patient Portal</CardTitle>
              <CardDescription className="text-gray-400">Access your calendar, check-in history, and upcoming therapy sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-full flex flex-col">
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    View your calendar with important events
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Review history of Chex check-ins
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Manage upcoming therapy sessions
                  </li>
                </ul>
                <Link href="/patient/dashboard" className="block w-full mt-auto">
                  <Button className="w-full bg-green-900 hover:bg-green-900/90 text-white border-0">
                    Enter Patient Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-green-900/20 hover:border-green-900/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Therapist Portal</CardTitle>
              <CardDescription className="text-gray-400">Manage your patients and review their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-full flex flex-col">
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    View list of all patients
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Access patient check-in history
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-900 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Review depression level heatmaps
                  </li>
                </ul>
                <Link href="/therapist/dashboard" className="block w-full mt-auto">
                  <Button className="w-full bg-green-900 hover:bg-green-900/90 text-white border-0">
                    Enter Therapist Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

