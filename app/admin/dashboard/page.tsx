"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<{
    id: number;
    email: string;
    fullName: string;
    role: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the auth token from cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as { [key: string]: string })
    
    const token = cookies['auth-token']

    if (!token) {
      setLoading(false)
      return
    }

    // Fetch user data
    fetch('http://localhost:8081/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data')
        return res.json()
      })
      .then(data => {
        setUserData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching user data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">Please log in to view your dashboard</div>
  }

  if (userData.role !== 'ADMINISTRATOR') {
    return <div className="flex justify-center items-center min-h-screen">You don't have permission to access this page</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administrator Dashboard</h1>
      <div className="mb-6">
        <p>Welcome, {userData.fullName}</p>
        <p>Email: {userData.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Management</CardTitle>
            <CardDescription>Manage all vehicles and maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/fleet/dashboard')}>
              Go to Fleet Management
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Planning</CardTitle>
            <CardDescription>Create and manage routes and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/routes/dashboard')}>
              Go to Route Planning
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/analytics/dashboard')}>
              Go to Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/admin/users')}>
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 