'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import SliderComponent from '@/components/SliderComponent';
import CompararModal from '@/components/CompararModal';
import SuscribirModal from '@/components/SuscribirModal';
import EquipoModal from '@/components/EquipoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Importación dinámica del mapa sin SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div className="text-gray-500">Cargando mapa...</div>
    </div>
  )
});

interface Filters {
  hoteles: boolean;
  transporte: boolean;
  nivelRuido: boolean;
  densidadHabitantes: boolean;
  densidadTuristas: boolean;
  densidadTransporte: boolean;
  contaminacionSonora: boolean;
}

const TouristMapLayout: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    hoteles: false,
    transporte: false,
    nivelRuido: false,
    densidadHabitantes: false,
    densidadTuristas: false,
    densidadTransporte: false,
    contaminacionSonora: false
  });

  const [sliderValue, setSliderValue] = useState(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'comparar' | 'suscribir' | 'equipo' | null>(null);

  const toggleFilter = (filterKey: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const openModal = (modal: 'comparar' | 'suscribir' | 'equipo') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('es-ES');
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Título */}
            <div className="flex items-center">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                Mapa turístico BCN
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openModal('comparar')}
              >
                Comparar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openModal('suscribir')}
              >
                Suscribir
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openModal('equipo')}
              >
                Equipo
              </Button>
            </div>

            {/* Desktop Info */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-medium">Barcelona</span>
              <span>{date}</span>
              <span>{time}</span>
              <span className="text-lg">🌤️ 25°</span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰ Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
          {/* Map Area */}
          <div className="lg:col-span-3 relative">
            <Card className="h-full">
              <CardContent className="p-0 h-full relative">
                <MapComponent filters={filters} sliderValue={sliderValue} />
                
                {/* Slider */}
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 lg:right-4 z-50 slider-container">
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg">
                    <SliderComponent
                      value={sliderValue}
                      onChange={setSliderValue}
                      min={0}
                      max={100}
                      label="Densidad Turística"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Filtros Mapa</h3>
                  <div className="space-y-3">
                    {Object.entries(filters).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleFilter(key as keyof Filters)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Si quieres recibir actualidad turística de tu zona suscríbete
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => openModal('suscribir')}
                  >
                    Suscribir
                  </Button>
                </CardContent>
              </Card>

              {/* Comparison */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Quieres comparar los barrios y su densidad turística?
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal('comparar')}
                  >
                    Comparador
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden mobile-overlay">
          <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl z-50">
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Filtros</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Filtros Mapa</h3>
                <div className="space-y-3">
                  {Object.entries(filters).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleFilter(key as keyof Filters)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-6 border-t space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      openModal('suscribir');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Suscribir
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      openModal('comparar');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Comparador
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      openModal('equipo');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Equipo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CompararModal 
        isOpen={activeModal === 'comparar'} 
        onClose={closeModal} 
      />
      <SuscribirModal 
        isOpen={activeModal === 'suscribir'} 
        onClose={closeModal} 
      />
      <EquipoModal 
        isOpen={activeModal === 'equipo'} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default TouristMapLayout;
