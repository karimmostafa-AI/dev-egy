import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupModal({ isOpen, onClose }: EmailSignupModalProps) {
  const [email, setEmail] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSignUp = () => {
    console.log('Sign up clicked:', { email, birthMonth, birthDay });
    // Handle signup logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden" data-testid="email-signup-modal">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          data-testid="close-modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex">
          {/* Left side - Form */}
          <div className="flex-1 p-8">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-2xl font-bold mb-2">
                Sign up to get<br />
                <span className="text-lg font-bold">FREE SHIPPING</span><br />
                on your next order!
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground mb-6">
              Be the first to hear about new products and exclusive offers, and get your birthday gift on your special day.
            </p>

            <div className="space-y-4">
              {/* Email field */}
              <div>
                <label className="text-sm font-medium text-foreground">EMAIL</label>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  data-testid="email-input"
                />
              </div>

              {/* Birthday fields */}
              <div>
                <label className="text-sm font-medium text-foreground">BIRTHDAY</label>
                <div className="flex gap-2 mt-1">
                  <Select value={birthMonth} onValueChange={setBirthMonth}>
                    <SelectTrigger className="flex-1" data-testid="month-select">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={birthDay} onValueChange={setBirthDay}>
                    <SelectTrigger className="flex-1" data-testid="day-select">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sign up button */}
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 mt-6"
                onClick={handleSignUp}
                data-testid="signup-button"
              >
                SIGN UP
              </Button>

              {/* Links */}
              <div className="text-center space-y-1 mt-4">
                <button
                  className="text-sm text-muted-foreground hover:text-foreground underline block w-full"
                  onClick={onClose}
                  data-testid="no-thanks"
                >
                  No thanks
                </button>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground underline block w-full"
                  onClick={() => console.log('Privacy Policy clicked')}
                  data-testid="privacy-policy"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-1/3 bg-blue-50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200" />
            <div className="absolute bottom-4 right-4">
              <div className="bg-white rounded-lg p-3 shadow-lg">
                <div className="text-xs font-bold text-blue-600">UA</div>
                <div className="text-xs text-gray-600">Uniform<br />Advantage®</div>
              </div>
            </div>
            {/* Medical tools illustration would go here */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}