import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownUp, Bus, Clock, RotateCcw, CarTaxiFrontIcon as Taxi } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TripPlanner } from "@/components/client/trip-planner"
import { RouteDetails } from "@/components/client/route-details"

export default function RoutesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Plan Your Trip</CardTitle>
              <CardDescription>Find the best route from your location to your destination</CardDescription>
            </CardHeader>
            <CardContent>
              <TripPlanner expanded />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Transport Type</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <Bus className="mr-2 h-4 w-4" />
                    Bus
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Taxi className="mr-2 h-4 w-4" />
                    Taxi
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Preferences</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Fastest Route
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    Fewer Transfers
                  </Button>
                </div>
              </div>

              <Button variant="ghost" className="w-full" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Suggested Routes</CardTitle>
              <CardDescription>3 routes found from Jemaa el-Fnaa to Majorelle Garden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <RouteDetails
                  routeNumber="3"
                  routeName="Jemaa el-Fnaa - Majorelle Garden"
                  departureTime="11:15 AM"
                  arrivalTime="11:45 AM"
                  duration="30 min"
                  transfers={0}
                  fare="15 MAD"
                  walkingDistance="350m"
                  busStatus="On Time"
                />

                <Separator />

                <RouteDetails
                  routeNumber="7+12"
                  routeName="Via Gueliz"
                  departureTime="11:10 AM"
                  arrivalTime="11:50 AM"
                  duration="40 min"
                  transfers={1}
                  fare="12 MAD"
                  walkingDistance="450m"
                  busStatus="Slight Delay"
                />

                <Separator />

                <RouteDetails
                  routeNumber="T3"
                  routeName="Taxi Direct"
                  departureTime="11:05 AM"
                  arrivalTime="11:25 AM"
                  duration="20 min"
                  transfers={0}
                  fare="35 MAD"
                  walkingDistance="0m"
                  busStatus="Available Now"
                  isTaxi
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

