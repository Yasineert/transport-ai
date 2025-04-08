"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/signup"]

    if (!isLoggedIn() && !publicRoutes.includes(pathname)) {
      router.push("/login")
    }
  }, [pathname, router])

  return <>{children}</>
}

