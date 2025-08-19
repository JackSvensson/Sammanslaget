"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Hämta sparade stats från localStorage (eller API om du bygger ut senare)
    const savedStats = JSON.parse(localStorage.getItem("finalStats"));
    setStats(savedStats);

    // Enkel logik för badges (du kan bygga ut detta senare)
    if (savedStats) {
      const newBadges = [];
      if (savedStats.completedStations === savedStats.totalStations) {
        newBadges.push("🏅 Alla stationer klara!");
      }
      if (savedStats.currentRoundStats.averageScore > 8) {
        newBadges.push("💪 Hög genomsnittspoäng!");
      }
      setBadges(newBadges);
    }
  }, []);

  const handleBackToStart = () => {
    // Rensa sparade stats och gå tillbaka till start
    localStorage.removeItem("finalStats");
    router.push("/");
  };

  if (!stats) {
    return <p>Laddar slutresultat...</p>;
  }

  return (
    <div>
      <h1>Slutresultat</h1>

      <section>
        <h2>Statistik</h2>
        <ul>
          <li>Genomförda stationer: {stats.completedStations}</li>
          <li>Total tid: {stats.currentRoundStats.totalTime} sekunder</li>
          <li>Genomsnittspoäng: {stats.currentRoundStats.averageScore}</li>
          <li>Bästa station: {stats.currentRoundStats.bestStation}</li>
          <li>Sämsta station: {stats.currentRoundStats.worstStation}</li>
        </ul>
      </section>

      <section>
        <h2>Badges</h2>
        {badges.length > 0 ? (
          <ul>
            {badges.map((badge, index) => (
              <li key={index}>{badge}</li>
            ))}
          </ul>
        ) : (
          <p>Inga badges denna gång</p>
        )}
      </section>

      <button onClick={handleBackToStart}>Tillbaka till start</button>
    </div>
  );
}
