// components/ChamaProLogo.jsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const ChamaProLogo = ({ size = "lg", className = "" }) => {
  const { theme } = useTheme();
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
        <div className="transform -rotate-12 text-white font-bold text-center">
          {size === 'sm' && <span className="text-xs">CP</span>}
          {size === 'md' && <span className="text-sm">CP</span>}
          {size === 'lg' && <span className="text-xl">CP</span>}
          {size === 'xl' && <span className="text-2xl">CP</span>}
        </div>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur opacity-30"></div>
    </div>
  );
};

export default ChamaProLogo;