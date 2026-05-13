import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg p-6 ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}
  >
    {children}
  </div>
);
