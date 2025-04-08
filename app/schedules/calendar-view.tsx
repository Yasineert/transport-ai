"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CalendarEvent = {
  id: number
  title: string
  routeNumber: string
  startTime: string
  endTime: string
  driver: string
  vehicle: string
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({})

  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Mock data for calendar events
  useState(() => {
    const mockEvents: Record<string, CalendarEvent[]> = {}

    // Generate some random events for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      // Add events to some random days
      if (Math.random() > 0.7) {
        const dateKey = `${year}-${month + 1}-${i}`
        mockEvents[dateKey] = [
          {
            id: i * 100 + 1,
            title: "Route Schedule",
            routeNumber: `R-${Math.floor(Math.random() * 20) + 1}`,
            startTime: `${Math.floor(Math.random() * 12) + 7}:00`,
            endTime: `${Math.floor(Math.random() * 12) + 13}:00`,
            driver: `Driver ${Math.floor(Math.random() * 10) + 1}`,
            vehicle: `BUS-${Math.floor(Math.random() * 1000) + 1000}`,
          },
        ]

        // Add a second event to some days
        if (Math.random() > 0.7) {
          mockEvents[dateKey].push({
            id: i * 100 + 2,
            title: "Special Service",
            routeNumber: `S-${Math.floor(Math.random() * 5) + 1}`,
            startTime: `${Math.floor(Math.random() * 4) + 16}:00`,
            endTime: `${Math.floor(Math.random() * 4) + 20}:00`,
            driver: `Driver ${Math.floor(Math.random() * 10) + 1}`,
            vehicle: `BUS-${Math.floor(Math.random() * 1000) + 1000}`,
          })
        }
      }
    }

    setEvents(mockEvents)
  }, [currentDate])

  // Create calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 p-1 bg-gray-50"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month + 1}-${day}`
    const dayEvents = events[dateKey] || []
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-1 overflow-hidden ${isToday ? "bg-blue-50 border-blue-300" : ""}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
          {dayEvents.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
            </Badge>
          )}
        </div>
        <div className="space-y-1 overflow-hidden">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="text-xs p-1 rounded bg-emerald-100 text-emerald-800 truncate"
              title={`${event.title} - ${event.routeNumber} (${event.startTime}-${event.endTime})`}
            >
              {event.routeNumber}: {event.startTime}
            </div>
          ))}
        </div>
      </div>,
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Schedule Calendar</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-lg font-medium">
          {monthNames[month]} {year}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div key={day} className="text-center py-2 font-medium text-sm">
              {day}
            </div>
          ))}
          {calendarDays}
        </div>
      </CardContent>
    </Card>
  )
}

