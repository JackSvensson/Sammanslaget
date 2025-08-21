"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StationPage from './StationPage';

export default function Home() {
  const router = useRouter();
  const [currentStation, setCurrentStation] = useState(1);
  const [allResults, setAllResults] = useState([]);

  const handleStationComplete = (stationResult, isLastStation) => {
    console.log('Station slutförd:', stationResult);
    
    // Spara resultat
    setAllResults(prev => [...prev, stationResult]);
    
    if (isLastStation) {
      console.log('Alla stationer slutförda!');
      console.log('Alla resultat:', [...allResults, stationResult]);
      // Navigera till resultat
      // router.push('/results');
    } else {
      // Gå till nästa station
      setCurrentStation(prev => prev + 1);
    }
  };

  const handleAbort = () => {
    const confirmed = confirm('Är du säker på att du vill avbryta rundan?');
    if (confirmed) {
      // Reset allt
      setCurrentStation(1);
      setAllResults([]);
      localStorage.removeItem('stationResults');
      localStorage.removeItem('globalStats');
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5f5f7' }}>
      <StationPage
        stationId={currentStation}
        onStationComplete={handleStationComplete}
        onAbort={handleAbort}
      />
      
      {/* Debug controls för utveckling */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 20,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <h4>Debug Controls</h4>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => setCurrentStation(1)}>Station 1</button>
            <button onClick={() => setCurrentStation(2)}>Station 2</button>
            <button onClick={() => setCurrentStation(3)}>Station 3</button>
            <button onClick={() => setCurrentStation(4)}>Station 4</button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <small>Current: Station {currentStation}</small>
          </div>
        </div>
      )}
    </div>
  );
}