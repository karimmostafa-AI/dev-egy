import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TopNavigationBar from '@/components/TopNavigationBar';
import MainHeader from '@/components/MainHeader';
import CategoryNavigation from '@/components/CategoryNavigation';
import Footer from '@/components/Footer';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [location, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch('email');

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send a reset email via backend API
      console.log('Sending password reset email to:', data.email);
      
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="sticky top-0 z-40 bg-background">
          <TopNavigationBar />
          <MainHeader />
          <CategoryNavigation />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
          <div className="w-full max-w-md">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Check Your Email</CardTitle>
                <CardDescription className="text-green-600">
                  Password reset instructions sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-green-700">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium text-green-800" data-testid="reset-email">
                  {emailValue}
                </p>
                <p className="text-sm text-green-600">
                  Please check your email and follow the instructions to reset your password. 
                  The link will expire in 24 hours.
                </p>
                
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={() => setLocation('/auth')}
                    className="w-full"
                    data-testid="back-to-login"
                  >
                    Back to Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setError(null);
                    }}
                    className="w-full"
                    data-testid="send-again"
                  >
                    Send Again
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Didn't receive an email? Check your spam folder or try again with a different email address.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background">
        <TopNavigationBar />
        <MainHeader />
        <CategoryNavigation />
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Forgot Password?</CardTitle>
              <CardDescription>
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive" data-testid="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="send-reset-button"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation('/auth')}
                    data-testid="back-to-login-link"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need help? Contact our support team at:</p>
            <Button variant="link" className="h-auto p-0 font-normal" data-testid="support-email">
              support@devegypt.com
            </Button>
            <p className="mt-2">or call us at (555) 123-4567</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}