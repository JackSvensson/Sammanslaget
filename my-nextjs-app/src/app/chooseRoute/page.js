"use client";

import { routes } from "@/data/routes";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function ChooseRoute() {
  return (
    <main>
      <h1>LindMotion</h1>
      <h2>Välj träningsrutt</h2>
      {routes.map((r) => (
        <div key={r.id}>
          <Map path={r.path} stations={r.stations} />
          <p>
            {r.name} - Distans: {r.distance} - Tid: {r.time}
          </p>
        </div>
      ))}
    </main>
  );
}
