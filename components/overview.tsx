"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { fetchPerformanceData, type PerformanceData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function Overview() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const performanceData = await fetchPerformanceData()
        setData(performanceData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch performance data:", err)
        setError("Failed to load performance data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (error) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="On Time" fill="#10b981" />
        <Bar dataKey="Delayed" fill="#f59e0b" />
        <Bar dataKey="Cancelled" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}

