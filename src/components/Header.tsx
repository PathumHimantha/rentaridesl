import { Link, useLocation } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");

  const navLinks = isAdmin
    ? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/vehicles", label: "Vehicles" },
        { href: "/admin/bookings", label: "Bookings" },
        { href: "/", label: "View Site" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/vehicles", label: "All Vehicles" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            RentaRide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAdmin && (
            <Link to="/admin/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/login">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary p-2 rounded-lg ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAdmin && (
                <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4">Admin Login</Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
