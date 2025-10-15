'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

  useEffect(() => {
    setIsClient(true);
    // Cargar datos de los barrios
    loadBarriosData();
  }, []);

  const loadBarriosData = async () => {
    try {
      const response = await fetch('/data/coordenadas-barrios.json');
      if (!response.ok) {
        throw new Error(`Error al cargar datos de barrios: ${response.status}`);
      }
      const data = await response.json();
      console.log('Datos de barrios cargados correctamente:', data.length, 'barrios');
      setBarriosData(data);
    } catch (error) {
      console.error('Error cargando datos de barrios:', error);
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

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={barcelonaCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        
        {/* Marcadores de hoteles */}
        {filters?.hoteles && barriosData
          .filter(barrio => barrio.hoteles > 0)
          .map((barrio) => (
            <Marker key={`hotel-${barrio.codi_barri}`} position={barrio.coordenadas}>
              <Popup>
                <div>
                  <h3 className="font-semibold">{barrio.nom_barri}</h3>
                  <p className="text-sm text-gray-600">Hoteles: {barrio.hoteles}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    🏨 Hoteles
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Marcadores de transporte */}
        {filters?.transporte && barriosData
          .filter(barrio => barrio.densidad_transporte > 70)
          .map((barrio) => (
            <Marker key={`transport-${barrio.codi_barri}`} position={barrio.coordenadas}>
              <Popup>
                <div>
                  <h3 className="font-semibold">{barrio.nom_barri}</h3>
                  <p className="text-sm text-gray-600">Densidad transporte: {barrio.densidad_transporte}%</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    🚇 Transporte
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Marcadores de ruido */}
        {filters?.nivelRuido && barriosData
          .filter(barrio => barrio.nivel_ruido > 70)
          .map((barrio) => (
            <Marker key={`noise-${barrio.codi_barri}`} position={barrio.coordenadas}>
              <Popup>
                <div>
                  <h3 className="font-semibold">{barrio.nom_barri}</h3>
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
                    🔊 Ruido
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
