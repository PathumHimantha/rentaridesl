import { useMemo, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleFiltersComponent } from "@/components/VehicleFilters";
import { VehicleFilters } from "@/types/vehicle";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Car } from "lucide-react";

const VehiclesPage = () => {
  const { vehicles } = useBooking();
  const maxPrice = Math.max(...vehicles.map((v) => v.pricePerDay));

  const [filters, setFilters] = useState<VehicleFilters>({
    type: "all",
    driverOption: "all",
    priceRange: [0, maxPrice],
    availability: "all",
    searchQuery: "",
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.type !== "all" && vehicle.type !== filters.type) return false;
      if (filters.driverOption === "with" && !vehicle.driverOption) return false;
      if (filters.driverOption === "without" && vehicle.driverOption) return false;
      if (
        vehicle.pricePerDay < filters.priceRange[0] ||
        vehicle.pricePerDay > filters.priceRange[1]
      )
        return false;
      if (filters.availability === "available" && !vehicle.available) return false;
      if (filters.availability === "booked" && vehicle.available) return false;
      if (
        filters.searchQuery &&
        !vehicle.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !vehicle.type.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [vehicles, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              All Vehicles
            </h1>
            <p className="text-muted-foreground">
              Browse our complete fleet and find your perfect ride
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h2 className="font-display font-semibold text-lg mb-4 hidden lg:block">
                  Filter Vehicles
                </h2>
                <VehicleFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>

            {/* Vehicle Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">
                  {filteredVehicles.length} vehicles found
                </span>
              </div>

              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-secondary/30 rounded-xl">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your filters to find more options
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehiclesPage;
