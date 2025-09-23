import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  loading = "lazy",
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">Image not available</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton className={`w-full h-full ${className}`} />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : 'block'} object-cover`}
        loading={loading}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }}
      />
    </>
  );
}