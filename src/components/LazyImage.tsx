
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
    // Observer para carregar apenas quando aparecer na tela (Core do Protocolo FAHUB)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '50px' }); // Preload 50px antes de aparecer

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className} ${!isLoaded ? placeholderColor : ''}`}>
      {/* Skeleton Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
             {fallbackText ? (
                 <span className="text-[10px] text-white/30 font-bold uppercase">{fallbackText.substring(0, 2)}</span>
             ) : (
                 <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"></div>
             )}
        </div>
      )}
      
      {/* Error State Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600 border border-white/5">
            <span className="text-[9px] font-mono text-gray-500 uppercase">{fallbackText || 'IMG'}</span>
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