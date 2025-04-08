import { Bus, Clock, CarTaxiFrontIcon as Taxi, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function RouteDetails({
  routeNumber,
  routeName,
  departureTime,
  arrivalTime,
  duration,
  transfers,
  fare,
  walkingDistance,
  busStatus,
  isTaxi = false,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isTaxi ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}
          >
            {isTaxi ? <Taxi className="h-6 w-6" /> : <Bus className="h-6 w-6" />}
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-lg">
              {isTaxi ? "Taxi" : "Route"} {routeNumber}
            </h3>
            <p className="text-sm text-muted-foreground">{routeName}</p>
          </div>
        </div>
        <Badge variant={busStatus === "On Time" ? "outline" : busStatus === "Slight Delay" ? "secondary" : "default"}>
          {busStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground mb-1">Departure</div>
          <div className="font-medium">{departureTime}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Arrival</div>
          <div className="font-medium">{arrivalTime}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Duration</div>
          <div className="font-medium flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {duration}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Fare</div>
          <div className="font-medium flex items-center">
            <Wallet className="h-3 w-3 mr-1" />
            {fare}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2 pt-2">
        <div className="text-sm space-x-3">
          <span className="text-muted-foreground">
            Transfers: <span className="font-medium">{transfers}</span>
          </span>
          <span className="text-muted-foreground">
            Walking: <span className="font-medium">{walkingDistance}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Map View
          </Button>
          <Button size="sm">Select Route</Button>
        </div>
      </div>
    </div>
  )
}

