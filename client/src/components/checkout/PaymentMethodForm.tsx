import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock } from "lucide-react";

interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

interface PaymentMethodFormProps {
  onSubmit?: (payment: PaymentMethod) => void;
}

export default function PaymentMethodForm({ onSubmit }: PaymentMethodFormProps) {
  const [payment, setPayment] = useState<PaymentMethod>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPayment(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(payment);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardholderName">Cardholder Name *</Label>
            <Input 
              id="cardholderName" 
              placeholder="John Doe" 
              value={payment.cardholderName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input 
              id="cardNumber" 
              placeholder="**** **** **** 1234" 
              value={payment.cardNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expires *</Label>
              <Input 
                id="expiryDate" 
                placeholder="MM/YY" 
                value={payment.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC *</Label>
              <Input 
                id="cvc" 
                placeholder="123" 
                value={payment.cvc}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Lock className="h-4 w-4 mr-1" />
            <span>Your payment information is securely encrypted</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
