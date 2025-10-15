'use client';

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { useState } from 'react';
import styles from './Map.module.css';
import PanelInfo from '../PanelInfo/Panelinfo';
import DiaSlider from '../DiaSlider/DiaSlider';
import { datosPoblacionPorDia, DatosPoblacionItem } from '../../lib/data/datostest';

interface Barrio {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const barrios: Barrio[] = [
  { id: 'barri1', name: 'El Raval', lat: 41.375, lon: 2.168 },
  { id: 'barri2', name: 'El Gòtic', lat: 41.38, lon: 2.175 },
  { id: 'barri3', name: 'Sant Pere', lat: 41.385, lon: 2.18 },
];

const Mapa: React.FC = () => {
  const [dia, setDia] = useState<number>(0);
  const [barrioSeleccionado, setBarrioSeleccionado] = useState<Barrio | null>(null);

  const getColor = (value: number): string => {
    return value > 80 ? '#800026' :
           value > 60 ? '#BD0026' :
           value > 40 ? '#E31A1C' :
           value > 20 ? '#FC4E2A' :
           value > 10 ? '#FD8D3C' :
           value > 0  ? '#FEB24C' :
                        '#FFEDA0';
  };

  const handleCircleClick = (barrio: Barrio): void => {
    setBarrioSeleccionado(barrio);
  };

  const handleClosePanel = (): void => {
    setBarrioSeleccionado(null);
  };

  const handleDiaChange = (nuevoDia: number): void => {
    setDia(nuevoDia);
  };

  return (
    <div className={styles.mapWrapper}>
      {/* Panel lateral */}
      <PanelInfo 
        barrio={barrioSeleccionado} 
        onClose={handleClosePanel} 
      />

      {/* Mapa principal */}
      <MapContainer
        center={[41.3851, 2.1734]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {barrios.map((barrio) => {
          const rawValue = (datosPoblacionPorDia[dia] as DatosPoblacionItem)[barrio.id];
          const intensidad: number = typeof rawValue === 'number' ? rawValue : Math.floor(Math.random() * 100);
          const color: string = getColor(intensidad);

          return (
            <CircleMarker
              key={`${barrio.id}-${dia}`}
              center={[barrio.lat, barrio.lon]}
              radius={18}
              fillColor={color}
              color="white"
              weight={2}
              fillOpacity={0.9}
              eventHandlers={{
                click: () => handleCircleClick(barrio),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Componente slider */}
      <DiaSlider
        dia={dia}
        maxDia={datosPoblacionPorDia.length - 1}
        onChange={handleDiaChange}
      />
    </div>
  );
};

export default Mapa;