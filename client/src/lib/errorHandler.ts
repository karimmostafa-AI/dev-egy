// Error handling utilities
import { toast } from "@/hooks/use-toast";

// Parse error message from different sources
export const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  
  return "An unexpected error occurred";
};

// Handle API errors with appropriate user feedback
export const handleApiError = (error: unknown, defaultMessage = "An error occurred"): void => {
  const message = parseErrorMessage(error);
  
  // Show error toast
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
  
  // Log error to console for debugging
  console.error("API Error:", error);
};

// Handle form submission errors
export const handleFormError = (error: unknown, formName: string): void => {
  const message = parseErrorMessage(error);
  
  // Show error toast
  toast({
    title: `Error submitting ${formName}`,
    description: message,
    variant: "destructive",
  });
  
  // Log error to console for debugging
  console.error(`${formName} submission error:`, error);
};

// Handle success messages
export const handleSuccess = (title: string, description: string): void => {
  toast({
    title,
    description,
  });
};

// Handle warnings
export const handleWarning = (title: string, description: string): void => {
  toast({
    title,
    description,
    variant: "default",
  });
};

// Handle info messages
export const handleInfo = (title: string, description: string): void => {
  toast({
    title,
    description,
    variant: "default",
  });
};