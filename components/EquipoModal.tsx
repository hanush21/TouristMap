'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  avatar: string;
  link?: string;
}

const EquipoModal: React.FC<EquipoModalProps> = ({ isOpen, onClose }) => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      nombre: 'Marc Guillem Palacios',
      rol: 'Backend Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQGKMpt6zdxgOg/profile-displayphoto-scale_400_400/B4EZkVsV_LIIAo-/0/1757005570758?e=1763596800&v=beta&t=Id7oIwSNvWOZFkwSRnVDRuKK3nZkbRF0hwSzzOODJZQ',
      link: 'https://www.linkedin.com/in/marc-g-p'
    },
    {
      id: '2',
      nombre: 'Danilo Espinosa',
      rol: 'Frontend Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D35AQELjccFEimaQw/profile-framedphoto-shrink_800_800/B4DZlSKtabJcAg-/0/1758020163596?e=1761166800&v=beta&t=A_7397b4EC8znfRLM1XwEAvOM-dNHT2cgTjHQGPotvg',
      link: 'https://www.linkedin.com/in/danilo-espinosa-web/'
    },
     {
      id: '3',
      nombre: 'Cristiana Sollini',
      rol: 'Frontend Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQE4gfdcPqmjDQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726168728776?e=1763596800&v=beta&t=7mPTu-COIitZA71EuV8zgKpXGbrAZqK2KLIRMUEjjes',
      link: 'https://www.linkedin.com/in/cristianasollini/'
    },
     {
      id: '4',
      nombre: 'Albert Grau',
      rol: 'Backend Developer',
      avatar: 'https://avatars.githubusercontent.com/u/146814602?v=4',
      link: 'https://github.com/AlbertGrauL'
    },
    {
      id: '5',
      nombre: 'Luis Ricardo Gutiérrez Soliz',
      rol: 'Backend Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4E35AQEhg8HBmuUCgQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1680953306303?e=1761170400&v=beta&t=rT3nAG1rsYzRSRBS4drg6VW9wvZE7VzqPEfGaadbXJs',
      link: 'https://www.linkedin.com/in/luis-ricardo-guti%C3%A9rrez-soliz/'
    },
    {
      id: '6',
      nombre: 'Richard Hernández Montero',
      rol: 'Frontend Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHjIXnqRCqBvQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1713959457616?e=1763596800&v=beta&t=bSzKu1BAFBYM0xcP7bv6ow3jk3IcqolfOWCBoCKzIXk',
      link: 'https://www.linkedin.com/in/richard-hernandez21/'
    },
    // ... otros miembros
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"  >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
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
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
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
                <Card key={member.id} className="p-4 flex flex-col items-center text-center hover:bg-blue-50 transition">
                  {member.link ? (
                    <a href={member.link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={member.avatar}
                        alt={member.nombre}
                        className="w-16 h-16 rounded-full mb-2 object-cover border border-gray-200 shadow-sm"
                      />
                    </a>
                  ) : (
                    <img
                      src={member.avatar}
                      alt={member.nombre}
                      className="w-16 h-16 rounded-full mb-2 object-cover border border-gray-200 shadow-sm"
                    />
                  )}
                  <h3 className="font-semibold text-gray-800 text-sm">{member.nombre}</h3>
                  <p className="text-blue-600 text-xs font-medium">{member.rol}</p>
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

         

          {/* Botón de cierre */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipoModal;
