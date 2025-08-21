"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./results.module.css";

export default function ResultsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [stationResults, setStationResults] = useState([]);

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
      { id: 1, name: "Armhävningar", result: 12, unit: "reps", isBest: false, isWorst: true },
      { id: 2, name: "Jägarvila", result: 50, unit: "sek", isBest: false, isWorst: false },
      { id: 3, name: "Plankan", result: 85, unit: "sek", isBest: true, isWorst: false },
      { id: 4, name: "Burpees", result: 18, unit: "reps", isBest: false, isWorst: false },
      { id: 5, name: "Sit-ups", result: 25, unit: "reps", isBest: false, isWorst: false },
    ];

    setStats(mockStats);
    setStationResults(mockStationResults);

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
    router.push("/");
  };

  const handleShare = () => {
    alert("Delningsfunktion kommer snart!");
  };

  const handleViewHistory = () => {
    router.push("/history");
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

            {/* Huvudpoäng */}
            <section className={styles.summarySection}>
              <div className={styles.totalScore}>
                {stats.currentRoundStats.totalScore}
              </div>
              <div className={styles.scoreLabel}>Total poäng</div>
            </section>

            {/* Statistik-kort */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <div className={styles.statLabel}>Total tid</div>
                <div className={styles.statValue}>
                  {formatTime(stats.currentRoundStats.totalTime)}
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statLabel}>Genomsnitt</div>
                <div className={styles.statValue}>
                  {stats.currentRoundStats.averageScore}
                  <span className={styles.statUnit}> poäng</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statLabel}>Genomförda</div>
                <div className={styles.statValue}>
                  {stats.completedStations}/{stats.totalStations}
                  <span className={styles.statUnit}> stationer</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statLabel}>Träffprocent</div>
                <div className={styles.statValue}>
                  {Math.round((stats.completedStations / stats.totalStations) * 100)}
                  <span className={styles.statUnit}>%</span>
                </div>
              </div>
            </div>

            {/* Stationsresultat */}
            <section className={styles.performanceSection}>
              <h2 className={styles.sectionTitle}>Stationsresultat</h2>
              <div className={styles.stationsList}>
                {stationResults.map((station) => (
                  <div key={station.id} className={styles.stationItem}>
                    <div className={styles.stationInfo}>
                      <div className={styles.stationNumber}>{station.id}</div>
                      <div className={styles.stationName}>{station.name}</div>
                    </div>
                    <div className={styles.stationResult}>
                      <span className={styles.resultValue}>{station.result}</span>
                      <span className={styles.resultUnit}>{station.unit}</span>
                      {station.isBest && (
                        <span className={`${styles.resultBadge} ${styles.best}`}>
                          Bäst
                        </span>
                      )}
                      {station.isWorst && (
                        <span className={`${styles.resultBadge} ${styles.worst}`}>
                          Sämst
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Badges */}
            {badges.length > 0 && (
              <section className={styles.badgesSection}>
                <h2 className={styles.sectionTitle}>Utmärkelser</h2>
                <div className={styles.badgesGrid}>
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`${styles.badge} ${styles[badge.type]}`}
                    >
                      <div className={styles.badgeIcon}>{badge.icon}</div>
                      <div className={styles.badgeTitle}>{badge.title}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Åtgärdsknappar */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleNewRound}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                🔄 Ny runda
              </button>
              <button
                onClick={handleShare}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                📤 Dela resultat
              </button>
              <button
                onClick={handleViewHistory}
                className={`${styles.button} ${styles.tertiaryButton}`}
              >
                📊 Se historik
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
