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
} from "@/components/ui/chart"

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
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            {/* Navigation links */}
          </nav>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>

          <Skeleton className="h-[400px] w-full rounded-lg" />
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
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            {/* Navigation links */}
          </nav>
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
          <Link href="/bus-stops" className="text-sm font-medium text-muted-foreground">
            Bus Stops
          </Link>
          <Link href="/passenger-app" className="text-sm font-medium text-muted-foreground">
            Passenger App
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground">
            Reports
          </Link>
          <Link href="/analytics" className="text-sm font-medium">
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
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Analyze performance and usage data</p>
          </div>
          <div className="flex gap-2">
            <Select 
              value={year} 
              onValueChange={(value) => {
                setYear(value);
                toast({
                  title: "Year Changed",
                  description: `Analytics data updated for year ${value}.`,
                });
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={dateRange} 
              onValueChange={(value) => {
                setDateRange(value);
                toast({
                  title: "Date Range Changed",
                  description: `Analytics data updated for ${value.replace('last', 'last ')}${value === 'custom' ? ' range' : ''}.`,
                });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average On-Time Performance</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.4%</div>
              <p className="text-xs text-muted-foreground">+3.1% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.8M MAD</div>
              <p className="text-xs text-muted-foreground">+5.4% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">Improvement from last year</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="passengers" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-[400px] grid-cols-3">
                <TabsTrigger value="passengers">Passenger Trends</TabsTrigger>
                <TabsTrigger value="performance">Route Performance</TabsTrigger>
                <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Select 
                  value={chartType} 
                  onValueChange={setChartType}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setYear("2023")
                    setDateRange("last30days")
                    setChartType("line")
                  }}
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Reset Filters</span>
                </Button>
              </div>
            </div>

            <TabsContent value="passengers" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Passenger Volume</CardTitle>
                  <CardDescription>Total passenger count across all routes by month</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={passengerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="passengers" stroke="#ef4444" strokeWidth={2} />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <BarChart data={passengerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="passengers" fill="#ef4444" />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={passengerData.map(item => ({ name: item.name, value: item.passengers }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {passengerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Route Performance Analysis</CardTitle>
                  <CardDescription>On-time performance metrics for top routes</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="onTime" stroke="#10b981" name="On Time %" />
                        <Line type="monotone" dataKey="delayed" stroke="#ef4444" name="Delayed %" />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="onTime" fill="#10b981" name="On Time %" />
                        <Bar dataKey="delayed" fill="#ef4444" name="Delayed %" />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={[
                            { name: "On Time", value: performanceData.reduce((sum, item) => sum + item.onTime, 0) / performanceData.length },
                            { name: "Delayed", value: performanceData.reduce((sum, item) => sum + item.delayed, 0) / performanceData.length },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                  <CardDescription>Breakdown of revenue by service type</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={revenueData.map((item, index) => ({ name: item.name, value: item.value, month: index }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={revenueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {revenueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Peak Hour Analysis</CardTitle>
              <CardDescription>Passenger volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { hour: "6AM", passengers: 2100 },
                    { hour: "7AM", passengers: 4500 },
                    { hour: "8AM", passengers: 6800 },
                    { hour: "9AM", passengers: 5200 },
                    { hour: "10AM", passengers: 3800 },
                    { hour: "11AM", passengers: 3200 },
                    { hour: "12PM", passengers: 3500 },
                    { hour: "1PM", passengers: 3700 },
                    { hour: "2PM", passengers: 3400 },
                    { hour: "3PM", passengers: 3600 },
                    { hour: "4PM", passengers: 4200 },
                    { hour: "5PM", passengers: 6500 },
                    { hour: "6PM", passengers: 5800 },
                    { hour: "7PM", passengers: 4300 },
                    { hour: "8PM", passengers: 3200 },
                    { hour: "9PM", passengers: 2400 },
                    { hour: "10PM", passengers: 1800 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="passengers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Popularity</CardTitle>
              <CardDescription>Most used routes by passenger volume</CardDescription>
            </CardHeader>\

