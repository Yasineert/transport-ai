"use client"

// This file contains all API functions for fetching and mutating data

import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = "http://localhost:8081/api" // Update this with your backend URL

// Common headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// Types
export type Vehicle = {
  id: string
  model: string
  status: "In Service" | "Maintenance" | "Charging" | "Out of Service"
  currentRoute?: string
  driver?: string
  lastMaintenance: string
  type: "Bus" | "Taxi"
  capacity: number
}

export type RouteInfo = {
  id: string
  name?: string
  depart: string
  destination: string
  distance: number
  duree: number
  type?: "Bus" | "Taxi" | "Train"
  status?: "Active" | "Maintenance" | "Suspended"
  frequency?: string
  activeVehicles?: number
  dailyPassengers?: number
  traffic?: {
    etat: string
    niveauAffection: number
  }
}

export type Driver = {
  id: string
  name: string
  vehicleType: "Bus" | "Taxi"
  currentAssignment?: string
  status: "On Duty" | "On Leave" | "In Training"
  experience: string
  performance: number
}

export type MaintenanceRecord = {
  vehicleId: string
  type: "Bus" | "Taxi" | "Electric Bus"
  maintenanceType: string
  startDate: string
  expectedCompletion: string
  status: "In Progress" | "Scheduled" | "Completed"
  technician: string
}

export type BusStop = {
  id: string
  name: string
  location: string
  type: "Smart Stop" | "Standard Stop"
  routesServed: string[]
  dailyPassengers: number
  status: "Operational" | "Maintenance"
}

export type PerformanceData = {
  name: string
  "On Time": number
  Delayed: number
  Cancelled: number
}

export type FleetStatusData = {
  name: string
  value: number
}

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
}

// Mock data fetching functions (in a real app, these would call actual APIs)
export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock data
    if (!token) {
      console.warn("No authentication token found, using mock data");
      return getMockVehicles();
    }

    const response = await fetch(`${API_BASE_URL}/v1/fleet/vehicles`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((vehicle: any) => ({
      id: vehicle.id.toString(),
      model: vehicle.model,
      status: vehicle.status,
      currentRoute: vehicle.currentRoute,
      driver: vehicle.driver,
      lastMaintenance: vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0] : '',
      type: vehicle.type,
      capacity: vehicle.capacity
    }));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    // Fallback to mock data for development
    return getMockVehicles();
  }
}

// Helper function to get mock vehicles data
function getMockVehicles(): Vehicle[] {
  return [
    {
      id: "A237",
      model: "Volvo 9700",
      status: "In Service",
      currentRoute: "Route 3: Jemaa el-Fnaa - Gueliz",
      driver: "Ahmed Tazi",
      lastMaintenance: "2023-04-15",
      type: "Bus",
      capacity: 50
    },
    {
      id: "B145",
      model: "Mercedes-Benz Citaro",
      status: "In Service",
      currentRoute: "Route 7: Railway Station - Menara Mall",
      driver: "Karim Benali",
      lastMaintenance: "2023-05-02",
      type: "Bus",
      capacity: 50
    },
    {
      id: "C089",
      model: "MAN Lion's City",
      status: "Maintenance",
      lastMaintenance: "2023-05-18",
      type: "Bus",
      capacity: 50
    },
    {
      id: "D321",
      model: "Scania Citywide",
      status: "Charging",
      lastMaintenance: "2023-05-10",
      type: "Bus",
      capacity: 50
    },
    {
      id: "E456",
      model: "Volvo 7900 Electric",
      status: "In Service",
      currentRoute: "Route 12: Majorelle Garden - Palmeraie",
      driver: "Fatima Ouazzani",
      lastMaintenance: "2023-04-28",
      type: "Bus",
      capacity: 50
    },
    {
      id: "T102",
      model: "Dacia Logan",
      status: "In Service",
      currentRoute: "Medina Taxi Zone",
      driver: "Hassan Alaoui",
      lastMaintenance: "2023-05-12",
      type: "Taxi",
      capacity: 4
    },
    {
      id: "T215",
      model: "Peugeot 301",
      status: "In Service",
      currentRoute: "Menara Mall",
      driver: "Youssef Berrada",
      lastMaintenance: "2023-05-05",
      type: "Taxi",
      capacity: 4
    },
    {
      id: "T347",
      model: "Fiat Tipo",
      status: "Maintenance",
      lastMaintenance: "2023-05-18",
      type: "Taxi",
      capacity: 4
    },
  ]
}

