import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  color1?: string;
  color2?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 32, 
  animated = false,
  color1 = 'text-primary-600',
  color2 = 'text-primary-300'
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      {/* Bottom-Left L-Shape */}
      <path 
        d="M8 11V21C8 23.2091 9.79086 25 12 25H22" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        className={`${color1} origin-center transition-transform duration-500 ease-out ${animated ? 'group-hover:-translate-x-0.5 group-hover:translate-y-0.5' : ''}`}
      />
      {/* Top-Right L-Shape */}
      <path 
        d="M24 21V11C24 8.79086 22.2091 7 20 7H10" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        className={`${color2} origin-center transition-transform duration-500 ease-out ${animated ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`}
      />
    </svg>
  );
};

export default Logo;