import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('../presentation/components/Map/Map'),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <MapComponent />
    </div>
  );
}
