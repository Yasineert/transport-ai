import Link from "next/link"
import { ArrowRight, Bus, Clock, Map, MapPin, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PopularRoutes } from "@/components/client/popular-routes"
import { TripPlanner } from "@/components/client/trip-planner"
import { LiveMap } from "@/components/client/live-map"

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-700 -mx-4 px-4 py-12 sm:py-16 text-white rounded-b-xl">
        <div className="container mx-auto space-y-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Explore Marrakech with Ease</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-white/90">
            Plan your journey, track buses in real-time, and enjoy seamless travel throughout the city
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <TripPlanner />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <Map className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Route Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Find the fastest routes to your destination with real-time traffic updates.
            </p>
            <Button variant="link" className="pl-0 mt-2" asChild>
              <Link href="/client/routes">
                Plan a Route <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Clock className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View accurate timetables for all bus and taxi routes in Marrakech.</p>
            <Button variant="link" className="pl-0 mt-2" asChild>
              <Link href="/client/schedules">
                View Schedules <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Ticket className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Purchase and store digital tickets for convenient travel.</p>
            <Button variant="link" className="pl-0 mt-2" asChild>
              <Link href="/client/tickets">
                Buy Tickets <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Bus className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Live Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track buses and taxis in real-time to plan your journey better.</p>
            <Button variant="link" className="pl-0 mt-2" asChild>
              <Link href="/client/live">
                Track Vehicles <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Main Tabs Section */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="popular">Popular Routes</TabsTrigger>
          <TabsTrigger value="nearby">Nearby Stops</TabsTrigger>
          <TabsTrigger value="live">Live Map</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="mt-6">
          <PopularRoutes />
        </TabsContent>
        <TabsContent value="nearby" className="mt-6">
          <div className="space-y-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Current location"
                className="flex-1"
                defaultValue="Jemaa el-Fnaa"
                prefix={<MapPin className="h-4 w-4 text-muted-foreground mr-2" />}
              />
              <Button>Find Stops</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Jemaa el-Fnaa
                  </CardTitle>
                  <CardDescription>250m away • 4 min walk</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">1</span>
                        <span>Jemaa el-Fnaa - Gueliz</span>
                      </div>
                      <span className="text-sm font-medium">3 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">3</span>
                        <span>Jemaa el-Fnaa - Majorelle Garden</span>
                      </div>
                      <span className="text-sm font-medium">7 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">7</span>
                        <span>Jemaa el-Fnaa - Railway Station</span>
                      </div>
                      <span className="text-sm font-medium">12 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Koutoubia Mosque
                  </CardTitle>
                  <CardDescription>450m away • 6 min walk</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">5</span>
                        <span>Koutoubia - Gueliz</span>
                      </div>
                      <span className="text-sm font-medium">5 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">8</span>
                        <span>Koutoubia - Menara Mall</span>
                      </div>
                      <span className="text-sm font-medium">Just Left</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium mr-2">15</span>
                        <span>Koutoubia - Airport</span>
                      </div>
                      <span className="text-sm font-medium">20 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="live" className="mt-6">
          <LiveMap />
        </TabsContent>
      </Tabs>

      {/* Promos Section */}
      <section className="pt-4">
        <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardHeader>
              <CardTitle>Weekly Pass Discount</CardTitle>
              <CardDescription className="text-white/80">Valid until April 15th, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Get 25% off on all weekly passes with code WEEK25</p>
              <Button variant="secondary">Get This Offer</Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle>Tourist Explorer Pass</CardTitle>
              <CardDescription className="text-white/80">Unlimited travel for 3 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Visit all Marrakech attractions with our special explorer pass</p>
              <Button variant="secondary">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

