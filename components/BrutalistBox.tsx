
import React from 'react';

interface BrutalistBoxProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const BrutalistBox: React.FC<BrutalistBoxProps> = ({ 
  children, 
  color = 'white', 
  className = '', 
  onClick,
  hoverable = false
}) => {
  const baseClasses = `neo-border neo-shadow p-6 font-bold transition-all ${className}`;
  const interactiveClasses = hoverable ? 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer' : '';

  return (
    <div 
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`${baseClasses} ${interactiveClasses}`}
    >
      {children}
    </div>
  );
};
