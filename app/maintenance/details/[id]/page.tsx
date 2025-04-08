"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Bus, ArrowLeft, Clock, Calendar, CheckSquare, PenToolIcon as Tools, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function MaintenanceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [maintenanceRecord, setMaintenanceRecord] = useState<any>(null)

  // Mock function to fetch a maintenance record
  const fetchMaintenanceRecord = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data
    return {
      id,
      type: "Bus",
      vehicleId: id,
      maintenanceType: "Engine Repair",
      description:
        "Complete overhaul of engine systems including replacement of worn parts and recalibration of fuel injection system.",
      startDate: "2023-05-18",
      expectedCompletion: "2023-05-22",
      status: "In Progress",
      technician: "Mohammed Chaoui",
      priority: "Medium",
      cost: "12,500 MAD",
      completionPercentage: 65,
      notes: [
        {
          date: "2023-05-18",
          author: "Mohammed Chaoui",
          content: "Started engine disassembly and inspection. Found worn piston rings and damaged valve seats.",
        },
        {
          date: "2023-05-19",
          author: "Mohammed Chaoui",
          content: "Ordered replacement parts. ETA 1 day. Continuing with cleanup and preparation.",
        },
        {
          date: "2023-05-20",
          author: "Mohammed Chaoui",
          content: "Parts received. Beginning reassembly process.",
        },
      ],
      parts: [
        { name: "Piston Rings (set)", quantity: 1, cost: "2,200 MAD", status: "Installed" },
        { name: "Valve Seats", quantity: 4, cost: "3,600 MAD", status: "Installed" },
        { name: "Oil Filter", quantity: 1, cost: "350 MAD", status: "Pending" },
        { name: "Engine Oil (5L)", quantity: 3, cost: "1,800 MAD", status: "Pending" },
      ],
      history: [
        { date: "2023-01-15", type: "Oil Change", technician: "Jamal Bennani", cost: "800 MAD" },
        { date: "2023-03-02", type: "Brake Service", technician: "Amina Ziani", cost: "1,500 MAD" },
      ],
    }
  }

  useEffect(() => {
    const loadMaintenanceRecord = async () => {
      try {
        setLoading(true)
        const record = await fetchMaintenanceRecord(id as string)
        setMaintenanceRecord(record)
      } catch (error) {
        console.error("Failed to fetch maintenance record:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMaintenanceRecord()
  }, [id])

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
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    )
  }

  if (!maintenanceRecord) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-rose-600" />
            <span className="text-lg font-semibold">Marrakech Transport</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">{/* Navigation links */}</nav>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Maintenance Record Not Found</h1>
            <p className="text-muted-foreground mt-2">The maintenance record you're looking for could not be found.</p>
            <Button className="mt-4" onClick={() => router.push("/maintenance")}>
              Go Back to Maintenance
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
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/maintenance")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Maintenance Details: {maintenanceRecord.vehicleId}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CardDescription>Current maintenance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{maintenanceRecord.completionPercentage}%</span>
                  <Badge
                    className={
                      maintenanceRecord.status === "Completed"
                        ? "bg-green-500"
                        : maintenanceRecord.status === "In Progress"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {maintenanceRecord.status}
                  </Badge>
                </div>
                <Progress value={maintenanceRecord.completionPercentage} />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started: {maintenanceRecord.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Expected: {maintenanceRecord.expectedCompletion}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/maintenance")}>
                Update Status
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Details</CardTitle>
              <CardDescription>Maintenance information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vehicle ID:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.vehicleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maintenance:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.maintenanceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Technician:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.technician}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                  <span className="text-sm font-medium">{maintenanceRecord.cost}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Description</CardTitle>
              <CardDescription>Maintenance description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{maintenanceRecord.description}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="parts">
              <Tools className="h-4 w-4 mr-2" />
              Parts
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Notes</CardTitle>
                <CardDescription>Progress updates and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRecord.notes.map((note, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{note.author}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push("/maintenance")}>
                  Add Note
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Parts and Materials</CardTitle>
                <CardDescription>Parts used for this maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Part Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {maintenanceRecord.parts.map((part, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{part.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{part.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{part.cost}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={part.status === "Installed" ? "default" : "outline"}>{part.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push("/maintenance")}>
                  Add Part
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>Previous maintenance records for this vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRecord.history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <div className="font-medium">{item.type}</div>
                        <div className="text-sm text-muted-foreground">
                          <span>{item.date}</span> • <span>Technician: {item.technician}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{item.cost}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => router.push("/maintenance")}>
                  View All History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

