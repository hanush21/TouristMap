# 🗺️ Mapa Turístico Barcelona

Una aplicación web interactiva para visualizar información turística de Barcelona con filtros avanzados y análisis de densidad por barrios.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Mapa Interactivo**: Visualización de Barcelona con Leaflet
- **Mapa de Calor**: Densidad turística ajustable con slider
- **Filtros Avanzados**: Hoteles, transporte, ruido, densidad de habitantes, etc.
- **Comparación de Barrios**: Modal para comparar métricas entre barrios
- **Sistema de Suscripción**: Formulario para recibir actualizaciones
- **Diseño Responsive**: Adaptado para móvil y desktop

### 🎯 Filtros Disponibles
- 🏨 **Hoteles**: Ubicaciones y cantidad de hoteles por barrio
- 🚇 **Transporte**: Densidad de transporte público
- 🔊 **Nivel de Ruido**: Contaminación sonora por zonas
- 👥 **Densidad de Habitantes**: Población por km²
- 🎒 **Densidad de Turistas**: Actividad turística (controlada por slider)
- 🚌 **Densidad de Transporte**: Accesibilidad del transporte público
- 🌡️ **Contaminación Sonora**: Niveles de ruido ambiental

### 📊 Datos Utilizados
- **Datos Reales**: Información oficial de barrios de Barcelona
- **Coordenadas**: Ubicaciones precisas de cada barrio
- **Métricas Turísticas**: Datos mensuales de turismo por distrito
- **Información de Transporte**: Metro, bus, tranvía por barrio

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Leaflet** - Mapas interactivos
- **React-Leaflet** - Integración React-Leaflet

### Backend (Futuro)
- **Java** - Backend en desarrollo
- **Axios** - Cliente HTTP configurado

## 📁 Estructura del Proyecto

```
TouristMap/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── mapa/
│   │   └── page.tsx
│   └── leaflet.css
├── components/
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── MapComponent.tsx
│   ├── SliderComponent.tsx
│   ├── CompararModal.tsx
│   ├── SuscribirModal.tsx
│   ├── EquipoModal.tsx
│   └── TouristMapLayout.tsx
├── data/
│   └── transporte-barrios.json
├── lib/
│   ├── utils.ts
│   └── api.ts
└── public/
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd TouristMap

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Acceso
- **Página Principal**: `http://localhost:3000`
- **Mapa Interactivo**: `http://localhost:3000/mapa`

## 🎮 Cómo Usar

### 1. Navegación
- **Desktop**: Usa los botones en el header y el sidebar derecho
- **Mobile**: Usa el menú hamburguesa (☰ Filtros)

### 2. Filtros del Mapa
- Activa/desactiva filtros según tus necesidades
- El slider controla la intensidad del mapa de calor turístico
- Los marcadores aparecen según los filtros seleccionados

### 3. Comparación de Barrios
- Haz clic en "Comparar" para abrir el modal
- Selecciona múltiples barrios
- Visualiza métricas comparativas en tabla

### 4. Suscripción
- Haz clic en "Suscribir" para recibir actualizaciones
- Completa el formulario con tus preferencias
- Selecciona barrios de interés

## 📊 Datos y Métricas

### Fuentes de Datos
- **API Backend**: Datos dinámicos de turismo y coordenadas desde `http://localhost:8080/api`
  - `/neighborhoods/full-data`: Datos completos de turismo por barrio
  - `/summary/full-data`: Ubicaciones y métricas adicionales
- **transporte-barrios.json**: Información de transporte público (archivo estático)

### Métricas Calculadas
- **Densidad Turística**: Basada en puntos de interés y datos oficiales
- **Densidad de Habitantes**: Población por km² normalizada
- **Nivel de Ruido**: Datos simulados por zona
- **Accesibilidad**: Densidad de transporte público

## 🔧 Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Personalización
- **Colores del Mapa**: Modifica `getHeatmapColor()` en `MapComponent.tsx`
- **Filtros**: Agrega nuevos filtros en `TouristMapLayout.tsx`
- **Datos**: Los datos principales ahora vienen de APIs dinámicas

## 🤝 Contribución

### Equipo de Desarrollo
- **Ana García** - Project Manager
- **Carlos Rodríguez** - Frontend Developer
- **María López** - Backend Developer
- **David Martínez** - GIS Specialist
- **Laura Fernández** - UX/UI Designer
- **Javier Ruiz** - Data Analyst

### Roadmap
- [ ] Integración con backend Java
- [ ] Autenticación de usuarios
- [ ] Más tipos de datos (tráfico, eventos)
- [ ] Exportación de datos
- [ ] Notificaciones push

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 📞 Contacto

- **Proyecto**: Hackathon Taula3
- **Ciudad**: Barcelona, España
- **Versión**: 1.0.0
- **Estado**: En desarrollo activo

---

*Desarrollado con ❤️ para mejorar la experiencia turística de Barcelona*