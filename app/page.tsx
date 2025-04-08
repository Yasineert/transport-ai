"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bus, Clock, MapPin, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { FleetStatus } from "@/components/fleet-status"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBusStops, type BusStop } from "@/lib/api"

export default function Dashboard() {
  const [busStops, setBusStops] = useState<BusStop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Sort bus stops by passenger volume (descending)
  const sortedBusStops = [...busStops].sort((a, b) => b.dailyPassengers - a.dailyPassengers).slice(0, 5)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-rose-600" />
          <span className="text-lg font-semibold">Marrakech Transport</span>
        </div>
        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium">
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
          <Link href="/analytics" className="text-sm font-medium text-muted-foreground">
            Analytics
          </Link>
          <Link href="/settings" className="text-sm font-medium text-muted-foreground">
            Settings
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48,293</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">2 routes under maintenance</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Fleet Performance Overview</CardTitle>
              <CardDescription>Daily performance metrics for the entire fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Current status of all vehicles in the fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <FleetStatus />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from the transport network</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Busiest Stations</CardTitle>
              <CardDescription>Top 5 stations by passenger volume today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </>
              ) : error ? (
                <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
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
              ) : (
                sortedBusStops.map((stop) => (
                  <div key={stop.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stop.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stop.dailyPassengers.toLocaleString()} passengers
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-rose-500"
                        style={{
                          width: `${Math.min(100, (stop.dailyPassengers / sortedBusStops[0].dailyPassengers) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Link href="/bus-stops" className="flex items-center text-sm text-muted-foreground">
                View all stations
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

