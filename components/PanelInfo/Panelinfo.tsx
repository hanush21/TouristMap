'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Panelinfo.module.css';

interface Barrio {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface PanelInfoProps {
  barrio: Barrio | null;
  onClose: () => void;
}

const PanelInfo: React.FC<PanelInfoProps> = ({ barrio, onClose }) => {
  return (
    <motion.div
      className={styles.panel}
      initial={{ x: '-100%' }}
      animate={{ x: barrio ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className={styles.header}>
        <h2>{barrio?.name ?? ''}</h2>
        <button 
          onClick={onClose} 
          className={styles.closeBtn}
          type="button"
          aria-label="Cerrar panel"
        >
          <X size={22} />
        </button>
      </div>

      {barrio ? (
        <div className={styles.content}>
          <p><strong>ID:</strong> {barrio.id}</p>
          <p><strong>Latitud:</strong> {barrio.lat.toFixed(4)}</p>
          <p><strong>Longitud:</strong> {barrio.lon.toFixed(4)}</p>
          <p><strong>Descripción:</strong> Datos simulados del barrio {barrio.name}.</p>
        </div>
      ) : (
        <div className={styles.contentVacio}>
          <p>Selecciona un barrio para ver detalles.</p>
        </div>
      )}
    </motion.div>
  );
};

export default PanelInfo;