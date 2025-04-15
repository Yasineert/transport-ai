"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthRequest, AuthResponse, login, register, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api"
import { Role } from "@/types/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userRole: Role | null
  login: (request: AuthRequest) => Promise<void>
  register: (request: AuthRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<Role | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = getAuthToken()
    if (token) {
      // In a real app, you would decode the JWT token to get the role
      // For now, we'll use a mock role
      setUserRole(Role.ADMINISTRATOR)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (request: AuthRequest) => {
    try {
      const response = await login(request)
      setAuthToken(response.token)
      // In a real app, you would decode the JWT token to get the role
      setUserRole(Role.ADMINISTRATOR)
      setIsAuthenticated(true)
      router.push("/admin/dashboard")
    } catch (error) {
      throw error
    }
  }

  const handleRegister = async (request: AuthRequest) => {
    try {
      const response = await register(request)
      setAuthToken(response.token)
      // In a real app, you would decode the JWT token to get the role
      setUserRole(Role.ADMINISTRATOR)
      setIsAuthenticated(true)
      router.push("/admin/dashboard")
    } catch (error) {
      throw error
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    setIsAuthenticated(false)
    setUserRole(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userRole,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 