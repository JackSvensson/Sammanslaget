"use client";

import { useParams, useRouter } from "next/navigation";
import StationPage from "../../StationPage";

export default function StationRoute() {
  const params = useParams();
  const router = useRouter();
  const stationId = parseInt(params.id);

  const handleStationComplete = (stationResult, isLastStation) => {
    console.log("Station slutförd:", stationResult);
    const routeId = localStorage.getItem("currentRoute");

    // Markera som slutförd
    let completedStations = JSON.parse(
      localStorage.getItem("completedStations") || "[]"
    );

    if (!completedStations.includes(stationId)) {
      completedStations.push(stationId);
    }

    localStorage.setItem(
      "completedStations",
      JSON.stringify(completedStations)
    );

    // Kolla om det är sista stationen (station 4)
    if (stationId === 4 || isLastStation) {
      // Sista stationen - gå till resultat
      localStorage.setItem("nextStation", "done");
      router.push("/results");
    } else {
      // Inte sista stationen - gå tillbaka till rutt-vyn
      router.push(`/startRoute/${routeId}`);
    }
  };

  const handleAbort = () => {
    const confirmed = confirm("Är du säker på att du vill avbryta rundan?");
    if (confirmed) {
      localStorage.removeItem("nextStation");
      localStorage.removeItem("currentRoute");
      localStorage.removeItem("currentStats");
      localStorage.removeItem("stationResults");
      localStorage.removeItem("currentTime");
      localStorage.removeItem("completedStations");
      router.push("/");
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