// Updated RouteInfo type to match the backend Itinerary model
export async function fetchRoutes(): Promise<RouteInfo[]> {
  try {
    // Get token for authentication
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock data
    if (!token) {
      console.warn("No authentication token found, using mock data");
      return getMockRoutes();
    }

    const response = await fetch(`${API_BASE_URL}/v1/routes/all`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch routes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((route: any) => ({
      id: route.id.toString(),
      depart: route.depart,
      destination: route.destination,
      distance: route.distance,
      duree: route.duree,
      // Map additional frontend-specific fields
      name: `${route.depart} - ${route.destination}`,
      type: route.type || "Bus", // Use the type from backend or default to "Bus"
      status: "Active", // Default for display purposes
      frequency: "Every 30 min", // Default
      activeVehicles: 0,
      dailyPassengers: 0,
      traffic: route.traffic
    }));
  } catch (error) {
    console.error("Error fetching routes:", error);
    // Fallback to mock data for development
    return getMockRoutes();
  }
}

// Helper function to get mock routes data
function getMockRoutes(): RouteInfo[] {
  return [
    {
      id: "R001",
      name: "Jemaa el-Fnaa - Gueliz",
      depart: "Jemaa el-Fnaa",
      destination: "Gueliz",
      distance: 5.2,
      duree: 15,
      type: "Bus",
      status: "Active",
      frequency: "Every 15 min",
      activeVehicles: 8,
      dailyPassengers: 4250,
    },
    {
      id: "R007",
      name: "Railway Station - Menara Mall",
      depart: "Railway Station",
      destination: "Menara Mall",
      distance: 7.8,
      duree: 20,
      type: "Bus",
      status: "Active",
      frequency: "Every 20 min",
      activeVehicles: 6,
      dailyPassengers: 3820,
    },
    {
      id: "R012",
      name: "Majorelle Garden - Palmeraie",
      depart: "Majorelle Garden",
      destination: "Palmeraie",
      distance: 6.5,
      duree: 25,
      type: "Bus",
      status: "Active",
      frequency: "Every 30 min",
      activeVehicles: 4,
      dailyPassengers: 2150,
    },
    {
      id: "T003",
      name: "Medina - Airport",
      depart: "Medina",
      destination: "Airport",
      distance: 9.3,
      duree: 15,
      type: "Taxi",
      status: "Active",
      frequency: "On Demand",
      activeVehicles: 12,
      dailyPassengers: 850,
    }
  ];
}

export async function fetchDrivers(): Promise<Driver[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  return [
    {
      id: "D001",
      name: "Ahmed Tazi",
      vehicleType: "Bus",
      currentAssignment: "Route 3: Jemaa el-Fnaa - Gueliz",
      status: "On Duty",
      experience: "5 years",
      performance: 4.8,
    },
    {
      id: "D015",
      name: "Karim Benali",
      vehicleType: "Bus",
      currentAssignment: "Route 7: Railway Station - Menara Mall",
      status: "On Duty",
      experience: "3 years",
      performance: 4.5,
    },
    {
      id: "D023",
      name: "Fatima Ouazzani",
      vehicleType: "Bus",
      currentAssignment: "Route 12: Majorelle Garden - Palmeraie",
      status: "On Duty",
      experience: "7 years",
      performance: 4.9,
    },
    {
      id: "D042",
      name: "Hassan Alaoui",
      vehicleType: "Taxi",
      currentAssignment: "Medina Taxi Zone",
      status: "On Duty",
      experience: "4 years",
      performance: 4.7,
    },
    {
      id: "D056",
      name: "Youssef Berrada",
      vehicleType: "Taxi",
      currentAssignment: "Airport Taxi Zone",
      status: "On Duty",
      experience: "2 years",
      performance: 4.3,
    },
    {
      id: "D078",
      name: "Nadia El Fassi",
      vehicleType: "Bus",
      status: "In Training",
      experience: "6 months",
      performance: 3.8,
    },
    {
      id: "D082",
      name: "Omar Benjelloun",
      vehicleType: "Bus",
      status: "In Training",
      experience: "3 months",
      performance: 3.5,
    },
    {
      id: "D035",
      name: "Rachid Mansouri",
      vehicleType: "Bus",
      status: "On Leave",
      experience: "6 years",
      performance: 4.6,
    },
    {
      id: "D062",
      name: "Samira Idrissi",
      vehicleType: "Taxi",
      status: "On Leave",
      experience: "5 years",
      performance: 4.4,
    },
  ]
}

export async function fetchMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock data
    if (!token) {
      console.warn("No authentication token found, using mock data");
      return getMockMaintenanceRecords();
    }

    const response = await fetch(`${API_BASE_URL}/v1/fleet/maintenance`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance records: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((record: any) => ({
      vehicleId: record.vehicleId.toString(),
      type: record.vehicleType,
      maintenanceType: record.maintenanceType,
      startDate: record.maintenanceDate ? new Date(record.maintenanceDate).toISOString().split('T')[0] : '',
      expectedCompletion: record.completionDate ? new Date(record.completionDate).toISOString().split('T')[0] : '',
      status: record.status,
      technician: record.technician || "Assigned Technician"
    }));
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    // Fallback to mock data for development
    return getMockMaintenanceRecords();
  }
}

