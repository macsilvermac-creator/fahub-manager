import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from './icons/UiIcons';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
    <div className={`relative overflow-hidden ${className} ${!isLoaded && !hasError ? placeholderColor : ''}`}>
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
      
      {/* Error State Fallback (Visual Shield) */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-gray-600 border border-white/5">
            <ImageIcon className="w-6 h-6 opacity-30 mb-1" />
            <span className="text-[8px] font-mono text-gray-500 uppercase">{fallbackText ? fallbackText.substring(0,6) : 'IMG ERR'}</span>
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