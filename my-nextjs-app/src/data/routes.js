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
  {
    id: 2,
    name: "Rutt 2",
    path: [
      [57.706015, 11.936464],
      [57.706414, 11.934803],
      [57.707255, 11.934759],
      [57.707376, 11.934354],
      [57.706846, 11.933759],
      [57.707066, 11.932818],
      [57.70765, 11.932443],
      [57.707641, 11.933637],
      [57.70792, 11.933554],
      [57.707939, 11.937024],
      [57.709631, 11.940009],
      [57.708367, 11.940823],
      [57.708243, 11.940086],
      [57.706193, 11.941661],
      [57.705767, 11.93998],
      [57.707264, 11.9387],
      [57.707365, 11.937913],
      [57.705991, 11.936677],
      [57.706015, 11.936464],
    ],
    get distance() {
      return calculateRouteDistance(this.path).toFixed(2) + " km";
    },
    get time() {
      const minutes = estimateWalkingTime(calculateRouteDistance(this.path));
      return Math.round(minutes) + " min";
    },
    stations: [
      {
        id: 1,
        name: "Aftonstjärnan",
        position: [57.707066, 11.932818],
      },
      {
        id: 2,
        name: "Karla Tornet",
        position: [57.709631, 11.940009],
      },
      {
        id: 3,
        name: "Lindholms Hamnen",
        position: [57.708367, 11.940823],
      },
      {
        id: 4,
        name: "Lindholms Piren",
        position: [57.705767, 11.93998],
      },
      {
        id: 5,
        name: "Lindholmen Science Park",
        position: [57.707264, 11.9387],
      },
    ],
  },
  {
    id: 3,
    name: "Rutt 3",
    path: [
      [57.706015, 11.936464],
      [57.706414, 11.934803],
      [57.707255, 11.934759],
      [57.707376, 11.934354],
      [57.706846, 11.933759],
      [57.707066, 11.932818],
      [57.70765, 11.932443],
      [57.707641, 11.933637],
      [57.70792, 11.933554],
      [57.707939, 11.937024],
      [57.709631, 11.940009],
      [57.708367, 11.940823],
      [57.708243, 11.940086],
      [57.706193, 11.941661],
      [57.705767, 11.93998],
      [57.707264, 11.9387],
      [57.707365, 11.937913],
      [57.705991, 11.936677],
      [57.706015, 11.936464],
    ],
    get distance() {
      return calculateRouteDistance(this.path).toFixed(2) + " km";
    },
    get time() {
      const minutes = estimateWalkingTime(calculateRouteDistance(this.path));
      return Math.round(minutes) + " min";
    },
    stations: [
      {
        id: 1,
        name: "Aftonstjärnan",
        position: [57.707066, 11.932818],
      },
      {
        id: 2,
        name: "Karla Tornet",
        position: [57.709631, 11.940009],
      },
      {
        id: 3,
        name: "Lindholms Hamnen",
        position: [57.708367, 11.940823],
      },
      {
        id: 4,
        name: "Lindholms Piren",
        position: [57.705767, 11.93998],
      },
      {
        id: 5,
        name: "Lindholmen Science Park",
        position: [57.707264, 11.9387],
      },
    ],
  },
  {
    id: 4,
    name: "Rutt 4",
    path: [
      [57.706015, 11.936464],
      [57.706414, 11.934803],
      [57.707255, 11.934759],
      [57.707376, 11.934354],
      [57.706846, 11.933759],
      [57.707066, 11.932818],
      [57.70765, 11.932443],
      [57.707641, 11.933637],
      [57.70792, 11.933554],
      [57.707939, 11.937024],
      [57.709631, 11.940009],
      [57.708367, 11.940823],
      [57.708243, 11.940086],
      [57.706193, 11.941661],
      [57.705767, 11.93998],
      [57.707264, 11.9387],
      [57.707365, 11.937913],
      [57.705991, 11.936677],
      [57.706015, 11.936464],
    ],
    get distance() {
      return calculateRouteDistance(this.path).toFixed(2) + " km";
    },
    get time() {
      const minutes = estimateWalkingTime(calculateRouteDistance(this.path));
      return Math.round(minutes) + " min";
    },
    stations: [
      {
        id: 1,
        name: "Aftonstjärnan",
        position: [57.707066, 11.932818],
      },
      {
        id: 2,
        name: "Karla Tornet",
        position: [57.709631, 11.940009],
      },
      {
        id: 3,
        name: "Lindholms Hamnen",
        position: [57.708367, 11.940823],
      },
      {
        id: 4,
        name: "Lindholms Piren",
        position: [57.705767, 11.93998],
      },
      {
        id: 5,
        name: "Lindholmen Science Park",
        position: [57.707264, 11.9387],
      },
    ],
  },
];
