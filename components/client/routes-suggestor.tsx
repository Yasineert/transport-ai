"use client"

import { useState } from "react"
import { 
  ArrowRight, 
  MapPin, 
  CornerUpRight, 
  Filter, 
  Clock, 
  Bus, 
  Sparkles,
  TagIcon,
  Route as RouteIcon,
  CornerDownLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function RoutesSuggestor() {
  const [location, setLocation] = useState("Jemaa el-Fnaa")
  const [radius, setRadius] = useState(3)
  const [transportType, setTransportType] = useState("all")
  const [timeOfDay, setTimeOfDay] = useState("now")
  const [maxDuration, setMaxDuration] = useState(60)
  const [showPopular, setShowPopular] = useState(true)
  const [showTouristFriendly, setShowTouristFriendly] = useState(false)
  const [suggestionMode, setSuggestionMode] = useState("exploratory")

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center">
          <RouteIcon className="mr-2 h-5 w-5" />
          Route Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue="exploratory" onValueChange={setSuggestionMode}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="exploratory">Explore Area</TabsTrigger>
              <TabsTrigger value="directional">Find Direction</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exploratory" className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Your Location" 
                    className="pl-9" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="radius">Search Radius: {radius} km</Label>
                  </div>
                  <Slider 
                    id="radius"
                    defaultValue={[3]} 
                    max={15} 
                    step={1}
                    onValueChange={(val) => setRadius(val[0])}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="directional" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="From" 
                    className="pl-9" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="relative flex-1">
                  <CornerDownLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="popular">
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Popular Destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Popular Destinations</SelectItem>
                      <SelectItem value="tourist">Tourist Attractions</SelectItem>
                      <SelectItem value="shopping">Shopping Areas</SelectItem>
                      <SelectItem value="dining">Dining Districts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={transportType} 
              onValueChange={setTransportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Transport Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bus">Bus Only</SelectItem>
                <SelectItem value="taxi">Taxi Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={timeOfDay} 
              onValueChange={setTimeOfDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Time of Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Now</SelectItem>
                <SelectItem value="morning">Morning (6-10 AM)</SelectItem>
                <SelectItem value="day">Daytime (10 AM-5 PM)</SelectItem>
                <SelectItem value="evening">Evening (5-10 PM)</SelectItem>
                <SelectItem value="night">Night (10 PM-6 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="duration">Max Duration: {maxDuration} min</Label>
            </div>
            <Slider 
              id="duration"
              defaultValue={[60]} 
              max={180} 
              step={15}
              onValueChange={(val) => setMaxDuration(val[0])}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="popular" 
                checked={showPopular}
                onCheckedChange={setShowPopular}
              />
              <Label htmlFor="popular">Show Most Popular Routes</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="tourist" 
                checked={showTouristFriendly}
                onCheckedChange={setShowTouristFriendly}
              />
              <Label htmlFor="tourist">Tourist-Friendly Routes Only</Label>
            </div>
          </div>
          
          <Button className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Suggest Routes
          </Button>
          
          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-3">Suggested Routes</h3>
            
            <div className="space-y-3">
              <RouteCard 
                routeNumber="3"
                from="Jemaa el-Fnaa"
                to="Majorelle Garden"
                duration="30 min"
                frequency="Every 20 min"
                nextDeparture="7 min"
                highlights={["Tourist attraction", "Scenic route"]}
                type="bus"
              />
              
              <RouteCard 
                routeNumber="12"
                from="Jemaa el-Fnaa"
                to="Palmeraie"
                duration="35 min"
                frequency="Every 30 min"
                nextDeparture="18 min"
                highlights={["Shopping district", "Restaurant area"]}
                type="bus"
              />
              
              <RouteCard 
                routeNumber="T1"
                from="Jemaa el-Fnaa"
                to="Bahia Palace"
                duration="15 min"
                frequency="On demand"
                nextDeparture="Available now"
                highlights={["Historical site", "Quick route"]}
                type="taxi"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RouteCardProps {
  routeNumber: string;
  from: string;
  to: string;
  duration: string;
  frequency: string;
  nextDeparture: string;
  highlights: string[];
  type: "bus" | "taxi";
}

function RouteCard({ routeNumber, from, to, duration, frequency, nextDeparture, highlights, type }: RouteCardProps) {
  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${type === "bus" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"}`}>
            {type === "bus" ? <Bus className="h-4 w-4" /> : routeNumber}
          </div>
          <div className="ml-3">
            <div className="font-medium">{type === "bus" ? `Route ${routeNumber}` : `Taxi ${routeNumber}`}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <span>{from}</span>
              <ArrowRight className="mx-1 h-3 w-3" />
              <span>{to}</span>
            </div>
          </div>
        </div>
        <Badge variant="outline">{duration}</Badge>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {highlights.map((highlight, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {highlight}
          </Badge>
        ))}
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-muted-foreground">{frequency}</span>
          <div className="font-medium flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Next: {nextDeparture}
          </div>
        </div>
        <Button size="sm">View Details</Button>
      </div>
    </div>
  )
}