import { VehicleFilters, VehicleType } from "@/types/vehicle";
import { vehicleTypes } from "@/data/mockVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onFiltersChange: (filters: VehicleFilters) => void;
  maxPrice: number;
}

export const VehicleFiltersComponent = ({
  filters,
  onFiltersChange,
  maxPrice,
}: VehicleFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onFiltersChange({
      type: "all",
      driverOption: "all",
      priceRange: [0, maxPrice],
      availability: "all",
      searchQuery: "",
    });
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.driverOption !== "all" ||
    filters.availability !== "all" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Vehicle Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, type: value as VehicleType | "all" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {vehicleTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Driver Option</Label>
        <Select
          value={filters.driverOption}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              driverOption: value as "all" | "with" | "without",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All options" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Options</SelectItem>
            <SelectItem value="with">With Driver</SelectItem>
            <SelectItem value="without">Without Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Availability</Label>
        <Select
          value={filters.availability}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              availability: value as "all" | "available" | "booked",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available Only</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">
          Price Range (Rs. {filters.priceRange[0].toLocaleString()} - Rs.{" "}
          {filters.priceRange[1].toLocaleString()})
        </Label>
        <Slider
          min={0}
          max={maxPrice}
          step={500}
          value={filters.priceRange}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, priceRange: value as [number, number] })
          }
          className="pt-2"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicles..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value })
          }
          className="pl-10"
        />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Vehicles</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  );
};
