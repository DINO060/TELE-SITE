import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ 
  children, 
  active = false, 
  onClick, 
  className = '' 
}) => {
  const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap";
  
  const stateClasses = active
    ? "bg-[var(--primary)] text-white shadow-[var(--shadow)]"
    : "bg-[var(--muted)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--card)]";

  const interactiveClasses = onClick ? "cursor-pointer" : "";

  return (
    <span
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </span>
  );
};