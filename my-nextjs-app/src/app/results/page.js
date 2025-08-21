"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./results.module.css";

export default function ResultsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [stationResults, setStationResults] = useState([]);
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    // Simulerad data - ersätt med riktig data från localStorage eller API
    const mockStats = {
      completedStations: 5,
      totalStations: 5,
      currentRoundStats: {
        totalTime: 545,
        averageScore: 27,
        bestStation: "Station 3",
        worstStation: "Station 1",
        totalScore: 135,
      },
    };

    const mockStationResults = [
      { id: 1, name: "Armhävningar", result: 12, unit: "reps", goal: 10, points: 2, isBest: false, isWorst: false },
      { id: 2, name: "Jägarvila", result: 50, unit: "sek", goal: 50, points: 0, isBest: false, isWorst: false },
      { id: 3, name: "Plankan", result: 85, unit: "sek", goal: 60, points: 25, isBest: true, isWorst: false },
      { id: 4, name: "Burpees", result: 18, unit: "reps", goal: 8, points: 10, isBest: false, isWorst: false },
      { id: 5, name: "Sit-ups", result: 25, unit: "reps", goal: 20, points: 5, isBest: false, isWorst: false },
    ];

    // Beräkna sluttid
    const now = new Date();
    const endTimeString = now.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setStats(mockStats);
    setStationResults(mockStationResults);
    setEndTime(endTimeString);

    // Badge-logik
    const newBadges = [];
    if (mockStats.completedStations === mockStats.totalStations) {
      newBadges.push({
        icon: "🏅",
        title: "Fullständig!",
        type: "gold",
      });
    }
    if (mockStats.currentRoundStats.averageScore > 25) {
      newBadges.push({
        icon: "💪",
        title: "Stark prestation!",
        type: "silver",
      });
    }
    if (mockStats.currentRoundStats.totalTime < 600) {
      newBadges.push({
        icon: "⚡",
        title: "Snabb tid!",
        type: "bronze",
      });
    }
    setBadges(newBadges);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNewRound = () => {
    localStorage.removeItem("finalStats");
    localStorage.removeItem("nextStation");
    localStorage.removeItem("currentRoute");
    localStorage.removeItem("currentTime");
    localStorage.removeItem("completedStations");
    router.push("/");
  };

  if (!stats) {
    return (
      <div className={styles.resultsPage}>
        <div className={styles.container}>
          <p>Laddar slutresultat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultsPage}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneScreen}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1 className={styles.title}>SLUTRESULTAT</h1>
              <p className={styles.subtitle}>Bra jobbat! Här är din sammanfattning</p>
            </header>

            {/* Huvudpoäng med cirkel */}
            <section className={styles.summarySection}>
              <div className={styles.scoreCircleContainer}>
                <div className={styles.scoreCircleBackground}>
                  <Image 
                    src="/exercises/ResultCircle.svg" 
                    alt="Result Circle"
                    width={180}
                    height={180}
                    className={styles.scoreCircleImage}
                  />
                </div>
                <div className={styles.scoreOverlay}>
                  <div className={styles.totalScore}>
                    {stats.currentRoundStats.totalScore}
                  </div>
                  <div className={styles.scoreLabel}>poäng</div>
                </div>
              </div>
            </section>

            {/* Stationsresultat */}
            <section className={styles.performanceSection}>
              <h2 className={styles.sectionTitle}>Stationsresultat</h2>
              <div className={styles.stationsList}>
                {stationResults.map((station) => (
                  <div key={station.id} className={styles.stationCard}>
                    <div className={styles.stationHeader}>
                      <div className={styles.stationNumber}>{station.id}</div>
                      <div className={styles.stationName}>{station.name}</div>
                      <div className={styles.stationPoints}>
                        {station.points > 0 ? `+${station.points}` : station.points} poäng
                      </div>
                    </div>
                    <div className={styles.stationDetails}>
                      <div className={styles.stationResult}>
                        Resultat: <strong>{station.result} {station.unit}</strong>
                      </div>
                      <div className={styles.stationGoal}>
                        Mål: {station.goal} {station.unit}
                      </div>
                    </div>
                    {station.isBest && (
                      <div className={`${styles.resultBadge} ${styles.best}`}>
                        Bäst
                      </div>
                    )}
                    {station.isWorst && (
                      <div className={`${styles.resultBadge} ${styles.worst}`}>
                        Sämst
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Sluttid */}
            <section className={styles.endTimeSection}>
              <div className={styles.endTimeCard}>
                <div className={styles.endTimeLabel}>Sluttid</div>
                <div className={styles.endTimeValue}>{endTime}</div>
              </div>
            </section>

            {/* Badges */}
            

            {/* Åtgärdsknappar */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleNewRound}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                 Ny runda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
