import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Car, Calendar, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { vehicles, bookings } = useBooking();

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter((v) => v.available).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  const recentBookings = [...bookings]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your rental business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-display font-bold">
                  {stats.totalVehicles}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-display font-bold">
                  {stats.availableVehicles}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bookings</p>
                <p className="text-2xl font-display font-bold">
                  {stats.totalBookings}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-display font-bold">
                  Rs. {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/admin/vehicles">
            <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="font-display font-semibold text-lg mb-2">
                Manage Vehicles
              </h3>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove vehicles from your fleet
              </p>
            </Card>
          </Link>
          <Link to="/admin/bookings">
            <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <h3 className="font-display font-semibold text-lg mb-2">
                View Bookings
              </h3>
              <p className="text-sm text-muted-foreground">
                Review and manage all booking requests
              </p>
            </Card>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="p-6">
          <h2 className="font-display font-semibold text-lg mb-4">
            Recent Bookings
          </h2>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => {
                const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle?.name} • {booking.numberOfDays} days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Rs. {booking.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(booking.createdAt, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No bookings yet
            </p>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
