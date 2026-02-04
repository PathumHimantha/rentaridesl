import { useState } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vehicle, VehicleType } from "@/types/vehicle";
import { vehicleTypes } from "@/data/mockVehicles";
import { Plus, Pencil, Trash2, Car } from "lucide-react";
import { toast } from "sonner";

const AdminVehicles = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useBooking();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Car" as VehicleType,
    image: "",
    description: "",
    pricePerDay: 0,
    pricePerKm: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    driverOption: false,
    driverPricePerDay: 0,
    available: true,
    features: "",
    seats: 4,
    transmission: "Manual",
    fuelType: "Petrol",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Car",
      image: "",
      description: "",
      pricePerDay: 0,
      pricePerKm: 0,
      pricePerWeek: 0,
      pricePerMonth: 0,
      driverOption: false,
      driverPricePerDay: 0,
      available: true,
      features: "",
      seats: 4,
      transmission: "Manual",
      fuelType: "Petrol",
    });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      image: vehicle.image,
      description: vehicle.description,
      pricePerDay: vehicle.pricePerDay,
      pricePerKm: vehicle.pricePerKm,
      pricePerWeek: vehicle.pricePerWeek,
      pricePerMonth: vehicle.pricePerMonth,
      driverOption: vehicle.driverOption,
      driverPricePerDay: vehicle.driverPricePerDay,
      available: vehicle.available,
      features: vehicle.features.join(", "),
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData = {
      name: formData.name,
      type: formData.type,
      image: formData.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
      images: [formData.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop"],
      description: formData.description,
      pricePerDay: formData.pricePerDay,
      pricePerKm: formData.pricePerKm,
      pricePerWeek: formData.pricePerWeek,
      pricePerMonth: formData.pricePerMonth,
      driverOption: formData.driverOption,
      driverPricePerDay: formData.driverPricePerDay,
      available: formData.available,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      seats: formData.seats,
      transmission: formData.transmission,
      fuelType: formData.fuelType,
    };

    if (editingVehicle) {
      updateVehicle({ ...vehicleData, id: editingVehicle.id });
      toast.success("Vehicle updated successfully!");
    } else {
      addVehicle(vehicleData);
      toast.success("Vehicle added successfully!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      deleteVehicle(id);
      toast.success("Vehicle deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Manage Vehicles</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove vehicles from your fleet
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Toyota Corolla"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as VehicleType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the vehicle..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Price/Day</Label>
                    <Input
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price/Km</Label>
                    <Input
                      type="number"
                      value={formData.pricePerKm}
                      onChange={(e) => setFormData({ ...formData, pricePerKm: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price/Week</Label>
                    <Input
                      type="number"
                      value={formData.pricePerWeek}
                      onChange={(e) => setFormData({ ...formData, pricePerWeek: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price/Month</Label>
                    <Input
                      type="number"
                      value={formData.pricePerMonth}
                      onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features (comma separated)</Label>
                  <Input
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="AC, GPS, Bluetooth"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">Driver Option</p>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to add a driver
                    </p>
                  </div>
                  <Switch
                    checked={formData.driverOption}
                    onCheckedChange={(checked) => setFormData({ ...formData, driverOption: checked })}
                  />
                </div>

                {formData.driverOption && (
                  <div className="space-y-2">
                    <Label>Driver Price/Day</Label>
                    <Input
                      type="number"
                      value={formData.driverPricePerDay}
                      onChange={(e) => setFormData({ ...formData, driverPricePerDay: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">Available</p>
                    <p className="text-sm text-muted-foreground">
                      Mark vehicle as available for booking
                    </p>
                  </div>
                  <Switch
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicles Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-12 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{vehicle.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{vehicle.type}</Badge>
                    </TableCell>
                    <TableCell>Rs. {vehicle.pricePerDay.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={vehicle.available ? "status-available" : "status-booked"}
                      >
                        {vehicle.available ? "Available" : "Booked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.driverOption ? (
                        <span className="text-success">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {vehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vehicles yet</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminVehicles;