// Helper function to get mock maintenance records data
function getMockMaintenanceRecords(): MaintenanceRecord[] {
  return [
    {
      vehicleId: "C089",
      type: "Bus",
      maintenanceType: "Engine Repair",
      startDate: "2023-05-18",
      expectedCompletion: "2023-05-22",
      status: "In Progress",
      technician: "Mohammed Chaoui",
    },
    {
      vehicleId: "T347",
      type: "Taxi",
      maintenanceType: "Transmission Service",
      startDate: "2023-05-18",
      expectedCompletion: "2023-05-20",
      status: "In Progress",
      technician: "Jamal Bennani",
    },
    {
      vehicleId: "E456",
      type: "Electric Bus",
      maintenanceType: "Battery System Check",
      startDate: "2023-05-19",
      expectedCompletion: "2023-05-21",
      status: "In Progress",
      technician: "Amina Ziani",
    },
    {
      vehicleId: "B098",
      type: "Bus",
      maintenanceType: "Routine Inspection",
      startDate: "2023-05-25",
      expectedCompletion: "2023-05-26",
      status: "Scheduled",
      technician: "Mohammed Chaoui",
    },
    {
      vehicleId: "A237",
      type: "Bus",
      maintenanceType: "Brake System Service",
      startDate: "2023-05-28",
      expectedCompletion: "2023-05-30",
      status: "Scheduled",
      technician: "Jamal Bennani",
    },
    {
      vehicleId: "T102",
      type: "Taxi",
      maintenanceType: "Oil Change",
      startDate: "2023-05-30",
      expectedCompletion: "2023-05-30",
      status: "Scheduled",
      technician: "Amina Ziani",
    },
    {
      vehicleId: "B145",
      type: "Bus",
      maintenanceType: "Engine Overhaul",
      startDate: "2023-04-25",
      expectedCompletion: "2023-05-02",
      status: "Completed",
      technician: "Mohammed Chaoui",
    },
    {
      vehicleId: "T215",
      type: "Taxi",
      maintenanceType: "Transmission Repair",
      startDate: "2023-04-26",
      expectedCompletion: "2023-04-28",
      status: "Completed",
      technician: "Jamal Bennani",
    },
    {
      vehicleId: "D321",
      type: "Electric Bus",
      maintenanceType: "Battery Replacement",
      startDate: "2023-04-10",
      expectedCompletion: "2023-04-15",
      status: "Completed",
      technician: "Amina Ziani",
    },
  ]
}

