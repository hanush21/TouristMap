'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CompararModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BarrioData {
  codi_barri: string;
  nom_barri: string;
  nom_districte: string;
  poblacio_2024: number;
  densitat_hab_km2: number;
  turisme_mensual: {
    turisme_percentatge_districte: {
      juliol: string;
    };
  };
}

interface CoordenadasData {
  codi_barri: string;
  nom_barri: string;
  nom_districte: string;
  nivel_ruido: number;
  contaminacion_sonora: number;
  densidad_transporte: number;
  hoteles: number;
}

interface BarrioComparacion {
  codi_barri: string;
  nom_barri: string;
  nom_districte: string;
  poblacio_2024: number;
  densitat_hab_km2: number;
  densidadTuristas: number;
  densidadHabitantes: number;
  nivelRuido: number;
  contaminacionSonora: number;
  transporte: number;
  hoteles: number;
}

const CompararModal: React.FC<CompararModalProps> = ({ isOpen, onClose }) => {
  const [barriosSeleccionados, setBarriosSeleccionados] = useState<string[]>([]);
  const [barriosData, setBarriosData] = useState<BarrioData[]>([]);
  const [coordenadasData, setCoordenadasData] = useState<CoordenadasData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBarriosData();
    }
  }, [isOpen]);

  const loadBarriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [turismoResponse, coordenadasResponse] = await Promise.all([
        fetch('/data/datosturismo.json').then(res => res.json()),
        fetch('/data/coordenadas-barrios.json').then(res => res.json())
      ]);
      
      setBarriosData(turismoResponse);
      setCoordenadasData(coordenadasResponse);
      
    } catch (error) {
      console.error('Error cargando datos de barrios:', error);
      setError('Error al cargar los datos de comparación');
    } finally {
      setLoading(false);
    }
  };

  const toggleBarrio = (barrioId: string) => {
    setBarriosSeleccionados(prev => 
      prev.includes(barrioId) 
        ? prev.filter(id => id !== barrioId)
        : [...prev, barrioId]
    );
  };

  const getBarriosComparar = (): BarrioComparacion[] => {
    return barriosSeleccionados
      .map(barrioId => {
        const barrio = barriosData.find(b => b.codi_barri === barrioId);
        const coordenadas = coordenadasData.find(c => c.codi_barri === barrioId);
        
        if (!barrio || !coordenadas) return null;
        
        // Calcular densidad de turistas desde el porcentaje de julio
        const densidadTuristas = Math.round(
          parseFloat(barrio.turisme_mensual.turisme_percentatge_districte.juliol.replace('%', ''))
        );
        
        // Calcular densidad de habitantes (normalizada)
        const densidadHabitantes = Math.round((barrio.densitat_hab_km2 / 35000) * 100);
        
        return {
          codi_barri: barrio.codi_barri,
          nom_barri: barrio.nom_barri,
          nom_districte: barrio.nom_districte,
          poblacio_2024: barrio.poblacio_2024,
          densitat_hab_km2: barrio.densitat_hab_km2,
          densidadTuristas: Math.min(100, densidadTuristas),
          densidadHabitantes: Math.min(100, densidadHabitantes),
          nivelRuido: coordenadas.nivel_ruido,
          contaminacionSonora: coordenadas.contaminacion_sonora,
          transporte: coordenadas.densidad_transporte,
          hoteles: coordenadas.hoteles
        };
      })
      .filter(Boolean) as BarrioComparacion[];
  };

  const getColorIntensity = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[100] p-4 modal-backdrop" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Comparar los 10 Barrios Más Turísticos de Barcelona</CardTitle>
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Cargando datos de comparación...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <>
          {/* Selección de barrios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecciona los barrios a comparar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {barriosData.map((barrio) => (
                <div
                  key={barrio.codi_barri}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    barriosSeleccionados.includes(barrio.codi_barri)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => toggleBarrio(barrio.codi_barri)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{barrio.nom_barri}</span>
                      <p className="text-xs text-gray-500">{barrio.nom_districte}</p>
                    </div>
                    {barriosSeleccionados.includes(barrio.codi_barri) && (
                      <Badge variant="default">Seleccionado</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparación */}
          {barriosSeleccionados.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Comparación:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Barrio</th>
                      <th className="text-center p-2 font-semibold">Distrito</th>
                      <th className="text-center p-2 font-semibold">Población</th>
                      <th className="text-center p-2 font-semibold">Densidad Turistas</th>
                      <th className="text-center p-2 font-semibold">Densidad Habitantes</th>
                      <th className="text-center p-2 font-semibold">Nivel Ruido</th>
                      <th className="text-center p-2 font-semibold">Contaminación Sonora</th>
                      <th className="text-center p-2 font-semibold">Transporte</th>
                      <th className="text-center p-2 font-semibold">Hoteles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBarriosComparar().map((barrio) => (
                      <tr key={barrio.codi_barri} className="border-b">
                        <td className="p-2 font-medium">{barrio.nom_barri}</td>
                        <td className="p-2 text-center text-sm text-gray-600">{barrio.nom_districte}</td>
                        <td className="p-2 text-center text-sm">{barrio.poblacio_2024.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.densidadTuristas)}`} />
                            <span className="ml-2 text-sm">{barrio.densidadTuristas}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.densidadHabitantes)}`} />
                            <span className="ml-2 text-sm">{barrio.densidadHabitantes}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.nivelRuido)}`} />
                            <span className="ml-2 text-sm">{barrio.nivelRuido} dB</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.contaminacionSonora)}`} />
                            <span className="ml-2 text-sm">{barrio.contaminacionSonora}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.transporte)}`} />
                            <span className="ml-2 text-sm">{barrio.transporte}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-4 rounded ${getColorIntensity(barrio.hoteles * 2)}`} />
                            <span className="ml-2 text-sm">{barrio.hoteles}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompararModal;
