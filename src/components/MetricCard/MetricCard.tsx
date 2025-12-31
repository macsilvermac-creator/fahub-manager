// src/components/MetricCard/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string; // Para estilização adicional via Tailwind
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;