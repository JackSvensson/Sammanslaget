"use client";

import { useParams, useRouter } from "next/navigation";
import StationPage from "../../StationPage";

export default function StationRoute() {
  const params = useParams();
  const router = useRouter();
  const stationId = parseInt(params.id);

  const handleStationComplete = (stationResult) => {
    console.log("Station slutförd:", stationResult);
    const routeId = localStorage.getItem("currentRoute");

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

    router.push(`/startRoute/${routeId}`);
  };

  const handleAbort = () => {
    const confirmed = confirm("Är du säker på att du vill avbryta rundan?");
    if (confirmed) {
      localStorage.removeItem("nextStation");
      localStorage.removeItem("currentRoute");
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
