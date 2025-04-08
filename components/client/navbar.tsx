"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Bus, Calendar, Home, LogOut, Map, Menu, Settings, Ticket, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center px-4">
        <Link href="/client" className="flex items-center">
          <Bus className="h-6 w-6 text-green-600 mr-2" />
          <span className="font-bold text-xl">MTransit</span>
        </Link>

        <nav className="mx-6 hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-4">
            <NavItem href="/client" label="Home" icon={<Home className="h-4 w-4 mr-2" />} />
            <NavItem href="/client/routes" label="Plan Trip" icon={<Map className="h-4 w-4 mr-2" />} />
            <NavItem href="/client/schedules" label="Schedules" icon={<Calendar className="h-4 w-4 mr-2" />} />
            <NavItem href="/client/tickets" label="Tickets" icon={<Ticket className="h-4 w-4 mr-2" />} />
            <NavItem href="/client/live" label="Live Tracking" icon={<Bus className="h-4 w-4 mr-2" />} />
          </ul>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ticket className="mr-2 h-4 w-4" />
                  <span>My Tickets</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center">
                    <Bus className="h-6 w-6 text-green-600 mr-2" />
                    <span className="font-bold text-xl">MTransit</span>
                  </div>
                </div>
                <nav className="flex-1 py-8">
                  <ul className="space-y-4">
                    <MobileNavItem href="/client" label="Home" icon={<Home className="h-5 w-5 mr-3" />} />
                    <MobileNavItem href="/client/routes" label="Plan Trip" icon={<Map className="h-5 w-5 mr-3" />} />
                    <MobileNavItem
                      href="/client/schedules"
                      label="Schedules"
                      icon={<Calendar className="h-5 w-5 mr-3" />}
                    />
                    <MobileNavItem href="/client/tickets" label="Tickets" icon={<Ticket className="h-5 w-5 mr-3" />} />
                    <MobileNavItem href="/client/live" label="Live Tracking" icon={<Bus className="h-5 w-5 mr-3" />} />
                  </ul>
                </nav>
                <div className="border-t py-4">
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavItem({ href, label, icon }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link href={href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`flex items-center ${isActive ? "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-50" : ""}`}
        >
          {icon}
          {label}
        </Button>
      </Link>
    </li>
  )
}

function MobileNavItem({ href, label, icon }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center py-2 px-3 rounded-md ${
          isActive
            ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-50"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  )
}

