import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LiveMap } from "@/components/client/live-map"
import { Bus, Info, RotateCcw, Search } from "lucide-react"

export default function LiveTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live Vehicle Tracking</h1>
        <p className="text-muted-foreground">Track buses and taxis in real-time</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Find Vehicle</CardTitle>
              <CardDescription>Search by route number or destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Enter route number or stop" />
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">Popular Routes</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Route 1
                  </Button>
                  <Button variant="outline" size="sm">
                    Route 3
                  </Button>
                  <Button variant="outline" size="sm">
                    Route 7
                  </Button>
                  <Button variant="outline" size="sm">
                    Airport
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Nearby Vehicles</CardTitle>
              <CardDescription>Based on your current location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <VehicleItem
                  routeNumber="3"
                  routeName="Jemaa el-Fnaa - Majorelle Garden"
                  arrival="2 min"
                  status="On Time"
                  busId="B145"
                />

                <VehicleItem
                  routeNumber="7"
                  routeName="Railway Station - Menara Mall"
                  arrival="5 min"
                  status="Slight Delay"
                  busId="A237"
                />

                <VehicleItem
                  routeNumber="12"
                  routeName="Majorelle Garden - Palmeraie"
                  arrival="8 min"
                  status="On Time"
                  busId="E456"
                />

                <VehicleItem
                  routeNumber="T3"
                  routeName="Medina Taxi Zone"
                  arrival="On Demand"
                  status="Available"
                  busId="T102"
                  isTaxi
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3">
          <Card className="h-full">
            <CardContent className="p-0 h-[600px] relative">
              <LiveMap />
              <div className="absolute top-4 right-4 z-10">
                <Button variant="secondary" size="sm" className="shadow-md">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-background/90 p-3 rounded-md shadow-md border">
                <div className="flex items-center text-sm">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Click on any vehicle on the map to see detailed information and estimated arrival times</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function VehicleItem({ routeNumber, routeName, arrival, status, busId, isTaxi = false }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isTaxi ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}
        >
          <Bus className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <div className="font-medium flex items-center">
            <span>{routeNumber}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm">{busId}</span>
          </div>
          <div className="text-sm text-muted-foreground">{routeName}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{arrival}</div>
        <Badge
          variant={status === "On Time" ? "outline" : status === "Slight Delay" ? "secondary" : "default"}
          className="text-xs"
        >
          {status}
        </Badge>
      </div>
    </div>
  )
}

