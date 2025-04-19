"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for the calendar
const MOCK_EVENTS = [
  {
    id: 1,
    title: "CS 101 Exam",
    date: "2025-04-05",
    time: "10:00 AM - 12:00 PM",
    type: "exam",
    checkIn: { before: false, after: true },
  },
  {
    id: 2,
    title: "Study Group",
    date: "2025-04-05",
    time: "3:00 PM - 5:00 PM",
    type: "study",
    checkIn: { before: false, after: false },
  },
  {
    id: 3,
    title: "Therapy Session",
    date: "2025-04-05",
    time: "6:00 PM - 7:00 PM",
    type: "therapy",
    checkIn: { before: false, after: false },
  },
  {
    id: 4,
    title: "Campus Party",
    date: "2025-04-06",
    time: "9:00 PM - 1:00 AM",
    type: "social",
    checkIn: { before: true, after: true },
  },
  {
    id: 5,
    title: "Math 202 Test",
    date: "2025-04-08",
    time: "2:00 PM - 3:30 PM",
    type: "exam",
    checkIn: { before: true, after: false },
  },
  {
    id: 6,
    title: "Chex Check-in Call",
    date: "2025-04-05",
    time: "2:30 PM",
    type: "checkin",
    checkIn: { before: false, after: false },
  },
  {
    id: 7,
    title: "Chex Check-in Call",
    date: "2025-04-06",
    time: "8:30 PM",
    type: "checkin",
    checkIn: { before: false, after: false },
  },
]

// Days of the week
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Get events for a specific date
const getEventsForDate = (date: string) => {
  return MOCK_EVENTS.filter((event) => event.date === date)
}

// Generate dates for the current week
const generateWeekDates = () => {
  const today = new Date()
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
      isToday: date.toDateString() === today.toDateString(),
    })
  }

  return dates
}

export default function PatientCalendar() {
  const weekDates = generateWeekDates()
  const [selectedDate, setSelectedDate] = useState(
    weekDates.find((d) => d.isToday)?.dateString || weekDates[0].dateString,
  )

  const events = getEventsForDate(selectedDate)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((day) => (
          <button
            key={day.dateString}
            onClick={() => setSelectedDate(day.dateString)}
            className={`p-4 rounded-lg text-center transition-colors ${
              day.dateString === selectedDate
                ? "bg-purple-500/20 text-purple-200"
                : day.isToday
                  ? "bg-purple-500/10 text-purple-200"
                  : "bg-[#1a1a1a] border border-purple-500/20 hover:bg-purple-500/10 text-purple-200"
            }`}
          >
            <div className="text-xs font-medium">{day.day.substring(0, 3)}</div>
            <div className="text-lg font-bold">{day.date.getDate()}</div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-purple-200">
          Events for{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        {events.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-purple-500/20">
            <CardContent className="p-6 text-center text-purple-200/70">No events scheduled for this day</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden bg-[#1a1a1a] border-purple-500/20">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div
                      className={`w-2 ${
                        event.type === "exam"
                          ? "bg-red-400"
                          : event.type === "study"
                            ? "bg-blue-400"
                            : event.type === "therapy"
                              ? "bg-purple-400"
                              : event.type === "social"
                                ? "bg-yellow-400"
                                : event.type === "checkin"
                                  ? "bg-purple-400"
                                  : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-purple-200">{event.title}</h4>
                          <p className="text-sm text-purple-200/70">{event.time}</p>
                        </div>
                        <div className="flex space-x-2">
                          {event.type === "checkin" && <Badge className="bg-purple-500/20 text-purple-200">Chex Call</Badge>}
                          {event.type === "exam" && <Badge className="bg-red-500/20 text-red-200">Exam</Badge>}
                          {event.type === "social" && <Badge className="bg-yellow-500/20 text-yellow-200">Social</Badge>}
                          {event.type === "therapy" && <Badge className="bg-purple-500/20 text-purple-200">Therapy</Badge>}
                        </div>
                      </div>

                      {(event.checkIn.before || event.checkIn.after) && (
                        <div className="mt-3 pt-3 border-t border-purple-500/20 flex space-x-3">
                          {event.checkIn.before && (
                            <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-200">
                              Pre-event check-in
                            </Badge>
                          )}
                          {event.checkIn.after && (
                            <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-200">
                              Post-event check-in
                            </Badge>
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

