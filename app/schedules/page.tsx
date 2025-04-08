"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bus, Plus, Search, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CalendarIcon } from "lucide-react"
import { CalendarView } from "./calendar-view"

// Types
type Schedule = {
  id: number
  routeNumber: string
  routeName: string
  departureTime: string
  arrivalTime: string
  daysOfWeek: string[]
  driver: string
  vehicle: string
  status: "active" | "cancelled" | "completed"
}

// Mock data for schedules
const initialDailySchedules = [
  {
    id: "1",
    route: "Jemaa el-Fnaa - Gueliz",
    type: "Bus",
    firstDeparture: "06:00",
    lastDeparture: "23:00",
    frequency: "Every 15 min",
    status: "Active",
    vehiclesAssigned: 8,
  },
  {
    id: "2",
    route: "Railway Station - Menara Mall",
    type: "Bus",
    firstDeparture: "06:30",
    lastDeparture: "22:30",
    frequency: "Every 20 min",
    status: "Active",
    vehiclesAssigned: 6,
  },
  {
    id: "3",
    route: "Majorelle Garden - Palmeraie",
    type: "Bus",
    firstDeparture: "07:00",
    lastDeparture: "21:00",
    frequency: "Every 30 min",
    status: "Active",
    vehiclesAssigned: 4,
  },
  {
    id: "4",
    route: "Airport - City Center",
    type: "Bus",
    firstDeparture: "05:00",
    lastDeparture: "00:00",
    frequency: "Every 25 min",
    status: "Active",
    vehiclesAssigned: 5,
  },
  {
    id: "5",
    route: "Medina Taxi Zone",
    type: "Taxi",
    firstDeparture: "06:00",
    lastDeparture: "02:00",
    frequency: "On Demand",
    status: "Active",
    vehiclesAssigned: 12,
  },
]

const initialWeeklySchedules = [
  {
    id: "6",
    route: "Jemaa el-Fnaa - Gueliz",
    dayType: "Weekend",
    firstDeparture: "07:00",
    lastDeparture: "00:00",
    frequency: "Every 20 min",
    status: "Active",
    vehiclesAssigned: 6,
  },
  {
    id: "7",
    route: "Railway Station - Menara Mall",
    dayType: "Weekend",
    firstDeparture: "08:00",
    lastDeparture: "23:00",
    frequency: "Every 25 min",
    status: "Active",
    vehiclesAssigned: 5,
  },
  {
    id: "8",
    route: "Airport - City Center",
    dayType: "Holiday",
    firstDeparture: "05:30",
    lastDeparture: "01:00",
    frequency: "Every 20 min",
    status: "Active",
    vehiclesAssigned: 6,
  },
]

const initialSpecialSchedules = [
  {
    id: "9",
    event: "Marrakech Film Festival",
    routesAffected: "3 Routes",
    date: "Nov 24-Dec 2, 2023",
    timePeriod: "18:00-02:00",
    frequency: "Every 10 min",
    status: "Upcoming",
    extraVehicles: 12,
  },
  {
    id: "10",
    event: "Eid al-Fitr",
    routesAffected: "All Routes",
    date: "April 10-12, 2024",
    timePeriod: "05:00-02:00",
    frequency: "Increased by 30%",
    status: "Planned",
    extraVehicles: 25,
  },
  {
    id: "11",
    event: "Marrakech Marathon",
    routesAffected: "5 Routes",
    date: "January 28, 2024",
    timePeriod: "06:00-14:00",
    frequency: "Route Diversions",
    status: "Planned",
    extraVehicles: 8,
  },
]

