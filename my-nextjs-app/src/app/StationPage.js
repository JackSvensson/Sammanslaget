'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './StationPage.module.css';

// Station data med korrekta bildnamn
const STATIONS = [
  {
    id: 1,
    name: 'Armhävningar',
    type: 'reps',
    unit: 'st',
    description: 'Gör så många armhävningar du kan',
    image: '/exercises/pushup.svg',
    hasPlayButton: true,
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
    image: '/exercises/wallsit.svg',
    hasPlayButton: false,
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
    image: '/exercises/stepup.svg',
    hasPlayButton: false,
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
    image: '/exercises/burpees.svg',
    hasPlayButton: true,
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
  const [result, setResult] = useState(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer states för Jägarvila
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  
  // Extra reps tracking
  const [extraReps, setExtraReps] = useState(0);
  const [showExtraReps, setShowExtraReps] = useState(false);
  const [targetGoal] = useState(10); // Målet att slå
  const [showGoalFeedback, setShowGoalFeedback] = useState(false);

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
    setResult(prev => {
      const newValue = prev + 1;
      checkGoalProgress(newValue);
      return newValue;
    });
  };

  const handleDecrement = () => {
    setResult(prev => {
      const newValue = Math.max(0, prev - 1);
      checkGoalProgress(newValue);
      return newValue;
    });
  };

  const checkGoalProgress = (currentResult) => {
    if (station?.type === 'reps') {
      setShowGoalFeedback(true);
      if (currentResult > targetGoal) {
        const extra = currentResult - targetGoal;
        setExtraReps(extra);
        setShowExtraReps(true);
      } else {
        setShowExtraReps(false);
        setExtraReps(0);
      }
    }
  };

  const handleCompleteStation = async () => {
    setIsSubmitting(true);
    
    // Visa alltid feedback när man klickar på klar
    if (station.type === 'reps') {
      checkGoalProgress(result);
    } else if (station.type === 'timer' && time > 0) {
      // För timer, kolla om tiden är bättre än målet (50 sekunder)
      if (time > 50) {
        setExtraReps(time - 50);
        setShowExtraReps(true);
      }
      setShowGoalFeedback(true);
    }
    
    // Vänta lite så användaren hinner se feedback
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Spara resultat
    const stationResult = {
      stationId: station.id,
      name: station.name,
      result: station.type === 'timer' ? time : result,
      unit: station.unit,
      extraReps: extraReps,
      timestamp: new Date().toISOString()
    };
    
    // Avgör om det är sista stationen
    const isLastStation = station.id === STATIONS.length;
    
    if (onStationComplete) {
      onStationComplete(stationResult, isLastStation);
    }
    
    // if (isLastStation) {
    //   router.push('/results');
    // } else {
    //   router.push(`/station/${station.id + 1}`);
    // }
    
    setIsSubmitting(false);
  };

  const handleExtraReps = () => {
    setShowExtraReps(true);
    setExtraReps(prev => prev + 2);
  };

  useEffect(() => {
    // Automatisk check när result ändras
    if (station?.type === 'reps') {
      checkGoalProgress(result);
    }
  }, [result, station]);

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
          
          <div className={styles.exerciseType}>{station.description}</div>

          {/* Övningsbild */}
          <div className={styles.exerciseIllustration}>
            <div className={styles.exerciseImageWrapper}>
              {station.image && (
                <Image 
                  src={station.image} 
                  alt={station.name}
                  width={200}
                  height={200}
                  className={styles.exerciseImage}
                />
              )}
              {station.hasPlayButton && (
                <button className={styles.playButton} aria-label="Spela övningsanimation">
                  ▶
                </button>
              )}
            </div>
          </div>

          {/* Info knapp */}
          <div className={styles.infoButtons}>
            <button 
              className={`${styles.infoButton} ${styles.active}`}
            >
              Info
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
                <div className={styles.goalFeedback}>
                  {time > 50 ? (
                    <div className={styles.successFeedback}>
                      <strong>+ {time - 50} sekunder Bra jobbat!</strong>
                    </div>
                  ) : time === 50 ? (
                    <div className={styles.exactFeedback}>
                      <strong>Perfekt! Du nådde målet!</strong>
                    </div>
                  ) : (
                    <div className={styles.encourageFeedback}>
                      <strong>{50 - time} sekunder kvar till målet</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resultat input för reps övningar */}
          {station.type === 'reps' && (
            <div className={styles.resultSection}>
              <label className={styles.resultLabel}>
                Att slå: <strong>{targetGoal} {station.unit}</strong>
              </label>
              <div className={styles.resultInputContainer}>
                <button 
                  className={styles.resultButton}
                  onClick={handleDecrement}
                  aria-label="Minska"
                >
                  -
                </button>
                <div className={styles.resultDisplay}>
                  {result}
                </div>
                <button 
                  className={styles.resultButton}
                  onClick={handleIncrement}
                  aria-label="Öka"
                >
                  +
                </button>
              </div>
              
              {/* Feedback om målet */}
              {showGoalFeedback && (
                <div className={styles.goalFeedback}>
                  {result > targetGoal ? (
                    <div className={styles.successFeedback}>
                      <strong>+ {result - targetGoal} reps Bra jobbat!</strong>
                    </div>
                  ) : result === targetGoal ? (
                    <div className={styles.exactFeedback}>
                      <strong>Perfekt! Du nådde målet!</strong>
                    </div>
                  ) : (
                    <div className={styles.encourageFeedback}>
                      <strong>{targetGoal - result} reps kvar till målet</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instruktioner */}
          {station.instructions && (
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

          {/* Bottenmeny med stats */}
          <div className={styles.bottomStats}>
            <div className={styles.statItem}>
              <div className={styles.statItemLabel}>Poäng</div>
              <div className={styles.statItemValue}>0p</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statItemLabel}>Distans</div>
              <div className={styles.statItemValue}>2,5 km</div>
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
        </main>
      </div>
    </div>
  );
}