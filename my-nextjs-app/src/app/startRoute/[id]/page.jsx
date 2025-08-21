"use client";

import { routes } from "@/data/routes";
import dynamic from "next/dynamic";
import styles from "./startRoute.module.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function StartRoutePage({ params }) {
  const { id } = React.use(params);
  const route = routes.find((r) => r.id.toString() === id);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!route) return <p>Rutt ej hittad</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LindMotion</h1>
      <h2 className={styles.mapTitle}>{route.name}</h2>
      <div className={styles.mapWrapper}>
        <h2 className={styles.mapRouteName}>
          <Image
            src={"/running.svg"}
            height={25}
            width={25}
            alt="running person"
          />
          {route.name}
        </h2>
        <Map path={route.path} stations={route.stations} />
        <div className={styles.routeInfo}>
          <p>
            <small>Distans</small>
            {route.distance}
          </p>
          <p>
            <small>Tid</small>
            {route.time}
          </p>
        </div>
      </div>
      <div className={styles.stationListWrapper}>
        <ul className={styles.stationList}>
          {route.stations.map((s, i) => (
            <li key={i} className={styles.stationInfo}>
              <Image
                src={"/location-mark.svg"}
                height={30}
                width={30}
                alt="Route Icon"
              />
              <p className={styles.stationText}>
                {s.name}
                <small>Station {s.id}</small>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button className={styles.stationButton}>Framme vid Station</button>
      <div className={styles.statContainer}>
        <p className={styles.statText}>
          <small>Tid:</small>
          {formatTime(seconds)}
        </p>
      </div>
    </main>
  );
}
