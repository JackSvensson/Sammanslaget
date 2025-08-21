"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
  });
}

export default function Map({ path, stations, start }) {
  function MapUpdater({ path }) {
    const map = useMap();
    useEffect(() => {
      if (path.length) {
        const bounds = L.latLngBounds(path);
        map.fitBounds(bounds, { padding: [50, 50] });
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
      {start && (
        <CircleMarker
          center={start.position}
          radius={5}
          pathOptions={{
            color: "orange",
            fillColor: "orange",
            fillOpacity: 1,
          }}
        ></CircleMarker>
      )}
      {stations.map((station, i) => (
        <Marker key={i} position={station.position}></Marker>
      ))}
      <MapUpdater path={path} />
    </MapContainer>
  );
}
