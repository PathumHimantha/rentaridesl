import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types/vehicle";
import { Calendar, User, Phone, FileText, Car } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const AdminBookings = () => {
  const { bookings, vehicles, updateBookingStatus } = useBooking();

  const sortedBookings = [...bookings].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    updateBookingStatus(bookingId, status);
    toast.success(`Booking status updated to ${status}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all booking requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-display font-bold">{bookings.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-display font-bold text-warning">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-display font-bold text-primary">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-display font-bold text-success">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBookings.map((booking) => {
                  const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <code className="text-xs bg-secondary px-2 py-1 rounded">
                          {booking.id.toUpperCase()}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.phoneNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {vehicle && (
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-10 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {vehicle?.name || "Unknown"}
                            </p>
                            {booking.withDriver && (
                              <Badge variant="outline" className="text-xs">
                                With Driver
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(booking.startDate, "MMM d")} -{" "}
                            {format(booking.endDate, "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.numberOfDays} days
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          Rs. {booking.totalPrice.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={booking.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              booking.id,
                              value as Booking["status"]
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          )}
        </Card>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4 mt-6">
          {sortedBookings.map((booking) => {
            const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
            return (
              <Card key={booking.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <code className="text-xs bg-secondary px-2 py-1 rounded">
                    {booking.id.toUpperCase()}
                  </code>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{vehicle?.name || "Unknown vehicle"}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {format(booking.startDate, "MMM d")} -{" "}
                      {format(booking.endDate, "MMM d")} ({booking.numberOfDays} days)
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold">
                      Rs. {booking.totalPrice.toLocaleString()}
                    </span>
                    <Select
                      value={booking.status}
                      onValueChange={(value) =>
                        handleStatusChange(booking.id, value as Booking["status"])
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
