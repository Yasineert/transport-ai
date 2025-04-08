"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bus, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDrivers, type Driver } from "@/lib/api"
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

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [addDriverDialogOpen, setAddDriverDialogOpen] = useState(false)
  const [editDriverDialogOpen, setEditDriverDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: "",
    vehicleType: "Bus" as Driver["vehicleType"],
    status: "On Duty" as Driver["status"],
    experience: "",
    performance: 4.0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const driversData = await fetchDrivers()
        setDrivers(driversData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch drivers:", err)
        setError("Failed to load drivers data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = driver.id.toLowerCase().includes(query)
      const matchesName = driver.name.toLowerCase().includes(query)
      const matchesAssignment = driver.currentAssignment?.toLowerCase().includes(query) || false

      if (!(matchesId || matchesName || matchesAssignment)) {
        return false
      }
    }

    // Filter by tab
    if (activeTab === "active" && driver.status !== "On Duty") {
      return false
    }
    if (activeTab === "training" && driver.status !== "In Training") {
      return false
    }
    if (activeTab === "leave" && driver.status !== "On Leave") {
      return false
    }

    return true
  })

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.experience) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      // In a real app, this would call an API to add the driver
      // For now, we'll just update the local state
      const newDriverWithId: Driver = {
        ...newDriver,
        id: `D${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
      }

      // Update local state
      setDrivers((prev) => [...prev, newDriverWithId])

      toast({
        title: "Driver added",
        description: `Driver ${newDriverWithId.name} has been added to the system.`,
      })

      setAddDriverDialogOpen(false)
      setNewDriver({
        name: "",
        vehicleType: "Bus",
        status: "On Duty",
        experience: "",
        performance: 4.0,
      })
    } catch (err) {
      console.error("Failed to add driver:", err)
      toast({
        title: "Failed to add driver",
        description: "An error occurred while adding the driver. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDriver = async () => {
    if (!selectedDriver) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to update the driver
      // For now, we'll just update the local state

      // Update local state
      setDrivers((prev) => prev.map((d) => (d.id === selectedDriver.id ? selectedDriver : d)))

      toast({
        title: "Driver updated",
        description: `Driver ${selectedDriver.name} has been updated.`,
      })

      setEditDriverDialogOpen(false)
      setSelectedDriver(null)
    } catch (err) {
      console.error("Failed to update driver:", err)
      toast({
        title: "Failed to update driver",
        description: "An error occurred while updating the driver. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDriver = async () => {
    if (!selectedDriver) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to delete the driver
      // For now, we'll just update the local state

      // Remove from local state
      setDrivers((prev) => prev.filter((d) => d.id !== selectedDriver.id))

      toast({
        title: "Driver deleted",
        description: `Driver ${selectedDriver.name} has been removed from the system.`,
      })

      setDeleteDialogOpen(false)
      setSelectedDriver(null)
    } catch (err) {
      console.error("Failed to delete driver:", err)
      toast({
        title: "Failed to delete driver",
        description: "An error occurred while deleting the driver. Please try again.",
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
          <TabsTrigger value="active">Active Drivers</TabsTrigger>
          <TabsTrigger value="training">In Training</TabsTrigger>
          <TabsTrigger value="leave">On Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Drivers</CardTitle>
              <CardDescription>Currently active drivers in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Current Assignment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.vehicleType}</TableCell>
                        <TableCell>{driver.currentAssignment || "-"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{driver.status}</Badge>
                        </TableCell>
                        <TableCell>{driver.experience}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{driver.performance.toFixed(1)}</span>
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${(driver.performance / 5) * 100}%` }}
                              />
                            </div>
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
                                    title: "Driver Profile",
                                    description: "Driver profile view is coming soon.",
                                  })
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDriver(driver)
                                  setEditDriverDialogOpen(true)
                                }}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Driver Schedule",
                                    description: "Viewing driver schedule...",
                                  })
                                }}
                              >
                                View Schedule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Performance History",
                                    description: "Driver performance history view is coming soon.",
                                  })
                                }}
                              >
                                Performance History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedDriver(driver)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Remove Driver
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

        <TabsContent value="training" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Drivers in Training</CardTitle>
              <CardDescription>Drivers currently undergoing training programs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Training Program</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expected Completion</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No drivers in training found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>
                          {driver.vehicleType === "Bus" ? "Bus Driver Certification" : "Taxi Driver Certification"}
                        </TableCell>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>2023-05-30</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">75%</span>
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div className="h-full w-[75%] rounded-full bg-blue-500" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Ahmed Tazi</TableCell>
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
                                    title: "Driver Profile",
                                    description: "Driver profile view is coming soon.",
                                  })
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>Training Records</DropdownMenuItem>
                              <DropdownMenuItem>Assign Instructor</DropdownMenuItem>
                              <DropdownMenuItem>Update Progress</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedDriver(driver)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Remove Driver
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

        <TabsContent value="leave" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Drivers on Leave</CardTitle>
              <CardDescription>Drivers currently on vacation or medical leave</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Replacement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No drivers on leave found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.vehicleType}</TableCell>
                        <TableCell>{driver.id.includes("5") ? "Medical" : "Vacation"}</TableCell>
                        <TableCell>2023-05-10</TableCell>
                        <TableCell>2023-05-24</TableCell>
                        <TableCell>Omar Benjelloun</TableCell>
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
                                    title: "Driver Profile",
                                    description: "Driver profile view is coming soon.",
                                  })
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>Extend Leave</DropdownMenuItem>
                              <DropdownMenuItem>End Leave Early</DropdownMenuItem>
                              <DropdownMenuItem>Change Replacement</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedDriver(driver)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Remove Driver
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
          <Link href="/drivers" className="text-sm font-medium">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Driver Management</h1>
            <p className="text-muted-foreground">Manage and monitor all drivers in the system</p>
          </div>
          <Button onClick={() => setAddDriverDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search drivers..."
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

      {/* Add Driver Dialog */}
      <Dialog open={addDriverDialogOpen} onOpenChange={setAddDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Add a new driver to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver-name" className="text-right">
                Name
              </Label>
              <Input
                id="driver-name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Ahmed Tazi"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-type" className="text-right">
                Vehicle Type
              </Label>
              <Select
                value={newDriver.vehicleType}
                onValueChange={(value) => setNewDriver({ ...newDriver, vehicleType: value as Driver["vehicleType"] })}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver-status" className="text-right">
                Status
              </Label>
              <Select
                value={newDriver.status}
                onValueChange={(value) => setNewDriver({ ...newDriver, status: value as Driver["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="In Training">In Training</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver-experience" className="text-right">
                Experience
              </Label>
              <Input
                id="driver-experience"
                value={newDriver.experience}
                onChange={(e) => setNewDriver({ ...newDriver, experience: e.target.value })}
                className="col-span-3"
                placeholder="e.g. 5 years"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver-performance" className="text-right">
                Performance
              </Label>
              <Input
                id="driver-performance"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={newDriver.performance.toString()}
                onChange={(e) => setNewDriver({ ...newDriver, performance: Number.parseFloat(e.target.value) || 4.0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDriverDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver} disabled={submitting}>
              {submitting ? "Adding..." : "Add Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={editDriverDialogOpen} onOpenChange={setEditDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-driver-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-driver-name"
                  value={selectedDriver.name}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-vehicle-type" className="text-right">
                  Vehicle Type
                </Label>
                <Select
                  value={selectedDriver.vehicleType}
                  onValueChange={(value) =>
                    setSelectedDriver({ ...selectedDriver, vehicleType: value as Driver["vehicleType"] })
                  }
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-driver-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedDriver.status}
                  onValueChange={(value) => setSelectedDriver({ ...selectedDriver, status: value as Driver["status"] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Duty">On Duty</SelectItem>
                    <SelectItem value="In Training">In Training</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-driver-experience" className="text-right">
                  Experience
                </Label>
                <Input
                  id="edit-driver-experience"
                  value={selectedDriver.experience}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, experience: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-driver-performance" className="text-right">
                  Performance
                </Label>
                <Input
                  id="edit-driver-performance"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={selectedDriver.performance.toString()}
                  onChange={(e) =>
                    setSelectedDriver({ ...selectedDriver, performance: Number.parseFloat(e.target.value) || 4.0 })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDriverDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver} disabled={submitting}>
              {submitting ? "Updating..." : "Update Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Driver Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the driver {selectedDriver?.name} from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDriver}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Removing..." : "Remove Driver"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

