'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StationPage.module.css';

// Station data
const STATIONS = [
  {
    id: 1,
    name: 'Armhävningar',
    type: 'reps',
    unit: 'st',
    description: 'Gör så många armhävningar du kan',
    targetScore: 10,
    positions: [
      { number: 70, description: 'Startposition' },
      { number: 107, description: 'Nedre position' }
    ],
    instructions: [
      'Starta i plankan med raka armar',
      'Sänk kroppen tills bröstet nästan nuddar golvet',
      'Pressa upp till startposition',
      'Håll kroppen rak hela tiden'
    ],
    image: '/exercises/pushup.svg'
  },
  {
    id: 2,
    name: 'Jägarvila',
    type: 'timer',
    unit: 'sek',
    description: 'Håll positionen så länge du kan',
    targetScore: 50,
    instructions: [
      'Sitt med ryggen mot väggen',
      'Böj knäna i 90 graders vinkel',
      'Håll positionen',
      'Klicka Start när du börjar och Stop när du inte orkar mer'
    ],
    image: ['/exercises/wallsit.svg']
  },
  {
    id: 3,
    name: 'Step up',
    type: 'reps',
    unit: 'st',
    description: 'Alternera mellan höger och vänster ben',
    targetScore: 26,
    instructions: [
      'Ställ dig framför en bänk eller låda',
      'Steg upp med höger fot',
      'Lyft vänster knä upp',
      'Steg ner och repetera med andra benet'
    ],
    image: '/exercises/stepup.svg'
  },
  {
    id: 4,
    name: 'Burpees',
    type: 'reps',
    unit: 'st',
    description: 'Fullständiga burpees med hopp',
    targetScore: 13,
    instructions: [
      'Starta stående',
      'Gå ner i planka',
      'Gör en armhävning',
      'Hoppa med fötterna fram',
      'Hoppa upp med armarna över huvudet'
    ],
    image: '/exercises/burpees.svg'
  }
];