// Routes for dropdown
const routes = [
  "Jemaa el-Fnaa - Gueliz",
  "Railway Station - Menara Mall",
  "Majorelle Garden - Palmeraie",
  "Airport - City Center",
  "Medina Taxi Zone",
  "Menara Gardens - Agdal",
  "Gueliz - University",
]

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCalendarView, setShowCalendarView] = useState(false)
  const { toast } = useToast()

  // Simulate data loading
  useState(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockSchedules: Schedule[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        routeNumber: `R-${Math.floor(Math.random() * 20) + 1}`,
        routeName: `${["Downtown", "Airport", "University", "Hospital", "Mall"][Math.floor(Math.random() * 5)]} to ${["Central", "North", "South", "East", "West"][Math.floor(Math.random() * 5)]}`,
        departureTime: `${Math.floor(Math.random() * 12) + 7}:${Math.random() > 0.5 ? "00" : "30"} ${Math.random() > 0.5 ? "AM" : "PM"}`,
        arrivalTime: `${Math.floor(Math.random() * 12) + 7}:${Math.random() > 0.5 ? "00" : "30"} ${Math.random() > 0.5 ? "AM" : "PM"}`,
        daysOfWeek: Array.from(
          { length: Math.floor(Math.random() * 7) + 1 },
          () =>
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
              Math.floor(Math.random() * 7)
            ],
        ).filter((day, index, self) => self.indexOf(day) === index), // Remove duplicates
        driver: `Driver ${Math.floor(Math.random() * 10) + 1}`,
        vehicle: `BUS-${Math.floor(Math.random() * 1000) + 1000}`,
        status: ["active", "cancelled", "completed"][Math.floor(Math.random() * 3)] as
          | "active"
          | "cancelled"
          | "completed",
      }))

      setSchedules(mockSchedules)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) => {
    const query = searchQuery.toLowerCase()
    return (
      schedule.routeNumber.toLowerCase().includes(query) ||
      schedule.routeName.toLowerCase().includes(query) ||
      schedule.driver.toLowerCase().includes(query) ||
      schedule.vehicle.toLowerCase().includes(query) ||
      schedule.daysOfWeek.some((day) => day.toLowerCase().includes(query))
    )
  })

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleView = () => {
    if (!showCalendarView) {
      // Initialize calendar when switching to calendar view
      setSelectedDate(new Date())
      setCurrentMonth(new Date())
    }
    setShowCalendarView(!showCalendarView)
  }

  const [error, setError] = useState(false)

  // State for schedules
  const [dailySchedules, setDailySchedules] = useState(initialDailySchedules)
  const [weeklySchedules, setWeeklySchedules] = useState(initialWeeklySchedules)
  const [specialSchedules, setSpecialSchedules] = useState(initialSpecialSchedules)

  // State for search and filters
  const [routeTypeFilter, setRouteTypeFilter] = useState("all")

  // State for dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCalendarDialog, setShowCalendarDialog] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [scheduleType, setScheduleType] = useState("daily")

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Form state for new/edit schedule
  const [scheduleForm, setScheduleForm] = useState({
    id: "",
    route: "",
    type: "Bus",
    firstDeparture: "",
    lastDeparture: "",
    frequency: "",
    vehiclesAssigned: 0,
    // For weekly schedules
    dayType: "Weekend",
    // For special schedules
    event: "",
    routesAffected: "",
    date: "",
    timePeriod: "",
    extraVehicles: 0,
  })

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter schedules based on search query and route type
  const filteredDailySchedules = dailySchedules.filter((item) => {
    const matchesSearch =
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frequency.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = routeTypeFilter === "all" || item.type.toLowerCase() === routeTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const filteredWeeklySchedules = weeklySchedules.filter((item) => {
    const matchesSearch =
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dayType.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const filteredSpecialSchedules = specialSchedules.filter((item) => {
    const matchesSearch =
      item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.routesAffected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Handle creating a new schedule
  const handleCreateSchedule = () => {
    // Validate form based on schedule type
    if (scheduleType === "daily" || scheduleType === "weekly") {
      if (
        !scheduleForm.route ||
        !scheduleForm.firstDeparture ||
        !scheduleForm.lastDeparture ||
        !scheduleForm.frequency
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    } else if (scheduleType === "special") {
      if (!scheduleForm.event || !scheduleForm.routesAffected || !scheduleForm.date || !scheduleForm.timePeriod) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    // Generate a new ID
    const newId = String(Math.floor(Math.random() * 1000) + 100)

    // Add new schedule based on type
    if (scheduleType === "daily") {
      setDailySchedules([
        {
          id: newId,
          route: scheduleForm.route,
          type: scheduleForm.type,
          firstDeparture: scheduleForm.firstDeparture,
          lastDeparture: scheduleForm.lastDeparture,
          frequency: scheduleForm.frequency,
          status: "Active",
          vehiclesAssigned: scheduleForm.vehiclesAssigned,
        },
        ...dailySchedules,
      ])
    } else if (scheduleType === "weekly") {
      setWeeklySchedules([
        {
          id: newId,
          route: scheduleForm.route,
          dayType: scheduleForm.dayType,
          firstDeparture: scheduleForm.firstDeparture,
          lastDeparture: scheduleForm.lastDeparture,
          frequency: scheduleForm.frequency,
          status: "Active",
          vehiclesAssigned: scheduleForm.vehiclesAssigned,
        },
        ...weeklySchedules,
      ])
    } else if (scheduleType === "special") {
      setSpecialSchedules([
        {
          id: newId,
          event: scheduleForm.event,
          routesAffected: scheduleForm.routesAffected,
          date: scheduleForm.date,
          timePeriod: scheduleForm.timePeriod,
          frequency: scheduleForm.frequency,
          status: "Planned",
          extraVehicles: scheduleForm.extraVehicles,
        },
        ...specialSchedules,
      ])
    }

    // Reset form and close dialog
    resetScheduleForm()
    setShowCreateDialog(false)

    toast({
      title: "Schedule Created",
      description: `New schedule has been created successfully.`,
    })
  }

  // Handle editing a schedule
  const handleEditSchedule = () => {
    if (!selectedSchedule) return

    // Validate form based on schedule type
    if (scheduleType === "daily" || scheduleType === "weekly") {
      if (
        !scheduleForm.route ||
        !scheduleForm.firstDeparture ||
        !scheduleForm.lastDeparture ||
        !scheduleForm.frequency
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    } else if (scheduleType === "special") {
      if (!scheduleForm.event || !scheduleForm.routesAffected || !scheduleForm.date || !scheduleForm.timePeriod) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    // Update schedule based on type
    if (scheduleType === "daily") {
      setDailySchedules(
        dailySchedules.map((item) => {
          if (item.id === selectedSchedule.id) {
            return {
              ...item,
              route: scheduleForm.route,
              type: scheduleForm.type,
              firstDeparture: scheduleForm.firstDeparture,
              lastDeparture: scheduleForm.lastDeparture,
              frequency: scheduleForm.frequency,
              vehiclesAssigned: scheduleForm.vehiclesAssigned,
            }
          }
          return item
        }),
      )
    } else if (scheduleType === "weekly") {
      setWeeklySchedules(
        weeklySchedules.map((item) => {
          if (item.id === selectedSchedule.id) {
            return {
              ...item,
              route: scheduleForm.route,
              dayType: scheduleForm.dayType,
              firstDeparture: scheduleForm.firstDeparture,
              lastDeparture: scheduleForm.lastDeparture,
              frequency: scheduleForm.frequency,
              vehiclesAssigned: scheduleForm.vehiclesAssigned,
            }
          }
          return item
        }),
      )
    } else if (scheduleType === "special") {
      setSpecialSchedules(
        specialSchedules.map((item) => {
          if (item.id === selectedSchedule.id) {
            return {
              ...item,
              event: scheduleForm.event,
              routesAffected: scheduleForm.routesAffected,
              date: scheduleForm.date,
              timePeriod: scheduleForm.timePeriod,
              frequency: scheduleForm.frequency,
              extraVehicles: scheduleForm.extraVehicles,
            }
          }
          return item
        }),
      )
    }

    // Reset form and close dialog
    resetScheduleForm()
    setShowEditDialog(false)

    toast({
      title: "Schedule Updated",
      description: `Schedule has been updated successfully.`,
    })
  }

  // Handle deleting a schedule
  const handleDeleteSchedule = () => {
    if (!selectedSchedule) return

    // Delete schedule based on type
    if (scheduleType === "daily") {
      setDailySchedules(dailySchedules.filter((item) => item.id !== selectedSchedule.id))
    } else if (scheduleType === "weekly") {
      setWeeklySchedules(weeklySchedules.filter((item) => item.id !== selectedSchedule.id))
    } else if (scheduleType === "special") {
      setSpecialSchedules(specialSchedules.filter((item) => item.id !== selectedSchedule.id))
    }

    setShowDeleteDialog(false)

    toast({
      title: "Schedule Deleted",
      description: `Schedule has been deleted successfully.`,
    })
  }

  // Reset schedule form
  const resetScheduleForm = () => {
    setScheduleForm({
      id: "",
      route: "",
      type: "Bus",
      firstDeparture: "",
      lastDeparture: "",
      frequency: "",
      vehiclesAssigned: 0,
      dayType: "Weekend",
      event: "",
      routesAffected: "",
      date: "",
      timePeriod: "",
      extraVehicles: 0,
    })
  }

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Get schedules for a specific date
  const getSchedulesForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0]
    const schedules = []

    // Add daily schedules
    dailySchedules.forEach((schedule) => {
      schedules.push({
        ...schedule,
        type: "daily",
      })
    })

    // Add weekly schedules based on day of week
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    weeklySchedules.forEach((schedule) => {
      if ((schedule.dayType === "Weekend" && isWeekend) || (schedule.dayType === "Weekday" && !isWeekend)) {
        schedules.push({
          ...schedule,
          type: "weekly",
        })
      }
    })

    // Add special schedules
    specialSchedules.forEach((schedule) => {
      // Simple check - in real app would need more sophisticated date range checking
      if (schedule.date.includes(formattedDate.substring(5, 10))) {
        schedules.push({
          ...schedule,
          type: "special",
        })
      }
    })

    return schedules
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-rose-600" />
            <span className="text-lg font-semibold">Marrakech Transport</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">{/* Navigation links */}</nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          <div>
            <Skeleton className="h-10 w-[300px] mb-4" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-rose-600" />
            <span className="text-lg font-semibold">Marrakech Transport</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">{/* Navigation links */}</nav>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold">Error Loading Data</h2>
            <p className="mt-2 text-muted-foreground">There was a problem loading the schedule data.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-rose-600" />
          <span className="text-lg font-semibold">Marrakech Transport</span>
        </div>
        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground">
            Dashboard
          </Link>
          <Link href="/fleet-management" className="text-sm font-medium text-muted-foreground">
            Fleet Management
          </Link>
          <Link href="/routes" className="text-sm font-medium text-muted-foreground">
            Routes
          </Link>
          <Link href="/schedules" className="text-sm font-medium">
            Schedules
          </Link>
          <Link href="/drivers" className="text-sm font-medium text-muted-foreground">
            Drivers
          </Link>
          <Link href="/maintenance" className="text-sm font-medium text-muted-foreground">
            Maintenance
          </Link>
          <Link href="/fares" className="text-sm font-medium text-muted-foreground">
            Fares
          </Link>
          <Link href="/bus-stops" className="text-sm font-medium text-muted-foreground">
            Bus Stops
          </Link>
          <Link href="/passenger-app" className="text-sm font-medium text-muted-foreground">
            Passenger App
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground">
            Reports
          </Link>
          <Link href="/analytics" className="text-sm font-medium text-muted-foreground">
            Analytics
          </Link>
          <Link href="/settings" className="text-sm font-medium text-muted-foreground">
            Settings
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Schedules</h1>
          <div className="flex space-x-2">
            <Button onClick={toggleView}>
              {showCalendarView ? (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  List View
                </span>
              ) : (
                <span className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar View
                </span>
              )}
            </Button>
            <Button
              onClick={() => {
                resetScheduleForm()
                setScheduleType("daily")
                setShowCreateDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {showCalendarView ? (
          <CalendarView />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Schedules</CardTitle>
              <CardDescription>Manage and view all bus schedules across routes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Route</th>
                        <th className="text-left py-3 px-4">Departure</th>
                        <th className="text-left py-3 px-4">Arrival</th>
                        <th className="text-left py-3 px-4">Days</th>
                        <th className="text-left py-3 px-4">Driver</th>
                        <th className="text-left py-3 px-4">Vehicle</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedules.map((schedule) => (
                        <tr key={schedule.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{schedule.routeNumber}</div>
                            <div className="text-sm text-muted-foreground">{schedule.routeName}</div>
                          </td>
                          <td className="py-3 px-4">{schedule.departureTime}</td>
                          <td className="py-3 px-4">{schedule.arrivalTime}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {schedule.daysOfWeek.map((day) => (
                                <span key={day} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {day.substring(0, 3)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">{schedule.driver}</td>
                          <td className="py-3 px-4">{schedule.vehicle}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(schedule.status)}`}>
                              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Edit Schedule",
                                    description: "Schedule editing functionality is coming soon.",
                                  })
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "View Schedule",
                                    description: "Schedule details view is coming soon.",
                                  })
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Schedule Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {scheduleType === "daily"
                ? "Create Daily Schedule"
                : scheduleType === "weekly"
                  ? "Create Weekly Schedule Variation"
                  : "Create Special Event Schedule"}
            </DialogTitle>
            <DialogDescription>
              {scheduleType === "daily"
                ? "Add a new regular daily service schedule."
                : scheduleType === "weekly"
                  ? "Add a weekend or holiday schedule variation."
                  : "Create a temporary schedule for a special event."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(scheduleType === "daily" || scheduleType === "weekly") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="route" className="text-right">
                    Route
                  </Label>
                  <Select
                    value={scheduleForm.route}
                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, route: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {scheduleType === "daily" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={scheduleForm.type}
                      onValueChange={(value) => setScheduleForm({ ...scheduleForm, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Taxi">Taxi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {scheduleType === "weekly" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dayType" className="text-right">
                      Day Type
                    </Label>
                    <Select
                      value={scheduleForm.dayType}
                      onValueChange={(value) => setScheduleForm({ ...scheduleForm, dayType: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                        <SelectItem value="Ramadan">Ramadan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstDeparture" className="text-right">
                    First Departure
                  </Label>
                  <Input
                    id="firstDeparture"
                    type="time"
                    value={scheduleForm.firstDeparture}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, firstDeparture: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastDeparture" className="text-right">
                    Last Departure
                  </Label>
                  <Input
                    id="lastDeparture"
                    type="time"
                    value={scheduleForm.lastDeparture}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, lastDeparture: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Input
                    id="frequency"
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    placeholder="e.g., Every 15 min"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehiclesAssigned" className="text-right">
                    Vehicles Assigned
                  </Label>
                  <Input
                    id="vehiclesAssigned"
                    type="number"
                    min="0"
                    value={scheduleForm.vehiclesAssigned}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, vehiclesAssigned: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {scheduleType === "special" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event" className="text-right">
                    Event Name
                  </Label>
                  <Input
                    id="event"
                    value={scheduleForm.event}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, event: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routesAffected" className="text-right">
                    Routes Affected
                  </Label>
                  <Input
                    id="routesAffected"
                    value={scheduleForm.routesAffected}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, routesAffected: e.target.value })}
                    placeholder="e.g., 3 Routes, All Routes"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    placeholder="e.g., Nov 24-Dec 2, 2023"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timePeriod" className="text-right">
                    Time Period
                  </Label>
                  <Input
                    id="timePeriod"
                    value={scheduleForm.timePeriod}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, timePeriod: e.target.value })}
                    placeholder="e.g., 18:00-02:00"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Input
                    id="frequency"
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    placeholder="e.g., Every 10 min, Increased by 30%"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="extraVehicles" className="text-right">
                    Extra Vehicles
                  </Label>
                  <Input
                    id="extraVehicles"
                    type="number"
                    min="0"
                    value={scheduleForm.extraVehicles}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, extraVehicles: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {scheduleType === "daily"
                ? "Edit Daily Schedule"
                : scheduleType === "weekly"
                  ? "Edit Weekly Schedule Variation"
                  : "Edit Special Event Schedule"}
            </DialogTitle>
            <DialogDescription>Update the schedule information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(scheduleType === "daily" || scheduleType === "weekly") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-route" className="text-right">
                    Route
                  </Label>
                  <Select
                    value={scheduleForm.route}
                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, route: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {scheduleType === "daily" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={scheduleForm.type}
                      onValueChange={(value) => setScheduleForm({ ...scheduleForm, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Taxi">Taxi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {scheduleType === "weekly" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-dayType" className="text-right">
                      Day Type
                    </Label>
                    <Select
                      value={scheduleForm.dayType}
                      onValueChange={(value) => setScheduleForm({ ...scheduleForm, dayType: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                        <SelectItem value="Ramadan">Ramadan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstDeparture" className="text-right">
                    First Departure
                  </Label>
                  <Input
                    id="edit-firstDeparture"
                    type="time"
                    value={scheduleForm.firstDeparture}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, firstDeparture: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastDeparture" className="text-right">
                    Last Departure
                  </Label>
                  <Input
                    id="edit-lastDeparture"
                    type="time"
                    value={scheduleForm.lastDeparture}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, lastDeparture: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-frequency" className="text-right">
                    Frequency
                  </Label>
                  <Input
                    id="edit-frequency"
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-vehiclesAssigned" className="text-right">
                    Vehicles Assigned
                  </Label>
                  <Input
                    id="edit-vehiclesAssigned"
                    type="number"
                    min="0"
                    value={scheduleForm.vehiclesAssigned}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, vehiclesAssigned: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {scheduleType === "special" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-event" className="text-right">
                    Event Name
                  </Label>
                  <Input
                    id="edit-event"
                    value={scheduleForm.event}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, event: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-routesAffected" className="text-right">
                    Routes Affected
                  </Label>
                  <Input
                    id="edit-routesAffected"
                    value={scheduleForm.routesAffected}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, routesAffected: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="edit-date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-timePeriod" className="text-right">
                    Time Period
                  </Label>
                  <Input
                    id="edit-timePeriod"
                    value={scheduleForm.timePeriod}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, timePeriod: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-frequency" className="text-right">
                    Frequency
                  </Label>
                  <Input
                    id="edit-frequency"
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-extraVehicles" className="text-right">
                    Extra Vehicles
                  </Label>
                  <Input
                    id="edit-extraVehicles"
                    type="number"
                    min="0"
                    value={scheduleForm.extraVehicles}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, extraVehicles: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSchedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this schedule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Calendar View Dialog */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Schedule Calendar</DialogTitle>
            <DialogDescription>View and manage schedules in calendar format</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <h2 className="text-lg font-semibold">{formatDate(currentMonth)}</h2>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array(getFirstDayOfMonth(currentMonth))
                .fill(null)
                .map((_, index) => (
                  <div key={`empty-${index}`} className="h-24 p-1 border rounded-md bg-muted/20"></div>
                ))}

              {getDaysInMonth(currentMonth).map((date) => {
                const daySchedules = getSchedulesForDate(date)
                return (
                  <div
                    key={date.toString()}
                    className={`h-24 p-1 border rounded-md overflow-y-auto ${
                      isToday(date)
                        ? "bg-blue-50 border-blue-200"
                        : isSelected(date)
                          ? "bg-rose-50 border-rose-200"
                          : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-right text-sm font-medium mb-1">{date.getDate()}</div>
                    <div className="space-y-1">
                      {daySchedules.slice(0, 3).map((schedule, index) => (
                        <div
                          key={index}
                          className={`text-xs p-1 rounded truncate ${
                            schedule.type === "special"
                              ? "bg-amber-100 text-amber-800"
                              : schedule.type === "weekly"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {schedule.route || schedule.event}
                        </div>
                      ))}
                      {daySchedules.length > 3 && (
                        <div className="text-xs text-center text-muted-foreground">+{daySchedules.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {getSchedulesForDate(selectedDate).length > 0 && (
              <div className="mt-4 border rounded-md p-3">
                <h3 className="font-medium mb-2">Schedules for {selectedDate.toLocaleDateString()}</h3>
                <div className="space-y-2">
                  {getSchedulesForDate(selectedDate).map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-1">
                      <div>
                        <span className="font-medium">{schedule.route || schedule.event}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {schedule.firstDeparture && schedule.lastDeparture
                            ? `${schedule.firstDeparture} - ${schedule.lastDeparture}`
                            : schedule.timePeriod}
                        </span>
                      </div>
                      <Badge
                        className={
                          schedule.type === "special"
                            ? "bg-amber-500"
                            : schedule.type === "weekly"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }
                      >
                        {schedule.type === "special" ? "Special" : schedule.type === "weekly" ? "Weekly" : "Daily"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCalendarDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

