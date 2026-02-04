import React, { createContext, useContext, useState, ReactNode } from "react";
import { Vehicle, Booking, DateRange } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";
import { mockBookings } from "@/data/mockBookings";

interface BookingContextType {
  vehicles: Vehicle[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Booking;
  updateVehicle: (vehicle: Vehicle) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  deleteVehicle: (id: string) => void;
  isVehicleAvailable: (vehicleId: string, dateRange: DateRange) => boolean;
  getBookedDatesForVehicle: (vehicleId: string) => DateRange[];
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const addBooking = (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      createdAt: new Date(),
    };
    setBookings((prev) => [...prev, newBooking]);
    
    // Mark vehicle as unavailable if booking overlaps with current date
    const now = new Date();
    if (bookingData.startDate <= now && bookingData.endDate >= now) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === bookingData.vehicleId ? { ...v, available: false } : v
        )
      );
    }
    
    return newBooking;
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? vehicle : v)));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v${Date.now()}`,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const getBookedDatesForVehicle = (vehicleId: string): DateRange[] => {
    return bookings
      .filter((b) => b.vehicleId === vehicleId && b.status !== "cancelled")
      .map((b) => ({ startDate: b.startDate, endDate: b.endDate }));
  };

  const isVehicleAvailable = (vehicleId: string, dateRange: DateRange): boolean => {
    if (!dateRange.startDate || !dateRange.endDate) return true;
    
    const bookedDates = getBookedDatesForVehicle(vehicleId);
    return !bookedDates.some(
      (bookedRange) =>
        bookedRange.startDate &&
        bookedRange.endDate &&
        dateRange.startDate! <= bookedRange.endDate &&
        dateRange.endDate! >= bookedRange.startDate
    );
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  return (
    <BookingContext.Provider
      value={{
        vehicles,
        bookings,
        addBooking,
        updateVehicle,
        addVehicle,
        deleteVehicle,
        isVehicleAvailable,
        getBookedDatesForVehicle,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
