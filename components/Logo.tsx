import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 32, 
}) => {
  return (
    <div className={`relative flex items-center justify-center bg-primary-600 rounded-full text-white font-bold ${className}`} style={{ width: size, height: size }}>
       <span style={{ fontSize: size * 0.6, lineHeight: 1 }}>C</span>
    </div>
  );
};

export default Logo;