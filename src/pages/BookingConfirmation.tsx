import { useParams, Link } from "react-router-dom";
import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, User, Phone, FileText, Car, Home } from "lucide-react";
import { format } from "date-fns";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { bookings, vehicles } = useBooking();
  const booking = bookings.find((b) => b.id === bookingId);
  const vehicle = booking ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  if (!booking || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
            <Link to="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your booking request has been submitted successfully
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono font-semibold">{booking.id.toUpperCase()}</p>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <Separator className="mb-6" />

            {/* Vehicle Info */}
            <div className="flex gap-4 mb-6">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-24 h-20 rounded-xl object-cover"
              />
              <div>
                <h2 className="font-display font-semibold text-lg">{vehicle.name}</h2>
                <Badge variant="secondary">{vehicle.type}</Badge>
                {booking.withDriver && (
                  <Badge variant="outline" className="ml-2">
                    With Driver
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Customer Details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{booking.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">NIC</p>
                  <p className="font-medium">{booking.nic}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Rental Period</p>
                  <p className="font-medium">
                    {format(booking.startDate, "MMM d")} - {format(booking.endDate, "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({booking.numberOfDays} days)
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Payment Summary */}
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-display font-bold text-primary">
                  Rs. {booking.totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Payment to be collected at vehicle pickup
              </p>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-display font-semibold mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                Our team will contact you to confirm the booking
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                Bring your driving license and NIC/Passport for verification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                Pay the rental amount at pickup and collect your vehicle
              </li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/vehicles" className="flex-1">
              <Button className="w-full">
                <Car className="h-4 w-4 mr-2" />
                Browse More Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
