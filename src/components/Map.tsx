"use client"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

type LngLatBoundsLike =
  | [[number, number], [number, number]]
  | [number, number, number, number]

export default function MapaRender() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [geojsonData, setGeojsonData] = useState<any>(null)

  const brazilBounds: LngLatBoundsLike = [
    [-74.0, -34.0],
    [-34.0, 5.5]
  ]

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/instituicoes_bahia.geojson")
      const data = await res.json()
      setGeojsonData(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!geojsonData || !mapContainerRef.current || !process.env.NEXT_PUBLIC_MAPBOX_KEY) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/verttb/cmav7e36p00vx01sd6w6h9690",
      center: [-41.5, -12.9], // Centro da Bahia
      zoom: 5,
      maxBounds: brazilBounds
    })

    mapRef.current = map

    map.on("load", () => {
      map.addSource("instituicoes", {
        type: "geojson",
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "instituicoes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            10,
            "#f1f075",
            30,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            15,
            10,
            25,
            30,
            35
          ]
        }
      })

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "instituicoes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      })

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "instituicoes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      })
    })

    return () => map.remove()
  }, [geojsonData])

  return <div ref={mapContainerRef} className="w-full h-full" />
}
