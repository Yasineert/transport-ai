// This is a simple client-side auth utility for demo purposes
// In a production app, you would use a proper auth solution like NextAuth.js or Clerk

export type User = {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "driver" | "staff"
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const userStr = localStorage.getItem("user")
  if (!userStr) {
    return null
  }

  try {
    return JSON.parse(userStr) as User
  } catch (error) {
    console.error("Failed to parse user from localStorage", error)
    return null
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null
}

export function logout(): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("user")
  window.location.href = "/login"
}

export function hasPermission(requiredRole: "admin" | "manager" | "driver" | "staff"): boolean {
  const user = getUser()
  if (!user) {
    return false
  }

  // Simple role hierarchy: admin > manager > driver > staff
  const roleHierarchy = {
    admin: 4,
    manager: 3,
    driver: 2,
    staff: 1,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

