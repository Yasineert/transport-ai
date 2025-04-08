"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bus, Filter, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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

// Define fare types
type FareType = {
  id: string
  name: string
  vehicleType: string
  price: number
  description: string
  paymentMethods: string[]
  status: "Active" | "Inactive"
  lastUpdated: string
}

export default function FaresPage() {
  const [fares, setFares] = useState<FareType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("standard")
  const [addFareDialogOpen, setAddFareDialogOpen] = useState(false)
  const [editFareDialogOpen, setEditFareDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFare, setSelectedFare] = useState<FareType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // New fare form state
  const [newFare, setNewFare] = useState({
    name: "",
    vehicleType: "Bus",
    price: 0,
    description: "",
    paymentMethods: ["Cash"],
    status: "Active" as FareType["status"],
  })

  // Mock data for fares
  const mockFares: FareType[] = [
    {
      id: "F001",
      name: "Single Ride",
      vehicleType: "Bus",
      price: 4,
      description: "Any route, one-way",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-01-15",
    },
    {
      id: "F002",
      name: "Return Ticket",
      vehicleType: "Bus",
      price: 7,
      description: "Any route, round-trip",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-01-15",
    },
    {
      id: "F003",
      name: "Zone 1 Fare",
      vehicleType: "Taxi",
      price: 15,
      description: "Within city center",
      paymentMethods: ["Cash", "Card"],
      status: "Active",
      lastUpdated: "2023-02-10",
    },
    {
      id: "F004",
      name: "Zone 2 Fare",
      vehicleType: "Taxi",
      price: 25,
      description: "City center to suburbs",
      paymentMethods: ["Cash", "Card"],
      status: "Active",
      lastUpdated: "2023-02-10",
    },
    {
      id: "F005",
      name: "Student Fare",
      vehicleType: "Bus",
      price: 2,
      description: "50% discount for students",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-03-01",
    },
    {
      id: "F006",
      name: "Senior Fare",
      vehicleType: "Bus",
      price: 1,
      description: "75% discount for seniors",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-03-01",
    },
    {
      id: "F007",
      name: "Children Fare",
      vehicleType: "Bus",
      price: 0,
      description: "Free for children under 12",
      paymentMethods: ["None"],
      status: "Active",
      lastUpdated: "2023-03-01",
    },
    {
      id: "F008",
      name: "Daily Pass",
      vehicleType: "Bus",
      price: 15,
      description: "Unlimited rides for 24 hours",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-04-05",
    },
    {
      id: "F009",
      name: "Weekly Pass",
      vehicleType: "Bus",
      price: 60,
      description: "Unlimited rides for 7 days",
      paymentMethods: ["Cash", "Card", "Mobile"],
      status: "Active",
      lastUpdated: "2023-04-05",
    },
  ]

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        setFares(mockFares)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch fares:", err)
        setError("Failed to load fares data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredFares = fares.filter((fare) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = fare.name.toLowerCase().includes(query)
      const matchesDescription = fare.description.toLowerCase().includes(query)
      const matchesPrice = fare.price.toString().includes(query)

      if (!(matchesName || matchesDescription || matchesPrice)) {
        return false
      }
    }

    // Filter by tab
    if (
      activeTab === "standard" &&
      (fare.name.includes("Student") ||
        fare.name.includes("Senior") ||
        fare.name.includes("Children") ||
        fare.name.includes("Pass"))
    ) {
      return false
    }
    if (
      activeTab === "special" &&
      !(fare.name.includes("Student") || fare.name.includes("Senior") || fare.name.includes("Children"))
    ) {
      return false
    }
    if (activeTab === "passes" && !fare.name.includes("Pass")) {
      return false
    }

    return true
  })

  const handleAddFare = async () => {
    if (!newFare.name || !newFare.description || newFare.price < 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      // In a real app, this would call an API to add the fare
      // For now, we'll just update the local state
      const newFareWithId: FareType = {
        ...newFare,
        id: `F${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        lastUpdated: new Date().toISOString().split("T")[0],
      }

      // Update local state
      setFares((prev) => [...prev, newFareWithId])

      toast({
        title: "Fare added",
        description: `Fare ${newFareWithId.name} has been added to the system.`,
      })

      setAddFareDialogOpen(false)
      setNewFare({
        name: "",
        vehicleType: "Bus",
        price: 0,
        description: "",
        paymentMethods: ["Cash"],
        status: "Active",
      })
    } catch (err) {
      console.error("Failed to add fare:", err)
      toast({
        title: "Failed to add fare",
        description: "An error occurred while adding the fare. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditFare = async () => {
    if (!selectedFare) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to update the fare
      // For now, we'll just update the local state

      // Update local state
      setFares((prev) =>
        prev.map((f) =>
          f.id === selectedFare.id
            ? {
                ...selectedFare,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : f,
        ),
      )

      toast({
        title: "Fare updated",
        description: `Fare ${selectedFare.name} has been updated.`,
      })

      setEditFareDialogOpen(false)
      setSelectedFare(null)
    } catch (err) {
      console.error("Failed to update fare:", err)
      toast({
        title: "Failed to update fare",
        description: "An error occurred while updating the fare. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteFare = async () => {
    if (!selectedFare) return

    try {
      setSubmitting(true)
      // In a real app, this would call an API to delete the fare
      // For now, we'll just update the local state

      // Remove from local state
      setFares((prev) => prev.filter((f) => f.id !== selectedFare.id))

      toast({
        title: "Fare deleted",
        description: `Fare ${selectedFare.name} has been removed from the system.`,
      })

      setDeleteDialogOpen(false)
      setSelectedFare(null)
    } catch (err) {
      console.error("Failed to delete fare:", err)
      toast({
        title: "Failed to delete fare",
        description: "An error occurred while deleting the fare. Please try again.",
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
          <TabsTrigger value="standard">Standard Fares</TabsTrigger>
          <TabsTrigger value="special">Special Fares</TabsTrigger>
          <TabsTrigger value="passes">Passes & Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Fares</CardTitle>
              <CardDescription>Regular fare prices for all routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fare Type</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Distance/Zone</TableHead>
                    <TableHead>Payment Methods</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFares.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No fares found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFares.map((fare) => (
                      <TableRow key={fare.id}>
                        <TableCell className="font-medium">{fare.name}</TableCell>
                        <TableCell>{fare.vehicleType}</TableCell>
                        <TableCell>{fare.price} MAD</TableCell>
                        <TableCell>{fare.description}</TableCell>
                        <TableCell>{fare.paymentMethods.join(", ")}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{fare.status}</Badge>
                        </TableCell>
                        <TableCell>{fare.lastUpdated}</TableCell>
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
                                  setSelectedFare(fare)
                                  setEditFareDialogOpen(true)
                                }}
                              >
                                Edit Fare
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Fare History",
                                    description: "Fare price history view is coming soon.",
                                  })
                                }}
                              >
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: fare.status === "Active" ? "Disable Fare" : "Enable Fare",
                                    description:
                                      fare.status === "Active"
                                        ? "This fare will no longer be available for purchase."
                                        : "This fare will now be available for purchase.",
                                  })
                                }}
                              >
                                {fare.status === "Active" ? "Disable Fare" : "Enable Fare"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedFare(fare)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Fare
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

        <TabsContent value="special" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Fares</CardTitle>
              <CardDescription>Discounted fares for specific groups</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fare Type</TableHead>
                    <TableHead>Eligible Group</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>ID Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFares.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No special fares found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFares.map((fare) => (
                      <TableRow key={fare.id}>
                        <TableCell className="font-medium">{fare.name}</TableCell>
                        <TableCell>
                          {fare.name.includes("Student")
                            ? "Students with valid ID"
                            : fare.name.includes("Senior")
                              ? "Passengers over 65"
                              : "Children under 12"}
                        </TableCell>
                        <TableCell>
                          {fare.name.includes("Student") ? "50%" : fare.name.includes("Senior") ? "75%" : "100%"}
                        </TableCell>
                        <TableCell>{fare.price} MAD</TableCell>
                        <TableCell>
                          {fare.name.includes("Student")
                            ? "Student ID"
                            : fare.name.includes("Senior")
                              ? "National ID"
                              : "None"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{fare.status}</Badge>
                        </TableCell>
                        <TableCell>{fare.lastUpdated}</TableCell>
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
                                  setSelectedFare(fare)
                                  setEditFareDialogOpen(true)
                                }}
                              >
                                Edit Fare
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Fare History",
                                    description: "Fare price history view is coming soon.",
                                  })
                                }}
                              >
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: fare.status === "Active" ? "Disable Fare" : "Enable Fare",
                                    description:
                                      fare.status === "Active"
                                        ? "This fare will no longer be available for purchase."
                                        : "This fare will now be available for purchase.",
                                  })
                                }}
                              >
                                {fare.status === "Active" ? "Disable Fare" : "Enable Fare"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedFare(fare)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Fare
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

        <TabsContent value="passes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Passes & Subscriptions</CardTitle>
              <CardDescription>Long-term passes and subscription options</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pass Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Restrictions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFares.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No passes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFares.map((fare) => (
                      <TableRow key={fare.id}>
                        <TableCell className="font-medium">{fare.name}</TableCell>
                        <TableCell>
                          {fare.name.includes("Daily")
                            ? "24 hours"
                            : fare.name.includes("Weekly")
                              ? "7 days"
                              : fare.name.includes("Monthly")
                                ? "30 days"
                                : "3 days"}
                        </TableCell>
                        <TableCell>{fare.price} MAD</TableCell>
                        <TableCell>
                          {fare.name.includes("Tourist") ? "All routes + tourist attractions" : "All bus routes"}
                        </TableCell>
                        <TableCell>{fare.name.includes("Tourist") ? "Passport required" : "None"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{fare.status}</Badge>
                        </TableCell>
                        <TableCell>{fare.lastUpdated}</TableCell>
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
                                  setSelectedFare(fare)
                                  setEditFareDialogOpen(true)
                                }}
                              >
                                Edit Pass
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Fare History",
                                    description: "Fare price history view is coming soon.",
                                  })
                                }}
                              >
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: fare.status === "Active" ? "Disable Pass" : "Enable Pass",
                                    description:
                                      fare.status === "Active"
                                        ? "This pass will no longer be available for purchase."
                                        : "This pass will now be available for purchase.",
                                  })
                                }}
                              >
                                {fare.status === "Active" ? "Disable Pass" : "Enable Pass"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedFare(fare)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete Pass
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
          <Link href="/drivers" className="text-sm font-medium text-muted-foreground">
            Drivers
          </Link>
          <Link href="/maintenance" className="text-sm font-medium text-muted-foreground">
            Maintenance
          </Link>
          <Link href="/fares" className="text-sm font-medium">
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
            <h1 className="text-2xl font-bold">Fare Management</h1>
            <p className="text-muted-foreground">Manage ticket prices and fare structures</p>
          </div>
          <Button onClick={() => setAddFareDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fare Type
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search fares..."
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

      {/* Add Fare Dialog */}
      <Dialog open={addFareDialogOpen} onOpenChange={setAddFareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fare</DialogTitle>
            <DialogDescription>Add a new fare or pass to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fare-name" className="text-right">
                Name
              </Label>
              <Input
                id="fare-name"
                value={newFare.name}
                onChange={(e) => setNewFare({ ...newFare, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Single Ride"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-type" className="text-right">
                Vehicle Type
              </Label>
              <Select
                value={newFare.vehicleType}
                onValueChange={(value) => setNewFare({ ...newFare, vehicleType: value })}
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
              <Label htmlFor="fare-price" className="text-right">
                Price (MAD)
              </Label>
              <Input
                id="fare-price"
                type="number"
                min="0"
                step="0.5"
                value={newFare.price.toString()}
                onChange={(e) => setNewFare({ ...newFare, price: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fare-description" className="text-right">
                Description
              </Label>
              <Input
                id="fare-description"
                value={newFare.description}
                onChange={(e) => setNewFare({ ...newFare, description: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Any route, one-way"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-methods" className="text-right">
                Payment Methods
              </Label>
              <Input
                id="payment-methods"
                value={newFare.paymentMethods.join(", ")}
                onChange={(e) =>
                  setNewFare({ ...newFare, paymentMethods: e.target.value.split(",").map((m) => m.trim()) })
                }
                className="col-span-3"
                placeholder="e.g. Cash, Card, Mobile"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fare-status" className="text-right">
                Status
              </Label>
              <Select
                value={newFare.status}
                onValueChange={(value) => setNewFare({ ...newFare, status: value as FareType["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFare} disabled={submitting}>
              {submitting ? "Adding..." : "Add Fare"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fare Dialog */}
      <Dialog open={editFareDialogOpen} onOpenChange={setEditFareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fare</DialogTitle>
            <DialogDescription>Update fare information</DialogDescription>
          </DialogHeader>
          {selectedFare && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fare-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-fare-name"
                  value={selectedFare.name}
                  onChange={(e) => setSelectedFare({ ...selectedFare, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-vehicle-type" className="text-right">
                  Vehicle Type
                </Label>
                <Select
                  value={selectedFare.vehicleType}
                  onValueChange={(value) => setSelectedFare({ ...selectedFare, vehicleType: value })}
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
                <Label htmlFor="edit-fare-price" className="text-right">
                  Price (MAD)
                </Label>
                <Input
                  id="edit-fare-price"
                  type="number"
                  min="0"
                  step="0.5"
                  value={selectedFare.price.toString()}
                  onChange={(e) => setSelectedFare({ ...selectedFare, price: Number.parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fare-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-fare-description"
                  value={selectedFare.description}
                  onChange={(e) => setSelectedFare({ ...selectedFare, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-payment-methods" className="text-right">
                  Payment Methods
                </Label>
                <Input
                  id="edit-payment-methods"
                  value={selectedFare.paymentMethods.join(", ")}
                  onChange={(e) =>
                    setSelectedFare({ ...selectedFare, paymentMethods: e.target.value.split(",").map((m) => m.trim()) })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fare-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedFare.status}
                  onValueChange={(value) => setSelectedFare({ ...selectedFare, status: value as FareType["status"] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFare} disabled={submitting}>
              {submitting ? "Updating..." : "Update Fare"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Fare Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the fare {selectedFare?.name} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFare} disabled={submitting} className="bg-red-600 hover:bg-red-700">
              {submitting ? "Deleting..." : "Delete Fare"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

