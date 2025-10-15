'use client';

import React, { useState, useRef, useCallback } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculateValue = useCallback((clientX: number): number => {
    if (!sliderRef.current) return value;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    
    // Aplicar step
    const steppedValue = Math.round(newValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  }, [calculateValue, onChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  }, [isDragging, calculateValue, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const newValue = calculateValue(touch.clientX);
    onChange(newValue);
  }, [calculateValue, onChange]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newValue = calculateValue(touch.clientX);
    onChange(newValue);
  }, [isDragging, calculateValue, onChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Agregar/remover event listeners globales
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-[#333] uppercase tracking-[0.5px] mb-2 text-[12px] font-semibold leading-[2.5em]">
          {label}
        </label>
      )}
      
      <div 
        ref={sliderRef}
        className="relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track del slider */}
        <div className="w-full h-2 bg-gray-300 rounded-full">
          {/* Fill del slider */}
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input slider invisible como fallback para accesibilidad */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute top-0 w-full h-2 opacity-0 pointer-events-none"
          tabIndex={0}
        />
        
        {/* Handle del slider */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-lg transition-all duration-200 ${
            isDragging 
              ? 'scale-125 cursor-grabbing shadow-xl' 
              : 'cursor-grab hover:scale-110 hover:shadow-xl'
          }`}
          style={{ left: `calc(${percentage}% - 10px)` }}
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