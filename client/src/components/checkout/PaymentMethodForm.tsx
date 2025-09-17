import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

export default function PaymentMethodForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" placeholder="**** **** **** 1234" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expires</Label>
            <Input id="expiryDate" placeholder="MM/YY" />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
