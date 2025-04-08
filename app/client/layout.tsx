import type React from "react"
import { Navbar } from "@/components/client/navbar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Marrakech Transport System
      </footer>
    </div>
  )
}

