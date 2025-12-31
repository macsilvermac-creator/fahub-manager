import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  description,
  color = 'blue' 
}: StatCardProps) => {
  
  // Cores dinâmicas baseadas na prop 'color'
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span className={`flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
              {trend}
            </span>
          )}
          {description && (
            <span className="text-slate-400 truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;