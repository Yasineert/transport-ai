"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Bus,
  Calendar,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { MaintenanceCalendar } from "./calendar-view"
import { useRouter } from "next/navigation"

// Mock data for maintenance records
const initialActiveMaintenance = [
  {
    id: "C089",
    type: "Bus",
    maintenanceType: "Engine Repair",
    startDate: "2023-05-18",
    expectedCompletion: "2023-05-22",
    status: "In Progress",
    technician: "Mohammed Chaoui",
  },
  {
    id: "T347",
    type: "Taxi",
    maintenanceType: "Transmission Service",
    startDate: "2023-05-18",
    expectedCompletion: "2023-05-20",
    status: "In Progress",
    technician: "Jamal Bennani",
  },
  {
    id: "E456",
    type: "Electric Bus",
    maintenanceType: "Battery System Check",
    startDate: "2023-05-19",
    expectedCompletion: "2023-05-21",
    status: "In Progress",
    technician: "Amina Ziani",
  },
]

const initialScheduledMaintenance = [
  {
    id: "B098",
    type: "Bus",
    maintenanceType: "Routine Inspection",
    scheduledDate: "2023-05-25",
    duration: "1 day",
    priority: "Normal",
    assignedTo: "Mohammed Chaoui",
  },
  {
    id: "A237",
    type: "Bus",
    maintenanceType: "Brake System Service",
    scheduledDate: "2023-05-28",
    duration: "2 days",
    priority: "Medium",
    assignedTo: "Jamal Bennani",
  },
  {
    id: "T102",
    type: "Taxi",
    maintenanceType: "Oil Change",
    scheduledDate: "2023-05-30",
    duration: "4 hours",
    priority: "Normal",
    assignedTo: "Amina Ziani",
  },
]

const initialMaintenanceHistory = [
  {
    id: "B145",
    type: "Bus",
    maintenanceType: "Engine Overhaul",
    completionDate: "2023-05-02",
    cost: "15,000 MAD",
    status: "Completed",
    technician: "Mohammed Chaoui",
  },
  {
    id: "T215",
    type: "Taxi",
    maintenanceType: "Transmission Repair",
    completionDate: "2023-04-28",
    cost: "8,500 MAD",
    status: "Completed",
    technician: "Jamal Bennani",
  },
  {
    id: "D321",
    type: "Electric Bus",
    maintenanceType: "Battery Replacement",
    completionDate: "2023-04-15",
    cost: "25,000 MAD",
    status: "Completed",
    technician: "Amina Ziani",
  },
]

const technicians = ["Mohammed Chaoui", "Jamal Bennani", "Amina Ziani", "Hassan Alaoui", "Fatima Tazi"]

