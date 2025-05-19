"use client"
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
export default function Mapa() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_MAPBOX_KEY)
    if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) {
      console.error("Mapbox token is missing");
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [-74.5, 40],
        zoom: 9
      });
    }

    return () => {
      mapRef.current?.remove();
    }
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
}
