import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">RentaRide</span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/vehicles" className="hover:text-primary transition-colors">
              Vehicles
            </Link>
            <span>© 2024 RentaRide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
