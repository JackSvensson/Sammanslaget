"use client";

import { routes } from "@/data/routes";
import dynamic from "next/dynamic";
import styles from "./chooseRoute.module.css";
import { useState } from "react";
import Image from "next/image";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function ChooseRoute() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LindMotion</h1>
      <h2 className={styles.mapTitle}>Välj träningsrutt</h2>
      {selectedRoute && (
        <div className={styles.mapWrapper}>
          <Map path={selectedRoute.path} stations={selectedRoute.stations} />
        </div>
      )}
      <ul className={styles.routeList}>
        {routes.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => setSelectedRoute(r)}
              className={styles.routeButton}
            >
              <div className={styles.routeTextContainer}>
                <Image
                  src={"/route-icon.svg"}
                  height={35}
                  width={35}
                  alt="Route Icon"
                />
                <p className={styles.routeText}>{r.name}</p>
              </div>
              <div className={styles.routeDistanceTime}>
                <p className={styles.routeText}>{r.distance}</p>
                <small className={styles.routeTime}>Cirka {r.time}</small>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <button className={styles.startButton}>Starta Rutten</button>
    </main>
  );
}
