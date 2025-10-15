'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  especialidad: string[];
  avatar?: string;
}

const EquipoModal: React.FC<EquipoModalProps> = ({ isOpen, onClose }) => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      nombre: 'Ana García',
      rol: 'Project Manager',
      descripcion: 'Experta en gestión de proyectos turísticos y análisis de datos urbanos.',
      especialidad: ['Gestión de Proyectos', 'Análisis de Datos', 'Turismo Sostenible']
    },
    {
      id: '2',
      nombre: 'Carlos Rodríguez',
      rol: 'Desarrollador Frontend',
      descripcion: 'Especialista en React, Next.js y desarrollo de interfaces de usuario.',
      especialidad: ['React', 'Next.js', 'TypeScript', 'UI/UX']
    },
    {
      id: '3',
      nombre: 'María López',
      rol: 'Desarrolladora Backend',
      descripcion: 'Experta en arquitectura de sistemas y APIs para aplicaciones de mapas.',
      especialidad: ['Node.js', 'Python', 'APIs REST', 'Bases de Datos']
    },
    {
      id: '4',
      nombre: 'David Martínez',
      rol: 'Especialista en GIS',
      descripcion: 'Experto en sistemas de información geográfica y análisis espacial.',
      especialidad: ['GIS', 'Leaflet', 'Análisis Espacial', 'Cartografía']
    },
    {
      id: '5',
      nombre: 'Laura Fernández',
      rol: 'Diseñadora UX/UI',
      descripcion: 'Especialista en diseño centrado en el usuario y experiencia móvil.',
      especialidad: ['Diseño UX', 'Figma', 'Prototipado', 'Design System']
    },
    {
      id: '6',
      nombre: 'Javier Ruiz',
      rol: 'Analista de Datos',
      descripcion: 'Experto en análisis de datos turísticos y patrones de movilidad urbana.',
      especialidad: ['Python', 'Machine Learning', 'Análisis Estadístico', 'Visualización']
    }
  ];

  const projectInfo = {
    nombre: 'Mapa Turístico Barcelona',
    descripcion: 'Una plataforma innovadora que combina tecnología GIS, análisis de datos en tiempo real y diseño centrado en el usuario para proporcionar información turística completa de Barcelona.',
    objetivos: [
      'Proporcionar información turística en tiempo real',
      'Analizar patrones de densidad turística',
      'Mejorar la experiencia del visitante',
      'Apoyar la planificación urbana sostenible',
      'Facilitar la toma de decisiones informadas'
    ],
    tecnologias: [
      'Next.js', 'React', 'TypeScript', 'Leaflet', 'Tailwind CSS',
      'shadcn/ui', 'Axios', 'Node.js', 'Python', 'PostgreSQL'
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[100] p-4 modal-backdrop">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Sobre Nosotros</CardTitle>
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Información del proyecto */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{projectInfo.nombre}</h2>
            <p className="text-gray-600 mb-4">{projectInfo.descripcion}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Objetivos del Proyecto</h3>
                <ul className="space-y-2">
                  {projectInfo.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Tecnologías Utilizadas</h3>
                <div className="flex flex-wrap gap-2">
                  {projectInfo.tecnologias.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {member.nombre.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{member.nombre}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-2">{member.rol}</p>
                    <p className="text-gray-600 text-sm mb-3">{member.descripcion}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.especialidad.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Información del Proyecto</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Versión:</strong> 1.0.0</p>
                <p><strong>Fecha de Lanzamiento:</strong> Octubre 2024</p>
                <p><strong>Licencia:</strong> MIT</p>
              </div>
              <div>
                <p><strong>Desarrollado para:</strong> Hackathon Taula3</p>
                <p><strong>Ciudad:</strong> Barcelona, España</p>
                <p><strong>Estado:</strong> En desarrollo activo</p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3">¿Tienes preguntas?</h3>
            <p className="text-gray-600 mb-4">
              Estamos siempre abiertos a sugerencias y mejoras para hacer de esta plataforma una herramienta más útil para todos.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                Contactar Equipo
              </Button>
              <Button variant="outline" size="sm">
                Reportar Bug
              </Button>
              <Button variant="outline" size="sm">
                Sugerir Mejora
              </Button>
            </div>
          </div>

          {/* Botón de cierre */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipoModal;
