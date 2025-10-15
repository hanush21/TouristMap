'use client';

import React, { useMemo } from 'react';
import data from '../data/datosturismo.json';

interface BarrioData {
  codi_barri: string;
  nom_barri: string;
  codi_districte: string;
  nom_districte: string;
  poblacio_2024: number;
  densitat_hab_km2: number;
  turisme_mensual: {
    turistes_absolut_districte_simulat: Record<string, number>;
  };
}

const TopBarriosTuristicos: React.FC = () => {
  const barrios: BarrioData[] = data as BarrioData[];

  const topBarrios = useMemo(() => {
    return barrios
      .map(b => {
        const totalTuristas = Object.values(b.turisme_mensual.turistes_absolut_districte_simulat).reduce(
          (acc, val) => acc + val,
          0
        );
        const promedio = totalTuristas / 12;
        return { ...b, promedio };
      })
      .sort((a, b) => b.promedio - a.promedio)
      .slice(0, 5);
  }, [barrios]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 w-full border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
        Top 5 barrios más turísticos
      </h2>

      <ul className="divide-y divide-gray-100">
        {topBarrios.map((barrio, index) => (
          <li
            key={barrio.codi_barri}
            className="flex justify-between items-center py-2 hover:bg-blue-50/60 rounded-md transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 w-4">{index + 1}</span>
              <div>
                <p className="text-xs font-medium text-gray-800 leading-tight">{barrio.nom_barri}</p>
                <p className="text-[10px] text-gray-500">{barrio.nom_districte}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-gray-700">
                {Math.round(barrio.promedio).toLocaleString('es-ES')}
              </p>
              <p className="text-[10px] text-gray-400">turistas/mes</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopBarriosTuristicos;
