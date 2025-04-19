"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for patients
const MOCK_PATIENTS = [
  {
    id: "john-doe",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    status: "high",
    lastCheckIn: "Today",
    nextSession: "Today, 6:00 PM",
  },
  {
    id: "emily-chen",
    name: "Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EC",
    status: "medium",
    lastCheckIn: "Yesterday",
    nextSession: "Apr 8, 3:00 PM",
  },
  {
    id: "michael-brown",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    status: "low",
    lastCheckIn: "2 days ago",
    nextSession: "Apr 10, 2:00 PM",
  },
  {
    id: "sophia-garcia",
    name: "Sophia Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SG",
    status: "medium",
    lastCheckIn: "Today",
    nextSession: "Apr 7, 11:00 AM",
  },
  {
    id: "david-kim",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DK",
    status: "low",
    lastCheckIn: "3 days ago",
    nextSession: "Apr 12, 4:00 PM",
  },
]

interface PatientListProps {
  selectedPatient: string | null
  onSelectPatient: (patientId: string) => void
}

export default function PatientList({ selectedPatient, onSelectPatient }: PatientListProps) {
  return (
    <div className="divide-y divide-green-900/20">
      {MOCK_PATIENTS.map((patient) => (
        <button
          key={patient.id}
          className={cn(
            "w-full px-4 py-3 flex items-center justify-between hover:bg-green-900/10 transition-colors",
            selectedPatient === patient.id && "bg-green-900/20"
          )}
          onClick={() => onSelectPatient(patient.id)}
        >
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-green-900/20 text-green-900">{patient.initials}</AvatarFallback>
            </Avatar>
            <div className="ml-3 text-left">
              <div className="text-sm font-medium text-white">{patient.name}</div>
              <div className="text-xs text-gray-400">{patient.nextSession}</div>
            </div>
          </div>
          <div className="flex items-center">
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
              patient.status === "high" && "bg-red-500/20 text-red-200",
              patient.status === "medium" && "bg-yellow-500/20 text-yellow-200",
              patient.status === "low" && "bg-green-900/20 text-green-900"
            )}>
              {patient.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

