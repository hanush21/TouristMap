'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import SliderComponent from '@/components/SliderComponent';
import CompararModal from '@/components/CompararModal';
import SuscribirModal from '@/components/SuscribirModal';
import EquipoModal from '@/components/EquipoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TouristForm, { DEFAULT_NEIGHBORHOODS } from '@/components/forms/forms';

// Importación dinámica del mapa sin SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center rounded-xl border border-dashed text-muted-foreground">
      <div className="text-sm">Cargando mapa…</div>
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

// ================= ValorarModal =================
function ValorarModal({ isOpen, onClose, neighborhoods }: { isOpen: boolean; onClose: () => void; neighborhoods: string[] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border/60 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Valorar zona</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>
        <CardContent className="pb-6">
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

const TouristMapLayout: React.FC<{ searchParams?: { barrios?: string } }> = ({ searchParams }) => {
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

  const neighborhoods = searchParams?.barrios
    ? searchParams.barrios.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_NEIGHBORHOODS;

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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="text-base sm:text-lg font-medium tracking-tight">Mapa turístico BCN</div>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => openModal('comparar')}>Comparar</Button>
              <Button variant="outline" size="sm" onClick={() => openModal('suscribir')}>Suscribir</Button>
              <Button variant="outline" size="sm" onClick={() => openModal('equipo')}>Equipo</Button>
              <Button size="sm" onClick={() => openModal('valorar')}>Valorar</Button>
            </div>

            <div className="md:hidden">
              <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰ Menú</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
          <div className="lg:col-span-3 relative rounded-xl overflow-hidden">
            <Card className="h-full border-0 shadow-none bg-transparent">
              <CardContent className="p-0 h-full relative">
                <div className="absolute inset-0">
                  <MapComponent filters={filters} sliderValue={sliderValue} />
                </div>

                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-50">
                  <div className="rounded-xl border bg-background/80 backdrop-blur px-4 py-3 shadow-sm">
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

          <div className="hidden lg:block">
            <div className="space-y-6">
              <Card className="border">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold mb-4">Filtros del mapa</h3>
                  <div className="space-y-3">
                    {Object.entries(filters).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleFilter(key as keyof Filters)}
                          className="rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm capitalize text-foreground/90">
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

      <CompararModal isOpen={activeModal === 'comparar'} onClose={closeModal} />
      <SuscribirModal isOpen={activeModal === 'suscribir'} onClose={closeModal} />
      <EquipoModal isOpen={activeModal === 'equipo'} onClose={closeModal} />
      <ValorarModal isOpen={activeModal === 'valorar'} onClose={closeModal} neighborhoods={neighborhoods} />
    </div>
  );
};

export default TouristMapLayout;
