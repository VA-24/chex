"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TranscriptModal } from "./transcript-modal"
import { supabase } from "@/lib/supabase"
import { useCheckInData } from "@/hooks/useCheckInData"

interface Event {
  id: string | number;
  title: string;
  date: string;
  time: string;
  type: string;
  checkIn: { before: boolean; after: boolean };
  has_checked_in?: boolean;
  summary?: string;
}

// Base events that are always shown
const BASE_EVENTS: Event[] = [

  {
    id: 13,
    title: "Hackathon",
    date: "2025-04-18",
    time: "All Day",
    type: "social",
    checkIn: { before: false, after: true },
  },
];

// Generate dates for the current month
const generateMonthDates = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate how many days from the previous month we need to show
  const prevMonthDays = firstDayOfWeek

  // Calculate how many days from the next month we need to show
  // We want to show 6 weeks (42 days) total
  const totalDaysToShow = 42
  const nextMonthDays = totalDaysToShow - daysInMonth - prevMonthDays

  const dates = []

  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

  for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
    const date = new Date(prevMonthYear, prevMonth, i)
    dates.push({
      date,
      dateString: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      isToday: date.toDateString() === new Date().toDateString(),
    })
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    dates.push({
      date,
      dateString: date.toISOString().split("T")[0],
      isCurrentMonth: true,
      isToday: date.toDateString() === new Date().toDateString(),
    })
  }

  // Add days from next month
  const nextMonth = month === 11 ? 0 : month + 1
  const nextMonthYear = month === 11 ? year + 1 : year

  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(nextMonthYear, nextMonth, i)
    dates.push({
      date,
      dateString: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      isToday: date.toDateString() === new Date().toDateString(),
    })
  }

  return dates
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
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isToday: date.toDateString() === today.toDateString(),
    })
  }

  return dates
}

// Get month name
const getMonthName = (month: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return monthNames[month]
}

