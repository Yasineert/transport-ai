"use client"

import { useState } from "react"
import Link from "next/link"
import { Bus, Clock, CreditCard, MapPin, Phone, QrCode, Smartphone, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function PassengerAppPage() {
  const { toast } = useToast()
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showPushUpdateDialog, setShowPushUpdateDialog] = useState(false)
  const [showConfigureDialog, setShowConfigureDialog] = useState(false)
  const [currentFeature, setCurrentFeature] = useState("")

  // Feature configuration state
  const [featureConfig, setFeatureConfig] = useState({
    tracking: {
      enabled: true,
      refreshRate: "15",
      accuracyLevel: "high",
      showBusNumber: true,
      showDriverInfo: false,
    },
    ticketing: {
      enabled: true,
      paymentMethods: ["card", "mobile"],
      ticketValidityHours: "24",
      showQRCode: true,
    },
    planning: {
      enabled: true,
      maxRoutes: "3",
      showAlternatives: true,
      includeWalking: true,
    },
    payment: {
      enabled: true,
      methods: ["card", "mobile"],
      savePaymentInfo: false,
      requireAuth: true,
    },
    qrcode: {
      enabled: true,
      scanTimeout: "30",
      cameraAccess: true,
    },
  })

  // Push update state
  const [updateInfo, setUpdateInfo] = useState({
    version: "2.4.2",
    releaseNotes: "Bug fixes and performance improvements",
    forceUpdate: false,
    platforms: ["android", "ios"],
    rolloutPercentage: "100",
  })

  // Handle feature configuration
  const handleConfigureFeature = (feature) => {
    setCurrentFeature(feature)
    setShowConfigureDialog(true)
  }

  // Handle push update
  const handlePushUpdate = () => {
    toast({
      title: "Update Pushed Successfully",
      description: `Version ${updateInfo.version} has been pushed to ${updateInfo.platforms.join(", ")} devices.`,
    })
    setShowPushUpdateDialog(false)
  }

  // Handle feature toggle
  const handleFeatureToggle = (feature, value) => {
    setFeatureConfig({
      ...featureConfig,
      [feature]: {
        ...featureConfig[feature],
        enabled: value,
      },
    })

    toast({
      title: value ? "Feature Enabled" : "Feature Disabled",
      description: `The ${getFeatureName(feature)} feature has been ${value ? "enabled" : "disabled"}.`,
    })
  }

  // Get feature name for display
  const getFeatureName = (feature) => {
    switch (feature) {
      case "tracking":
        return "Real-time Tracking"
      case "ticketing":
        return "Mobile Ticketing"
      case "planning":
        return "Trip Planning"
      case "payment":
        return "Payment Integration"
      case "qrcode":
        return "QR Code Scanning"
      default:
        return feature
    }
  }

  // Get feature icon
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "tracking":
        return <MapPin className="mr-2 h-4 w-4 text-rose-600" />
      case "ticketing":
        return <Ticket className="mr-2 h-4 w-4 text-rose-600" />
      case "planning":
        return <Clock className="mr-2 h-4 w-4 text-rose-600" />
      case "payment":
        return <CreditCard className="mr-2 h-4 w-4 text-rose-600" />
      case "qrcode":
        return <QrCode className="mr-2 h-4 w-4 text-rose-600" />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-rose-600" />
          <span className="text-lg font-semibold">Marrakech Transport</span>
        </div>
        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground">
            Dashboard
          </Link>
          <Link href="/fleet-management" className="text-sm font-medium text-muted-foreground">
            Fleet Management
          </Link>
          <Link href="/routes" className="text-sm font-medium text-muted-foreground">
            Routes
          </Link>
          <Link href="/schedules" className="text-sm font-medium text-muted-foreground">
            Schedules
          </Link>
          <Link href="/drivers" className="text-sm font-medium text-muted-foreground">
            Drivers
          </Link>
          <Link href="/maintenance" className="text-sm font-medium text-muted-foreground">
            Maintenance
          </Link>
          <Link href="/fares" className="text-sm font-medium text-muted-foreground">
            Fares
          </Link>
          <Link href="/bus-stops" className="text-sm font-medium text-muted-foreground">
            Bus Stops
          </Link>
          <Link href="/passenger-app" className="text-sm font-medium">
            Passenger App
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground">
            Reports
          </Link>
          <Link href="/analytics" className="text-sm font-medium text-muted-foreground">
            Analytics
          </Link>
          <Link href="/settings" className="text-sm font-medium text-muted-foreground">
            Settings
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Passenger App Management</h1>
            <p className="text-muted-foreground">Manage the mobile application for passengers</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Loading Preview",
                  description: "Preparing app preview...",
                })
                setTimeout(() => {
                  setShowPreviewDialog(true)
                }, 800)
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              Preview App
            </Button>
            <Button onClick={() => setShowPushUpdateDialog(true)}>
              <Smartphone className="mr-2 h-4 w-4" />
              Push Update
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>App Statistics</CardTitle>
                  <CardDescription>Current usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="font-medium">24,582</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Downloads (Total)</span>
                      <span className="font-medium">85,347</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="font-medium">4.7/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Version</span>
                      <span className="font-medium">2.4.1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Updated</span>
                      <span className="font-medium">2023-05-10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>User distribution by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Android</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[68%] rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>iOS</span>
                        <span className="font-medium">32%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[32%] rounded-full bg-blue-500" />
                      </div>
                    </div>
                    <div className="pt-4 text-sm text-muted-foreground">Most active time: 7:00 AM - 9:00 AM</div>
                    <div className="text-sm text-muted-foreground">Most used feature: Real-time tracking</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>App Health</CardTitle>
                  <CardDescription>Performance and stability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="font-medium">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Load Time</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crash Rate</span>
                      <span className="font-medium">0.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response Time</span>
                      <span className="font-medium">245ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server Status</span>
                      <Badge className="bg-green-500">Operational</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>App Features Management</CardTitle>
                <CardDescription>Configure and manage app features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-rose-600" />
                        <span className="font-medium">Real-time Tracking</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Live tracking of buses and estimated arrival times
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Active</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureFeature("tracking")}>
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4 text-rose-600" />
                        <span className="font-medium">Mobile Ticketing</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Purchase and validate tickets directly from the app
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Active</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureFeature("ticketing")}>
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-rose-600" />
                        <span className="font-medium">Trip Planning</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Plan journeys with multiple routes and transport options
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Active</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureFeature("planning")}>
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-rose-600" />
                        <span className="font-medium">Payment Integration</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Multiple payment methods including cards and mobile wallets
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Active</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureFeature("payment")}>
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <QrCode className="mr-2 h-4 w-4 text-rose-600" />
                        <span className="font-medium">QR Code Scanning</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scan QR codes at bus stops for real-time information
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-500 text-white">
                        Beta
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureFeature("qrcode")}>
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Add New Feature",
                      description: "Feature creation wizard will be available in the next update.",
                    })
                  }}
                >
                  Add New Feature
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Saving Changes",
                      description: "Updating feature configuration...",
                    })

                    // Simulate saving process
                    setTimeout(() => {
                      toast({
                        title: "Changes Saved",
                        description: "Your feature configuration has been updated successfully.",
                      })
                    }, 1000)
                  }}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage and send notifications to app users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Scheduled Notifications</div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">Service Disruption Alert</div>
                          <div className="text-sm text-muted-foreground">Route 7 delay due to road works</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Scheduled for: May 20, 2023 - 07:00 AM
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => {
                              toast({
                                title: "Notification Cancelled",
                                description: "The scheduled notification has been cancelled.",
                              })
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">Special Event Notice</div>
                          <div className="text-sm text-muted-foreground">Extra buses for Marrakech Film Festival</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Scheduled for: May 25, 2023 - 09:00 AM
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => {
                              toast({
                                title: "Notification Cancelled",
                                description: "The scheduled notification has been cancelled.",
                              })
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Send New Notification</div>
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input id="title" placeholder="Notification title" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Input id="message" placeholder="Notification message" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="target" className="text-sm font-medium">
                          Target Audience
                        </label>
                        <select
                          id="target"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="all">All Users</option>
                          <option value="android">Android Users</option>
                          <option value="ios">iOS Users</option>
                          <option value="route3">Route 3 Users</option>
                          <option value="route7">Route 7 Users</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            toast({
                              title: "Notification Sent",
                              description: "Your notification has been sent to the selected users.",
                            })
                          }}
                        >
                          Send Notification
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
                <CardDescription>Recent feedback and reviews from app users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Ahmed K.</div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="ml-2 text-sm">5.0</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      Great app! The real-time tracking is very accurate and helps me plan my commute perfectly.
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>May 18, 2023</span>
                      <span>Android v2.4.1</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Fatima O.</div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★★</span>
                        <span className="ml-2 text-sm">4.0</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      The mobile ticketing feature is very convenient. Would be nice to have more payment options
                      though.
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>May 15, 2023</span>
                      <span>iOS v2.4.1</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Karim B.</div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★</span>
                        <span className="ml-2 text-sm">3.0</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      App sometimes crashes when trying to plan a complex route. Please fix this issue.
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>May 12, 2023</span>
                      <span>Android v2.4.0</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Nadia E.</div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="ml-2 text-sm">5.0</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      The QR code feature at bus stops is amazing! Makes it so easy to get information quickly.
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>May 10, 2023</span>
                      <span>iOS v2.4.1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Loading All Feedback",
                      description: "Fetching all user feedback and reviews.",
                    })
                  }}
                >
                  View All Feedback
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* App Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>App Preview</DialogTitle>
            <DialogDescription>Preview how the app looks on different devices.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative border-8 border-gray-800 rounded-3xl w-[280px] h-[500px] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center justify-center">
                <div className="w-16 h-4 bg-gray-700 rounded-full"></div>
              </div>
              <div className="bg-white h-full pt-8 pb-4 px-2">
                <div className="bg-rose-600 text-white p-2 rounded-t-lg flex items-center">
                  <Bus className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Marrakech Transport</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-b-lg mb-2">
                  <div className="text-sm font-medium">Find your route</div>
                  <div className="flex mt-1 gap-1">
                    <div className="bg-white rounded p-1 flex-1 text-xs text-gray-500">From</div>
                    <div className="bg-white rounded p-1 flex-1 text-xs text-gray-500">To</div>
                    <div className="bg-rose-600 text-white rounded p-1 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow mb-2 p-2">
                  <div className="text-xs font-medium text-gray-500">NEXT DEPARTURES</div>
                  <div className="mt-1 border-b pb-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-1">
                          1
                        </div>
                        <span className="text-sm">Jemaa el-Fnaa - Gueliz</span>
                      </div>
                      <span className="text-sm font-medium">3 min</span>
                    </div>
                  </div>
                  <div className="mt-1 border-b pb-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-1">
                          7
                        </div>
                        <span className="text-sm">Railway Station - Menara</span>
                      </div>
                      <span className="text-sm font-medium">8 min</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-1">
                          3
                        </div>
                        <span className="text-sm">Majorelle Garden - Palmeraie</span>
                      </div>
                      <span className="text-sm font-medium">12 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="bg-white rounded-lg shadow p-2 w-[48%]">
                    <div className="flex items-center justify-center">
                      <Ticket className="h-4 w-4 text-rose-600 mr-1" />
                      <span className="text-xs font-medium">My Tickets</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-2 w-[48%]">
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-rose-600 mr-1" />
                      <span className="text-xs font-medium">Live Map</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-2 mb-2">
                  <div className="text-xs font-medium text-gray-500">POPULAR ROUTES</div>
                  <div className="mt-1 text-sm">Airport - City Center</div>
                  <div className="mt-1 text-sm">Jemaa el-Fnaa - Gueliz</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-800 flex items-center justify-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                Android
              </Button>
              <Button variant="outline" size="sm">
                iOS
              </Button>
              <Button variant="outline" size="sm">
                Tablet
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Push Update Dialog */}
      <Dialog open={showPushUpdateDialog} onOpenChange={setShowPushUpdateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Push App Update</DialogTitle>
            <DialogDescription>Configure and push a new version of the app to users.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Input
                id="version"
                value={updateInfo.version}
                onChange={(e) => setUpdateInfo({ ...updateInfo, version: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="release-notes" className="text-right">
                Release Notes
              </Label>
              <Textarea
                id="release-notes"
                value={updateInfo.releaseNotes}
                onChange={(e) => setUpdateInfo({ ...updateInfo, releaseNotes: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platforms" className="text-right">
                Platforms
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                <Button
                  variant={updateInfo.platforms.includes("android") ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newPlatforms = updateInfo.platforms.includes("android")
                      ? updateInfo.platforms.filter((p) => p !== "android")
                      : [...updateInfo.platforms, "android"]
                    setUpdateInfo({ ...updateInfo, platforms: newPlatforms })
                  }}
                >
                  Android
                </Button>
                <Button
                  variant={updateInfo.platforms.includes("ios") ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newPlatforms = updateInfo.platforms.includes("ios")
                      ? updateInfo.platforms.filter((p) => p !== "ios")
                      : [...updateInfo.platforms, "ios"]
                    setUpdateInfo({ ...updateInfo, platforms: newPlatforms })
                  }}
                >
                  iOS
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rollout" className="text-right">
                Rollout %
              </Label>
              <Input
                id="rollout"
                type="number"
                min="1"
                max="100"
                value={updateInfo.rolloutPercentage}
                onChange={(e) => setUpdateInfo({ ...updateInfo, rolloutPercentage: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="force-update" className="text-right">
                Force Update
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="force-update"
                  checked={updateInfo.forceUpdate}
                  onCheckedChange={(checked) => setUpdateInfo({ ...updateInfo, forceUpdate: checked })}
                />
                <Label htmlFor="force-update" className="text-sm text-muted-foreground">
                  Users will be required to update before using the app
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPushUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePushUpdate}>Push Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature Configuration Dialog */}
      <Dialog open={showConfigureDialog} onOpenChange={setShowConfigureDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {getFeatureName(currentFeature)}</DialogTitle>
            <DialogDescription>Adjust settings for the {getFeatureName(currentFeature)} feature.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feature-enabled" className="text-right">
                Enabled
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="feature-enabled"
                  checked={currentFeature && featureConfig[currentFeature]?.enabled}
                  onCheckedChange={(checked) => handleFeatureToggle(currentFeature, checked)}
                />
                <Label htmlFor="feature-enabled" className="text-sm text-muted-foreground">
                  Feature is {currentFeature && featureConfig[currentFeature]?.enabled ? "active" : "inactive"} for
                  users
                </Label>
              </div>
            </div>

            {currentFeature === "tracking" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="refresh-rate" className="text-right">
                    Refresh Rate (sec)
                  </Label>
                  <Input
                    id="refresh-rate"
                    type="number"
                    min="5"
                    max="60"
                    value={featureConfig.tracking.refreshRate}
                    onChange={(e) =>
                      setFeatureConfig({
                        ...featureConfig,
                        tracking: {
                          ...featureConfig.tracking,
                          refreshRate: e.target.value,
                        },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accuracy" className="text-right">
                    Accuracy Level
                  </Label>
                  <Select
                    value={featureConfig.tracking.accuracyLevel}
                    onValueChange={(value) =>
                      setFeatureConfig({
                        ...featureConfig,
                        tracking: {
                          ...featureConfig.tracking,
                          accuracyLevel: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select accuracy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Battery Saving)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Precise)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="show-bus-number" className="text-right">
                    Show Bus Number
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="show-bus-number"
                      checked={featureConfig.tracking.showBusNumber}
                      onCheckedChange={(checked) =>
                        setFeatureConfig({
                          ...featureConfig,
                          tracking: {
                            ...featureConfig.tracking,
                            showBusNumber: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {currentFeature === "ticketing" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment-methods" className="text-right">
                    Payment Methods
                  </Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    <Button
                      variant={featureConfig.ticketing.paymentMethods.includes("card") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newMethods = featureConfig.ticketing.paymentMethods.includes("card")
                          ? featureConfig.ticketing.paymentMethods.filter((m) => m !== "card")
                          : [...featureConfig.ticketing.paymentMethods, "card"]
                        setFeatureConfig({
                          ...featureConfig,
                          ticketing: {
                            ...featureConfig.ticketing,
                            paymentMethods: newMethods,
                          },
                        })
                      }}
                    >
                      Credit Card
                    </Button>
                    <Button
                      variant={featureConfig.ticketing.paymentMethods.includes("mobile") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newMethods = featureConfig.ticketing.paymentMethods.includes("mobile")
                          ? featureConfig.ticketing.paymentMethods.filter((m) => m !== "mobile")
                          : [...featureConfig.ticketing.paymentMethods, "mobile"]
                        setFeatureConfig({
                          ...featureConfig,
                          ticketing: {
                            ...featureConfig.ticketing,
                            paymentMethods: newMethods,
                          },
                        })
                      }}
                    >
                      Mobile Wallet
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ticket-validity" className="text-right">
                    Ticket Validity (hours)
                  </Label>
                  <Input
                    id="ticket-validity"
                    type="number"
                    min="1"
                    max="72"
                    value={featureConfig.ticketing.ticketValidityHours}
                    onChange={(e) =>
                      setFeatureConfig({
                        ...featureConfig,
                        ticketing: {
                          ...featureConfig.ticketing,
                          ticketValidityHours: e.target.value,
                        },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {currentFeature === "qrcode" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="scan-timeout" className="text-right">
                    Scan Timeout (sec)
                  </Label>
                  <Input
                    id="scan-timeout"
                    type="number"
                    min="10"
                    max="60"
                    value={featureConfig.qrcode.scanTimeout}
                    onChange={(e) =>
                      setFeatureConfig({
                        ...featureConfig,
                        qrcode: {
                          ...featureConfig.qrcode,
                          scanTimeout: e.target.value,
                        },
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="camera-access" className="text-right">
                    Camera Access
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="camera-access"
                      checked={featureConfig.qrcode.cameraAccess}
                      onCheckedChange={(checked) =>
                        setFeatureConfig({
                          ...featureConfig,
                          qrcode: {
                            ...featureConfig.qrcode,
                            cameraAccess: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="camera-access" className="text-sm text-muted-foreground">
                      Request camera permission on startup
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigureDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Feature Updated",
                  description: `${getFeatureName(currentFeature)} settings have been updated.`,
                })
                setShowConfigureDialog(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

