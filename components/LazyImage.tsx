
import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderColor?: string;
  fallbackText?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholderColor = 'bg-white/10', fallbackText, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className} ${!isLoaded ? placeholderColor : ''}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
           {fallbackText ? (
             <span className="text-[10px] text-white/30 font-bold uppercase">{fallbackText.substring(0, 2)}</span>
           ) : (
             <div className="w-full h-full animate-pulse bg-white/5"></div>
           )}
        </div>
      )}
      <img
        ref={imgRef}
        src={isInView ? src : ''}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
