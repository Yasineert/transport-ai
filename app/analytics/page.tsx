"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bus, Download, LineChart, BarChartIcon, PieChartIcon, Users, Filter, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [year, setYear] = useState("2023")
  const [dateRange, setDateRange] = useState("last30days")
  const [chartType, setChartType] = useState("line")
  
  // Sample data for charts
  const passengerData = [
    { name: "Jan", passengers: 42000 },
    { name: "Feb", passengers: 45000 },
    { name: "Mar", passengers: 48000 },
    { name: "Apr", passengers: 51000 },
    { name: "May", passengers: 53000 },
    { name: "Jun", passengers: 58000 },
    { name: "Jul", passengers: 62000 },
    { name: "Aug", passengers: 65000 },
    { name: "Sep", passengers: 59000 },
    { name: "Oct", passengers: 55000 },
    { name: "Nov", passengers: 50000 },
    { name: "Dec", passengers: 47000 },
  ]

  const performanceData = [
    { name: "Route 1", onTime: 92, delayed: 8 },
    { name: "Route 3", onTime: 88, delayed: 12 },
    { name: "Route 7", onTime: 85, delayed: 15 },
    { name: "Route 12", onTime: 90, delayed: 10 },
    { name: "Route 15", onTime: 82, delayed: 18 },
  ]

  const revenueData = [
    { name: "Bus Tickets", value: 65 },
    { name: "Taxi Fares", value: 25 },
    { name: "Tourist Passes", value: 10 },
  ]

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"]

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle exporting data
  const handleExportData = () => {
    toast({
      title: "Exporting Data",
      description: "Preparing analytics data for export...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Data Exported",
        description: "Analytics data has been exported successfully to CSV format.",
      });
    }, 1500);
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
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
        </main>
      </div>
    );
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
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold">Error Loading Data</h2>
            <p className="mt-2 text-muted-foreground">There was a problem loading the analytics data.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Main content
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
          <Link href="/analytics" className="text-sm font-medium">
            Analytics
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Analyze performance and usage data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">635,240</div>
              <p className="text-xs text-muted-foreground">+8.2% from last year</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Passenger Volume</CardTitle>
            <CardDescription>Total passenger count across all routes by month</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <p>Chart placeholder</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

