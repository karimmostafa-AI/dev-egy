import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ShippingAddress {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface ShippingAddressFormProps {
  onSubmit?: (address: ShippingAddress) => void;
}

export default function ShippingAddressForm({ onSubmit }: ShippingAddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "Egypt",
    phone: "",
    isDefault: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAddress(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input 
              id="fullName" 
              placeholder="John Doe" 
              value={address.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input 
              id="address1" 
              placeholder="123 Main St" 
              value={address.address1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address2">Address Line 2</Label>
            <Input 
              id="address2" 
              placeholder="Apartment, suite, etc. (optional)" 
              value={address.address2}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input 
              id="city" 
              placeholder="Cairo" 
              value={address.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province *</Label>
            <Input 
              id="state" 
              placeholder="Cairo" 
              value={address.state}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code *</Label>
            <Input 
              id="zip" 
              placeholder="12345" 
              value={address.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input 
              id="country" 
              placeholder="Egypt" 
              value={address.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone" 
              placeholder="+20 123 456 7890" 
              value={address.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={address.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isDefault">Set as default shipping address</Label>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
