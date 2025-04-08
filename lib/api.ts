// This file contains all API functions for fetching and mutating data

// Types
export type Vehicle = {
  id: string
  model: string
  status: "In Service" | "Maintenance" | "Charging" | "Out of Service"
  currentRoute?: string
  driver?: string
  lastMaintenance: string
  type: "Bus" | "Taxi"
}

export type RouteInfo = {
  id: string
  name: string
  type: "Bus" | "Taxi"
  status: "Active" | "Maintenance" | "Suspended"
  frequency: string
  activeVehicles: number
  dailyPassengers: number
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

// Mock data fetching functions (in a real app, these would call actual APIs)
export async function fetchVehicles(): Promise<Vehicle[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "A237",
      model: "Volvo 9700",
      status: "In Service",
      currentRoute: "Route 3: Jemaa el-Fnaa - Gueliz",
      driver: "Ahmed Tazi",
      lastMaintenance: "2023-04-15",
      type: "Bus",
    },
    {
      id: "B145",
      model: "Mercedes-Benz Citaro",
      status: "In Service",
      currentRoute: "Route 7: Railway Station - Menara Mall",
      driver: "Karim Benali",
      lastMaintenance: "2023-05-02",
      type: "Bus",
    },
    {
      id: "C089",
      model: "MAN Lion's City",
      status: "Maintenance",
      lastMaintenance: "2023-05-18",
      type: "Bus",
    },
    {
      id: "D321",
      model: "Scania Citywide",
      status: "Charging",
      lastMaintenance: "2023-05-10",
      type: "Bus",
    },
    {
      id: "E456",
      model: "Volvo 7900 Electric",
      status: "In Service",
      currentRoute: "Route 12: Majorelle Garden - Palmeraie",
      driver: "Fatima Ouazzani",
      lastMaintenance: "2023-04-28",
      type: "Bus",
    },
    {
      id: "T102",
      model: "Dacia Logan",
      status: "In Service",
      currentRoute: "Medina Taxi Zone",
      driver: "Hassan Alaoui",
      lastMaintenance: "2023-05-12",
      type: "Taxi",
    },
    {
      id: "T215",
      model: "Peugeot 301",
      status: "In Service",
      currentRoute: "Menara Mall",
      driver: "Youssef Berrada",
      lastMaintenance: "2023-05-05",
      type: "Taxi",
    },
    {
      id: "T347",
      model: "Fiat Tipo",
      status: "Maintenance",
      lastMaintenance: "2023-05-18",
      type: "Taxi",
    },
  ]
}

export async function fetchRoutes(): Promise<RouteInfo[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  return [
    {
      id: "R001",
      name: "Jemaa el-Fnaa - Gueliz",
      type: "Bus",
      status: "Active",
      frequency: "Every 15 min",
      activeVehicles: 8,
      dailyPassengers: 4250,
    },
    {
      id: "R007",
      name: "Railway Station - Menara Mall",
      type: "Bus",
      status: "Active",
      frequency: "Every 20 min",
      activeVehicles: 6,
      dailyPassengers: 3820,
    },
    {
      id: "R012",
      name: "Majorelle Garden - Palmeraie",
      type: "Bus",
      status: "Active",
      frequency: "Every 30 min",
      activeVehicles: 4,
      dailyPassengers: 2150,
    },
    {
      id: "R015",
      name: "Airport - City Center",
      type: "Bus",
      status: "Active",
      frequency: "Every 25 min",
      activeVehicles: 5,
      dailyPassengers: 3450,
    },
    {
      id: "T003",
      name: "Medina Taxi Zone",
      type: "Taxi",
      status: "Active",
      frequency: "On Demand",
      activeVehicles: 12,
      dailyPassengers: 850,
    },
  ]
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
  await new Promise((resolve) => setTimeout(resolve, 750))

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
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would call an API to add the vehicle
  const newVehicle: Vehicle = {
    ...vehicle,
    id: `V${Math.floor(Math.random() * 1000)}`,
  }

  return newVehicle
}

export async function updateVehicleStatus(id: string, status: Vehicle["status"]): Promise<Vehicle> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would call an API to update the vehicle
  // For now, we'll just return a mock response
  return {
    id,
    model: "Updated Vehicle",
    status,
    lastMaintenance: new Date().toISOString().split("T")[0],
    type: "Bus",
  }
}

export async function scheduleMaintenanceForVehicle(
  vehicleId: string,
  maintenanceType: string,
  startDate: string,
  expectedCompletion: string,
): Promise<MaintenanceRecord> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  // In a real app, this would call an API to schedule maintenance
  return {
    vehicleId,
    type: "Bus",
    maintenanceType,
    startDate,
    expectedCompletion,
    status: "Scheduled",
    technician: "Assigned Technician",
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would call an API to delete the vehicle
  // For now, we'll just return a success response
  return
}

