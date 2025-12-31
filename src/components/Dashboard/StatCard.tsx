import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string; // Opcional: para mostrar crescimento/queda futuro
  colorClass?: string; // Para variar a cor do ícone/fundo
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = "text-indigo-600 bg-indigo-50" 
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}