import axios from 'axios';

// Configuración base de axios para la aplicación
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/backend',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si es necesario
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Redirigir al login si es necesario
      console.log('No autorizado');
    }
    return Promise.reject(error);
  }
);

export default api;

// Funciones específicas para la API del mapa turístico
export const mapAPI = {
  // Obtener datos completos de turismo por barrios (reemplaza datosturismo.json)
  getTourismData: () => {
    return api.get('/neighborhoods/full-data');
  },

  // Obtener datos completos de coordenadas y métricas (reemplaza coordenadas-barrios.json)
  getCoordinatesData: () => {
    return api.get('/summary/full-data');
  },

  // Obtener datos de puntos de interés
  getPointsOfInterest: (filters: any) => {
    return api.get('/points-of-interest', { params: filters });
  },

  // Obtener datos de densidad turística
  getTouristDensity: (area: string) => {
    return api.get(`/tourist-density/${area}`);
  },

  // Obtener datos de ruido
  getNoiseData: (area: string) => {
    return api.get(`/noise-data/${area}`);
  },

  // Obtener datos de transporte
  getTransportData: (area: string) => {
    return api.get(`/transport-data/${area}`);
  },

  // Enviar suscripción
  subscribeUser: (data: any) => {
    return api.post('/subscribe', data);
  },

  // Obtener datos de comparación de barrios
  getNeighborhoodComparison: (neighborhoods: string[]) => {
    return api.post('/compare-neighborhoods', { neighborhoods });
  },
};
