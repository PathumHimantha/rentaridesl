import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  FileText,
  CreditCard,
} from "lucide-react";
import { useState, useMemo } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { toast } from "sonner";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, addBooking, isVehicleAvailable } = useBooking();
  const vehicle = vehicles.find((v) => v.id === id);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    nic: "",
    withDriver: false,
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.max(1, differenceInDays(endDate, startDate) + 1);
  }, [startDate, endDate]);

  const pricing = useMemo(() => {
    if (!vehicle || numberOfDays === 0) {
      return { vehicleCost: 0, driverCost: 0, total: 0 };
    }

    let vehicleCost = 0;
    if (numberOfDays >= 30) {
      const months = Math.floor(numberOfDays / 30);
      const remainingDays = numberOfDays % 30;
      vehicleCost = months * vehicle.pricePerMonth + remainingDays * vehicle.pricePerDay;
    } else if (numberOfDays >= 7) {
      const weeks = Math.floor(numberOfDays / 7);
      const remainingDays = numberOfDays % 7;
      vehicleCost = weeks * vehicle.pricePerWeek + remainingDays * vehicle.pricePerDay;
    } else {
      vehicleCost = numberOfDays * vehicle.pricePerDay;
    }

    const driverCost = formData.withDriver
      ? numberOfDays * vehicle.driverPricePerDay
      : 0;

    return {
      vehicleCost,
      driverCost,
      total: vehicleCost + driverCost,
    };
  }, [vehicle, numberOfDays, formData.withDriver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicle || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.customerName || !formData.phoneNumber || !formData.nic) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check availability
    if (!isVehicleAvailable(vehicle.id, { startDate, endDate })) {
      toast.error("Vehicle is not available for selected dates");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const booking = addBooking({
        vehicleId: vehicle.id,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        nic: formData.nic,
        startDate,
        endDate,
        numberOfDays,
        withDriver: formData.withDriver,
        totalPrice: pricing.total,
        status: "pending",
      });

      setIsSubmitting(false);
      navigate(`/booking-confirmation/${booking.id}`);
    }, 1000);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicle
          </Button>

          <h1 className="text-3xl font-display font-bold mb-6">
            Book {vehicle.name}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="p-6">
                  <h2 className="font-display font-semibold text-lg mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        placeholder="Enter your full name"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="07X XXX XXXX"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nic">NIC Number *</Label>
                      <Input
                        id="nic"
                        placeholder="Enter your NIC number"
                        value={formData.nic}
                        onChange={(e) =>
                          setFormData({ ...formData, nic: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </Card>

                {/* Rental Dates */}
                <Card className="p-6">
                  <h2 className="font-display font-semibold text-lg mb-4">
                    Rental Period
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              if (date && (!endDate || endDate < date)) {
                                setEndDate(addDays(date, 1));
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                              date < (startDate || new Date()) ||
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  {numberOfDays > 0 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Total rental period: <strong>{numberOfDays} days</strong>
                    </p>
                  )}
                </Card>

                {/* Driver Option */}
                {vehicle.driverOption && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display font-semibold text-lg">
                          Add Driver
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Rs. {vehicle.driverPricePerDay.toLocaleString()} per day
                        </p>
                      </div>
                      <Switch
                        checked={formData.withDriver}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, withDriver: checked })
                        }
                      />
                    </div>
                  </Card>
                )}

                {/* Required Documents */}
                <Card className="p-6 bg-secondary/30">
                  <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      Valid Driving License
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      National ID Card or Passport
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Please bring these documents when picking up the vehicle
                  </p>
                </Card>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <Card className="p-6">
                    <h2 className="font-display font-semibold text-lg mb-4">
                      Booking Summary
                    </h2>

                    {/* Vehicle Info */}
                    <div className="flex gap-3 mb-4">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-20 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{vehicle.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {vehicle.type}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Pricing Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Vehicle ({numberOfDays} days)
                        </span>
                        <span>Rs. {pricing.vehicleCost.toLocaleString()}</span>
                      </div>
                      {formData.withDriver && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Driver ({numberOfDays} days)
                          </span>
                          <span>Rs. {pricing.driverCost.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          Rs. {pricing.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6"
                      disabled={isSubmitting || numberOfDays === 0}
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Payment will be collected at pickup
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
