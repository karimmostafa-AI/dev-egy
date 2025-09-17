import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ShippingAddressForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="123 Main St" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Anytown" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="CA" />
        </div>
        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" placeholder="12345" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" placeholder="USA" />
        </div>
      </CardContent>
    </Card>
  );
}
