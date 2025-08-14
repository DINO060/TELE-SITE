import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    label: string;
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-[var(--shadow)] transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            change.value >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {change.value >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-[var(--fg)] opacity-70 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[var(--fg)]">{value}</p>
      {change && (
        <p className="text-xs text-[var(--fg)] opacity-60 mt-1">{change.label}</p>
      )}
    </div>
  );
};