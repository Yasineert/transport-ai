"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function UserDashboard() {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData.fullName}</h1>
      <div className="mb-6">
        <p>Role: {userData.role}</p>
        <p>Email: {userData.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and update your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>View Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
            <CardDescription>View your tickets and travel history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>View Tickets</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan a Journey</CardTitle>
            <CardDescription>Find routes and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Plan Journey</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 