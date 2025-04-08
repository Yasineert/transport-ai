"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bus, Filter, MoreHorizontal, Plus, Search, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBusStops, type BusStop } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
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

export default function BusStopsPage() {
  const [busStops, setBusStops] = useState<BusStop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [addStopDialogOpen, setAddStopDialogOpen] = useState(false)
  const [editStopDialogOpen, setEditStopDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // New bus stop form state
  const [newStop, setNewStop] = useState({
    name: "",
    location: "",
    type: "Standard Stop" as BusStop["type"],
    routesServed: [] as string[],
    dailyPassengers: 0,
    status: "Operational" as BusStop["status"],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const stopsData = await fetchBusStops()
        setBusStops(stopsData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch bus stops:", err)
        setError("Failed to load bus stops data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredStops = busStops.filter((stop) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = stop.id.toLowerCase().includes(query)
      const matchesName = stop.name.toLowerCase().includes(query)
      const matchesLocation = stop.location.toLowerCase().includes(query)

      if (!(matchesId || matchesName || matchesLocation)) {
        return false
      }
    }

    // Filter by tab
    if (activeTab === "smart" && stop.type !== "Smart Stop") {
      return false
    }
    if (activeTab === "standard" && stop.type !== "Standard Stop") {
      return false
    }
    if (activeTab === "maintenance" && stop.status !== "Maintenance") {
      return false
    }

    return true
  })

  const handleAddStop = async () => {
    if (!newStop.name || !newStop.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      // In a real app, this would call an API to add the bus stop
      // For now, we'll just update the local state
      const newStopWithId: BusStop = {
        ...newStop,
        id: `BS${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        routesServed: newStop.routesServed.length > 0 ? newStop.routesServed : ["Route 1"],
      }

      // Update local state
      setBusStops((prev) => [...prev, newStopWithId])

      toast({
        title: "Bus stop added",
        description: `Bus stop ${newStopWithId.name} has been added to the system.`,
      })

      setAddStopDialogOpen(false)
      setNewStop({
        name: "",
        location: "",
        type: "Standard Stop",
        routesServed: [],
        dailyPassengers: 0,
        status: "Operational",
      })
    } catch (err) {
      console.error("Failed to add bus stop:", err)
      toast({
        title: "Failed to add bus stop",
        description: "An error occurred while adding the bus stop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditStop = async () => {
    if (!selectedStop) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to update the bus stop
      // For now, we'll just update the local state

      // Update local state
      setBusStops((prev) => prev.map((s) => (s.id === selectedStop.id ? selectedStop : s)))

      toast({
        title: "Bus stop updated",
        description: `Bus stop ${selectedStop.name} has been updated.`,
      })

      setEditStopDialogOpen(false)
      setSelectedStop(null)
    } catch (err) {
      console.error("Failed to update bus stop:", err)
      toast({
        title: "Failed to update bus stop",
        description: "An error occurred while updating the bus stop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteStop = async () => {
    if (!selectedStop) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to delete the bus stop
      // For now, we'll just update the local state

      // Remove from local state
      setBusStops((prev) => prev.filter((s) => s.id !== selectedStop.id))

      toast({
        title: "Bus stop deleted",
        description: `Bus stop ${selectedStop.name} has been removed from the system.`,
      })

      setDeleteDialogOpen(false)
      setSelectedStop(null)
    } catch (err) {
      console.error("Failed to delete bus stop:", err)
      toast({
        title: "Failed to delete bus stop",
        description: "An error occurred while deleting the bus stop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return (
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Stops</TabsTrigger>
          <TabsTrigger value="smart">Smart Stops</TabsTrigger>
          <TabsTrigger value="standard">Standard Stops</TabsTrigger>
          <TabsTrigger value="maintenance">Under Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bus Stops</CardTitle>
              <CardDescription>Complete list of all bus stops in the network</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Routes Served</TableHead>
                    <TableHead>Daily Passengers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No bus stops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStops.map((stop) => (
                      <TableRow key={stop.id}>
                        <TableCell className="font-medium">{stop.id}</TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>{stop.location}</TableCell>
                        <TableCell>{stop.type}</TableCell>
                        <TableCell>{stop.routesServed.join(", ")}</TableCell>
                        <TableCell>{stop.dailyPassengers.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={stop.status === "Operational" ? "bg-green-500" : "bg-amber-500"}>
                            {stop.status}
                          </Badge>
                        </TableCell>
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
                                  toast({
                                    title: "Bus Stop Details",
                                    description: "Bus stop details view is coming soon.",
                                  })
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStop(stop)
                                  setEditStopDialogOpen(true)
                                }}
                              >
                                Edit Stop
                              </DropdownMenuItem>
                              {stop.type === "Standard Stop" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast({
                                      title: "Upgrade Bus Stop",
                                      description:
                                        "Upgrading to Smart Stop will cost approximately 25,000 MAD. Proceed?",
                                    })
                                  }}
                                >
                                  Upgrade to Smart Stop
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Schedule Maintenance",
                                    description: "Bus stop maintenance scheduling is coming soon.",
                                  })
                                }}
                              >
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedStop(stop)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Stop
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Bus Stops</CardTitle>
              <CardDescription>Bus stops with digital displays and smart features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStops.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-sm text-muted-foreground">No smart bus stops found</p>
                  </div>
                ) : (
                  filteredStops.map((stop) => (
                    <Card key={stop.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{stop.name}</CardTitle>
                          <Badge className="bg-green-500">Online</Badge>
                        </div>
                        <CardDescription>
                          {stop.id} • {stop.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Display Status</span>
                              <span className="font-medium text-green-600">Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>WiFi Status</span>
                              <div className="flex items-center">
                                <Wifi className="mr-1 h-3 w-3 text-green-600" />
                                <span className="font-medium text-green-600">
                                  Active ({Math.floor(Math.random() * 100) + 50} users)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>CCTV Status</span>
                              <span className="font-medium text-green-600">
                                Online ({Math.floor(Math.random() * 3) + 2} cameras)
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Current Temperature</span>
                              <span className="font-medium">{Math.floor(Math.random() * 5) + 23}°C</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Current Occupancy</div>
                            <Progress value={Math.floor(Math.random() * 60) + 20} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.floor(Math.random() * 60) + 20}% Full</span>
                              <span>~{Math.floor(Math.random() * 30) + 15} people</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Next Arrivals</div>
                            <div className="space-y-1">
                              {stop.routesServed.slice(0, 3).map((route, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{route}</span>
                                  <span className="font-medium">{Math.floor(Math.random() * 15) + 1} min</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standard" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Bus Stops</CardTitle>
              <CardDescription>Basic bus stops without digital features</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Routes Served</TableHead>
                    <TableHead>Daily Passengers</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Last Inspection</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No standard bus stops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStops.map((stop) => (
                      <TableRow key={stop.id}>
                        <TableCell className="font-medium">{stop.id}</TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>{stop.location}</TableCell>
                        <TableCell>{stop.routesServed.join(", ")}</TableCell>
                        <TableCell>{stop.dailyPassengers.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={stop.status === "Operational" ? "bg-green-500" : "bg-amber-500"}>
                            {stop.status === "Operational" ? "Good" : "Maintenance"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        </TableCell>
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
                                  toast({
                                    title: "Bus Stop Details",
                                    description: "Bus stop details view is coming soon.",
                                  })
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStop(stop)
                                  setEditStopDialogOpen(true)
                                }}
                              >
                                Edit Stop
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Upgrade Bus Stop",
                                    description: "Upgrading to Smart Stop will cost approximately 25,000 MAD. Proceed?",
                                  })
                                }}
                              >
                                Upgrade to Smart Stop
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Schedule Maintenance",
                                    description: "Bus stop maintenance scheduling is coming soon.",
                                  })
                                }}
                              >
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedStop(stop)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Stop
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bus Stops Under Maintenance</CardTitle>
              <CardDescription>Stops currently undergoing repairs or upgrades</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Maintenance Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expected Completion</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No bus stops under maintenance found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStops.map((stop) => (
                      <TableRow key={stop.id}>
                        <TableCell className="font-medium">{stop.id}</TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>{stop.type}</TableCell>
                        <TableCell>{stop.id.includes("7") ? "Shelter Replacement" : "Upgrade to Smart Stop"}</TableCell>
                        <TableCell>2023-05-10</TableCell>
                        <TableCell>2023-05-25</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={60} className="h-2 w-24" />
                            <span className="text-sm">60%</span>
                          </div>
                        </TableCell>
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
                                  toast({
                                    title: "Bus Stop Details",
                                    description: "Bus stop details view is coming soon.",
                                  })
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Update Progress</DropdownMenuItem>
                              <DropdownMenuItem>Extend Timeline</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
          <Link href="/maintenance" className="text-sm font-medium text-muted-foreground">
            Maintenance
          </Link>
          <Link href="/fares" className="text-sm font-medium text-muted-foreground">
            Fares
          </Link>
          <Link href="/bus-stops" className="text-sm font-medium">
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
            <h1 className="text-2xl font-bold">Smart Bus Stops</h1>
            <p className="text-muted-foreground">Manage and monitor all bus stops in the network</p>
          </div>
          <Button onClick={() => setAddStopDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bus Stop
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bus stops..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setSearchQuery("")}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Clear Filter</span>
          </Button>
        </div>

        {renderContent()}
      </main>

      {/* Add Bus Stop Dialog */}
      <Dialog open={addStopDialogOpen} onOpenChange={setAddStopDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bus Stop</DialogTitle>
            <DialogDescription>Add a new bus stop to the network</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-name" className="text-right">
                Name
              </Label>
              <Input
                id="stop-name"
                value={newStop.name}
                onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Jemaa el-Fnaa"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-location" className="text-right">
                Location
              </Label>
              <Input
                id="stop-location"
                value={newStop.location}
                onChange={(e) => setNewStop({ ...newStop, location: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Medina, Central Square"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-type" className="text-right">
                Type
              </Label>
              <Select
                value={newStop.type}
                onValueChange={(value) => setNewStop({ ...newStop, type: value as BusStop["type"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Smart Stop">Smart Stop</SelectItem>
                  <SelectItem value="Standard Stop">Standard Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-routes" className="text-right">
                Routes Served
              </Label>
              <Input
                id="stop-routes"
                value={newStop.routesServed.join(", ")}
                onChange={(e) =>
                  setNewStop({ ...newStop, routesServed: e.target.value.split(",").map((r) => r.trim()) })
                }
                className="col-span-3"
                placeholder="e.g. Route 1, Route 3, Route 7"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-passengers" className="text-right">
                Est. Daily Passengers
              </Label>
              <Input
                id="stop-passengers"
                type="number"
                value={newStop.dailyPassengers.toString()}
                onChange={(e) => setNewStop({ ...newStop, dailyPassengers: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop-status" className="text-right">
                Status
              </Label>
              <Select
                value={newStop.status}
                onValueChange={(value) => setNewStop({ ...newStop, status: value as BusStop["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStopDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStop} disabled={submitting}>
              {submitting ? "Adding..." : "Add Bus Stop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bus Stop Dialog */}
      <Dialog open={editStopDialogOpen} onOpenChange={setEditStopDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bus Stop</DialogTitle>
            <DialogDescription>Update bus stop information</DialogDescription>
          </DialogHeader>
          {selectedStop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-stop-name"
                  value={selectedStop.name}
                  onChange={(e) => setSelectedStop({ ...selectedStop, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-stop-location"
                  value={selectedStop.location}
                  onChange={(e) => setSelectedStop({ ...selectedStop, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={selectedStop.type}
                  onValueChange={(value) => setSelectedStop({ ...selectedStop, type: value as BusStop["type"] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Smart Stop">Smart Stop</SelectItem>
                    <SelectItem value="Standard Stop">Standard Stop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-routes" className="text-right">
                  Routes Served
                </Label>
                <Input
                  id="edit-stop-routes"
                  value={selectedStop.routesServed.join(", ")}
                  onChange={(e) =>
                    setSelectedStop({ ...selectedStop, routesServed: e.target.value.split(",").map((r) => r.trim()) })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-passengers" className="text-right">
                  Daily Passengers
                </Label>
                <Input
                  id="edit-stop-passengers"
                  type="number"
                  value={selectedStop.dailyPassengers.toString()}
                  onChange={(e) =>
                    setSelectedStop({ ...selectedStop, dailyPassengers: Number.parseInt(e.target.value) || 0 })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stop-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedStop.status}
                  onValueChange={(value) => setSelectedStop({ ...selectedStop, status: value as BusStop["status"] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStopDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStop} disabled={submitting}>
              {submitting ? "Updating..." : "Update Bus Stop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bus Stop Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the bus stop {selectedStop?.name} from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStop} disabled={submitting} className="bg-red-600 hover:bg-red-700">
              {submitting ? "Deleting..." : "Delete Bus Stop"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

