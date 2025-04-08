import Link from "next/link"
import { Bus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
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
          <Link href="/passenger-app" className="text-sm font-medium text-muted-foreground">
            Passenger App
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground">
            Reports
          </Link>
          <Link href="/analytics" className="text-sm font-medium text-muted-foreground">
            Analytics
          </Link>
          <Link href="/settings" className="text-sm font-medium">
            Settings
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your system preferences and configurations</p>
        </div>

        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4">
              <TabsList className="flex flex-col h-auto w-full rounded-md bg-muted p-1 md:w-48">
                <TabsTrigger value="general" className="justify-start w-full">
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full">
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="users" className="justify-start w-full">
                  Users & Permissions
                </TabsTrigger>
                <TabsTrigger value="integrations" className="justify-start w-full">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="billing" className="justify-start w-full">
                  Billing
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="general" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your organization and system settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization Name</Label>
                      <Input id="organization" defaultValue="Marrakech Transport Authority" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Email</Label>
                      <Input id="contact" type="email" defaultValue="admin@marrakech-transport.ma" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="africa-casablanca">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa-casablanca">Africa/Casablanca (GMT+1)</SelectItem>
                          <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                          <SelectItem value="europe-paris">Europe/Paris (GMT+1)</SelectItem>
                          <SelectItem value="america-new_york">America/New_York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="ar-ma">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar-ma">Arabic (Morocco)</SelectItem>
                          <SelectItem value="fr-fr">French</SelectItem>
                          <SelectItem value="en-us">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="maintenance">System Maintenance</Label>
                      <Textarea
                        id="maintenance"
                        placeholder="Enter maintenance message"
                        defaultValue="System maintenance scheduled for Sunday, 2:00 AM - 4:00 AM."
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important events
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive SMS alerts for critical issues</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about scheduled maintenance
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Performance Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts about system issues</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="justify-start">
                          <span className="h-4 w-4 rounded-full bg-background border mr-2"></span>
                          Light
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <span className="h-4 w-4 rounded-full bg-slate-950 mr-2"></span>
                          Dark
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <span className="h-4 w-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-950 mr-2"></span>
                          System
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="grid grid-cols-5 gap-2">
                        <Button variant="outline" className="justify-center p-1 h-10 w-10">
                          <span className="h-8 w-8 rounded-full bg-rose-500"></span>
                        </Button>
                        <Button variant="outline" className="justify-center p-1 h-10 w-10">
                          <span className="h-8 w-8 rounded-full bg-blue-500"></span>
                        </Button>
                        <Button variant="outline" className="justify-center p-1 h-10 w-10">
                          <span className="h-8 w-8 rounded-full bg-green-500"></span>
                        </Button>
                        <Button variant="outline" className="justify-center p-1 h-10 w-10">
                          <span className="h-8 w-8 rounded-full bg-purple-500"></span>
                        </Button>
                        <Button variant="outline" className="justify-center p-1 h-10 w-10">
                          <span className="h-8 w-8 rounded-full bg-amber-500"></span>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Use a more compact layout for tables and lists</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animations</Label>
                        <p className="text-sm text-muted-foreground">Enable animations throughout the interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Users & Permissions</CardTitle>
                    <CardDescription>Manage user accounts and access permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure who has access to the system and what they can do
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="font-medium">Administrator</div>
                          <p className="text-sm text-muted-foreground">Full access to all system features</p>
                          <div className="mt-2 text-sm">3 users</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="font-medium">Fleet Manager</div>
                          <p className="text-sm text-muted-foreground">Manage vehicles and maintenance</p>
                          <div className="mt-2 text-sm">5 users</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="font-medium">Route Planner</div>
                          <p className="text-sm text-muted-foreground">Create and manage routes and schedules</p>
                          <div className="mt-2 text-sm">4 users</div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="font-medium">Analyst</div>
                          <p className="text-sm text-muted-foreground">View reports and analytics</p>
                          <div className="mt-2 text-sm">7 users</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Manage Users</Button>
                    <Button variant="outline">Manage Roles</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>Connect with other systems and services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-medium">GPS Tracking System</div>
                          <p className="text-sm text-muted-foreground">Real-time vehicle location tracking</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-medium">Payment Gateway</div>
                          <p className="text-sm text-muted-foreground">Process digital fare payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-medium">Weather API</div>
                          <p className="text-sm text-muted-foreground">Weather forecasts for route planning</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-medium">Maintenance Management System</div>
                          <p className="text-sm text-muted-foreground">Track vehicle maintenance and repairs</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-medium">Public Information Displays</div>
                          <p className="text-sm text-muted-foreground">Update bus stop displays with arrival times</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                    <CardDescription>Manage your subscription and payment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Current Plan</div>
                      <div className="mt-1 text-2xl font-bold">Enterprise</div>
                      <div className="mt-1 text-sm text-muted-foreground">Billed annually</div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Payment Method</div>
                      <div className="mt-2 flex items-center">
                        <div className="h-8 w-12 rounded border bg-slate-50"></div>
                        <div className="ml-4">
                          <div>•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Update Payment Method
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Billing History</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <div>Apr 1, 2023</div>
                          <div className="font-medium">$12,000.00</div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>Mar 1, 2023</div>
                          <div className="font-medium">$12,000.00</div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>Feb 1, 2023</div>
                          <div className="font-medium">$12,000.00</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

