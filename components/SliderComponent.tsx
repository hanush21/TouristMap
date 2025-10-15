'use client';

import React from 'react';

interface SliderComponentProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Track del slider */}
        <div className="w-full h-2 bg-gray-300 rounded-full">
          {/* Fill del slider */}
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        {/* Handle del slider */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:bg-blue-700"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      
      {/* Valor actual */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Menor densidad</span>
        <span className="font-medium text-blue-600">{value}</span>
        <span>Mayor densidad</span>
      </div>
    </div>
  );
};

export default SliderComponent;
