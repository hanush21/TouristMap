'use client';

import React, { useState, useRef, useCallback } from 'react';
import touristMonthsData from '../lib/data/meses.json';

interface MonthData {
  month: number;
  name: string;
  tourists: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isHoliday?: boolean;
  description: string;
}

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
  min = 1,
  max = 12,
  step = 1,
  label = "Mes del año",
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Usar los datos importados directamente con fallback
  const monthsData: MonthData[] = touristMonthsData.filter(month => 
    month && month.month && month.name && month.tourists !== undefined
  );

  const getCurrentMonthData = useCallback(() => {
    return monthsData.find(month => month.month === value) || monthsData[0];
  }, [monthsData, value]);

  const calculateValue = useCallback((clientX: number): number => {
    if (!sliderRef.current) return value;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    // Calcular en qué segmento de mes estamos (cada mes = 1/12 del slider)
    const monthIndex = Math.floor(percentage * 12);
    const newValue = Math.min(12, Math.max(1, monthIndex + 1));
    
    return newValue;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setShowTooltip(true);
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
    setTimeout(() => setShowTooltip(false), 1000);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setShowTooltip(true);
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
    setTimeout(() => setShowTooltip(false), 1000);
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

  const fillPercentage = (value / 12) * 100; // Enero = 8.33%, Diciembre = 100%
  const handlePosition = ((value - 1) / 11) * 100; // Enero = 0%, Diciembre = 100%
  const currentMonth = getCurrentMonthData();

  const getSeasonColor = (season: string, tourists: number) => {
    if (tourists >= 90) return 'bg-red-500';
    if (tourists >= 80) return 'bg-orange-500';
    if (tourists >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!monthsData || monthsData.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center text-gray-500">Cargando datos del slider...</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className='flex justify-between items-center mb-2'>
          <span className="text-[#333] uppercase tracking-[0.5px] text-[12px] font-semibold">
            {label}</span>
          {/* 
          <span className="font-semibold text-blue-600">{currentMonth?.name || 'Enero'}</span> */}
        </div>
      )}
      
      <div 
        ref={sliderRef}
        className="relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => !isDragging && setShowTooltip(false)}
      >
        {/* Segmentos de meses - cada uno ocupa 1/12 del slider */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
          {monthsData.slice(0, 12).map((month, index) => {
            const segmentWidth = 100 / 12; // Cada mes = 8.333% del ancho
            const leftPosition = index * segmentWidth;
            
            return (
              <div
                key={month.month || index}
                className={`absolute top-0 h-full opacity-60 ${
                  month.season === 'winter' ? 'bg-blue-300' :
                  month.season === 'spring' ? 'bg-green-300' :
                  month.season === 'summer' ? 'bg-red-300' :
                  'bg-orange-300'
                }`}
                style={{ 
                  left: `${leftPosition}%`, 
                  width: `${segmentWidth}%`,
                  borderRight: index < 11 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                }}
              />
            );
          })}
        </div>
        
        {/* ✅ CORREGIDO: Fill con segmentos de colores de estaciones */}
        <div className="absolute top-0 h-3 rounded-l-full overflow-hidden transition-all duration-300" style={{ width: `${fillPercentage}%` }}>
          {monthsData.slice(0, 12).map((month, index) => {
            const segmentWidth = 100 / 12; // Cada mes = 8.333% del ancho
            const leftPosition = index * segmentWidth;
            
            // Solo mostrar segmentos que estén dentro del área de fill
            const segmentEndPosition = leftPosition + segmentWidth;
            const fillEndPosition = fillPercentage;
            
            if (leftPosition >= fillEndPosition) return null; // Segmento completamente fuera
            
            // Calcular el ancho visible del segmento
            let visibleWidth = segmentWidth;
            if (segmentEndPosition > fillEndPosition) {
              visibleWidth = fillEndPosition - leftPosition;
            }
            
            return (
              <div
                key={`fill-${month.month || index}`}
                className={`absolute top-0 h-full ${
                  month.season === 'winter' ? 'bg-blue-500' :
                  month.season === 'spring' ? 'bg-green-500' :
                  month.season === 'summer' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}
                style={{ 
                  left: `${(leftPosition / fillPercentage) * 100}%`, 
                  width: `${(visibleWidth / fillPercentage) * 100}%`
                }}
              />
            );
          })}
        </div>
        
        {/* Separadores entre meses */}
        <div className="absolute top-0 w-full h-3 pointer-events-none">
          {Array.from({ length: 11 }, (_, index) => {
            const pos = ((index + 1) / 12) * 100;
            return (
              <div
                key={`separator-${index}`}
                className="absolute top-0 w-px h-3 bg-gray-500 opacity-40"
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>
        
        {/* Marcadores de feriados con validación */}
        <div className="absolute top-0 w-full h-3 pointer-events-none">
          {monthsData.map((month) => {
            if (!month?.isHoliday || !month.month) return null;
            const pos = ((month.month - 1) / 12) * 100 + (100 / 24);
            return (
              <div
                key={`holiday-${month.month}`}
                className="absolute top-0 w-1 h-3 bg-red-600 opacity-80"
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>
        
        {/* Input slider invisible como fallback para accesibilidad */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute top-0 w-full h-3 opacity-0 pointer-events-none"
          tabIndex={0}
        />
        
        {/* Handle del slider - Solo este cambia de color según ocupación */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-lg transition-all duration-200 z-10 ${
            isDragging 
              ? 'scale-125 cursor-grabbing shadow-xl' 
              : 'cursor-grab hover:scale-110 hover:shadow-xl'
          }`}
          style={{ left: `calc(${handlePosition}% - 12px)` }}
        >
          {/* Solo el indicador del handle cambia según ocupación turística */}
          <div 
            className={`absolute inset-1 rounded-full transition-colors duration-200 ${getSeasonColor(currentMonth?.season || 'winter', currentMonth?.tourists || 0)}`}
          />
        </div>

        {/* Tooltip */}
        {showTooltip && currentMonth && (
          <div 
            className="absolute bottom-8 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl z-50 whitespace-nowrap"
            style={{ left: `${handlePosition}%` }}
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{currentMonth.name}</div>
              <div className="text-xs opacity-90">{currentMonth.description}</div>
              <div className="text-xs">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getSeasonColor(currentMonth.season, currentMonth.tourists)}`}></span>
                {currentMonth.tourists}% ocupación
              </div>
            </div>
            {/* Flecha del tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Etiquetas de meses */}
        <div className="absolute -bottom-5 w-full pointer-events-none">
          {monthsData.slice(0, 12).map((month) => {
            if (!month.month) return null;
            const pos = ((month.month - 1) / 12) * 100 + (100 / 24);
            const showLabel = month.month % 4 === 1 || month.month === 12;
            return showLabel ? (
              <div
                key={`label-${month.month}`}
                className="absolute text-[9px] text-gray-500 transform -translate-x-1/2"
                style={{ left: `${pos}%` }}
              >
                {month.name?.substring(0, 3) || ''}
              </div>
            ) : null;
          })}
        </div>
      </div>
      
      {/* Información del mes actual */}
      <div className="flex justify-center items-center text-xs text-gray-600 mt-8">
        <div className="text-center">
          <div className="font-semibold text-blue-600">{currentMonth?.name || 'Enero'}</div>
          <div className="text-xs">{currentMonth?.tourists || 0}% turistas</div>
        </div>
      </div>

      {/* Leyenda de temporadas horizontal */}
      <div className="flex justify-center items-center gap-4 text-[10px] text-gray-500 mt-3 px-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
          <span>Invierno</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-300 rounded-full"></span>
          <span>Primavera</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-300 rounded-full"></span>
          <span>Verano</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-300 rounded-full"></span>
          <span>Otoño</span>
        </div>
      </div>

      {/* Leyenda de ocupación horizontal */}
      <div className="flex justify-center items-center gap-3 text-[9px] text-gray-400 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span>Baja (&lt;60%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
          <span>Media (60-79%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          <span>Alta (80-89%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          <span>Pico (≥90%)</span>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;