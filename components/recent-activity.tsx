import { Activity, AlertTriangle, Bus, MapPin, User } from "lucide-react"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100">
          <Bus className="h-5 w-5 text-rose-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Bus #A237 arrived at Jemaa el-Fnaa</p>
          <p className="text-sm text-muted-foreground">2 minutes ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Delay on Route 7 due to traffic congestion</p>
          <p className="text-sm text-muted-foreground">15 minutes ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
          <MapPin className="h-5 w-5 text-blue-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">New bus stop added at Majorelle Garden</p>
          <p className="text-sm text-muted-foreground">45 minutes ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <Activity className="h-5 w-5 text-green-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Route 3 operating at 95% on-time performance today</p>
          <p className="text-sm text-muted-foreground">1 hour ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
          <User className="h-5 w-5 text-purple-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Driver Ahmed completed safety training</p>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </div>
      </div>
    </div>
  )
}

