import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, children, className = '', ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200';
    
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-100',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
    };

    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? '⏳ Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
