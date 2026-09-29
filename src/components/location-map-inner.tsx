"use client";

import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, TileLayer } from "react-leaflet";
import { approximateLocation } from "@/lib/suburb-coords";

export default function LocationMapInner({
  suburb,
  seed,
}: {
  suburb: string;
  seed: string;
}) {
  const center = approximateLocation(suburb, seed);
  const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      className="brand-map h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${
          cartoKey ? `?key=${cartoKey}` : ""
        }`}
      />
      <Circle
        center={center}
        radius={500}
        pathOptions={{
          color: "#CA0000",
          weight: 1.5,
          opacity: 0.55,
          fillColor: "#CA0000",
          fillOpacity: 0.16,
        }}
      />
    </MapContainer>
  );
}
