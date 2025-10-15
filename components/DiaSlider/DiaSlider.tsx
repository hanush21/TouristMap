'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './DiaSlider.module.css';

interface Props {
  dia: number;
  maxDia: number;
  onChange: (value: number) => void;
}

const DiaSlider = ({ dia, maxDia, onChange }: Props) => {
  return (
    <div className={styles.sliderContainer}>
      <p className={styles.sliderLabel}>Día: {dia + 1}</p>
      <Slider
        min={0}
        max={maxDia}
        value={dia}
        onChange={(value) => onChange(value as number)}
        trackStyle={{ backgroundColor: '#007bff', height: 8 }}
        handleStyle={{
          borderColor: '#007bff',
          height: 20,
          width: 20,
          marginTop: -6,
          backgroundColor: '#fff',
        }}
        railStyle={{ backgroundColor: '#ddd', height: 8 }}
      />
    </div>
  );
};

export default DiaSlider;