export async function fetchBusStops(): Promise<BusStop[]> {
  await new Promise((resolve) => setTimeout(resolve, 650))

  return [
    {
      id: "BS001",
      name: "Jemaa el-Fnaa",
      location: "Medina, Central Square",
      type: "Smart Stop",
      routesServed: ["Route 1", "Route 3", "Route 7"],
      dailyPassengers: 8245,
      status: "Operational",
    },
    {
      id: "BS015",
      name: "Gueliz Center",
      location: "Gueliz, Mohammed V Avenue",
      type: "Smart Stop",
      routesServed: ["Route 3", "Route 5", "Route 12"],
      dailyPassengers: 6872,
      status: "Operational",
    },
    {
      id: "BS023",
      name: "Marrakech Railway Station",
      location: "Avenue Mohammed VI",
      type: "Smart Stop",
      routesServed: ["Route 7", "Route 15", "Route 18"],
      dailyPassengers: 5934,
      status: "Operational",
    },
    {
      id: "BS042",
      name: "Menara Mall",
      location: "Avenue Mohammed VI",
      type: "Smart Stop",
      routesServed: ["Route 7", "Route 9", "Route 14"],
      dailyPassengers: 4521,
      status: "Operational",
    },
    {
      id: "BS056",
      name: "Majorelle Garden",
      location: "Rue Yves Saint Laurent",
      type: "Standard Stop",
      routesServed: ["Route 12", "Route 20"],
      dailyPassengers: 3876,
      status: "Operational",
    },
    {
      id: "BS078",
      name: "Palmeraie",
      location: "Circuit de la Palmeraie",
      type: "Standard Stop",
      routesServed: ["Route 12", "Route 22"],
      dailyPassengers: 2450,
      status: "Maintenance",
    },
  ]
}

export async function fetchPerformanceData(): Promise<PerformanceData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      name: "6AM",
      "On Time": 85,
      Delayed: 15,
      Cancelled: 0,
    },
    {
      name: "8AM",
      "On Time": 75,
      Delayed: 22,
      Cancelled: 3,
    },
    {
      name: "10AM",
      "On Time": 92,
      Delayed: 8,
      Cancelled: 0,
    },
    {
      name: "12PM",
      "On Time": 88,
      Delayed: 10,
      Cancelled: 2,
    },
    {
      name: "2PM",
      "On Time": 90,
      Delayed: 10,
      Cancelled: 0,
    },
    {
      name: "4PM",
      "On Time": 78,
      Delayed: 18,
      Cancelled: 4,
    },
    {
      name: "6PM",
      "On Time": 72,
      Delayed: 25,
      Cancelled: 3,
    },
    {
      name: "8PM",
      "On Time": 82,
      Delayed: 15,
      Cancelled: 3,
    },
  ]
}

export async function fetchFleetStatusData(): Promise<FleetStatusData[]> {
  await new Promise((resolve) => setTimeout(resolve, 550))

  return [
    { name: "In Service", value: 142 },
    { name: "Maintenance", value: 18 },
    { name: "Charging", value: 25 },
    { name: "Out of Service", value: 5 },
  ]
}

