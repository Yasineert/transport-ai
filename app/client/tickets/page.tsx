import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  QrCode,
  RotateCcw,
  Share,
  ShoppingCart,
} from "lucide-react"

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground">Purchase and manage your transit tickets</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Tickets</TabsTrigger>
          <TabsTrigger value="expired">History</TabsTrigger>
          <TabsTrigger value="buy">Buy Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">7-Day Pass</h2>
                <p className="text-white/80 mb-3">Unlimited rides on all routes</p>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Valid: Apr 4 - Apr 10, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>5 days remaining</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white text-green-700">ACTIVE</Badge>
                <div className="mt-4">
                  <QrCode className="h-16 w-16 inline-block" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6 border-t border-white/20 pt-4">
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="secondary" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Single Trip</h2>
                <p className="text-white/80 mb-3">Route 3: Jemaa el-Fnaa - Majorelle Garden</p>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Valid: Apr 7, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Valid for 2 hours from activation</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white text-blue-700">UNUSED</Badge>
                <div className="mt-4">
                  <QrCode className="h-16 w-16 inline-block" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6 border-t border-white/20 pt-4">
              <Button variant="secondary" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Ticket History</CardTitle>
              <CardDescription>Your previously used tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div>
                    <h3 className="font-medium">3-Day Tourist Pass</h3>
                    <p className="text-sm text-muted-foreground">Used: Mar 15 - Mar 17, 2025</p>
                  </div>
                  <Badge variant="outline">Expired</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div>
                    <h3 className="font-medium">Single Trip - Route 1</h3>
                    <p className="text-sm text-muted-foreground">Used: Mar 20, 2025</p>
                  </div>
                  <Badge variant="outline">Used</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div>
                    <h3 className="font-medium">Airport Express</h3>
                    <p className="text-sm text-muted-foreground">Used: Mar 25, 2025</p>
                  </div>
                  <Badge variant="outline">Used</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buy" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Single Trip</CardTitle>
                <CardDescription>Valid for one trip on any route</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7 MAD</div>
                <p className="text-sm text-muted-foreground mt-2">Valid for 2 hours from activation</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Ticket
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>7-Day Pass</CardTitle>
                  <Badge className="bg-green-600">POPULAR</Badge>
                </div>
                <CardDescription>Unlimited rides for 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45 MAD</div>
                <p className="text-sm text-muted-foreground mt-2">Save up to 35% compared to single tickets</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Pass
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>30-Day Pass</CardTitle>
                <CardDescription>Unlimited rides for a full month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">150 MAD</div>
                <p className="text-sm text-muted-foreground mt-2">Best value for regular commuters</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Pass
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Special Passes</CardTitle>
              <CardDescription>Tourist and group packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">Tourist Explorer Pass</h3>
                  <p className="text-sm text-muted-foreground">3 days of unlimited travel + attraction discounts</p>
                </div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-4">90 MAD</div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">Group Day Pass</h3>
                  <p className="text-sm text-muted-foreground">Unlimited travel for up to 5 people for 1 day</p>
                </div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-4">75 MAD</div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">Airport Express</h3>
                  <p className="text-sm text-muted-foreground">Direct service between Jemaa el-Fnaa and Airport</p>
                </div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-4">20 MAD</div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center p-4 border rounded-md bg-muted/20 mt-6">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-muted-foreground mr-3" />
              <span>Secure payment with credit card, mobile payment, or cash at stations</span>
            </div>
            <Button variant="link">Payment Options</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

