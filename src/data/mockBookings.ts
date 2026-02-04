import { Booking } from "@/types/vehicle";

export const mockBookings: Booking[] = [
  {
    id: "b1",
    vehicleId: "5",
    customerName: "John Perera",
    phoneNumber: "0771234567",
    nic: "199012345678",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-05"),
    numberOfDays: 5,
    withDriver: true,
    totalPrice: 70000,
    status: "confirmed",
    createdAt: new Date("2024-01-28"),
  },
  {
    id: "b2",
    vehicleId: "4",
    customerName: "Mary Silva",
    phoneNumber: "0779876543",
    nic: "198523456789",
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-12"),
    numberOfDays: 3,
    withDriver: false,
    totalPrice: 24000,
    status: "pending",
    createdAt: new Date("2024-02-01"),
  },
];
