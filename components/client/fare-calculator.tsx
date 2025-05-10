"use client"

import { useState } from "react"
import { CalculatorIcon, Clock, MapPin, Wallet, Tag, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function FareCalculator() {
  const [origin, setOrigin] = useState("Jemaa el-Fnaa")
  const [destination, setDestination] = useState("")
  const [transportType, setTransportType] = useState("all")
  const [fareType, setFareType] = useState("single")
  const [distance, setDistance] = useState(5)
  const [hasDiscount, setHasDiscount] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const calculateFare = () => {
    setShowResults(true)
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center">
          <CalculatorIcon className="mr-2 h-5 w-5" />
          Fare Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="From" 
                  className="pl-9" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="To" 
                  className="pl-9" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            
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
                value={fareType} 
                onValueChange={setFareType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fare Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Trip</SelectItem>
                  <SelectItem value="return">Return Trip</SelectItem>
                  <SelectItem value="day">Day Pass</SelectItem>
                  <SelectItem value="week">Weekly Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="distance">Estimated Distance: {distance} km</Label>
              </div>
              <Slider 
                id="distance"
                defaultValue={[5]} 
                max={50} 
                step={1}
                onValueChange={(val) => setDistance(val[0])}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="discount" 
                checked={hasDiscount}
                onCheckedChange={setHasDiscount}
              />
              <Label htmlFor="discount">Apply Student/Senior Discount</Label>
            </div>
            
            <Button 
              className="w-full"
              onClick={calculateFare}
            >
              <CalculatorIcon className="mr-2 h-4 w-4" />
              Calculate Fare
            </Button>
          </div>
          
          {showResults && (
            <div className="pt-4 space-y-3">
              <div className="border-t pt-3">
                <h3 className="font-medium text-lg mb-3">Fare Estimates</h3>
                
                <Tabs defaultValue="bus">
                  <TabsList className="grid grid-cols-2 mb-3">
                    <TabsTrigger value="bus">Bus Options</TabsTrigger>
                    <TabsTrigger value="taxi">Taxi Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bus" className="space-y-3">
                    <FareOption 
                      routeNumber="3"
                      routeName="Jemaa el-Fnaa - Majorelle Garden"
                      fareAmount="15 MAD"
                      duration="30 min"
                      discountedPrice={hasDiscount ? "12 MAD" : null}
                      type="Standard"
                    />
                    
                    <FareOption 
                      routeNumber="12"
                      routeName="City Express"
                      fareAmount="20 MAD"
                      duration="25 min"
                      discountedPrice={hasDiscount ? "16 MAD" : null}
                      type="Express"
                    />
                  </TabsContent>
                  
                  <TabsContent value="taxi" className="space-y-3">
                    <FareOption 
                      routeNumber="T1"
                      routeName="Shared Taxi"
                      fareAmount="25 MAD"
                      duration="20 min"
                      type="Shared"
                    />
                    
                    <FareOption 
                      routeNumber="T2"
                      routeName="Private Taxi"
                      fareAmount="45 MAD"
                      duration="18 min"
                      type="Private"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <h4 className="font-medium mb-1">Fare Information</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Fares are estimates and may vary based on actual distance</li>
                  <li>Student/Senior discounts require valid ID</li>
                  <li>Day passes offer unlimited travel within city limits</li>
                  <li>Children under 5 travel free with paying adult</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface FareOptionProps {
  routeNumber: string;
  routeName: string;
  fareAmount: string;
  duration: string;
  discountedPrice?: string | null;
  type: string;
}

function FareOption({ routeNumber, routeName, fareAmount, duration, discountedPrice = null, type }: FareOptionProps) {
  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${type === "Standard" || type === "Express" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"}`}>
            {routeNumber}
          </div>
          <div className="ml-3">
            <div className="font-medium">{routeName}</div>
            <div className="text-sm text-muted-foreground">{type}</div>
          </div>
        </div>
        <Badge variant="outline">{duration}</Badge>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="font-medium">{fareAmount}</span>
            {discountedPrice && (
              <div className="text-xs text-green-600">
                <Tag className="h-3 w-3 mr-1 inline" />
                Discount: {discountedPrice}
              </div>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline">Select</Button>
      </div>
    </div>
  )
}