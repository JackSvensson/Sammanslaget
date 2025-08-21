// src/app/station/[id]/page.js
"use client";

import { useParams, useRouter } from 'next/navigation';
import StationPage from '../../StationPage';

export default function StationRoute() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id;

  const handleStationComplete = (stationResult, isLastStation) => {
    console.log('Station slutförd:', stationResult);
    
    if (isLastStation) {
      // Navigera till resultat
      router.push('/results');
    } else {
      // Gå till nästa station
      const nextStation = parseInt(stationId) + 1;
      router.push(`/station/${nextStation}`);
    }
  };

  const handleAbort = () => {
    const confirmed = confirm('Är du säker på att du vill avbryta rundan?');
    if (confirmed) {
      // Rensa localStorage
      localStorage.removeItem('stationResults');
      localStorage.removeItem('globalStats');
      // Gå tillbaka till start
      router.push('/');
    }
  };

  return (
    <StationPage
      stationId={stationId}
      onStationComplete={handleStationComplete}
      onAbort={handleAbort}
    />
  );
}