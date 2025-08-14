import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseClasses = "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90 shadow-[var(--shadow)]",
    secondary: "bg-[var(--card)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--muted)]",
    ghost: "text-[var(--fg)] hover:bg-[var(--muted)]"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-[calc(var(--radius)-2px)]",
    md: "px-4 py-2 text-sm rounded-[var(--radius)]",
    lg: "px-6 py-3 text-base rounded-[var(--radius)]"
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};