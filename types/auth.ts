export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  FLEET_MANAGER = 'FLEET_MANAGER',
  ROUTE_PLANNER = 'ROUTE_PLANNER',
  ANALYST = 'ANALYST',
  USER = 'USER'
}

export interface User {
  id: number
  email: string
  role: Role
  name: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
} 