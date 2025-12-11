
import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderColor?: string;
  fallbackText?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholderColor = 'bg-white/10', fallbackText, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '50px' }); // Preload a bit before showing

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className} ${!isLoaded ? placeholderColor : ''}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-full animate-pulse bg-white/5 flex items-center justify-center">
             {fallbackText && <span className="text-[10px] text-white/50">{fallbackText}</span>}
           </div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600 text-xs">
            IMG
        </div>
      ) : (
        <img
            ref={imgRef}
            src={isInView ? src : ''}
            alt={alt}
            className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
            {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;