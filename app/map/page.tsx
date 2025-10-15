import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';


const Mapa = dynamic(() => import('../../components/Map/___OLD___Map'), {
  ssr: true,

});
export default function Map() {
  return (
    <div>
      <Mapa />
    </div>
  );
}