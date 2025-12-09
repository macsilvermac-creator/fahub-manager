
import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
    className = '', 
    variant = 'rectangular', 
    width, 
    height 
}) => {
    const baseStyles = "animate-pulse bg-white/10";
    
    const variantStyles = {
        text: "rounded h-4 w-3/4",
        circular: "rounded-full",
        rectangular: "rounded-lg"
    };

    const style = {
        width: width,
        height: height
    };

    return (
        <div 
            className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
            style={style}
        />
    );
};

export default Skeleton;
