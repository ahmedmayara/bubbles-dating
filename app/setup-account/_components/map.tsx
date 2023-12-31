import React from "react";

import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({ iconUrl: "/images/marker-icon.png" });
const markerIcon2x = L.icon({ iconUrl: "/images/marker-icon-2x.png" });
const markerShadow = L.icon({ iconUrl: "/images/marker-shadow.png" });

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapProps {
  center?: number[];
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function Map({ center }: MapProps) {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="h-[25vh] rounded-lg"
    >
      <TileLayer url={url} attribution={attribution} />
      {center && (
        <Marker position={center as L.LatLngExpression} icon={markerIcon} />
      )}
    </MapContainer>
  );
}
