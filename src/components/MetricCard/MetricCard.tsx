// src/components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  isCurrency?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, isCurrency }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${isCurrency ? 'text-green-600' : 'text-blue-600'} mb-2`}>
        {value}
      </p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default MetricCard;