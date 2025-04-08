"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Settings, Trash2, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type MaintenanceEvent = {
  id: string
  type: string
  maintenanceType: string
  startDate?: string
  expectedCompletion?: string
  scheduledDate?: string
  duration?: string
  priority?: string
  status?: string
  technician?: string
  assignedTo?: string
}

interface MaintenanceCalendarProps {
  activeMaintenance: MaintenanceEvent[]
  scheduledMaintenance: MaintenanceEvent[]
  onStartMaintenance: (item: MaintenanceEvent) => void
  onUpdateStatus: (item: MaintenanceEvent) => void
  onDeleteMaintenance: (item: MaintenanceEvent, type: string) => void
}

export function MaintenanceCalendar({
  activeMaintenance,
  scheduledMaintenance,
  onStartMaintenance,
  onUpdateStatus,
  onDeleteMaintenance,
}: MaintenanceCalendarProps) {
  const { toast } = useToast()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
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
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-amber-100 text-amber-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "On Hold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-amber-100 text-amber-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Format date to string (YYYY-MM-DD)
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Compare dates (ignoring time)
  const isSameDay = (date1: Date, date2: string) => {
    const d1 = formatDateToString(date1)
    const d2 = date2
    return d1 === d2
  }

  // Get maintenance events for a specific date
  const getMaintenanceForDate = (date: Date) => {
    const events = []

    // Add active maintenance
    for (const item of activeMaintenance) {
      if (!item.startDate || !item.expectedCompletion) continue

      const startDate = new Date(item.startDate)
      const endDate = new Date(item.expectedCompletion)

      if (date >= startDate && date <= endDate) {
        events.push({
          ...item,
          eventType: "active",
        })
      }
    }

    // Add scheduled maintenance
    for (const item of scheduledMaintenance) {
      if (!item.scheduledDate) continue

      if (isSameDay(date, item.scheduledDate)) {
        events.push({
          ...item,
          eventType: "scheduled",
        })
      }
    }

    return events
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Create calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-28 border border-gray-200 p-1 bg-gray-50"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day)
    const dayEvents = getMaintenanceForDate(currentDate)
    const isCurrentDay = isToday(currentDate)
    const isSelectedDay = isSelected(currentDate)

    calendarDays.push(
      <div
        key={day}
        className={`h-28 border border-gray-200 p-1 overflow-hidden cursor-pointer 
          ${isCurrentDay ? "bg-blue-50 border-blue-300" : ""} 
          ${isSelectedDay ? "bg-rose-50 border-rose-200" : ""}
          hover:bg-gray-50
        `}
        onClick={() => setSelectedDate(currentDate)}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isCurrentDay ? "text-blue-600" : ""}`}>{day}</span>
          {dayEvents.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {dayEvents.length} {dayEvents.length === 1 ? "task" : "tasks"}
            </Badge>
          )}
        </div>
        <div className="space-y-1 overflow-hidden">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className={`text-xs p-1 rounded truncate ${
                event.eventType === "active"
                  ? getStatusColor(event.status || "In Progress")
                  : getPriorityColor(event.priority || "Normal")
              }`}
              title={`${event.id} - ${event.maintenanceType} (${event.eventType === "active" ? "In Progress" : "Scheduled"})`}
            >
              {event.id}: {event.maintenanceType}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>,
    )
  }

  const selectedDateEvents = getMaintenanceForDate(selectedDate)

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Maintenance Calendar</CardTitle>
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
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center py-2 font-medium text-sm">
                {day}
              </div>
            ))}
            {calendarDays}
          </div>
        </CardContent>
      </Card>

      {selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Maintenance on{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{event.id}</div>
                      <div className="text-sm mt-1">{event.maintenanceType}</div>
                      {event.eventType === "active" ? (
                        <div className="text-xs text-muted-foreground mt-1">
                          Start: {event.startDate} • Expected Completion: {event.expectedCompletion}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-1">
                          Scheduled: {event.scheduledDate} • Duration: {event.duration}
                        </div>
                      )}
                      <div className="text-xs mt-1">
                        {event.eventType === "active"
                          ? `Technician: ${event.technician}`
                          : `Assigned To: ${event.assignedTo}`}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        event.eventType === "active"
                          ? "bg-amber-500 text-white"
                          : event.priority === "High"
                            ? "bg-red-500 text-white"
                            : event.priority === "Medium"
                              ? "bg-amber-500 text-white"
                              : "bg-green-500 text-white"
                      }
                    >
                      {event.eventType === "active" ? event.status : event.priority}
                    </Badge>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    {event.eventType === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onUpdateStatus(event)
                          toast({
                            title: "Update Status",
                            description: `Update status for maintenance ${event.id}`,
                          })
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onStartMaintenance(event)
                          toast({
                            title: "Maintenance Started",
                            description: `Maintenance for vehicle ${event.id} has been started.`,
                          })
                        }}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Maintenance
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        onDeleteMaintenance(event, event.eventType)
                        toast({
                          title: "Delete Maintenance",
                          description: `Delete maintenance record for ${event.id}`,
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

