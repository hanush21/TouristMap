import React from 'react';
import styles from './Legend.module.css';

const Legend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.legendTitle}>Población</div>
      <div className={styles.legendScale}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#abd9e9' }}></span>
          <span className={styles.legendLabel}>Baja</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#fee090' }}></span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#fdae61' }}></span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#f46d43' }}></span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#d73027' }}></span>
          <span className={styles.legendLabel}>Alta</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;