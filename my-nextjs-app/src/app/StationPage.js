'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StationPage({ 
  stationId, 
  stationInfo, 
  isLastStation = false,
  onStationComplete,
  onAbort 
}) {
  const router = useRouter();
  const [result, setResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    completedStations: 0,
    totalStations: 5, // Exempel
    currentRoundStats: {
      totalTime: 0,
      averageScore: 0,
      bestStation: '',
      worstStation: ''
    }
  });
  const [statusMessage, setStatusMessage] = useState('');
  
  // Refs för tillgänglighet
  const mainContentRef = useRef(null);
  const resultInputRef = useRef(null);
  const statusRef = useRef(null);

  // Ladda användarens stats när komponenten mountas
  useEffect(() => {
    loadUserStats();
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [stationId]);

  const loadUserStats = () => {
    const mockStats = {
      completedStations: parseInt(stationId) - 1,
      totalStations: 5,
      currentRoundStats: {
        totalTime: 450,
        averageScore: 8.2,
        bestStation: 'Station 2',
        worstStation: 'Station 1'
      }
    };
    setStats(mockStats);
  };

  const updateStatusMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
      if (statusRef.current) {
        statusRef.current.focus();
      }
    }, 100);
  };

  const handleResultSubmit = async () => {
    if (!result.trim()) {
      updateStatusMessage("Fel: Vänligen fyll i ditt resultat");
      if (resultInputRef.current) {
        resultInputRef.current.focus();
      }
      return;
    }
  
    setIsSubmitting(true);
    updateStatusMessage("Sparar ditt resultat...");
  
    try {
      await saveStationResult({
        stationId,
        result: result.trim(),
        timestamp: new Date().toISOString(),
      });
  
      const newStats = {
        ...stats,
        completedStations: stats.completedStations + 1,
      };
      setStats(newStats);
  
      updateStatusMessage(
        `Resultat sparat. ${
          isLastStation ? "Runda slutförd!" : "Går vidare till nästa station."
        }`
      );
  
      setTimeout(() => {
        if (onStationComplete) {
          onStationComplete(isLastStation ? "complete" : "next", {
            stationId,
            result: result.trim(),
            stats: newStats,
          });
        }
  
        if (isLastStation) {
          localStorage.setItem("finalStats", JSON.stringify(newStats));
          router.push("/results");
        }
      }, 1500);
    } catch (error) {
      console.error("Fel vid sparande av resultat:", error);
      updateStatusMessage("Fel: Något gick fel vid sparande. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbort = () => {
    const confirmed = confirm('Är du säker på att du vill avbryta rundan? All progress kommer att förloras.');
    if (confirmed) {
      updateStatusMessage('Avbryter rundan...');
      if (onAbort) {
        onAbort();
      } else {
        router.back();
      }
    }
  };

  const handleGoBack = () => {
    const confirmed = confirm('Vill du gå tillbaka till föregående station? Nuvarande resultat kommer inte sparas.');
    if (confirmed) {
      updateStatusMessage('Går tillbaka...');
      router.back();
    }
  };

  const saveStationResult = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Resultat sparat:', data);
        resolve();
      }, 1000);
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minuter och ${remainingSeconds} sekunder`;
  };

  const progressPercentage = (stats.completedStations / stats.totalStations) * 100;

  return (
    <div className="station-page">
      <a href="#main-content" className="skip-link">Hoppa till huvudinnehåll</a>

      <div 
        ref={statusRef}
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
        tabIndex="-1"
      >
        {statusMessage}
      </div>

      <main 
        id="main-content"
        ref={mainContentRef}
        tabIndex="-1"
        className="main-content"
      >
        <header className="station-header">
          <div className="station-title-row">
            <h1>Station {stationId}</h1>
            <span 
              className="progress-text"
              aria-label={`Station ${stats.completedStations + 1} av ${stats.totalStations}`}
            >
              {stats.completedStations + 1}/{stats.totalStations}
            </span>
          </div>
          
          <div 
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Rundans framsteg: ${Math.round(progressPercentage)}% slutfört`}
          >
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
              aria-hidden="true"
            ></div>
          </div>
        </header>

        <section className="station-info" aria-labelledby="station-info-heading">
          <h2 id="station-info-heading">Övningsinformation</h2>
          <div className="info-content">
            <dl className="info-list">
              <dt>Övning:</dt>
              <dd>{stationInfo?.name || 'Stationsövning'}</dd>
              
              <dt>Beskrivning:</dt>
              <dd>{stationInfo?.description || 'Utför övningen enligt instruktionerna'}</dd>
              
              <dt>Tid:</dt>
              <dd>{stationInfo?.timeLimit || '2 minuter'}</dd>
            </dl>
            
            {stationInfo?.instructions && (
              <div>
                <h3>Instruktioner:</h3>
                <ol className="instructions-list">
                  {stationInfo.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>

        <section className="result-input" aria-labelledby="result-heading">
          <h2 id="result-heading">Fyll i ditt resultat</h2>
          <div className="input-section">
            <label htmlFor="result-field" className="input-label">
              Resultat ({stationInfo?.resultType || 'antal repetitioner'})
              <span className="required-indicator" aria-label="obligatorisk">*</span>
            </label>
            <input
              id="result-field"
              ref={resultInputRef}
              type="text"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Ange ditt resultat..."
              disabled={isSubmitting}
              className="result-input-field"
              aria-required="true"
              aria-describedby="result-help"
              aria-invalid={!result.trim() ? "true" : "false"}
            />
            <div id="result-help" className="input-help">
              Fyll i ditt resultat från övningen för att kunna gå vidare.
            </div>
          </div>
        </section>

        <section className="round-stats" aria-labelledby="stats-heading">
          <h2 id="stats-heading">Rundstatistik</h2>
          <dl className="stats-grid">
            <div className="stat-item">
              <dt className="stat-label">Genomförd tid:</dt>
              <dd className="stat-value">{formatTime(stats.currentRoundStats.totalTime)}</dd>
            </div>
            <div className="stat-item">
              <dt className="stat-label">Genomsnitt:</dt>
              <dd className="stat-value">{stats.currentRoundStats.averageScore}</dd>
            </div>
            <div className="stat-item">
              <dt className="stat-label">Bästa station:</dt>
              <dd className="stat-value stat-best">{stats.currentRoundStats.bestStation || 'Ingen än'}</dd>
            </div>
            <div className="stat-item">
              <dt className="stat-label">Sämsta station:</dt>
              <dd className="stat-value stat-worst">{stats.currentRoundStats.worstStation || 'Ingen än'}</dd>
            </div>
          </dl>
        </section>

        <section className="button-section" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">Åtgärder</h2>
          
          <button
            onClick={handleResultSubmit}
            disabled={isSubmitting || !result.trim()}
            className="primary-button"
            aria-describedby="primary-button-help"
            type="button"
          >
            {isSubmitting 
              ? 'Sparar...' 
              : isLastStation 
                ? 'Slutför runda' 
                : 'Gå till nästa station'
            }
          </button>
          <div id="primary-button-help" className="button-help">
            {!result.trim() ? 'Fyll i resultat för att aktivera knappen' : 
             isLastStation ? 'Slutför rundan och se alla resultat' : 'Fortsätt till nästa övning'}
          </div>

          <div className="secondary-buttons">
            <button
              onClick={handleGoBack}
              disabled={isSubmitting}
              className="back-button"
              type="button"
              aria-describedby="back-button-help"
            >
              Tillbaka
            </button>
            <div id="back-button-help" className="button-help">
              Gå tillbaka till föregående station
            </div>
            
            <button
              onClick={handleAbort}
              disabled={isSubmitting}
              className="abort-button"
              type="button"
              aria-describedby="abort-button-help"
            >
              Avbryt runda
            </button>
            <div id="abort-button-help" className="button-help">
              Avbryt hela rundan och gå tillbaka till start
            </div>
          </div>
        </section>
      </main>

      {process.env.NODE_ENV === 'development' && (
        <aside className="debug-info" aria-labelledby="debug-heading">
          <h3 id="debug-heading">Debug Information</h3>
          <pre aria-label="Debug data">
            {JSON.stringify({ stationId, isLastStation, result, stats }, null, 2)}
          </pre>
        </aside>
      )}
    </div>
  );
}

// Exempel på hur man använder komponenten
export function ExampleUsage() {
  const router = useRouter();

  const handleStationComplete = (action, data) => {
    console.log('Station slutförd:', action, data);
    
    if (action === 'next') {
      router.push(`/station/${parseInt(data.stationId) + 1}`);
    } else if (action === 'complete') {
      router.push('/results');
    }
  };

  const handleAbort = () => {
    router.push('/');
  };

  const exampleStationInfo = {
    name: 'Armhävningar',
    description: 'Gör så många armhävningar du kan på 2 minuter',
    timeLimit: '2 minuter',
    resultType: 'antal repetitioner',
    instructions: [
      'Börja i plankan position',
      'Sänk kroppen tills bröstet nästan nuddar golvet',
      'Pressa upp till startposition',
      'Räkna varje fullständig repetition'
    ]
  };

  return (
    <StationPage
      stationId="3"
      stationInfo={exampleStationInfo}
      isLastStation={false}
      onStationComplete={handleStationComplete}
      onAbort={handleAbort}
    />
  );
}
