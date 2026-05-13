// components/common/Card.tsx
'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={\g-white rounded-lg shadow-sm border border-gray-200 p-6 \\}
    >
      {children}
    </div>
  );
}
