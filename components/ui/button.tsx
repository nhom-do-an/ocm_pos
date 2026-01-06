import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      // Primary: Nền xanh dương, chữ trắng
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      // Secondary: Chữ xanh dương, viền xanh dương, nền trong suốt
      secondary: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500',
      // Success: Nền xanh lá, chữ trắng
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      // Danger: Nền đỏ, chữ trắng
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      // Outline: Viền xám, chữ xám
      outline: 'border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
      // Ghost: Không viền, hover có nền
      ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
