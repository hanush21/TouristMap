'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SuscribirModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  email: string;
  barriosInteres: string[];
  tipoNotificaciones: string[];
  frecuencia: string;
  comentarios: string;
}

const SuscribirModal: React.FC<SuscribirModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    barriosInteres: [],
    tipoNotificaciones: [],
    frecuencia: 'semanal',
    comentarios: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const barrios = [
    'Ciutat Vella',
    'Eixample', 
    'Gràcia',
    'Sants-Montjuïc',
    'Sarrià-Sant Gervasi',
    'Les Corts',
    'Horta-Guinardó',
    'Nou Barris',
    'Sant Andreu',
    'Sant Martí'
  ];

  const tiposNotificaciones = [
    { id: 'eventos', label: 'Eventos y actividades' },
    { id: 'trafico', label: 'Información de tráfico' },
    { id: 'turismo', label: 'Densidad turística' },
    { id: 'ruido', label: 'Niveles de ruido' },
    { id: 'transporte', label: 'Estado del transporte' },
    { id: 'seguridad', label: 'Información de seguridad' }
  ];

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'barriosInteres' | 'tipoNotificaciones', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí harías la llamada real al backend
      console.log('Datos enviados:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      barriosInteres: [],
      tipoNotificaciones: [],
      frecuencia: 'semanal',
      comentarios: ''
    });
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 modal-backdrop">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">¡Suscripción Exitosa!</h2>
            <p className="text-gray-600 mb-6">
              Te has suscrito correctamente. Recibirás actualizaciones sobre los barrios seleccionados.
            </p>
            <div className="space-y-3">
              <Button onClick={resetForm} className="w-full">
                Nueva Suscripción
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 modal-backdrop">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Suscribirse a Actualizaciones</CardTitle>
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Barrios de interés */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Barrios de Interés</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {barrios.map((barrio) => (
                  <div
                    key={barrio}
                    className={`p-2 border rounded cursor-pointer transition-all ${
                      formData.barriosInteres.includes(barrio)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => toggleArrayItem('barriosInteres', barrio)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{barrio}</span>
                      {formData.barriosInteres.includes(barrio) && (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de notificaciones */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tipo de Notificaciones</h3>
              <div className="space-y-2">
                {tiposNotificaciones.map((tipo) => (
                  <label key={tipo.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tipoNotificaciones.includes(tipo.id)}
                      onChange={() => toggleArrayItem('tipoNotificaciones', tipo.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frecuencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de Notificaciones
              </label>
              <select
                value={formData.frecuencia}
                onChange={(e) => handleInputChange('frecuencia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios Adicionales
              </label>
              <textarea
                value={formData.comentarios}
                onChange={(e) => handleInputChange('comentarios', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cuéntanos qué te interesa saber sobre Barcelona..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || formData.barriosInteres.length === 0}
              >
                {isSubmitting ? 'Enviando...' : 'Suscribirse'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuscribirModal;
