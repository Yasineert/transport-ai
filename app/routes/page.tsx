"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bus, Filter, LogOut, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchRoutes, addRoute, type RouteInfo, type RouteCreationRequest, getAuthToken, removeAuthToken } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [addRouteDialogOpen, setAddRouteDialogOpen] = useState(false)
  const [newRoute, setNewRoute] = useState<RouteCreationRequest>({
    depart: "",
    destination: "",
    distance: 0,
    duree: 0,
    type: "Bus"
  })
  const [submitting, setSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const routesData = await fetchRoutes()
        setRoutes(routesData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch routes:", err)
        setError("Failed to load routes data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Check if the user is authenticated
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  const filteredRoutes = routes.filter((route) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (typeof route.id === 'string' ? route.id.toLowerCase().includes(query) : String(route.id).includes(query)) ||
        (route.name?.toLowerCase().includes(query) || false) ||
        (route.type?.toLowerCase().includes(query) || false) ||
        (route.frequency?.toLowerCase().includes(query) || false) ||
        route.depart.toLowerCase().includes(query) ||
        route.destination.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleAddRoute = async () => {
    if (!newRoute.depart || !newRoute.destination) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      
      // Call the backend API to add the route
      const createdRoute = await addRoute(newRoute)
      
      // Update local state
      setRoutes((prev) => [...prev, {
        ...createdRoute,
        name: `${createdRoute.depart} - ${createdRoute.destination}`,
        type: createdRoute.type || "Bus",
        status: "Active",
        frequency: "Every 30 min",
        activeVehicles: 0,
        dailyPassengers: 0
      }])

      toast({
        title: "Route added",
        description: `Route ${createdRoute.depart} to ${createdRoute.destination} has been added.`,
      })

      setAddRouteDialogOpen(false)
      // Reset form with all required fields including type
      setNewRoute({
        depart: "",
        destination: "",
        distance: 0,
        duree: 0,
        type: "Bus"
      })
    } catch (err) {
      console.error("Failed to add route:", err)
      toast({
        title: "Failed to add route",
        description: "An error occurred while adding the route. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    window.location.href = "/login"
  }

  const handleLogin = () => {
    window.location.href = "/login"
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
      <Card>
        <CardHeader>
          <CardTitle>Active Routes</CardTitle>
          <CardDescription>All currently active bus and taxi routes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Active Vehicles</TableHead>
                <TableHead>Daily Passengers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No routes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.id}</TableCell>
                    <TableCell>{route.name || `${route.depart} - ${route.destination}`}</TableCell>
                    <TableCell>{route.type || "Bus"}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{route.status || "Active"}</Badge>
                    </TableCell>
                    <TableCell>{route.frequency || "N/A"}</TableCell>
                    <TableCell>{route.activeVehicles || 0}</TableCell>
                    <TableCell>{(route.dailyPassengers !== undefined) ? route.dailyPassengers.toLocaleString() : '0'}</TableCell>
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
                                title: "Route Details",
                                description: "Route details view is coming soon.",
                              })
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Edit Route",
                                description: "Route editing functionality is coming soon.",
                              })
                            }}
                          >
                            Edit Route
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Route Schedule",
                                description: "Viewing route schedule...",
                              })
                            }}
                          >
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Suspend Route",
                                description: "Are you sure you want to suspend this route?",
                                variant: "destructive",
                              })
                            }}
                          >
                            Suspend Route
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
          <Link href="/routes" className="text-sm font-medium">
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
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Login
            </button>
          )}
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Routes Management</h1>
            <p className="text-muted-foreground">Manage and monitor all transport routes</p>
          </div>
          <Button onClick={() => setAddRouteDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Route
          </Button>
        </div>
        {!isAuthenticated && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              You are viewing mock data. <a href="/signup" className="font-medium underline">Login</a> to access real data from the backend.
            </p>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search routes..."
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

      {/* Add Route Dialog */}
      <Dialog open={addRouteDialogOpen} onOpenChange={setAddRouteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>Add a new transport route to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="depart" className="text-right">
                Departure
              </Label>
              <Input
                id="depart"
                value={newRoute.depart}
                onChange={(e) => setNewRoute({ ...newRoute, depart: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Jemaa el-Fnaa"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <Input
                id="destination"
                value={newRoute.destination}
                onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Gueliz"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="route-type" className="text-right">
                Type
              </Label>
              <select
                id="route-type"
                value={newRoute.type}
                onChange={(e) => setNewRoute({ ...newRoute, type: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Bus">Bus</option>
                <option value="Taxi">Taxi</option>
                <option value="Train">Train</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="distance" className="text-right">
                Distance (km)
              </Label>
              <Input
                id="distance"
                type="number"
                value={newRoute.distance.toString()}
                onChange={(e) => setNewRoute({ ...newRoute, distance: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="e.g. 5.2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duree" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duree"
                type="number"
                value={newRoute.duree.toString()}
                onChange={(e) => setNewRoute({ ...newRoute, duree: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="e.g. 20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRouteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoute} disabled={submitting}>
              {submitting ? "Adding..." : "Add Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