// Server actions for mutations
export async function addVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock implementation
    if (!token) {
      console.warn("No authentication token found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newVehicle: Vehicle = {
        ...vehicle,
        id: `V${Math.floor(Math.random() * 1000)}`,
      };
      
      return newVehicle;
    }

    // Map frontend vehicle type to backend DTO
    const vehicleDto = {
      vehicleNumber: `V${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      model: vehicle.model,
      status: vehicle.status,
      type: vehicle.type,
      lastMaintenanceDate: vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance) : new Date(),
      capacity: vehicle.capacity
    };

    const response = await fetch(`${API_BASE_URL}/v1/fleet/vehicles`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleDto)
    });

    if (!response.ok) {
      throw new Error(`Failed to add vehicle: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      model: data.model,
      status: data.status,
      currentRoute: data.currentRoute,
      driver: data.driver,
      lastMaintenance: data.lastMaintenanceDate ? new Date(data.lastMaintenanceDate).toISOString().split('T')[0] : '',
      type: data.type,
      capacity: data.capacity
    };
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
}

export async function updateVehicleStatus(id: string, status: Vehicle["status"]): Promise<Vehicle> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock implementation
    if (!token) {
      console.warn("No authentication token found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      return {
        id,
        model: "Updated Vehicle",
        status,
        lastMaintenance: new Date().toISOString().split("T")[0],
        type: "Bus",
        capacity: 50
      };
    }

    const response = await fetch(`${API_BASE_URL}/v1/fleet/vehicles/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to update vehicle status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      model: data.model,
      status: data.status,
      currentRoute: data.currentRoute,
      driver: data.driver,
      lastMaintenance: data.lastMaintenanceDate ? new Date(data.lastMaintenanceDate).toISOString().split('T')[0] : '',
      type: data.type,
      capacity: data.capacity
    };
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    throw error;
  }
}

export async function scheduleMaintenanceForVehicle(
  vehicleId: string,
  maintenanceType: string,
  startDate: string,
  expectedCompletion: string,
): Promise<MaintenanceRecord> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock implementation
    if (!token) {
      console.warn("No authentication token found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      return {
        vehicleId,
        type: "Bus",
        maintenanceType,
        startDate,
        expectedCompletion,
        status: "Scheduled",
        technician: "Assigned Technician",
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/v1/fleet/vehicles/${vehicleId}/maintenance?maintenanceType=${encodeURIComponent(maintenanceType)}&startDate=${encodeURIComponent(startDate)}&expectedCompletion=${encodeURIComponent(expectedCompletion)}`, 
      {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to schedule maintenance: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      vehicleId: data.vehicleId.toString(),
      type: data.vehicleType,
      maintenanceType: data.maintenanceType,
      startDate: data.maintenanceDate ? new Date(data.maintenanceDate).toISOString().split('T')[0] : startDate,
      expectedCompletion: data.completionDate ? new Date(data.completionDate).toISOString().split('T')[0] : expectedCompletion,
      status: data.status,
      technician: data.technician || "Assigned Technician"
    };
  } catch (error) {
    console.error("Error scheduling maintenance:", error);
    throw error;
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, use mock implementation
    if (!token) {
      console.warn("No authentication token found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 800));
      return;
    }

    const response = await fetch(`${API_BASE_URL}/v1/fleet/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete vehicle: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
}

export async function register(request: AuthRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Include credentials in the request
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return await response.json()
  } catch (error) {
    toast({
      title: "Registration Failed",
      description: error instanceof Error ? error.message : "An error occurred during registration",
      variant: "destructive",
    })
    throw error
  }
}

export async function login(request: AuthRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/authenticate`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Include credentials in the request
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return await response.json()
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error instanceof Error ? error.message : "An error occurred during login",
      variant: "destructive",
    })
    throw error
  }
}

// Helper function to get auth token from localStorage or cookies
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    // First check localStorage
    const localToken = localStorage.getItem('authToken');
    if (localToken) {
      return localToken;
    }
    
    // Then check cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('auth-token=')) {
        return cookie.substring('auth-token='.length, cookie.length);
      }
    }
  }
  return null;
}

// Helper function to set auth token in both localStorage and cookies
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    // Set in localStorage
    localStorage.setItem('authToken', token);
    
    // Set in cookies
    document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 24 hours
  }
}

// Helper function to remove auth token from both localStorage and cookies
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    // Remove from localStorage
    localStorage.removeItem('authToken');
    
    // Remove from cookies
    document.cookie = 'auth-token=; path=/; max-age=0';
  }
}

