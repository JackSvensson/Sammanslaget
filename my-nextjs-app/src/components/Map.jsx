"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix för default Leaflet-marker
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

export default function Map({ path, stations }) {
  function MapUpdater({ path }) {
    const map = useMap();
    useEffect(() => {
      if (path.length) {
        const bounds = L.latLngBounds(path);
        map.fitBounds(bounds, { padding: [50, 50] }); // lite padding runt
      }
    }, [path]);
    return null;
  }

  return (
    <MapContainer
      center={path[0]}
      zoom={15}
      style={{
        height: "300px",
        width: "100%",
      }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={path} color="orange" />
      {stations.map((station, i) => (
        <Marker key={i} position={station.position}></Marker>
      ))}
      <MapUpdater path={path} />
    </MapContainer>
  );
}
