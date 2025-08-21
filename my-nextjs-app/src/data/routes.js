import { calculateRouteDistance, estimateWalkingTime } from "@/utils/geo";

export const routes = [
  {
    id: 1,
    name: "Rutt 1",
    path: [
      [57.705849, 11.93782],
      [57.705416, 11.938356],
      [57.704481, 11.937562],
      [57.703119, 11.933429],
      [57.702862, 11.933442],
      [57.702789, 11.931436],
      [57.703018, 11.931183],
      [57.704359, 11.931719],
      [57.704571, 11.93154],
      [57.70444, 11.931256],
      [57.704667187031, 11.931537928796416],
      [57.704721, 11.932897],
      [57.705434, 11.934414],
    ],
    start: {
      name: "Startpunkt",
      position: [57.705849, 11.93782],
    },
    get distance() {
      return calculateRouteDistance(this.path).toFixed(2) + " km";
    },
    get time() {
      const minutes = estimateWalkingTime(calculateRouteDistance(this.path));
      return Math.round(minutes) + " min";
    },
    stations: [
      { id: 1, name: "Hjärnan", position: [57.705849, 11.93782] },
      { id: 2, name: "Filips Distans Pir", position: [57.704481, 11.937562] },

      { id: 3, name: "Lilla Smögen", position: [57.702789, 11.931436] },
      { id: 4, name: "Hasselblad", position: [57.705434, 11.934414] },
    ],
  },
];
