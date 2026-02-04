import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Settings,
  Fuel,
  Check,
  User,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useBooking();
  const vehicle = vehicles.find((v) => v.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = vehicle.images.length > 0 ? vehicle.images : [vehicle.image];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-6">
        <div className="container">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={allImages[selectedImage]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{vehicle.type}</Badge>
                  <Badge
                    className={
                      vehicle.available ? "status-available" : "status-booked"
                    }
                  >
                    {vehicle.available ? "Available" : "Booked"}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  {vehicle.name}
                </h1>
              </div>

              <p className="text-muted-foreground">{vehicle.description}</p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.fuelType}</span>
                </div>
                {vehicle.driverOption && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Driver Available</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Card */}
              <Card className="p-6 bg-secondary/30">
                <h3 className="font-display font-semibold text-lg mb-4">
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Per Day</span>
                    <span className="font-semibold text-xl text-primary">
                      Rs. {vehicle.pricePerDay.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Per Week</span>
                    <span className="font-medium">
                      Rs. {vehicle.pricePerWeek.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Per Month</span>
                    <span className="font-medium">
                      Rs. {vehicle.pricePerMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Per Km</span>
                    <span className="font-medium">
                      Rs. {vehicle.pricePerKm.toLocaleString()}
                    </span>
                  </div>
                  {vehicle.driverOption && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">
                        Driver (per day)
                      </span>
                      <span className="font-medium">
                        + Rs. {vehicle.driverPricePerDay.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Features */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-3">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="py-1.5">
                      <Check className="h-3 w-3 mr-1 text-success" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <Link to={`/book/${vehicle.id}`}>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!vehicle.available}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {vehicle.available ? "Book Now" : "Currently Unavailable"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleDetail;
