import { calculateRouteDistance, estimateWalkingTime } from "@/utils/geo";

export const routes = [
  {
    id: 1,
    name: "Rutt 1",
    path: [
      [57.706015, 11.936464],
      [57.705523, 11.938439],
      [57.70348, 11.936627],
      [57.703376, 11.934444],
      [57.703056, 11.93344],
      [57.70461, 11.933183],
      [57.705272, 11.934236],
      [57.706369, 11.935216],
      [57.706015, 11.936464],
    ],
    get distance() {
      return calculateRouteDistance(this.path).toFixed(2) + " km";
    },
    get time() {
      const minutes = estimateWalkingTime(calculateRouteDistance(this.path));
      return Math.round(minutes) + " min";
    },
    stations: [{ id: 1, name: "Yrgo", position: [57.706015, 11.936464] }],
  },
];
