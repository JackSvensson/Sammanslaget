"use client";

import { routes } from "@/data/routes";
import dynamic from "next/dynamic";
import styles from "./startRoute.module.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function StartRoutePage({ params }) {
  const { id } = React.use(params);
  const route = routes.find((r) => r.id.toString() === id);
  const router = useRouter();

  const [seconds, setSeconds] = useState(0);
  const [nextStationIndex, setNextStationIndex] = useState(0);
  const [completedStations, setCompletedStations] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!route) return;

    localStorage.setItem("currentRoute", route.id);

    const storedNextStation = localStorage.getItem("nextStation");
    const storedTime = parseInt(localStorage.getItem("currentTime") || "0", 10);
    const storedCompleted = JSON.parse(
      localStorage.getItem("completedStations") || "[]"
    );
    const storedStats = JSON.parse(
      localStorage.getItem("currentStats") || '{"points": 0, "time": 0}'
    );

    if (!storedNextStation || storedNextStation === "done") {
      localStorage.setItem("currentTime", "0");
      localStorage.setItem("nextStation", route.stations[0].id.toString());
      localStorage.setItem("completedStations", "[]");
      localStorage.setItem("currentStats", '{"points": 0, "time": 0}');
      localStorage.removeItem("stationResults");

      setSeconds(0);
      setNextStationIndex(0);
      setCompletedStations([]);
      setTotalPoints(0);
    } else {
      if (storedNextStation === "last") {
        setNextStationIndex(route.stations.length - 1);
      } else {
        const index = route.stations.findIndex(
          (s) =>
            s.id === parseInt(storedNextStation || route.stations[0].id, 10)
        );
        setNextStationIndex(index >= 0 ? index : 0);
      }

      setSeconds(storedTime);
      setCompletedStations(storedCompleted);
      setTotalPoints(storedStats.points);
    }
  }, [route]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newTime = prev + 1;
        localStorage.setItem("currentTime", newTime.toString());

        const currentStats = JSON.parse(
          localStorage.getItem("currentStats") || '{"points": 0, "time": 0}'
        );
        currentStats.time = newTime;
        localStorage.setItem("currentStats", JSON.stringify(currentStats));

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatePoints = () => {
      const currentStats = JSON.parse(
        localStorage.getItem("currentStats") || '{"points": 0, "time": 0}'
      );
      setTotalPoints(currentStats.points);
    };

    const handleStorageChange = () => {
      updatePoints();
      const storedCompleted = JSON.parse(
        localStorage.getItem("completedStations") || "[]"
      );
      setCompletedStations(storedCompleted);
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("focus", updatePoints);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", updatePoints);
    };
  }, []);

  const handleGoToStation = () => {
    if (
      completedStations.length >= 4 ||
      nextStationIndex >= route.stations.length
    ) {
      localStorage.setItem("nextStation", "done");
      router.push("/results");
      return;
    }

    const currentIndex = nextStationIndex;
    const currentStationId = route.stations[currentIndex]?.id;
    if (!currentStationId) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < route.stations.length) {
      setNextStationIndex(nextIndex);
      localStorage.setItem(
        "nextStation",
        route.stations[nextIndex].id.toString()
      );
    } else {
      setNextStationIndex(nextIndex);
      localStorage.setItem("nextStation", "done");
    }

    router.push(`/station/${currentStationId}`);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const getDistance = () => {
    return route?.distance || "2,5 km";
  };

  if (!route) return <p>Rutt ej hittad</p>;

  return (
    <>
      <header className={styles.appHeader}>
        <h1 className={styles.appLogo}>LindMotion</h1>
      </header>
      <main className={styles.main}>
        <h2 className={styles.mapTitle}>{route.name}</h2>

        <div className={styles.mapWrapper}>
          <h2 className={styles.mapRouteName}>
            <Image
              src={"/Running.svg"}
              height={25}
              width={25}
              alt="running person"
            />
            {route.name}
          </h2>
          <Map
            path={route.path}
            stations={route.stations}
            start={route.start}
          />
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
            {route.stations.map((s, i) => {
              const isCompleted = completedStations.includes(s.id);
              const isCurrent = i === nextStationIndex && !isCompleted;
              return (
                <li
                  key={i}
                  className={`${styles.stationInfoContainer} ${
                    isCurrent ? styles.currentStation : ""
                  }`}
                >
                  <div className={styles.stationInfo}>
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
                  </div>
                  {isCompleted && (
                    <Image
                      src={"/checkmark.svg"}
                      height={20}
                      width={20}
                      alt="checkmark"
                    />
                  )}
                  {isCurrent && <div className={styles.currentMarker}>→</div>}
                </li>
              );
            })}
          </ul>
        </div>

        <button className={styles.stationButton} onClick={handleGoToStation}>
          {completedStations.length >= 4 ||
          nextStationIndex >= route.stations.length
            ? "Visa Resultat"
            : "Framme vid Station"}
        </button>

        <div className={styles.statContainer}>
          <div className={styles.statItem}>
            <small>Poäng:</small>
            <span>{totalPoints}p</span>
          </div>
          <div className={styles.statItem}>
            <small>Distans:</small>
            <span>{getDistance()}</span>
          </div>
          <div className={styles.statItem}>
            <small>Tid:</small>
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
      </main>
    </>
  );
}