// Days of the week
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function MonthlyCalendar() {
  const { checkInData, loading: checkInLoading } = useCheckInData();
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0])
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Add check-in and therapy events based on data
  const events = useMemo(() => {
    const allEvents = [...BASE_EVENTS];

    if (checkInData?.has_occurred) {
      // Add the check-in event
      allEvents.push({
        id: "checkin-1",
        title: "Chex Check-in",
        date: "2025-04-18",
        time: "2:45 PM",
        type: "checkin",
        checkIn: { before: false, after: false },
        has_checked_in: true,
        summary: checkInData.summary
      });

      // Only add therapy session if appointment is recommended
      if (checkInData.appointment_recommended) {
        allEvents.push({
          id: "therapy-1",
          title: "Therapy Session",
          date: "2025-04-19",
          time: "3:00 PM",
          type: "therapy",
          checkIn: { before: false, after: false },
        });
      }
    }

    return allEvents;
  }, [checkInData]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: string): Event[] => {
    return events.filter((event: Event) => event.date === date);
  }, [events]);

  const monthDates = generateMonthDates(currentYear, currentMonth)
  const weekDates = generateWeekDates()
  const displayDates = viewMode === "month" ? monthDates : weekDates

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToPreviousWeek = () => {
    const date = new Date(weekDates[0].date)
    date.setDate(date.getDate() - 7)
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
  }

  const goToNextWeek = () => {
    const date = new Date(weekDates[0].date)
    date.setDate(date.getDate() + 7)
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
  }

  const goToPrevious = () => {
    if (viewMode === "month") {
      goToPreviousMonth()
    } else {
      goToPreviousWeek()
    }
  }

  const goToNext = () => {
    if (viewMode === "month") {
      goToNextMonth()
    } else {
      goToNextWeek()
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "week" : "month")
  }

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={goToPrevious} className="text-gray-400 hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h3 className="text-lg font-medium text-white">
            {viewMode === "month"
              ? `${getMonthName(currentMonth)} ${currentYear}`
              : `Week of ${weekDates[0].date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </h3>
          <button onClick={goToNext} className="text-gray-400 hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <Button 
          variant="outline" 
          onClick={toggleViewMode}
          className="bg-green-900 text-white hover:bg-green-900/90 border-0"
        >
          {viewMode === "month" ? "Week View" : "Month View"}
        </Button>
      </div>

      {viewMode === "month" ? (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {displayDates.map((day) => {
              const dayEvents = getEventsForDate(day.dateString)
              const hasEvents = dayEvents.length > 0

              return (
                <button
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`p-2 h-20 rounded-lg text-left transition-colors ${
                    day.dateString === selectedDate
                      ? "bg-green-900 text-white"
                      : day.isToday
                        ? "bg-[#1a1a1a] text-white"
                        : day.isCurrentMonth
                          ? "bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-gray-300"
                          : "bg-[#1a1a1a]/50 text-gray-500 hover:bg-[#1a1a1a]/60"
                  }`}
                >
                  <div className="text-sm font-medium">{day.date.getDate()}</div>
                  {hasEvents && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs truncate rounded px-1 ${
                            day.dateString === selectedDate
                              ? "bg-white/20 text-white"
                              : event.type === "exam"
                                ? "bg-red-500/20 text-red-200"
                                : event.type === "therapy"
                                  ? "bg-green-900/20 text-green-900"
                                  : event.type === "checkin"
                                    ? "bg-green-900/20 text-green-900"
                                    : event.type === "social"
                                      ? "bg-green-900/20 text-green-900"
                                      : "bg-green-900/20 text-green-900"
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {displayDates.map((day) => (
            <button
              key={day.dateString}
              onClick={() => setSelectedDate(day.dateString)}
              className={`p-4 rounded-lg text-center transition-colors ${
                day.dateString === selectedDate
                  ? "bg-green-900 text-white"
                  : day.isToday
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-gray-300"
              }`}
            >
              <div className="text-xs font-medium">{DAYS_OF_WEEK[day.date.getDay()]}</div>
              <div className="text-lg font-bold">{day.date.getDate()}</div>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">
          Events
        </h3>

        {getEventsForDate(selectedDate).length === 0 ? (
          <Card className="bg-[#1a1a1a] border-green-900/20">
            <CardContent className="p-6 text-center text-gray-400">No events scheduled for this day</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {getEventsForDate(selectedDate).map((event) => (
              <Card 
                key={event.id} 
                className={`bg-[#1a1a1a] border-green-900/20 overflow-hidden ${
                  event.type === "checkin" && !event.has_checked_in ? "opacity-50" : "cursor-pointer hover:bg-green-900/5"
                }`}
                onClick={() => {
                  if (event.type === "checkin" && event.has_checked_in) {
                    handleEventClick(event.id.toString())
                  }
                }}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div
                      className={`w-2 ${
                        event.type === "exam"
                          ? "bg-red-500"
                          : event.type === "study"
                            ? "bg-green-400"
                            : event.type === "therapy"
                              ? "bg-green-600"
                              : event.type === "social"
                                ? "bg-green-500"
                                : event.type === "checkin"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <p className="text-sm text-green-200">{event.time}</p>
                          {event.type === "checkin" && event.has_checked_in && event.summary && (
                            <p className="mt-2 text-sm text-green-200/80">{event.summary}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {event.type === "checkin" && (
                            <Badge className={event.has_checked_in ? "bg-green-500/20 text-green-200" : "bg-green-600/20 text-green-200"}>
                              {event.has_checked_in ? "Completed" : "Pending"}
                            </Badge>
                          )}
                          {event.type === "exam" && <Badge className="bg-red-500/20 text-red-200">Exam</Badge>}
                          {event.type === "social" && <Badge className="bg-green-400/20 text-green-200">Social</Badge>}
                          {event.type === "therapy" && <Badge className="bg-green-600/20 text-green-200">Therapy</Badge>}
                        </div>
                      </div>

                      {(event.checkIn?.before || event.checkIn?.after) && (
                        <div className="mt-3 pt-3 border-t border-green-900/20 flex space-x-3">
                          {event.checkIn.before && (
                            <Badge variant="outline" className="text-xs border-green-900/50 text-green-200">
                              Pre-event check-in
                            </Badge>
                          )}
                          {event.checkIn.after && (
                            <Badge variant="outline" className="text-xs border-green-900/50 text-green-200">
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

      {selectedEventId && (
        <TranscriptModal
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          eventId={selectedEventId}
        />
      )}
    </div>
  )
}

