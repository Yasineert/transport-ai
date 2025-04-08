"use client"

import { useState } from "react"
import { ArrowRight, MapPin, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TripPlanner({ expanded = false }) {
  const [departureTime, setDepartureTime] = useState("now")

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm dark:bg-gray-950/90 rounded-lg shadow-lg p-4 ${expanded ? "space-y-4" : "space-y-3"}`}
    >
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="From" className="pl-9" defaultValue="Jemaa el-Fnaa" />
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="To" className="pl-9" defaultValue="Majorelle Garden" />
        </div>
      </div>

      {expanded && (
        <div className="flex items-center space-x-2">
          <Select defaultValue="now">
            <SelectTrigger>
              <SelectValue placeholder="Departure Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">Leave Now</SelectItem>
              <SelectItem value="30min">In 30 minutes</SelectItem>
              <SelectItem value="1hour">In 1 hour</SelectItem>
              <SelectItem value="custom">Custom Time</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Transport Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bus">Bus Only</SelectItem>
              <SelectItem value="taxi">Taxi Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Find Routes
      </Button>

      {expanded && (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm">
            <RotateCcw className="mr-2 h-3 w-3" />
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}