export default function StationPage({ 
  stationId = 1,
  onStationComplete,
  onAbort 
}) {
  const router = useRouter();
  const [station, setStation] = useState(null);
  const [result, setResult] = useState(12); // Startvärde
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  // Timer states för Jägarvila
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  
  // Extra reps tracking
  const [extraReps, setExtraReps] = useState(0);
  const [showExtraReps, setShowExtraReps] = useState(false);
  
  // Global stats
  const [globalStats, setGlobalStats] = useState({
    totalPoints: 0,
    distance: 2.3,
    totalTime: 303, // sekunder
    currentStation: parseInt(stationId)
  });

  useEffect(() => {
    // Hämta station baserat på ID
    const currentStation = STATIONS.find(s => s.id === parseInt(stationId));
    setStation(currentStation);
    
    // Reset states för ny station
    if (currentStation?.type === 'timer') {
      setTime(0);
      setIsRunning(false);
    } else if (currentStation?.type === 'reps') {
      setResult(currentStation.targetScore || 12);
    }
    
    setShowExtraReps(false);
    setExtraReps(0);
  }, [stationId]);

  // Timer logic för Jägarvila
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Auto-detect extra reps
  useEffect(() => {
    if (station?.type === 'reps' && result > station.targetScore && !showExtraReps) {
      setShowExtraReps(true);
      setExtraReps(result - station.targetScore);
    }
  }, [result, station, showExtraReps]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const formatGlobalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsRunning(true);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    setResult(time);
    
    // Check if beat target
    if (time > station.targetScore) {
      setShowExtraReps(true);
      setExtraReps(time - station.targetScore);
    }
  };

  const handleIncrement = () => {
    setResult(prev => prev + 1);
  };

  const handleDecrement = () => {
    setResult(prev => Math.max(0, prev - 1));
  };

  const handleCompleteStation = async () => {
    setIsSubmitting(true);
    
    // Calculate points
    const actualResult = station.type === 'timer' ? time : result;
    const points = Math.max(0, actualResult);
    
    // Update global stats
    const newStats = {
      ...globalStats,
      totalPoints: globalStats.totalPoints + points
    };
    setGlobalStats(newStats);
    
    // Save result
    const stationResult = {
      stationId: station.id,
      name: station.name,
      result: actualResult,
      unit: station.unit,
      extraReps: extraReps,
      points: points,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingResults = JSON.parse(localStorage.getItem('stationResults') || '[]');
    existingResults.push(stationResult);
    localStorage.setItem('stationResults', JSON.stringify(existingResults));
    localStorage.setItem('globalStats', JSON.stringify(newStats));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if last station
    const isLastStation = station.id === STATIONS.length;
    
    if (onStationComplete) {
      onStationComplete(stationResult, isLastStation);
    }
    
    if (isLastStation) {
      router.push('/results');
    } else {
      router.push(`/station/${station.id + 1}`);
    }
    
    setIsSubmitting(false);
  };

  if (!station) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Laddar station...</p>
      </div>
    );
  }

  return (
    <div className={styles.stationPage}>
      <div className={styles.phoneContainer}>
        {/* Status bar */}
        <div className={styles.statusBar}>
          <span className={styles.statusBarTime}>9:41</span>
          <div className={styles.statusBarIcons}>
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* App header */}
        <header className={styles.appHeader}>
          <div className={styles.appLogo}>LindMotion</div>
          <div className={styles.stationIndicator}>
            <span>📊</span>
            <span>STATION {station.id}</span>
          </div>
        </header>

        {/* Main content */}
        <main className={styles.mainContent}>
          <h1 className={styles.stationTitle}>{station.name}</h1>
          
          {/* Position badges for Armhävningar */}
          {station.positions && (
            <div className={styles.positionBadges}>
              {station.positions.map((pos, index) => (
                <div key={index} className={styles.positionBadge}>
                  {pos.number}
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.exerciseType}>{station.description}</div>

          {/* Exercise illustration */}
          <div className={`${styles.exerciseIllustration} ${station.hasDualImage ? styles.dual : ''}`}>
            {station.hasDualImage ? (
              <>
                <div className={styles.exerciseImage}>
                  <img src={station.images?.[0] || '/placeholder.svg'} alt={`${station.name} position 1`} />
                </div>
                <div className={styles.exerciseImage}>
                  <img src={station.images?.[1] || '/placeholder.svg'} alt={`${station.name} position 2`} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.exerciseImage}>
                  <img src={station.image || '/placeholder.svg'} alt={station.name} />
                </div>
                <button className={styles.playButton} aria-label="Spela övningsanimation">
                  ▶
                </button>
              </>
            )}
          </div>

          {/* Info/Lär tabs */}
          <div className={styles.infoButtons}>
            <button 
              className={`${styles.infoButton} ${activeTab === 'info' ? styles.active : styles.inactive}`}
              onClick={() => setActiveTab('info')}
            >
              Info
            </button>
            <button 
              className={`${styles.infoButton} ${activeTab === 'learn' ? styles.active : styles.inactive}`}
              onClick={() => setActiveTab('learn')}
            >
              Lär
            </button>
          </div>

          {/* Timer for Jägarvila */}
          {station.type === 'timer' && (
            <div className={styles.timerSection}>
              <div className={styles.timerLabel}>
                Tid att slå: <strong>00:{station.targetScore}</strong>
              </div>
              <div className={styles.timerDisplay}>{formatTime(time)}</div>
              <div className={styles.timerControls}>
                {!isRunning ? (
                  <button 
                    className={`${styles.timerButton} ${styles.startButton}`}
                    onClick={handleStartTimer}
                    disabled={time > 0}
                  >
                    ▶ Start
                  </button>
                ) : (
                  <button 
                    className={`${styles.timerButton} ${styles.stopButton}`}
                    onClick={handleStopTimer}
                  >
                    ■ STOP
                  </button>
                )}
              </div>
              {showExtraReps && (
                <div className={styles.extraRepsSection}>
                  <strong>+ {extraReps} sekunder Bra jobbat!</strong>
                </div>
              )}
            </div>
          )}

          {/* Result input for reps exercises */}
          {station.type === 'reps' && (
            <div className={styles.resultSection}>
              <label className={styles.resultLabel}>
                Att slå: <strong>{station.targetScore} {station.unit}</strong>
              </label>
              <div className={styles.resultInputWrapper}>
                <button 
                  className={styles.resultButton}
                  onClick={handleDecrement}
                  aria-label="Minska"
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.resultInput}
                  value={result}
                  onChange={(e) => setResult(parseInt(e.target.value) || 0)}
                  aria-label="Resultat"
                />
                <button 
                  className={styles.resultButton}
                  onClick={handleIncrement}
                  aria-label="Öka"
                >
                  +
                </button>
              </div>
              {showExtraReps && (
                <div className={styles.extraRepsSection}>
                  <strong>+ {extraReps} reps Bra jobbat!</strong>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {activeTab === 'info' && station.instructions && (
            <div className={styles.instructions}>
              <h3>Instruktioner:</h3>
              <ol>
                {station.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Learn content */}
          {activeTab === 'learn' && (
            <div className={styles.learnContent}>
              <h3>Tips för {station.name}:</h3>
              <ul>
                <li>Fokusera på korrekt teknik</li>
                <li>Andas jämnt genom övningen</li>
                <li>Ta pauser om du behöver</li>
              </ul>
            </div>
          )}

          {/* Complete button */}
          <button
            onClick={handleCompleteStation}
            disabled={isSubmitting || (station.type === 'timer' && time === 0)}
            className={styles.completeButton}
          >
            {isSubmitting ? 'SPARAR...' : 'KLAR MED ÖVNING'}
          </button>
        </main>

        {/* Bottom stats */}
        <div className={styles.bottomStats}>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Poäng</div>
            <div className={styles.statItemValue}>{globalStats.totalPoints}p</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Distans</div>
            <div className={styles.statItemValue}>{globalStats.distance} km</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Tid</div>
            <div className={styles.statItemValue}>{formatGlobalTime(globalStats.totalTime)}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Station</div>
            <div className={styles.statItemValue}>{station.id}/4</div>
          </div>
        </div>
      </div>
    </div>
  );
}