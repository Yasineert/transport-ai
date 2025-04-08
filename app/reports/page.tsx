"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bus, Calendar, Download, FileText, Filter, MoreHorizontal, Plus, Search, X, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for reports
const initialRecentReports = [
  {
    id: "1",
    name: "Monthly Performance Report",
    type: "Performance",
    generatedOn: "2023-05-01",
    generatedBy: "Admin",
    timePeriod: "April 2023",
    format: "PDF",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Quarterly Financial Report",
    type: "Financial",
    generatedOn: "2023-04-15",
    generatedBy: "Finance Manager",
    timePeriod: "Q1 2023",
    format: "Excel",
    size: "5.1 MB",
  },
  {
    id: "3",
    name: "Maintenance Summary",
    type: "Maintenance",
    generatedOn: "2023-05-10",
    generatedBy: "Maintenance Manager",
    timePeriod: "April 2023",
    format: "PDF",
    size: "1.8 MB",
  },
  {
    id: "4",
    name: "Passenger Volume Analysis",
    type: "Passenger",
    generatedOn: "2023-05-12",
    generatedBy: "Route Planner",
    timePeriod: "April 2023",
    format: "PDF",
    size: "3.2 MB",
  },
  {
    id: "5",
    name: "Driver Performance Report",
    type: "Performance",
    generatedOn: "2023-05-15",
    generatedBy: "HR Manager",
    timePeriod: "April 2023",
    format: "PDF",
    size: "2.1 MB",
  },
]

const initialScheduledReports = [
  {
    id: "6",
    name: "Monthly Performance Report",
    type: "Performance",
    frequency: "Monthly",
    nextGeneration: "2023-06-01",
    recipients: "5 recipients",
    format: "PDF",
    status: "Active",
  },
  {
    id: "7",
    name: "Weekly Route Performance",
    type: "Performance",
    frequency: "Weekly",
    nextGeneration: "2023-05-22",
    recipients: "3 recipients",
    format: "PDF",
    status: "Active",
  },
  {
    id: "8",
    name: "Quarterly Financial Report",
    type: "Financial",
    frequency: "Quarterly",
    nextGeneration: "2023-07-01",
    recipients: "4 recipients",
    format: "Excel",
    status: "Active",
  },
]

const initialReportTemplates = [
  {
    id: "9",
    name: "Performance Report",
    description: "Comprehensive report on fleet and route performance metrics",
    format: "PDF",
    sections: 5,
    lastUsed: "2023-05-01",
  },
  {
    id: "10",
    name: "Financial Summary",
    description: "Financial overview including revenue, expenses, and projections",
    format: "Excel",
    sections: 4,
    lastUsed: "2023-04-15",
  },
  {
    id: "11",
    name: "Maintenance Log",
    description: "Detailed maintenance activities and vehicle status report",
    format: "PDF",
    sections: 3,
    lastUsed: "2023-05-10",
  },
  {
    id: "12",
    name: "Passenger Analytics",
    description: "Passenger volume, trends, and demographic analysis",
    format: "PDF",
    sections: 6,
    lastUsed: "2023-05-12",
  },
  {
    id: "13",
    name: "Driver Performance",
    description: "Driver metrics, safety records, and performance evaluation",
    format: "PDF",
    sections: 4,
    lastUsed: "2023-05-15",
  },
]

