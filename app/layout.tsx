import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthCheck } from "@/components/auth-check"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marrakech Transport System",
  description: "Intelligent public transport management system for Marrakech",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheck>{children}</AuthCheck>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'