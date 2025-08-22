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
    goal: 10,
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
    goal: 50,
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
    goal: 15,
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
    goal: 8,
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
  const [result, setResult] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Timer states för Jägarvila
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  
  // Extra reps tracking
  const [extraReps, setExtraReps] = useState(0);
  const [showExtraReps, setShowExtraReps] = useState(false);
  const [showGoalFeedback, setShowGoalFeedback] = useState(false);

  // Stats från localStorage
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    // Hämta station baserat på ID
    const currentStation = STATIONS.find(s => s.id === parseInt(stationId));
    setStation(currentStation);
    
    // Reset timer om det är Jägarvila
    if (currentStation?.type === 'timer') {
      setTime(0);
      setIsRunning(false);
    }

    // Hämta befintliga stats
    const savedStats = JSON.parse(localStorage.getItem('currentStats') || '{"points": 0, "time": 0}');
    setTotalPoints(savedStats.points);
    
    // Hämta timer från localStorage
    const savedTime = parseInt(localStorage.getItem('currentTime') || '0');
    setTotalTime(savedTime);
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

  // Global timer that continues running
  useEffect(() => {
    const globalTimer = setInterval(() => {
      setTotalTime(prev => {
        const newTime = prev + 1;
        localStorage.setItem('currentTime', newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(globalTimer);
  }, []);

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
      if (currentResult > station.goal) {
        const extra = currentResult - station.goal;
        setExtraReps(extra);
        setShowExtraReps(true);
      } else {
        setShowExtraReps(false);
        setExtraReps(0);
      }
    }
  };

  const calculatePoints = (result, goal, type) => {
    if (type === 'reps') {
      // För reps: +1 poäng per rep över målet, -1 poäng per rep under målet
      return result - goal;
    } else if (type === 'timer') {
      // För timer: +1 poäng per sekund över målet, -1 poäng per sekund under målet
      return result - goal;
    }
    return 0;
  };

  const checkForRecord = async (stationResult) => {
    const recordKey = `station_${station.id}_record`;
    const currentRecord = localStorage.getItem(recordKey);
    
    let isRecord = false;
    
    if (!currentRecord) {
      // Första gången för denna station
      isRecord = true;
      localStorage.setItem(recordKey, JSON.stringify(stationResult));
    } else {
      const recordData = JSON.parse(currentRecord);
      
      // För reps: högre är bättre, för timer: högre är också bättre (längre tid)
      if (stationResult.result > recordData.result) {
        isRecord = true;
        localStorage.setItem(recordKey, JSON.stringify(stationResult));
      }
    }
    
    if (isRecord) {
      setIsNewRecord(true);
      // Visa record-meddelande i 3 sekunder
      setTimeout(() => setIsNewRecord(false), 3000);
    }
    
    return isRecord;
  };

  const handleCompleteStation = async () => {
    setIsSubmitting(true);
    
    // Visa alltid feedback när man klickar på klar
    if (station.type === 'reps') {
      checkGoalProgress(result);
    } else if (station.type === 'timer' && time > 0) {
      // För timer, kolla om tiden är bättre än målet
      if (time > station.goal) {
        setExtraReps(time - station.goal);
        setShowExtraReps(true);
      }
      setShowGoalFeedback(true);
    }
    
    // Vänta lite så användaren hinner se feedback
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Beräkna poäng
    const finalResult = station.type === 'timer' ? time : result;
    const points = calculatePoints(finalResult, station.goal, station.type);
    
    // Spara resultat
    const stationResult = {
      stationId: station.id,
      name: station.name,
      result: finalResult,
      unit: station.unit,
      goal: station.goal,
      points: points,
      extraReps: extraReps,
      timestamp: new Date().toISOString(),
      type: station.type
    };
    
    // Kolla för rekord
    const isRecord = await checkForRecord(stationResult);
    stationResult.isRecord = isRecord;
    
    // Uppdatera totala poäng
    const newTotalPoints = totalPoints + points;
    setTotalPoints(newTotalPoints);
    
    // Spara stats till localStorage
    const currentStats = {
      points: newTotalPoints,
      time: totalTime
    };
    localStorage.setItem('currentStats', JSON.stringify(currentStats));
    
    // Spara station resultat för slutsammanfattning
    const allResults = JSON.parse(localStorage.getItem('stationResults') || '[]');
    allResults.push(stationResult);
    localStorage.setItem('stationResults', JSON.stringify(allResults));
    
    // Markera som slutförd i localStorage
    let completedStations = JSON.parse(localStorage.getItem('completedStations') || '[]');
    if (!completedStations.includes(station.id)) {
      completedStations.push(station.id);
      localStorage.setItem('completedStations', JSON.stringify(completedStations));
    }
    
    // Avgör om det är sista stationen (station 4 är den sista)
    const isLastStation = station.id === 4;
    
    if (isLastStation) {
      // Sista stationen - gå direkt till resultat
      localStorage.setItem('nextStation', 'done');
      setIsSubmitting(false);
      
      // Navigera direkt till resultat istället för att använda callback
      const router = require('next/navigation').useRouter;
      if (typeof window !== 'undefined') {
        window.location.href = '/results';
      }
      return;
    }
    
    if (onStationComplete) {
      onStationComplete(stationResult, isLastStation);
    }
    
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

  const currentPoints = calculatePoints(
    station.type === 'timer' ? time : result, 
    station.goal, 
    station.type
  );

  return (
    <div className={styles.stationPage}>
      <div className={styles.phoneContainer}>
        {/* App header */}
        <header className={styles.appHeader}>
          <div className={styles.appLogo}>LindMotion</div>
        </header>

        {/* Main content */}
        <main className={styles.mainContent}>
          <h1 className={styles.stationTitle}>{station.name}</h1>
          
          <div className={styles.exerciseType}>{station.description}</div>

          {/* New Record Notification */}
          {isNewRecord && (
            <div className={styles.recordNotification}>
              🏆 NYTT REKORD! 🏆
            </div>
          )}

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
              <div className={styles.timerLabel}>Tid att slå: {station.goal} sek</div>

              {/* Poängräkning med frågetecken för timer */}
              <div className={styles.pointCalculation}>
                <span className={styles.pointsLabel}>
                  Poängräkning: {calculatePoints(time, station.goal, 'timer')} poäng
                </span>
                <button 
                  className={styles.questionButton}
                  onClick={() => setShowTooltip(true)}
                  aria-label="Information om poängräkning"
                >
                  ?
                </button>
              </div>

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
                  {time > station.goal ? (
                    <div className={styles.successFeedback}>
                      <strong>+ {time - station.goal} sekunder Bra jobbat!</strong>
                    </div>
                  ) : time === station.goal ? (
                    <div className={styles.exactFeedback}>
                      <strong>Perfekt! Du nådde målet!</strong>
                    </div>
                  ) : (
                    <div className={styles.encourageFeedback}>
                      <strong>{station.goal - time} sekunder kvar till målet</strong>
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
                Att slå: <strong>{station.goal} {station.unit}</strong>
              </label>

              {/* Poängräkning med frågetecken */}
              <div className={styles.pointCalculation}>
                <span className={styles.pointsLabel}>
                  Poängräkning: {calculatePoints(result, station.goal, 'reps')} poäng
                </span>
                <button 
                  className={styles.questionButton}
                  onClick={() => setShowTooltip(true)}
                  aria-label="Information om poängräkning"
                >
                  ?
                </button>
              </div>

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
                  {result > station.goal ? (
                    <div className={styles.successFeedback}>
                      <strong>+ {result - station.goal} reps Bra jobbat!</strong>
                    </div>
                  ) : result === station.goal ? (
                    <div className={styles.exactFeedback}>
                      <strong>Perfekt! Du nådde målet!</strong>
                    </div>
                  ) : (
                    <div className={styles.encourageFeedback}>
                      <strong>{station.goal - result} reps kvar till målet</strong>
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
              <div className={styles.statItemValue}>{totalPoints}p</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statItemLabel}>Distans</div>
              <div className={styles.statItemValue}>2,5 km</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statItemLabel}>Tid</div>
              <div className={styles.statItemValue}>{formatGlobalTime(totalTime)}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statItemLabel}>Station</div>
              <div className={styles.statItemValue}>{station.id}/4</div>
            </div>
          </div>
        </main>

        {/* Tooltip/Popup för poängräkning */}
        {showTooltip && (
          <>
            <div className={styles.tooltipOverlay} onClick={() => setShowTooltip(false)} />
            <div className={styles.tooltip}>
              <h3 className={styles.tooltipTitle}>Resultatbaserat poängsystem</h3>
              <div className={styles.tooltipContent}>
                <div className={styles.tooltipItem}>
                  <strong>Mer än målet</strong> = +1 poäng per extra rep/sekund
                </div>
                <div className={styles.tooltipItem}>
                  <strong>Exakt målet</strong> = 0 poäng
                </div>
                <div className={styles.tooltipItem}>
                  <strong>Mindre än målet</strong> = -1 poäng per saknad rep/sekund
                </div>
                <div className={styles.tooltipItem}>
                  <strong>Rekord</strong> = sparas automatiskt för varje station
                </div>
              </div>
              <button 
                className={styles.closeTooltip}
                onClick={() => setShowTooltip(false)}
              >
                Stäng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}