export default function ReportsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // State for reports
  const [recentReports, setRecentReports] = useState(initialRecentReports)
  const [scheduledReports, setScheduledReports] = useState(initialScheduledReports)
  const [reportTemplates, setReportTemplates] = useState(initialReportTemplates)

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [reportTypeFilter, setReportTypeFilter] = useState("all")

  // State for dialogs
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportTab, setReportTab] = useState("recent")

  // Form state for new report
  const [reportForm, setReportForm] = useState({
    name: "",
    type: "Performance",
    timePeriod: "",
    format: "PDF",
    recipients: "",
    frequency: "Monthly",
    description: "",
  })

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter reports based on search query and report type
  const filteredRecentReports = recentReports.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.timePeriod.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = reportTypeFilter === "all" || item.type.toLowerCase() === reportTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const filteredScheduledReports = scheduledReports.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frequency.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = reportTypeFilter === "all" || item.type.toLowerCase() === reportTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const filteredReportTemplates = reportTemplates.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Handle generating a new report
  const handleGenerateReport = () => {
    // Validate form
    if (!reportForm.name || !reportForm.timePeriod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Generate a new ID
    const newId = String(Math.floor(Math.random() * 1000) + 100)

    // Add new report to recent reports
    const newReport = {
      id: newId,
      name: reportForm.name,
      type: reportForm.type,
      generatedOn: new Date().toISOString().split("T")[0],
      generatedBy: "Current User",
      timePeriod: reportForm.timePeriod,
      format: reportForm.format,
      size: "0.0 MB", // This would be determined by the actual report
    }

    setRecentReports([newReport, ...recentReports])

    // Reset form and close dialog
    setReportForm({
      name: "",
      type: "Performance",
      timePeriod: "",
      format: "PDF",
      recipients: "",
      frequency: "Monthly",
      description: "",
    })
    setShowGenerateDialog(false)

    toast({
      title: "Report Generated",
      description: `${reportForm.name} has been generated successfully.`,
    })
  }

  // Handle scheduling a new report
  const handleScheduleReport = () => {
    // Validate form
    if (!reportForm.name || !reportForm.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Generate a new ID
    const newId = String(Math.floor(Math.random() * 1000) + 100)

    // Calculate next generation date based on frequency
    const nextGeneration = new Date()
    if (reportForm.frequency === "Weekly") {
      nextGeneration.setDate(nextGeneration.getDate() + 7)
    } else if (reportForm.frequency === "Monthly") {
      nextGeneration.setMonth(nextGeneration.getMonth() + 1)
    } else if (reportForm.frequency === "Quarterly") {
      nextGeneration.setMonth(nextGeneration.getMonth() + 3)
    }

    // Add new report to scheduled reports
    const newScheduledReport = {
      id: newId,
      name: reportForm.name,
      type: reportForm.type,
      frequency: reportForm.frequency,
      nextGeneration: nextGeneration.toISOString().split("T")[0],
      recipients: reportForm.recipients || "0 recipients",
      format: reportForm.format,
      status: "Active",
    }

    setScheduledReports([newScheduledReport, ...scheduledReports])

    // Reset form and close dialog
    setReportForm({
      name: "",
      type: "Performance",
      timePeriod: "",
      format: "PDF",
      recipients: "",
      frequency: "Monthly",
      description: "",
    })
    setShowScheduleDialog(false)

    toast({
      title: "Report Scheduled",
      description: `${reportForm.name} has been scheduled successfully.`,
    })
  }

  // Handle deleting a report
  const handleDeleteReport = () => {
    if (!selectedReport) return

    // Delete report based on tab
    if (reportTab === "recent") {
      setRecentReports(recentReports.filter((item) => item.id !== selectedReport.id))
    } else if (reportTab === "scheduled") {
      setScheduledReports(scheduledReports.filter((item) => item.id !== selectedReport.id))
    } else if (reportTab === "templates") {
      setReportTemplates(reportTemplates.filter((item) => item.id !== selectedReport.id))
    }

    setShowDeleteDialog(false)

    toast({
      title: "Report Deleted",
      description: `Report has been deleted successfully.`,
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-rose-600" />
            <span className="text-lg font-semibold">Marrakech Transport</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">{/* Navigation links */}</nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-10" />
          </div>

          <div>
            <Skeleton className="h-10 w-[300px] mb-4" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-rose-600" />
            <span className="text-lg font-semibold">Marrakech Transport</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">{/* Navigation links */}</nav>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold">Error Loading Data</h2>
            <p className="mt-2 text-muted-foreground">There was a problem loading the report data.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
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
          <Link href="/passenger-app" className="text-sm font-medium text-muted-foreground">
            Passenger App
          </Link>
          <Link href="/reports" className="text-sm font-medium">
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
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and view system reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button
              onClick={() => {
                setReportForm({
                  name: "",
                  type: "Performance",
                  timePeriod: "",
                  format: "PDF",
                  recipients: "",
                  frequency: "Monthly",
                  description: "",
                })
                setShowGenerateDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
          <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="passenger">Passenger</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchQuery("")
              setReportTypeFilter("all")
            }}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Reset Filters</span>
          </Button>
        </div>

        <Tabs defaultValue="recent" onValueChange={setReportTab}>
          <TabsList>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Reports generated in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRecentReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No Reports Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No reports match your search criteria."
                        : "There are no recent reports generated yet."}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setReportForm({
                          name: "",
                          type: "Performance",
                          timePeriod: "",
                          format: "PDF",
                          recipients: "",
                          frequency: "Monthly",
                          description: "",
                        })
                        setShowGenerateDialog(true)
                      }}
                    >
                      Generate Report
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead>Generated By</TableHead>
                        <TableHead>Time Period</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecentReports.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.generatedOn}</TableCell>
                          <TableCell>{item.generatedBy}</TableCell>
                          <TableCell>{item.timePeriod}</TableCell>
                          <TableCell>{item.format}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast({
                                      title: "View Report",
                                      description: "Opening report viewer...",
                                    })
                                  }}
                                >
                                  View Report
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast({
                                      title: "Share Report",
                                      description: "Report sharing options will appear here.",
                                    })
                                  }}
                                >
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReport(item)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  Delete Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Reports scheduled for automatic generation</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setReportForm({
                        name: "",
                        type: "Performance",
                        timePeriod: "",
                        format: "PDF",
                        recipients: "",
                        frequency: "Monthly",
                        description: "",
                      })
                      setShowScheduleDialog(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredScheduledReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No Scheduled Reports Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No reports match your search criteria."
                        : "There are no scheduled reports set up yet."}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setReportForm({
                          name: "",
                          type: "Performance",
                          timePeriod: "",
                          format: "PDF",
                          recipients: "",
                          frequency: "Monthly",
                          description: "",
                        })
                        setShowScheduleDialog(true)
                      }}
                    >
                      Schedule Report
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Generation</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScheduledReports.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.frequency}</TableCell>
                          <TableCell>{item.nextGeneration}</TableCell>
                          <TableCell>{item.recipients}</TableCell>
                          <TableCell>{item.format}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{item.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                                <DropdownMenuItem>Manage Recipients</DropdownMenuItem>
                                <DropdownMenuItem>Generate Now</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReport(item)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  Delete Schedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Saved templates for quick report generation</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReportTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No Templates Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No templates match your search criteria."
                        : "There are no report templates available yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReportTemplates.map((item) => (
                      <Card key={item.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground mb-4">{item.description}</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Format:</span>
                              <span className="font-medium">{item.format}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sections:</span>
                              <span className="font-medium">{item.sections}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Used:</span>
                              <span className="font-medium">{item.lastUsed}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(item)
                                setShowDeleteDialog(true)
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setReportForm({
                                  name: item.name,
                                  type: item.name.includes("Performance")
                                    ? "Performance"
                                    : item.name.includes("Financial")
                                      ? "Financial"
                                      : item.name.includes("Maintenance")
                                        ? "Maintenance"
                                        : "Passenger",
                                  timePeriod: "",
                                  format: item.format,
                                  recipients: "",
                                  frequency: "Monthly",
                                  description: item.description,
                                })
                                setShowGenerateDialog(true)
                              }}
                            >
                              Generate Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Create a new report based on your specifications.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-name" className="text-right">
                Report Name
              </Label>
              <Input
                id="report-name"
                value={reportForm.name}
                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">
                Report Type
              </Label>
              <Select value={reportForm.type} onValueChange={(value) => setReportForm({ ...reportForm, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Passenger">Passenger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-period" className="text-right">
                Time Period
              </Label>
              <Input
                id="time-period"
                value={reportForm.timePeriod}
                onChange={(e) => setReportForm({ ...reportForm, timePeriod: e.target.value })}
                placeholder="e.g., April 2023, Q1 2023"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Select
                value={reportForm.format}
                onValueChange={(value) => setReportForm({ ...reportForm, format: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>Set up a recurring report generation schedule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-name" className="text-right">
                Report Name
              </Label>
              <Input
                id="schedule-name"
                value={reportForm.name}
                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-type" className="text-right">
                Report Type
              </Label>
              <Select value={reportForm.type} onValueChange={(value) => setReportForm({ ...reportForm, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Passenger">Passenger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Select
                value={reportForm.frequency}
                onValueChange={(value) => setReportForm({ ...reportForm, frequency: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Select
                value={reportForm.format}
                onValueChange={(value) => setReportForm({ ...reportForm, format: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipients" className="text-right">
                Recipients
              </Label>
              <Input
                id="recipients"
                value={reportForm.recipients}
                onChange={(e) => setReportForm({ ...reportForm, recipients: e.target.value })}
                placeholder="e.g., 3 recipients"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReport}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this report. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

