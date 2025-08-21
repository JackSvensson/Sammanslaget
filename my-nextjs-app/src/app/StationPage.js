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
    positions: [
      { number: 70, description: 'Startposition' },
      { number: 107, description: 'Nedre position' }
    ],
    instructions: [
      'Starta i plankan med raka armar',
      'Sänk kroppen tills bröstet nästan nuddar golvet',
      'Pressa upp till startposition',
      'Håll kroppen rak hela tiden'
    ]
  },
  {
    id: 2,
    name: 'Jägarvila',
    type: 'timer',
    unit: 'sek',
    description: 'Håll positionen så länge du kan',
    hasDualImage: true,
    instructions: [
      'Sitt med ryggen mot väggen',
      'Böj knäna i 90 graders vinkel',
      'Håll positionen',
      'Klicka Start när du börjar och Stop när du inte orkar mer'
    ]
  },
  {
    id: 3,
    name: 'Step up',
    type: 'reps',
    unit: 'st',
    description: 'Alternera mellan höger och vänster ben',
    instructions: [
      'Ställ dig framför en bänk eller låda',
      'Steg upp med höger fot',
      'Lyft vänster knä upp',
      'Steg ner och repetera med andra benet'
    ]
  },
  {
    id: 4,
    name: 'Burpees',
    type: 'reps',
    unit: 'st',
    description: 'Fullständiga burpees med hopp',
    instructions: [
      'Starta stående',
      'Gå ner i planka',
      'Gör en armhävning',
      'Hoppa med fötterna fram',
      'Hoppa upp med armarna över huvudet'
    ]
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

  useEffect(() => {
    // Hämta station baserat på ID
    const currentStation = STATIONS.find(s => s.id === parseInt(stationId));
    setStation(currentStation);
    
    // Reset timer om det är Jägarvila
    if (currentStation?.type === 'timer') {
      setTime(0);
      setIsRunning(false);
    }
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsRunning(true);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    setResult(time);
  };

  const handleIncrement = () => {
    setResult(prev => prev + 1);
  };

  const handleDecrement = () => {
    setResult(prev => Math.max(0, prev - 1));
  };

  const handleCompleteStation = async () => {
    setIsSubmitting(true);
    
    // Spara resultat
    const stationResult = {
      stationId: station.id,
      name: station.name,
      result: station.type === 'timer' ? time : result,
      unit: station.unit,
      extraReps: extraReps,
      timestamp: new Date().toISOString()
    };
    
    // Simulera API-anrop
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Avgör om det är sista stationen
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

  const handleExtraReps = () => {
    setShowExtraReps(true);
    setExtraReps(prev => prev + 2);
  };

  if (!station) {
    return (
      <div className={styles.loading}>
        Laddar station...
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
          
          {/* Position badges för Armhävningar */}
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

          {/* Övningsbild */}
          <div className={`${styles.exerciseIllustration} ${station.hasDualImage ? styles.dual : ''}`}>
            {station.hasDualImage ? (
              <>
                <div className={styles.exerciseImage}>👤</div>
                <div className={styles.exerciseImage}>👤</div>
              </>
            ) : (
              <>
                <div className={styles.exerciseImage}>👤</div>
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

          {/* Timer för Jägarvila */}
          {station.type === 'timer' && (
            <div className={styles.timerSection}>
              <div className={styles.timerLabel}>Tid att slå:</div>
              <div className={styles.timerDisplay}>{formatTime(time)}</div>
              <div className={styles.timerControls}>
                {!isRunning ? (
                  <button 
                    className={`${styles.timerButton} ${styles.startButton}`}
                    onClick={handleStartTimer}
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
              {!isRunning && time > 0 && (
                <div className={styles.extraRepsSection}>
                  <strong>+ 2 sekunder Bra jobbat!</strong>
                </div>
              )}
            </div>
          )}

          {/* Resultat input för reps övningar */}
          {station.type === 'reps' && (
            <div className={styles.resultSection}>
              <label className={styles.resultLabel}>
                Att slå: <strong>10 {station.unit}</strong>
              </label>
              <div className={styles.resultInputWrapper}>
                <div className={styles.resultControls}>
                  <button 
                    className={styles.resultButton}
                    onClick={handleDecrement}
                    aria-label="Minska"
                  >
                    -
                  </button>
                </div>
                <input
                  type="number"
                  className={styles.resultInput}
                  value={result}
                  onChange={(e) => setResult(parseInt(e.target.value) || 0)}
                  aria-label="Resultat"
                />
                <div className={styles.resultControls}>
                  <button 
                    className={styles.resultButton}
                    onClick={handleIncrement}
                    aria-label="Öka"
                  >
                    +
                  </button>
                </div>
              </div>
              {showExtraReps && (
                <div className={styles.extraRepsSection}>
                  <strong>+ {extraReps} reps Bra jobbat!</strong>
                </div>
              )}
              {result > 10 && !showExtraReps && (
                <button onClick={handleExtraReps} style={{display: 'none'}}>
                  {/* Triggas automatiskt när man går över 10 */}
                  {setTimeout(() => handleExtraReps(), 500)}
                </button>
              )}
            </div>
          )}

          {/* Instruktioner */}
          {activeTab === 'info' && station.instructions && (
            <div className={styles.instructions}>
              <ol>
                {station.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Klar med övning knapp */}
          <button
            onClick={handleCompleteStation}
            disabled={isSubmitting || (station.type === 'timer' && time === 0)}
            className={styles.completeButton}
          >
            {isSubmitting ? 'SPARAR...' : 'KLAR MED ÖVNING'}
          </button>
        </main>

        {/* Bottenmeny med stats */}
        <div className={styles.bottomStats}>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Poäng</div>
            <div className={styles.statItemValue}>0p</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Distans</div>
            <div className={styles.statItemValue}>2,3 km</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Tid</div>
            <div className={styles.statItemValue}>05:03</div>
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