"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bus, Filter, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchVehicles,
  fetchMaintenanceRecords,
  updateVehicleStatus,
  scheduleMaintenanceForVehicle,
  type Vehicle,
  type MaintenanceRecord,
  addVehicle,
  deleteVehicle,
} from "@/lib/api"
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

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("buses")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [maintenanceType, setMaintenanceType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Vehicle["status"]>("In Service")
  const [submitting, setSubmitting] = useState(false)
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    status: "In Service" as Vehicle["status"],
    type: "Bus" as Vehicle["type"],
    lastMaintenance: new Date().toISOString().split("T")[0],
    capacity: 0
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [vehiclesData, maintenanceData] = await Promise.all([fetchVehicles(), fetchMaintenanceRecords()])
        setVehicles(vehiclesData)
        setMaintenanceRecords(maintenanceData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Filter by search query (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = vehicle.id.toLowerCase().includes(query)
      const matchesModel = vehicle.model.toLowerCase().includes(query)
      const matchesDriver = vehicle.driver?.toLowerCase().includes(query) || false
      const matchesRoute = vehicle.currentRoute?.toLowerCase().includes(query) || false

      if (!(matchesId || matchesModel || matchesDriver || matchesRoute)) {
        return false
      }
    }

    // Filter by tab
    if (activeTab === "buses" && vehicle.type !== "Bus") {
      return false
    }
    if (activeTab === "taxis" && vehicle.type !== "Taxi") {
      return false
    }
    if (activeTab === "maintenance" && vehicle.status !== "Maintenance") {
      return false
    }

    return true
  })

  const handleScheduleMaintenance = async () => {
    if (!selectedVehicle || !maintenanceType || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to schedule maintenance.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const result = await scheduleMaintenanceForVehicle(selectedVehicle.id, maintenanceType, startDate, endDate)

      // Update the vehicle status
      const updatedVehicle = await updateVehicleStatus(selectedVehicle.id, "Maintenance")

      // Update local state
      setVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)))
      setMaintenanceRecords((prev) => [...prev, result])

      toast({
        title: "Maintenance scheduled",
        description: `Maintenance for vehicle ${selectedVehicle.id} has been scheduled.`,
      })

      setMaintenanceDialogOpen(false)
      setMaintenanceType("")
      setStartDate("")
      setEndDate("")
      setSelectedVehicle(null)
    } catch (err) {
      console.error("Failed to schedule maintenance:", err)
      toast({
        title: "Failed to schedule maintenance",
        description: "An error occurred while scheduling maintenance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedVehicle || !newStatus) {
      toast({
        title: "Missing information",
        description: "Please select a status.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const updatedVehicle = await updateVehicleStatus(selectedVehicle.id, newStatus)

      // Update local state
      setVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)))

      toast({
        title: "Status updated",
        description: `Vehicle ${selectedVehicle.id} status has been updated to ${newStatus}.`,
      })

      setStatusDialogOpen(false)
      setNewStatus("In Service")
      setSelectedVehicle(null)
    } catch (err) {
      console.error("Failed to update status:", err)
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddVehicle = async () => {
    if (!newVehicle.model || !newVehicle.type || !newVehicle.status || !newVehicle.capacity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      
      // Call the API to add the vehicle
      const addedVehicle = await addVehicle({
        model: newVehicle.model,
        status: newVehicle.status,
        type: newVehicle.type,
        lastMaintenance: newVehicle.lastMaintenance,
        capacity: newVehicle.capacity
      })

      // Update local state with the response from the API
      setVehicles((prev) => [...prev, addedVehicle])

      toast({
        title: "Vehicle added",
        description: `Vehicle ${addedVehicle.id} has been added to the fleet.`,
      })

      setAddVehicleDialogOpen(false)
      setNewVehicle({
        model: "",
        status: "In Service",
        type: "Bus",
        lastMaintenance: new Date().toISOString().split("T")[0],
        capacity: 0
      })
    } catch (err) {
      console.error("Failed to add vehicle:", err)
      toast({
        title: "Failed to add vehicle",
        description: "An error occurred while adding the vehicle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) {
      return
    }

    try {
      setSubmitting(true)
      
      // Call the API to delete the vehicle
      await deleteVehicle(vehicleToDelete.id)

      // Remove from local state
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id))

      toast({
        title: "Vehicle deleted",
        description: `Vehicle ${vehicleToDelete.id} has been removed from the fleet.`,
      })

      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
    } catch (err) {
      console.error("Failed to delete vehicle:", err)
      toast({
        title: "Failed to delete vehicle",
        description: "An error occurred while deleting the vehicle. Please try again.",
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
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="taxis">Taxis</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vehicles..."
                className="w-[200px] pl-8 md:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setSearchQuery("")}>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Clear Filter</span>
            </Button>
          </div>
        </div>
        <TabsContent value="buses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bus Fleet</CardTitle>
              <CardDescription>Manage all buses in your fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No vehicles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.id}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vehicle.status === "In Service"
                                ? "bg-green-500"
                                : vehicle.status === "Maintenance"
                                  ? "bg-amber-500"
                                  : vehicle.status === "Charging"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{vehicle.currentRoute || "-"}</TableCell>
                        <TableCell>{vehicle.driver || "-"}</TableCell>
                        <TableCell>{vehicle.lastMaintenance}</TableCell>
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
                                    title: "Vehicle Details",
                                    description: "Vehicle details view is coming soon.",
                                  })
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Location Tracking",
                                    description: "Opening location tracking map...",
                                  })
                                }}
                              >
                                Track Location
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicle(vehicle)
                                  setMaintenanceDialogOpen(true)
                                }}
                              >
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicle(vehicle)
                                  setStatusDialogOpen(true)
                                }}
                              >
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setVehicleToDelete(vehicle)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Vehicle
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
        <TabsContent value="taxis" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxi Fleet</CardTitle>
              <CardDescription>Manage all taxis in your fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No vehicles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.id}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vehicle.status === "In Service"
                                ? "bg-green-500"
                                : vehicle.status === "Maintenance"
                                  ? "bg-amber-500"
                                  : vehicle.status === "Charging"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{vehicle.currentRoute || "-"}</TableCell>
                        <TableCell>{vehicle.driver || "-"}</TableCell>
                        <TableCell>{vehicle.lastMaintenance}</TableCell>
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
                                    title: "Vehicle Details",
                                    description: "Vehicle details view is coming soon.",
                                  })
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Location Tracking",
                                    description: "Opening location tracking map...",
                                  })
                                }}
                              >
                                Track Location
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicle(vehicle)
                                  setMaintenanceDialogOpen(true)
                                }}
                              >
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicle(vehicle)
                                  setStatusDialogOpen(true)
                                }}
                              >
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setVehicleToDelete(vehicle)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Vehicle
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
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Vehicles currently in maintenance or scheduled for maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
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
                  {maintenanceRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No maintenance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceRecords.map((record) => (
                      <TableRow key={`${record.vehicleId}-${record.startDate}`}>
                        <TableCell className="font-medium">{record.vehicleId}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.maintenanceType}</TableCell>
                        <TableCell>{record.startDate}</TableCell>
                        <TableCell>{record.expectedCompletion}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              record.status === "In Progress"
                                ? "bg-amber-500 text-white"
                                : record.status === "Scheduled"
                                  ? "bg-blue-500 text-white"
                                  : "bg-green-500 text-white"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>Extend Timeline</DropdownMenuItem>
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
          <Link href="/fleet-management" className="text-sm font-medium">
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
            <h1 className="text-2xl font-bold">Fleet Management</h1>
            <p className="text-muted-foreground">Manage and monitor your entire vehicle fleet</p>
          </div>
          <Button onClick={() => setAddVehicleDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
        {renderContent()}
      </main>

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleDialogOpen} onOpenChange={setAddVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Add a new vehicle to your fleet</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-model" className="text-right">
                Model
              </Label>
              <Input
                id="vehicle-model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Volvo 9700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-type" className="text-right">
                Type
              </Label>
              <Select
                value={newVehicle.type}
                onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value as Vehicle["type"] })}
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
              <Label htmlFor="vehicle-capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="vehicle-capacity"
                type="number"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="e.g. 40"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-status" className="text-right">
                Status
              </Label>
              <Select
                value={newVehicle.status}
                onValueChange={(value) => setNewVehicle({ ...newVehicle, status: value as Vehicle["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Service">In Service</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Charging">Charging</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last-maintenance" className="text-right">
                Last Maintenance
              </Label>
              <Input
                id="last-maintenance"
                type="date"
                value={newVehicle.lastMaintenance}
                onChange={(e) => setNewVehicle({ ...newVehicle, lastMaintenance: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddVehicleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={submitting}>
              {submitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Schedule maintenance for vehicle {selectedVehicle?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-type" className="text-right">
                Maintenance Type
              </Label>
              <Input
                id="maintenance-type"
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Engine Repair"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMaintenance} disabled={submitting}>
              {submitting ? "Scheduling..." : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Vehicle Status</DialogTitle>
            <DialogDescription>Update the status for vehicle {selectedVehicle?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Vehicle["status"])}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Service">In Service</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Charging">Charging</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={submitting}>
              {submitting ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle {vehicleToDelete?.id} from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

