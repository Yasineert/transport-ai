import { ArrowRight, Bus, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PopularRoutes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouteCard
        routeNumber="1"
        from="Jemaa el-Fnaa"
        to="Gueliz"
        frequency="Every 15 min"
        nextBus="3 min"
        status="On Time"
        duration="20 min"
        backgroundColor="bg-blue-600"
      />

      <RouteCard
        routeNumber="3"
        from="Jemaa el-Fnaa"
        to="Majorelle Garden"
        frequency="Every 20 min"
        nextBus="7 min"
        status="On Time"
        duration="30 min"
        backgroundColor="bg-green-600"
      />

      <RouteCard
        routeNumber="7"
        from="Railway Station"
        to="Menara Mall"
        frequency="Every 20 min"
        nextBus="12 min"
        status="Slight Delay"
        duration="25 min"
        backgroundColor="bg-red-600"
      />

      <RouteCard
        routeNumber="12"
        from="Majorelle Garden"
        to="Palmeraie"
        frequency="Every 30 min"
        nextBus="18 min"
        status="On Time"
        duration="35 min"
        backgroundColor="bg-purple-600"
      />

      <RouteCard
        routeNumber="15"
        from="Airport"
        to="City Center"
        frequency="Every 25 min"
        nextBus="Just Left"
        status="On Time"
        duration="40 min"
        backgroundColor="bg-orange-600"
      />

      <RouteCard
        routeNumber="T3"
        from="Medina Taxi Zone"
        to="Various Destinations"
        frequency="On Demand"
        nextBus="Available Now"
        status="Available"
        duration="Varies"
        backgroundColor="bg-yellow-600"
        isTaxi
      />
    </div>
  )
}

function RouteCard({
  routeNumber,
  from,
  to,
  frequency,
  nextBus,
  status,
  duration,
  backgroundColor = "bg-blue-600",
  isTaxi = false,
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className={`${backgroundColor} text-white p-3 rounded-t-lg flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
              {routeNumber}
            </div>
            <div className="font-medium">
              {isTaxi ? "Taxi" : "Route"} {routeNumber}
            </div>
          </div>
          <Badge className="bg-white text-black">{frequency}</Badge>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex items-center">
              <span>{from}</span>
              <ArrowRight className="mx-2 h-3 w-3 text-muted-foreground" />
              <span>{to}</span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Bus className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Next: <span className="font-medium">{nextBus}</span>
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Trip: <span className="font-medium">{duration}</span>
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Badge variant={status === "On Time" ? "outline" : "secondary"}>{status}</Badge>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

