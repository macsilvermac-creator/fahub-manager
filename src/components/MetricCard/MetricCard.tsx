// src/components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string; // Optional: for more detailed info if needed
  currency?: string; // Optional: for monetary values
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, currency }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {currency && <span className="text-xl font-semibold mr-1">{currency}</span>}
          {value}
        </p>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;