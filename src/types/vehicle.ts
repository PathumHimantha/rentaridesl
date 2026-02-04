export type VehicleType = 
  | "Motorbike" 
  | "Three-Wheeler" 
  | "Car" 
  | "Buddy Van" 
  | "Van";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  image: string;
  images: string[];
  description: string;
  pricePerDay: number;
  pricePerKm: number;
  pricePerWeek: number;
  pricePerMonth: number;
  driverOption: boolean;
  driverPricePerDay: number;
  available: boolean;
  features: string[];
  seats: number;
  transmission: string;
  fuelType: string;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface Booking {
  id: string;
  vehicleId: string;
  customerName: string;
  phoneNumber: string;
  nic: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  withDriver: boolean;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

export interface BookingFormData {
  customerName: string;
  phoneNumber: string;
  nic: string;
  startDate: Date | null;
  endDate: Date | null;
  withDriver: boolean;
}

export interface VehicleFilters {
  type: VehicleType | "all";
  driverOption: "all" | "with" | "without";
  priceRange: [number, number];
  availability: "all" | "available" | "booked";
  searchQuery: string;
}
