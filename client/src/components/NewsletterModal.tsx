import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', { email, month, day });
    // Reset form
    setEmail('');
    setMonth('');
    setDay('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="newsletter-modal">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          data-testid="close-modal"
          className="absolute top-4 right-4 hover-elevate p-1 rounded"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="modal-title">
              Sign up to get
            </h2>
            <p className="text-lg font-semibold text-primary mb-1">
              FREE SHIPPING
            </p>
            <p className="text-base text-foreground">
              on your next order!
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Be the first to hear about new products and exclusive discounts and receive your birthday treat for a special deal on your special day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                EMAIL
              </label>
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="email-input"
                className="w-full"
              />
            </div>

            {/* Birthday Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                BIRTHDAY
              </label>
              <div className="flex space-x-3">
                <Select value={month} onValueChange={setMonth} required>
                  <SelectTrigger data-testid="month-select" className="flex-1">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthName = new Date(0, i).toLocaleDateString('en', { month: 'long' });
                      return (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {monthName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select value={day} onValueChange={setDay} required>
                  <SelectTrigger data-testid="day-select" className="flex-1">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              data-testid="signup-button"
            >
              SIGN UP
            </Button>

            {/* Footer Links */}
            <div className="text-center space-y-2 text-xs text-muted-foreground">
              <button 
                type="button"
                onClick={() => console.log('No thanks clicked')}
                className="underline hover:text-foreground"
                data-testid="no-thanks-link"
              >
                No thanks
              </button>
              <div>
                <button 
                  type="button"
                  onClick={() => console.log('Privacy Policy clicked')}
                  className="underline hover:text-foreground"
                  data-testid="privacy-policy-link"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}