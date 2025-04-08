"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function PageHeader() {
  const pathname = usePathname()

  return <Navbar currentPath={pathname} />
}

