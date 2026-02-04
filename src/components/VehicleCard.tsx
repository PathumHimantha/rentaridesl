import { Vehicle } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Fuel, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <Link to={`/vehicle/${vehicle.id}`}>
      <Card className="overflow-hidden card-hover bg-card border-border/50 group cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={vehicle.available ? "status-available" : "status-booked"}
            >
              {vehicle.available ? "Available" : "Booked"}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
              {vehicle.type}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {vehicle.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {vehicle.seats} seats
            </span>
            <span className="flex items-center gap-1">
              <Settings className="h-3.5 w-3.5" />
              {vehicle.transmission}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5" />
              {vehicle.fuelType}
            </span>
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between">
            <div>
              <span className="text-2xl font-display font-bold text-primary">
                Rs. {vehicle.pricePerDay.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground"> / day</span>
            </div>
            {vehicle.driverOption && (
              <Badge variant="outline" className="text-xs">
                Driver available
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
