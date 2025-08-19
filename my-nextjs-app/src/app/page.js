"use client";


import StationPage from './StationPage';

export default function Home() {
  const stationInfo = {
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

  const handleStationComplete = (action, data) => {
    console.log('Station slutförd:', action, data);
    console.log('Action:', action); // 'next' eller 'complete'
    console.log('Data:', data); // stationId, result, stats
    
    // Här kan du lägga till navigation senare
    if (action === 'next') {
      console.log('Skulle navigera till nästa station');
    } else if (action === 'complete') {
      console.log('Skulle navigera till slutresultat');
    }
  };

  const handleAbort = () => {
    console.log('Användaren vill avbryta rundan');
    // Här kan du lägga till navigation tillbaka till start
  };

  return (
    <StationPage
      stationId="1"
      stationInfo={stationInfo}
      isLastStation={false} // Sätt till true om du vill testa sista stationen
      onStationComplete={handleStationComplete}
      onAbort={handleAbort}
    />
  );
}