import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, Calendar, Clock, Filter, Map, RotateCcw, Search, CarTaxiFrontIcon as Taxi } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transit Schedules</h1>
          <p className="text-muted-foreground">View all bus and taxi timetables for Marrakech</p>
        </div>
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search routes, stops, or areas" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transportation Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bus">Bus Only</SelectItem>
            <SelectItem value="taxi">Taxi Only</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsContent value="list" className="space-y-4 mt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <div className="bg-blue-600 text-white p-2 rounded mr-4">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Route 1: Jemaa el-Fnaa - Gueliz</CardTitle>
                  <CardDescription>Every 15 min • First departure: 6:00 AM • Last departure: 10:00 PM</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScheduleTable />
                <Button className="w-full">View Complete Timetable</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <div className="bg-green-600 text-white p-2 rounded mr-4">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Route 3: Jemaa el-Fnaa - Majorelle Garden</CardTitle>
                  <CardDescription>Every 20 min • First departure: 6:15 AM • Last departure: 9:45 PM</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScheduleTable isRoute3 />
                <Button className="w-full">View Complete Timetable</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <div className="bg-yellow-600 text-white p-2 rounded mr-4">
                  <Taxi className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">T3: Medina Taxi Zone</CardTitle>
                  <CardDescription>On demand • 6:00 AM - 12:00 AM • Fixed rates within zone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TaxiRates />
                <Button className="w-full">View Taxi Zone Map</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-slate-100 rounded-md border flex items-center justify-center min-h-[400px]">
                <div className="text-center p-6">
                  <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Interactive Map View</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Our interactive map shows all routes, stops, and real-time vehicle locations.
                  </p>
                  <Button>Open Full Map</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="pt-6">
              <WeeklyCalendarView />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ScheduleTable({ isRoute3 = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="px-3 py-2 text-left text-sm font-medium">Stop</th>
            <th className="px-3 py-2 text-center text-sm font-medium">Morning</th>
            <th className="px-3 py-2 text-center text-sm font-medium">Afternoon</th>
            <th className="px-3 py-2 text-center text-sm font-medium">Evening</th>
          </tr>
        </thead>
        <tbody>
          {isRoute3 ? (
            <>
              <tr className="border-b">
                <td className="px-3 py-2 text-sm">Jemaa el-Fnaa</td>
                <td className="px-3 py-2 text-sm text-center">6:15, 6:35, 6:55, 7:15</td>
                <td className="px-3 py-2 text-sm text-center">12:15, 12:35, 12:55, 1:15</td>
                <td className="px-3 py-2 text-sm text-center">6:15, 6:35, 6:55, 7:15</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2 text-sm">Koutoubia</td>
                <td className="px-3 py-2 text-sm text-center">6:20, 6:40, 7:00, 7:20</td>
                <td className="px-3 py-2 text-sm text-center">12:20, 12:40, 1:00, 1:20</td>
                <td className="px-3 py-2 text-sm text-center">6:20, 6:40, 7:00, 7:20</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2 text-sm">Gueliz Central</td>
                <td className="px-3 py-2 text-sm text-center">6:30, 6:50, 7:10, 7:30</td>
                <td className="px-3 py-2 text-sm text-center">12:30, 12:50, 1:10, 1:30</td>
                <td className="px-3 py-2 text-sm text-center">6:30, 6:50, 7:10, 7:30</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-sm">Majorelle Garden</td>
                <td className="px-3 py-2 text-sm text-center">6:45, 7:05, 7:25, 7:45</td>
                <td className="px-3 py-2 text-sm text-center">12:45, 1:05, 1:25, 1:45</td>
                <td className="px-3 py-2 text-sm text-center">6:45, 7:05, 7:25, 7:45</td>
              </tr>
            </>
          ) : (
            <>
              <tr className="border-b">
                <td className="px-3 py-2 text-sm">Jemaa el-Fnaa</td>
                <td className="px-3 py-2 text-sm text-center">6:00, 6:15, 6:30, 6:45</td>
                <td className="px-3 py-2 text-sm text-center">12:00, 12:15, 12:30, 12:45</td>
                <td className="px-3 py-2 text-sm text-center">6:00, 6:15, 6:30, 6:45</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2 text-sm">Mohammed V Avenue</td>
                <td className="px-3 py-2 text-sm text-center">6:10, 6:25, 6:40, 6:55</td>
                <td className="px-3 py-2 text-sm text-center">12:10, 12:25, 12:40, 12:55</td>
                <td className="px-3 py-2 text-sm text-center">6:10, 6:25, 6:40, 6:55</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-sm">Gueliz</td>
                <td className="px-3 py-2 text-sm text-center">6:20, 6:35, 6:50, 7:05</td>
                <td className="px-3 py-2 text-sm text-center">12:20, 12:35, 12:50, 1:05</td>
                <td className="px-3 py-2 text-sm text-center">6:20, 6:35, 6:50, 7:05</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

function TaxiRates() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="px-3 py-2 text-left text-sm font-medium">From</th>
            <th className="px-3 py-2 text-left text-sm font-medium">To</th>
            <th className="px-3 py-2 text-center text-sm font-medium">Fixed Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-3 py-2 text-sm">Jemaa el-Fnaa</td>
            <td className="px-3 py-2 text-sm">Airport</td>
            <td className="px-3 py-2 text-sm text-center">70 MAD</td>
          </tr>
          <tr className="border-b">
            <td className="px-3 py-2 text-sm">Jemaa el-Fnaa</td>
            <td className="px-3 py-2 text-sm">Gueliz</td>
            <td className="px-3 py-2 text-sm text-center">35 MAD</td>
          </tr>
          <tr className="border-b">
            <td className="px-3 py-2 text-sm">Jemaa el-Fnaa</td>
            <td className="px-3 py-2 text-sm">Majorelle Garden</td>
            <td className="px-3 py-2 text-sm text-center">40 MAD</td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-sm">Medina</td>
            <td className="px-3 py-2 text-sm">Within Medina</td>
            <td className="px-3 py-2 text-sm text-center">20 MAD</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function WeeklyCalendarView() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Weekly Schedule Overview</h3>
        <div className="flex items-center gap-2">
          <Select defaultValue="route1">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route1">Route 1: Jemaa el-Fnaa - Gueliz</SelectItem>
              <SelectItem value="route3">Route 3: Jemaa el-Fnaa - Majorelle</SelectItem>
              <SelectItem value="route7">Route 7: Railway Station - Menara</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1">
            <div className="bg-muted p-2 text-center font-medium">Time</div>
            {days.map((day, i) => (
              <div key={i} className="bg-muted p-2 text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {hours.map((hour, i) => (
            <div key={i} className="grid grid-cols-8 gap-1 mt-1">
              <div className="bg-muted/50 p-2 text-center">{hour}</div>
              {days.map((day, j) => (
                <div
                  key={j}
                  className={`p-2 text-center text-xs border rounded ${
                    Math.random() > 0.3
                      ? "bg-green-100 border-green-200"
                      : Math.random() > 0.5
                        ? "bg-yellow-100 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {Math.random() > 0.3 ? `Every 15m` : Math.random() > 0.5 ? `Every 20m` : `No Service`}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Regular Service</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm">Reduced Frequency</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-sm">No Service</span>
        </div>
      </div>
    </div>
  )
}

