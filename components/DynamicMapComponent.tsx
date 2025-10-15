'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/spinner';

// Componente de carga
const LoadingComponent = () => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
    <div className="text-center">
      <Spinner className="w-8 h-8 mb-2" />
      <div className="text-gray-500">Cargando mapa...</div>
    </div>
  </div>
);

// Importación dinámica del mapa sin SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <LoadingComponent />
});

export default MapComponent;
