'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';
import { mapAPI } from '../../lib/api';


// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Crear icono personalizado para hoteles
const hotelIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" width="24" height="24">
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Crear icono personalizado para transporte
const transportIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#059669" width="24" height="24">
      <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 4.57 18 5.5 18L4 19.5v.5h2.23l2-2H15.77l2 2H20v-.5L18.5 18c.93 0 1.5-.57 1.5-1.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 14 16.5 14s1.5.67 1.5 1.5S17.33 17 16.5 17zm1.5-6H6V6h12v5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Crear icono personalizado para ruido
const noiseIcon = new L.Icon({
   iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="24" height="24">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="6" fill="none" stroke="#dc2626" stroke-width="2"/>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#dc2626" stroke-width="1"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

interface MapComponentProps {
  filters?: {
    hoteles: boolean;
    transporte: boolean;
    nivelRuido: boolean;
    densidadHabitantes: boolean;
    densidadTuristas: boolean;
    densidadTransporte: boolean;
    contaminacionSonora: boolean;
  };
  sliderValue?: number;
}

interface BarrioData {
  codi_barri: string;
  nom_barri: string;
  coordenadas: [number, number];
  nivel_ruido: number;
  contaminacion_sonora: number;
  densidad_transporte: number;
  hoteles: number;
  puntos_interes: number;
}

// Componente interno para actualizar el mapa cuando cambien los filtros
function MapUpdater({ filters, sliderValue }: MapComponentProps) {
  const map = useMap();

  useEffect(() => {
    // Aquí puedes agregar lógica para actualizar el mapa basado en los filtros
    console.log('Filtros actualizados:', filters);
    console.log('Valor del slider:', sliderValue);
  }, [filters, sliderValue]);

  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ filters, sliderValue }) => {
  const [isClient, setIsClient] = useState(false);
  const [barriosData, setBarriosData] = useState<BarrioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Cargar datos de los barrios
    loadBarriosData();
  }, []);

  const loadBarriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mapAPI.getCoordinatesData();
      console.log('Datos de barrios cargados correctamente:', response.data.length, 'barrios');
      setBarriosData(response.data);
    } catch (error) {
      console.error('Error cargando datos de barrios:', error);
      setError('Error al cargar los datos del mapa');
      // Datos de fallback en caso de error
      setBarriosData([
        {
          codi_barri: '01-1',
          nom_barri: 'El Raval',
          coordenadas: [41.3809, 2.1722],
          nivel_ruido: 85,
          contaminacion_sonora: 78,
          densidad_transporte: 95,
          hoteles: 45,
          puntos_interes: 12
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Coordenadas de Barcelona
  const barcelonaCenter: [number, number] = [41.3851, 2.1734];

  // Función para obtener el color del mapa de calor basado en el valor del slider
  const getHeatmapColor = (value: number, maxValue: number = 100) => {
    const intensity = Math.min(value / maxValue, 1);
    
    if (intensity >= 0.8) return '#ff0000'; // Rojo intenso
    if (intensity >= 0.6) return '#ff6600'; // Naranja
    if (intensity >= 0.4) return '#ffcc00'; // Amarillo
    if (intensity >= 0.2) return '#66ff00'; // Verde claro
    return '#00ff00'; // Verde
  };

  // Función para obtener el radio del círculo basado en la densidad
  const getCircleRadius = (value: number, maxValue: number = 100) => {
    const intensity = Math.min(value / maxValue, 1);
    return Math.max(50, intensity * 300); // Radio entre 50 y 300 metros
  };

  // Función para obtener la opacidad del círculo
  const getCircleOpacity = (value: number, maxValue: number = 100) => {
    const intensity = Math.min(value / maxValue, 1);
    return Math.max(0.1, intensity * 0.7); // Opacidad entre 0.1 y 0.7
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Cargando datos del mapa...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={barcelonaCenter}
        zoom={13}
        zoomControl={false} 
        attributionControl={false} 
        minZoom={11} 
        maxZoom={16} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater filters={filters} sliderValue={sliderValue} />
        
        {/* Mapa de calor de densidad turística */}
        {filters?.densidadTuristas && barriosData.map((barrio) => {
          // Calcular densidad turística basada en el slider
          const densidadTuristica = Math.min(100, (barrio.puntos_interes * 10) + (sliderValue || 0) / 2);
          
          return (
            <Circle
              key={`heatmap-${barrio.codi_barri}`}
              center={barrio.coordenadas}
              radius={getCircleRadius(densidadTuristica)}
              pathOptions={{
                fillColor: getHeatmapColor(densidadTuristica),
                color: getHeatmapColor(densidadTuristica),
                weight: 2,
                opacity: 0.8,
                fillOpacity: getCircleOpacity(densidadTuristica)
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{barrio.nom_barri}</h3>
                  <p className="text-sm text-gray-600">
                    Densidad turística: {Math.round(densidadTuristica)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Puntos de interés: {barrio.puntos_interes}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${densidadTuristica}%`,
                          backgroundColor: getHeatmapColor(densidadTuristica)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}
        
        {/* Marcadores de hoteles con icono personalizado */}
        {filters?.hoteles && barriosData
          .filter(barrio => barrio.hoteles > 0)
          .map((barrio) => (
            <Marker 
              key={`hotel-${barrio.codi_barri}`} 
              position={barrio.coordenadas}
              icon={hotelIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    🏨 {barrio.nom_barri}
                  </h3>
                  <p className="text-sm text-gray-600">Hoteles: {barrio.hoteles}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Zona hotelera
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Marcadores de transporte con icono personalizado */}
        {filters?.transporte && barriosData
          .filter(barrio => barrio.densidad_transporte > 70)
          .map((barrio) => (
            <Marker 
              key={`transport-${barrio.codi_barri}`} 
              position={barrio.coordenadas}
              icon={transportIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    🚇 {barrio.nom_barri}
                  </h3>
                  <p className="text-sm text-gray-600">Densidad transporte: {barrio.densidad_transporte}%</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Alto transporte
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Marcadores de ruido con icono personalizado */}
        {filters?.nivelRuido && barriosData
          .filter(barrio => barrio.nivel_ruido > 70)
          .map((barrio) => (
            <Marker 
              key={`noise-${barrio.codi_barri}`} 
              position={barrio.coordenadas}
              icon={noiseIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    🔊 {barrio.nom_barri}
                  </h3>
                  <p className="text-sm text-gray-600">Nivel de ruido: {barrio.nivel_ruido} dB</p>
                  <p className="text-sm text-gray-600">Contaminación sonora: {barrio.contaminacion_sonora}%</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          barrio.nivel_ruido > 80 ? 'bg-red-500' : 
                          barrio.nivel_ruido > 60 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${barrio.nivel_ruido}%` }}
                      />
                    </div>
                  </div>
                  <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Alto ruido
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      
   
    </div>
  );
};

export default MapComponent;