// New type for route creation
export interface RouteCreationRequest {
  depart: string
  destination: string
  distance: number
  duree: number
  type: string
}

// Fetch fastest route between two points
export async function fetchFastestRoute(depart: string, destination: string): Promise<RouteInfo> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, return a mock fastest route
    if (!token) {
      console.warn("No authentication token found, using mock data");
      const mockRoutes = getMockRoutes();
      return mockRoutes[0]; // Just return the first mock route
    }

    const response = await fetch(`${API_BASE_URL}/v1/routes/fastest?depart=${encodeURIComponent(depart)}&destination=${encodeURIComponent(destination)}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fastest route: ${response.statusText}`);
    }

    const route = await response.json();
    return {
      id: route.id.toString(),
      depart: route.depart,
      destination: route.destination,
      distance: route.distance,
      duree: route.duree,
      name: `${route.depart} - ${route.destination}`,
      type: route.type || "Bus",
      status: "Active",
      traffic: route.traffic
    };
  } catch (error) {
    console.error("Error fetching fastest route:", error);
    throw error;
  }
}

// Fetch shortest route between two points
export async function fetchShortestRoute(depart: string, destination: string): Promise<RouteInfo> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, return a mock shortest route
    if (!token) {
      console.warn("No authentication token found, using mock data");
      const mockRoutes = getMockRoutes();
      // Return the route with the shortest distance
      return mockRoutes.reduce((prev, current) => 
        (prev.distance < current.distance) ? prev : current
      );
    }

    const response = await fetch(`${API_BASE_URL}/v1/routes/shortest?depart=${encodeURIComponent(depart)}&destination=${encodeURIComponent(destination)}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shortest route: ${response.statusText}`);
    }

    const route = await response.json();
    return {
      id: route.id.toString(),
      depart: route.depart,
      destination: route.destination,
      distance: route.distance,
      duree: route.duree,
      name: `${route.depart} - ${route.destination}`,
      type: route.type || "Bus",
      status: "Active",
      traffic: route.traffic
    };
  } catch (error) {
    console.error("Error fetching shortest route:", error);
    throw error;
  }
}

// Get route recommendations
export async function getRouteRecommendations(request: { depart: string, destination: string, preferredTransport?: string }): Promise<any> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, return mock recommendations
    if (!token) {
      console.warn("No authentication token found, using mock data");
      const mockRoutes = getMockRoutes();
      return {
        fastest: mockRoutes[0],
        shortest: mockRoutes.reduce((prev, current) => 
          (prev.distance < current.distance) ? prev : current
        ),
        multiModal: [
          {
            route: mockRoutes[0],
            transports: ["Bus"],
            totalDuration: mockRoutes[0].duree,
            totalCost: 10
          }
        ],
        success: true
      };
    }

    const response = await fetch(`${API_BASE_URL}/v1/routes/recommend`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to get route recommendations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting route recommendations:", error);
    throw error;
  }
}

// Add a new route
export async function addRoute(route: RouteCreationRequest): Promise<RouteInfo> {
  try {
    const token = getAuthToken();
    
    // If no token is available in development mode, create a mock response
    if (!token) {
      console.warn("No authentication token found, using mock data");
      // Cast the type to match the RouteInfo type expectation
      const routeType = route.type as "Bus" | "Taxi" | "Train" | undefined;
      
      return {
        id: `R${Math.floor(Math.random() * 1000)}`,
        depart: route.depart,
        destination: route.destination,
        distance: route.distance,
        duree: route.duree,
        type: routeType || "Bus",
        name: `${route.depart} - ${route.destination}`,
        status: "Active",
        frequency: "Every 30 min",
        activeVehicles: 0,
        dailyPassengers: 0
      };
    }

    const response = await fetch(`${API_BASE_URL}/v1/routes`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(route)
    });

    if (!response.ok) {
      throw new Error(`Failed to add route: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding route:", error);
    throw error;
  }
}

