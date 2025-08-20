"use client";

import { routes } from "@/data/routes";
import dynamic from "next/dynamic";
import styles from "./chooseRoute.module.css";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function ChooseRoute() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const router = useRouter();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LindMotion</h1>
      <h2 className={styles.mapTitle}>Välj träningsrutt</h2>
      {selectedRoute && (
        <div className={styles.mapWrapper}>
          <h2 className={styles.mapRouteName}>
            <Image
              src={"/running.svg"}
              height={25}
              width={25}
              alt="running person"
            />
            {selectedRoute.name}
          </h2>
          <Map path={selectedRoute.path} stations={selectedRoute.stations} />
          <div className={styles.routeInfo}>
            <p>
              <small>Distans</small>
              {selectedRoute.distance}
            </p>
            <p>
              <small>Tid</small>
              {selectedRoute.time}
            </p>
          </div>
        </div>
      )}
      <div className={styles.routeListWrapper}>
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
      </div>
      <button
        className={styles.startButton}
        onClick={() => router.push(`/startRoute/${selectedRoute.id}`)}
      >
        Starta Rutten
      </button>
    </main>
  );
}
