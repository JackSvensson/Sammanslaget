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
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    // Hämta verklig data från localStorage
    const savedResults = JSON.parse(localStorage.getItem('stationResults') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('currentStats') || '{"points": 0, "time": 0}');
    const savedTime = parseInt(localStorage.getItem('currentTime') || '0');
    
    // Beräkna totala poäng från alla stationer
    const totalPoints = savedResults.reduce((sum, station) => sum + (station.points || 0), 0);
    
    // Hitta bästa och sämsta station
    let bestStation = null;
    let worstStation = null;
    let highestPoints = -Infinity;
    let lowestPoints = Infinity;
    
    savedResults.forEach(station => {
      if (station.points > highestPoints) {
        highestPoints = station.points;
        bestStation = station.name;
      }
      if (station.points < lowestPoints) {
        lowestPoints = station.points;
        worstStation = station.name;
      }
    });

    // Markera bästa och sämsta station
    const resultsWithMarks = savedResults.map(station => ({
      ...station,
      isBest: station.name === bestStation && station.points === highestPoints,
      isWorst: station.name === worstStation && station.points === lowestPoints && savedResults.length > 1
    }));

    const calculatedStats = {
      completedStations: savedResults.length,
      totalStations: 4, // Antalet stationer i appen
      currentRoundStats: {
        totalTime: savedTime,
        averageScore: savedResults.length > 0 ? Math.round(totalPoints / savedResults.length) : 0,
        bestStation: bestStation || "Ingen",
        worstStation: worstStation || "Ingen",
        totalScore: totalPoints,
      },
    };

    // Beräkna sluttid
    const now = new Date();
    const endTimeString = now.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setStats(calculatedStats);
    setStationResults(resultsWithMarks);
    setEndTime(endTimeString);
    setTotalTime(savedTime);

    // Badge-logik baserat på verklig prestanda
    const newBadges = [];
    if (calculatedStats.completedStations === calculatedStats.totalStations) {
      newBadges.push({
        icon: "🏅",
        title: "Fullständig!",
        type: "gold",
      });
    }
    if (totalPoints > 0) {
      newBadges.push({
        icon: "💪",
        title: "Positiva poäng!",
        type: "silver",
      });
    }
    if (savedTime < 600) { // Under 10 minuter
      newBadges.push({
        icon: "⚡",
        title: "Snabb tid!",
        type: "bronze",
      });
    }
    // Kolla för nya rekord
    const hasNewRecord = savedResults.some(station => station.isRecord);
    if (hasNewRecord) {
      newBadges.push({
        icon: "🏆",
        title: "Nytt rekord!",
        type: "gold",
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
    // Rensa sessiondata men behåll rekord
    localStorage.removeItem("currentStats");
    localStorage.removeItem("stationResults");
    localStorage.removeItem("nextStation");
    localStorage.removeItem("currentRoute");
    localStorage.removeItem("currentTime");
    localStorage.removeItem("completedStations");
    router.push("/");
  };

  const handleViewRecords = () => {
    // Navigera till en rekordvy (kan implementeras senare)
    alert("Rekordvy kommer snart!");
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
              
              {/* Sammanfattning under cirkeln */}
              <div className={styles.summaryText}>
                <p><strong>Genomsnitt:</strong> {stats.currentRoundStats.averageScore} poäng per station</p>
                <p><strong>Total tid:</strong> {formatTime(stats.currentRoundStats.totalTime)}</p>
                <p><strong>Stationer:</strong> {stats.completedStations}/{stats.totalStations}</p>
              </div>
            </section>

            {/* Stationsresultat */}
            <section className={styles.performanceSection}>
              <h2 className={styles.sectionTitle}>Stationsresultat</h2>
              {stationResults.length > 0 ? (
                <div className={styles.stationsList}>
                  {stationResults.map((station) => (
                    <div key={station.stationId} className={styles.stationCard}>
                      <div className={styles.stationHeader}>
                        <div className={styles.stationNumber}>{station.stationId}</div>
                        <div className={styles.stationName}>
                          {station.name}
                          {station.isRecord && <span className={styles.recordBadge}>🏆</span>}
                        </div>
                        <div className={`${styles.stationPoints} ${station.points >= 0 ? styles.positive : styles.negative}`}>
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
              ) : (
                <p className={styles.noResults}>Inga stationsresultat hittades.</p>
              )}
            </section>


          
            

            {/* Åtgärdsknappar */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleNewRound}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                 Ny runda
              </button>
              <button
                onClick={handleViewRecords}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                🏆 Visa rekord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}