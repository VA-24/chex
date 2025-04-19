"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for patient events
const MOCK_PATIENT_DATA = {
  "john-doe": {
    events: [
      {
        id: 1,
        title: "CS 101 Exam",
        date: "2025-04-05",
        time: "10:00 AM - 12:00 PM",
        type: "exam",
      },
      {
        id: 2,
        title: "Study Group",
        date: "2025-04-05",
        time: "3:00 PM - 5:00 PM",
        type: "study",
      },
      {
        id: 3,
        title: "Therapy Session",
        date: "2025-04-05",
        time: "6:00 PM - 7:00 PM",
        type: "therapy",
      },
      {
        id: 4,
        title: "Campus Party",
        date: "2025-04-06",
        time: "9:00 PM - 1:00 AM",
        type: "social",
      },
      {
        id: 5,
        title: "Hackathon",
        date: "2025-04-07",
        time: "9:00 AM - 9:00 PM",
        type: "study",
      },
      {
        id: 6,
        title: "Post-Hackathon Check-in",
        date: "2025-04-07",
        time: "9:30 PM",
        type: "checkin",
        summary: "John reported feeling mentally exhausted after the hackathon but proud of his team's accomplishments. Mentioned some anxiety about upcoming project deadlines.",
      },
      {
        id: 7,
        title: "Weekly Check-in Call",
        date: "2025-04-18",
        time: "3:00 PM",
        type: "checkin",
        transcript: "AI: How are you feeling today, John?\nJohn: I've been feeling pretty overwhelmed lately with all the assignments piling up.\nAI: I understand that feeling. Can you tell me more about what's causing the most stress?\nJohn: The database project is due next week, and I'm struggling with some concepts. Plus, I haven't been sleeping well.\nAI: That sounds really challenging. How has your sleep been affected?\nJohn: I keep staying up late trying to work on assignments, but then I can't fall asleep because my mind is racing.",
        summary: "John expressed significant academic stress, particularly regarding an upcoming database project. He reported disrupted sleep patterns due to late-night studying and racing thoughts. Physical symptoms include fatigue and difficulty concentrating.",
        insights: [
          "Sleep disruption pattern emerging - recommend sleep hygiene review",
          "Academic stress at elevated levels - may benefit from study planning session",
          "Signs of anxiety around project deadlines - consider coping strategies discussion",
          "Positive engagement with check-in process despite stress"
        ]
      }
    ]
  },
}

// Days of the week
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Generate dates for the current week
const generateWeekDates = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates = []

  // Start from the beginning of the current week (Sunday)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - today.getDay())

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    dates.push({
      date,
      dateString: date.toISOString().split("T")[0],
      day: DAYS[date.getDay()],
      isToday: date.getTime() === today.getTime(),
    })
  }

  return dates
}

interface PatientCalendarProps {
  patientId: string
}

export default function PatientCalendar({ patientId }: PatientCalendarProps) {
  const weekDates = generateWeekDates()
  const [selectedDate, setSelectedDate] = useState(
    weekDates.find((d) => d.isToday)?.dateString || weekDates[0].dateString,
  )

  const patientData = MOCK_PATIENT_DATA[patientId as keyof typeof MOCK_PATIENT_DATA]

  if (!patientData) {
    return <div className="text-purple-200">No data available for this patient</div>
  }

  const selectedEvents = patientData.events.filter((event) => event.date === selectedDate)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((day) => (
          <button
            key={day.dateString}
            onClick={() => setSelectedDate(day.dateString)}
            className={`p-4 rounded-lg text-center transition-colors ${
              day.dateString === selectedDate
                ? "bg-green-900 text-white"
                : day.isToday
                  ? "bg-green-900/10 text-white"
                  : "bg-[#1a1a1a] border border-green-900/20 hover:bg-green-900/10 text-white"
            }`}
          >
            <div className="text-xs font-medium text-gray-400">{day.day.substring(0, 3)}</div>
            <div className="text-lg font-bold">{day.date.getDate()}</div>
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-white">
          Events for{" "}
          {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>
        {selectedEvents.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-green-900/20">
            <CardContent className="p-6 text-center text-gray-400">No events scheduled for this day</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedEvents.map((event) => (
              <Card key={event.id} className="mb-3 overflow-hidden bg-[#1a1a1a] border-green-900/20">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div
                      className={`w-2 ${
                        event.type === "exam"
                          ? "bg-red-400"
                          : event.type === "study"
                            ? "bg-blue-400"
                            : event.type === "therapy"
                              ? "bg-green-900"
                              : event.type === "social"
                                ? "bg-yellow-400"
                                : event.type === "checkin"
                                  ? "bg-green-900"
                                  : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <p className="text-sm text-gray-400">{event.time}</p>
                        </div>
                        <Badge
                          className={`${
                            event.type === "exam"
                              ? "bg-red-500/20 text-red-200"
                              : event.type === "study"
                                ? "bg-blue-500/20 text-blue-200"
                                : event.type === "therapy"
                                  ? "bg-green-900/20 text-green-200"
                                  : event.type === "social"
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : event.type === "checkin"
                                      ? "bg-green-900/20 text-green-200"
                                      : "bg-gray-500/20 text-gray-200"
                          }`}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      {event.type === "checkin" && (event.summary || event.transcript) && (
                        <div className="mt-3 pt-3 border-t border-green-900/20">
                          {event.transcript && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-white mb-2">Call Transcript</h5>
                              <pre className="text-sm text-gray-400 whitespace-pre-wrap font-mono bg-black/20 p-3 rounded">
                                {event.transcript}
                              </pre>
                            </div>
                          )}
                          {event.summary && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-white mb-2">Summary</h5>
                              <p className="text-sm text-gray-400">{event.summary}</p>
                            </div>
                          )}
                          {event.insights && (
                            <div>
                              <h5 className="text-sm font-medium text-white mb-2">Key Insights</h5>
                              <ul className="list-disc list-inside text-sm text-gray-400">
                                {event.insights.map((insight, index) => (
                                  <li key={index}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