export default function MaintenancePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  // State for maintenance records
  const [activeMaintenance, setActiveMaintenance] = useState(initialActiveMaintenance)
  const [scheduledMaintenance, setScheduledMaintenance] = useState(initialScheduledMaintenance)
  const [maintenanceHistory, setMaintenanceHistory] = useState(initialMaintenanceHistory)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all")

  // State for dialogs
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCalendarDialog, setShowCalendarDialog] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [showCalendarView, setShowCalendarView] = useState(false)

  // Form state
  const [newMaintenance, setNewMaintenance] = useState({
    id: "",
    type: "Bus",
    maintenanceType: "",
    scheduledDate: "",
    duration: "",
    priority: "Normal",
    assignedTo: "",
  })

  // Status update state
  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "In Progress",
    notes: "",
  })

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter maintenance records based on search query and vehicle type
  const filteredActiveMaintenance = activeMaintenance.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.maintenanceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = vehicleTypeFilter === "all" || item.type.toLowerCase() === vehicleTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const filteredScheduledMaintenance = scheduledMaintenance.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.maintenanceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = vehicleTypeFilter === "all" || item.type.toLowerCase() === vehicleTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const filteredMaintenanceHistory = maintenanceHistory.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.maintenanceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = vehicleTypeFilter === "all" || item.type.toLowerCase() === vehicleTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  // Handle scheduling new maintenance
  const handleScheduleMaintenance = () => {
    // Validate form
    if (
      !newMaintenance.id ||
      !newMaintenance.maintenanceType ||
      !newMaintenance.scheduledDate ||
      !newMaintenance.assignedTo
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Add new maintenance to scheduled maintenance
    setScheduledMaintenance([
      {
        ...newMaintenance,
      },
      ...scheduledMaintenance,
    ])

    // Reset form and close dialog
    setNewMaintenance({
      id: "",
      type: "Bus",
      maintenanceType: "",
      scheduledDate: "",
      duration: "",
      priority: "Normal",
      assignedTo: "",
    })
    setShowScheduleDialog(false)

    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance for vehicle ${newMaintenance.id} has been scheduled.`,
    })
  }

  // Handle updating maintenance status
  const handleUpdateStatus = () => {
    if (!statusUpdate.status) {
      toast({
        title: "Missing Information",
        description: "Please select a status.",
        variant: "destructive",
      })
      return
    }

    // Update status in active maintenance
    const updatedActiveMaintenance = activeMaintenance.map((item) => {
      if (item.id === statusUpdate.id) {
        return {
          ...item,
          status: statusUpdate.status,
        }
      }
      return item
    })

    // If status is "Completed", move to history
    if (statusUpdate.status === "Completed") {
      const completedItem = updatedActiveMaintenance.find((item) => item.id === statusUpdate.id)
      if (completedItem) {
        // Remove from active maintenance
        const filteredActiveMaintenance = updatedActiveMaintenance.filter((item) => item.id !== statusUpdate.id)
        setActiveMaintenance(filteredActiveMaintenance)

        // Add to history
        setMaintenanceHistory([
          {
            id: completedItem.id,
            type: completedItem.type,
            maintenanceType: completedItem.maintenanceType,
            completionDate: new Date().toISOString().split("T")[0],
            cost: "TBD",
            status: "Completed",
            technician: completedItem.technician,
          },
          ...maintenanceHistory,
        ])
      }
    } else {
      setActiveMaintenance(updatedActiveMaintenance)
    }

    setShowUpdateStatusDialog(false)

    toast({
      title: "Status Updated",
      description: `Maintenance status for vehicle ${statusUpdate.id} has been updated to ${statusUpdate.status}.`,
    })
  }

  // Handle starting scheduled maintenance
  const handleStartMaintenance = (item) => {
    // Remove from scheduled maintenance
    const updatedScheduledMaintenance = scheduledMaintenance.filter((maintenance) => maintenance.id !== item.id)
    setScheduledMaintenance(updatedScheduledMaintenance)

    // Add to active maintenance
    setActiveMaintenance([
      {
        id: item.id,
        type: item.type,
        maintenanceType: item.maintenanceType,
        startDate: new Date().toISOString().split("T")[0],
        expectedCompletion: item.scheduledDate,
        status: "In Progress",
        technician: item.assignedTo,
      },
      ...activeMaintenance,
    ])

    toast({
      title: "Maintenance Started",
      description: `Maintenance for vehicle ${item.id} has been started.`,
    })
  }

  // Handle deleting maintenance
  const handleDeleteMaintenance = () => {
    if (!selectedMaintenance) return

    if (selectedMaintenance.type === "active") {
      setActiveMaintenance(activeMaintenance.filter((item) => item.id !== selectedMaintenance.id))
    } else if (selectedMaintenance.type === "scheduled") {
      setScheduledMaintenance(scheduledMaintenance.filter((item) => item.id !== selectedMaintenance.id))
    } else if (selectedMaintenance.type === "history") {
      setMaintenanceHistory(maintenanceHistory.filter((item) => item.id !== selectedMaintenance.id))
    }

    setShowDeleteDialog(false)

    toast({
      title: "Maintenance Record Deleted",
      description: `Maintenance record for vehicle ${selectedMaintenance.id} has been deleted.`,
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

  // Get maintenance for a specific date
  const getMaintenanceForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0]
    const maintenance = []

    // Add active maintenance
    activeMaintenance.forEach((item) => {
      const startDate = new Date(item.startDate)
      const endDate = new Date(item.expectedCompletion)

      if (date >= startDate && date <= endDate) {
        maintenance.push({
          ...item,
          type: "active",
        })
      }
    })

    // Add scheduled maintenance
    scheduledMaintenance.forEach((item) => {
      const scheduleDate = new Date(item.scheduledDate)

      if (
        date.getDate() === scheduleDate.getDate() &&
        date.getMonth() === scheduleDate.getMonth() &&
        date.getFullYear() === scheduleDate.getFullYear()
      ) {
        maintenance.push({
          ...item,
          type: "scheduled",
        })
      }
    })

    return maintenance
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

          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-10" />
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
            <p className="mt-2 text-muted-foreground">There was a problem loading the maintenance data.</p>
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
          <Link href="/schedules" className="text-sm font-medium text-muted-foreground">
            Schedules
          </Link>
          <Link href="/drivers" className="text-sm font-medium text-muted-foreground">
            Drivers
          </Link>
          <Link href="/maintenance" className="text-sm font-medium">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Maintenance Management</h1>
            <p className="text-muted-foreground">Track and schedule vehicle maintenance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCalendarView(!showCalendarView)}>
              {showCalendarView ? (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  List View
                </span>
              ) : (
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar View
                </span>
              )}
            </Button>
            <Button onClick={() => setShowScheduleDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search maintenance records..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
          <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="bus">Buses</SelectItem>
              <SelectItem value="taxi">Taxis</SelectItem>
              <SelectItem value="electric">Electric Vehicles</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchQuery("")
              setVehicleTypeFilter("all")
            }}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Reset Filters</span>
          </Button>
        </div>

        {showCalendarView ? (
          <MaintenanceCalendar
            activeMaintenance={activeMaintenance}
            scheduledMaintenance={scheduledMaintenance}
            onStartMaintenance={handleStartMaintenance}
            onUpdateStatus={(item) => {
              setStatusUpdate({
                id: item.id,
                status: item.status || "In Progress",
                notes: "",
              })
              setShowUpdateStatusDialog(true)
            }}
            onDeleteMaintenance={(item, type) => {
              setSelectedMaintenance({
                id: item.id,
                type: type,
              })
              setShowDeleteDialog(true)
            }}
          />
        ) : (
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Maintenance</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="history">Maintenance History</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Maintenance</CardTitle>
                  <CardDescription>Vehicles currently undergoing maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredActiveMaintenance.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Bus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No Active Maintenance</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no vehicles currently undergoing maintenance.
                      </p>
                      <Button className="mt-4" onClick={() => setShowScheduleDialog(true)}>
                        Schedule Maintenance
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Maintenance Type</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Expected Completion</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActiveMaintenance.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.maintenanceType}</TableCell>
                            <TableCell>{item.startDate}</TableCell>
                            <TableCell>{item.expectedCompletion}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-amber-500 text-white">
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.technician}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setStatusUpdate({
                                        id: item.id,
                                        status: item.status,
                                        notes: "",
                                      })
                                      setShowUpdateStatusDialog(true)
                                    }}
                                  >
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMaintenance({
                                        id: item.id,
                                        type: "active",
                                      })
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    Delete Record
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Maintenance</CardTitle>
                  <CardDescription>Upcoming maintenance appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredScheduledMaintenance.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No Scheduled Maintenance</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no upcoming maintenance appointments scheduled.
                      </p>
                      <Button className="mt-4" onClick={() => setShowScheduleDialog(true)}>
                        Schedule Maintenance
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Maintenance Type</TableHead>
                          <TableHead>Scheduled Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScheduledMaintenance.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.maintenanceType}</TableCell>
                            <TableCell>{item.scheduledDate}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  item.priority === "High"
                                    ? "bg-red-500 text-white"
                                    : item.priority === "Medium"
                                      ? "bg-amber-500 text-white"
                                      : "bg-green-500 text-white"
                                }
                              >
                                {item.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.assignedTo}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStartMaintenance(item)}>
                                    Start Maintenance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMaintenance({
                                        id: item.id,
                                        type: "scheduled",
                                      })
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    Cancel Maintenance
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>Past maintenance records</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredMaintenanceHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Bus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No Maintenance History</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no completed maintenance records in the system.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Maintenance Type</TableHead>
                          <TableHead>Completion Date</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaintenanceHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.maintenanceType}</TableCell>
                            <TableCell>{item.completionDate}</TableCell>
                            <TableCell>{item.cost}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-500 text-white">
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.technician}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Refresh the page and navigate to a details view (you'll need to create this page)
                                      router.push(`/maintenance/details/${item.id}`)
                                      router.refresh()
                                    }}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>View Invoice</DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMaintenance({
                                        id: item.id,
                                        type: "history",
                                      })
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    Delete Record
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Create a new maintenance appointment for a vehicle.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-id" className="text-right">
                Vehicle ID
              </Label>
              <Input
                id="vehicle-id"
                value={newMaintenance.id}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, id: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-type" className="text-right">
                Vehicle Type
              </Label>
              <Select
                value={newMaintenance.type}
                onValueChange={(value) => setNewMaintenance({ ...newMaintenance, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Taxi">Taxi</SelectItem>
                  <SelectItem value="Electric Bus">Electric Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-type" className="text-right">
                Maintenance Type
              </Label>
              <Input
                id="maintenance-type"
                value={newMaintenance.maintenanceType}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, maintenanceType: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduled-date" className="text-right">
                Scheduled Date
              </Label>
              <Input
                id="scheduled-date"
                type="date"
                value={newMaintenance.scheduledDate}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, scheduledDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                value={newMaintenance.duration}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, duration: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newMaintenance.priority}
                onValueChange={(value) => setNewMaintenance({ ...newMaintenance, priority: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigned-to" className="text-right">
                Assigned To
              </Label>
              <Select
                value={newMaintenance.assignedTo}
                onValueChange={(value) => setNewMaintenance({ ...newMaintenance, assignedTo: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((technician) => (
                    <SelectItem key={technician} value={technician}>
                      {technician}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMaintenance}>Schedule Maintenance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateStatusDialog} onOpenChange={setShowUpdateStatusDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Maintenance Status</DialogTitle>
            <DialogDescription>Update the status of the maintenance for vehicle {statusUpdate.id}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={statusUpdate.status}
                onValueChange={(value) => setStatusUpdate({ ...statusUpdate, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={statusUpdate.notes}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                placeholder="Optional notes about the status update"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Maintenance Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this maintenance record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMaintenance}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar View Dialog */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Maintenance Calendar</DialogTitle>
            <DialogDescription>View and manage maintenance schedules in calendar view</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Month</span>
              </Button>
              <h2 className="text-xl font-semibold">{formatDate(currentMonth)}</h2>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Month</span>
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-sm font-medium text-muted-foreground py-2">
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
                const maintenanceItems = getMaintenanceForDate(date)
                const hasItems = maintenanceItems.length > 0

                return (
                  <div
                    key={date.toISOString()}
                    className={`h-24 p-1 border rounded-md overflow-hidden ${
                      isToday(date) ? "border-rose-500 border-2" : ""
                    } ${isSelected(date) ? "bg-muted" : ""} hover:bg-muted/50 cursor-pointer transition-colors`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${isToday(date) ? "text-rose-500" : ""}`}>
                        {date.getDate()}
                      </span>
                      {hasItems && (
                        <Badge variant="outline" className="text-xs">
                          {maintenanceItems.length}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-1 space-y-1 overflow-hidden">
                      {maintenanceItems.slice(0, 2).map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className={`text-xs truncate rounded px-1 py-0.5 ${
                            item.type === "active" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.id}: {item.maintenanceType || item.maintenanceType}
                        </div>
                      ))}
                      {maintenanceItems.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{maintenanceItems.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected date details */}
            {getMaintenanceForDate(selectedDate).length > 0 && (
              <div className="mt-6 border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Maintenance on{" "}
                  {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h3>
                <div className="space-y-3">
                  {getMaintenanceForDate(selectedDate).map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {item.id} - {item.type}
                          </div>
                          <div className="text-sm">{item.maintenanceType || item.maintenanceType}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.type === "active"
                              ? `Started: ${item.startDate} | Expected completion: ${item.expectedCompletion}`
                              : `Scheduled: ${item.scheduledDate} | Duration: ${item.duration}`}
                          </div>
                          <div className="text-xs mt-1">
                            {item.type === "active"
                              ? `Technician: ${item.technician}`
                              : `Assigned to: ${item.assignedTo}`}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            item.type === "active"
                              ? "bg-amber-500 text-white"
                              : item.priority === "High"
                                ? "bg-red-500 text-white"
                                : item.priority === "Medium"
                                  ? "bg-amber-500 text-white"
                                  : "bg-green-500 text-white"
                          }
                        >
                          {item.type === "active" ? item.status : item.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {item.type === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setStatusUpdate({
                                id: item.id,
                                status: item.status,
                                notes: "",
                              })
                              setShowCalendarDialog(false)
                              setShowUpdateStatusDialog(true)
                            }}
                          >
                            Update Status
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleStartMaintenance(item)
                              setShowCalendarDialog(false)
                            }}
                          >
                            Start Maintenance
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setSelectedMaintenance({
                              id: item.id,
                              type: item.type === "active" ? "active" : "scheduled",
                            })
                            setShowCalendarDialog(false)
                            setShowDeleteDialog(true)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCalendarDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowCalendarDialog(false)
                setShowScheduleDialog(true)
              }}
            >
              Schedule New Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

