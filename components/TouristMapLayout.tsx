'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import SliderComponent from '@/components/SliderComponent';
import CompararModal from '@/components/CompararModal';
import SuscribirModal from '@/components/SuscribirModal';
import EquipoModal from '@/components/EquipoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Legend from '@/components/Legend/Legend';

// ⬇️ Importa el formulario principal y su lista por defecto
import TouristForm, { DEFAULT_NEIGHBORHOODS } from '@/components/forms/forms';

// Importación dinámica del mapa sin SSR (NO CAMBIADO)
const MapComponent = dynamic(() => import('./Map/MapComponent'), {
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

// ================= ValorarModal (NUEVO) =================
function ValorarModal({
  isOpen,
  onClose,
  neighborhoods,
}: {
  isOpen: boolean;
  onClose: () => void;
  neighborhoods: string[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border/60 shadow-lg">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-semibold">Valorar zona</h2>
          <Button variant="outline" size="sm" onClick={onClose}>✕</Button>
        </div>
        <CardContent className="pb-6 pt-4">
          <TouristForm
            submitUrl="/api/sendform"
            newsletterUrl="/api/newsletter"
            neighborhoods={neighborhoods}
            defaultValues={{}}
          />
        </CardContent>
      </Card>
    </div>
  );
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
  const [activeModal, setActiveModal] = useState<'comparar' | 'suscribir' | 'equipo' | 'valorar' | null>(null);

  const toggleFilter = (filterKey: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const openModal = (modal: 'comparar' | 'suscribir' | 'equipo' | 'valorar') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (estilo minimalista) */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Título (sin iconos extras) */}
            <div className="flex items-center">
              <div className=" text-black px-4 py-2 rounded-lg font-bold">
                Mapa turístico BCN
              </div>
            </div>

            {/* Desktop Navigation (AÑADIDO botón Valorar) */}
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
              <Button 
                size="sm"
                onClick={() => openModal('valorar')}
              >
                Valorar
              </Button>
            </div>

            {/* Desktop Info (ELIMINADO fecha/hora/clima para mantener minimal) */}

            {/* Mobile Menu Button (NO CAMBIADO) */}
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

      {/* Main Content (NO CAMBIADO tamaños/grilla) */}
      <main className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-4rem)]">
          {/* Map Area - Sin bordes redondeados (NO CAMBIADO) */}
          <div className="lg:col-span-3 relative h-full overflow-hidden">
            <MapComponent filters={filters} sliderValue={sliderValue} />
            
            {/* Slider flotante sobre el mapa (NO CAMBIADO) */}
            {filters.densidadTuristas && (
              <div className="relative">
                <div className="fixed bottom-4 left-4 z-[3000] w-1/2">
                  <div className="bg-white/80 p-1 md:p-4 shadow-lg rounded-md backdrop-blur-md">
                    <SliderComponent
                      value={sliderValue}
                      onChange={setSliderValue}
                      min={0}
                      max={100}
                      label="Densidad Turística"
                    />
                  </div>
                </div>
                <Legend />
              </div> 
            )}
          </div>
          
          {/* Desktop Sidebar (NO CAMBIADO salvo texto) */}
          <div className="hidden lg:block bg-white border-l">
            <div className="p-6 space-y-6 h-full overflow-y-auto">
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
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Overlay (NO ELIMINADO; añade acceso a Valorar) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
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
                  <Button 
                    className="w-full"
                    onClick={() => {
                      openModal('valorar');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Valorar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals (Newsletter y Comparador existentes + NUEVO Valorar) */}
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

      {/* Modal del formulario principal */}
      <ValorarModal
        isOpen={activeModal === 'valorar'}
        onClose={closeModal}
        neighborhoods={DEFAULT_NEIGHBORHOODS}
      />
    </div>
  );
};

export default TouristMapLayout;
