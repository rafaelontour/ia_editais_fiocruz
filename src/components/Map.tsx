"use client"
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';


type LngLatBoundsLike =
  | [[number, number], [number, number]]
  | [number, number, number, number];

export default function MapaRender() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const brazilBounds : LngLatBoundsLike = [
    [-74.0, -34.0], // Southwest coordinates
    [-34.0, 5.5]    // Northeast coordinates
  ];


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
        style: 'mapbox://styles/verttb/cmav7e36p00vx01sd6w6h9690', 
        center: [-55, -14],
        zoom: 4,
        maxBounds: brazilBounds,
      });
    }

    return () => {
      mapRef.current?.remove();
    }
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
}
