import { ImageSourcePropType } from "react-native";

export type Sport = {
  id: string;
  name: string;
  worldPlayers: number;
  cityPlayers: number;
  image: ImageSourcePropType;
};

export const sports: Sport[] = [
  {
    id: "1",
    name: "Badminton",
    worldPlayers: 190000,
    cityPlayers: 4100,
    image: require("../assets/images/Badminton.png"),
  },
  {
    id: "2",
    name: "Basketball",
    worldPlayers: 150000,
    cityPlayers: 5000,
    image: require("../assets/images/Basketball.png"),
  },
  {
    id: "3",
    name: "Billiards",
    worldPlayers: 62000,
    cityPlayers: 1200,
    image: require("../assets/images/Billiards.png"),
  },
  {
    id: "4",
    name: "Boxing",
    worldPlayers: 145000,
    cityPlayers: 3500,
    image: require("../assets/images/Boxing.png"),
  },
  {
    id: "5",
    name: "Climbing",
    worldPlayers: 97000,
    cityPlayers: 2100,
    image: require("../assets/images/Climbing.png"),
  },
  {
    id: "6",
    name: "Cycling",
    worldPlayers: 300000,
    cityPlayers: 8000,
    image: require("../assets/images/Cycling.png"),
  },
  {
    id: "7",
    name: "Football",
    worldPlayers: 300000,
    cityPlayers: 8000,
    image: require("../assets/images/Football.png"),
  },
  {
    id: "8",
    name: "Golf",
    worldPlayers: 98000,
    cityPlayers: 2000,
    image: require("../assets/images/Golf.png"),
  },
  {
    id: "9",
    name: "Hockey",
    worldPlayers: 168000,
    cityPlayers: 5400,
    image: require("../assets/images/Hockey.png"),
  },
  {
    id: "10",
    name: "Karate",
    worldPlayers: 143000,
    cityPlayers: 3200,
    image: require("../assets/images/Karate.png"),
  },
  {
    id: "11",
    name: "Padel",
    worldPlayers: 181000,
    cityPlayers: 9000,
    image: require("../assets/images/Padel.png"),
  },
  {
    id: "12",
    name: "Ping Pong",
    worldPlayers: 181000,
    cityPlayers: 9000,
    image: require("../assets/images/Ping_Pong.png"),
  },
  {
    id: "13",
    name: "Running",
    worldPlayers: 250000,
    cityPlayers: 7200,
    image: require("../assets/images/running.png"),
  },
  {
    id: "14",
    name: "Skiing",
    worldPlayers: 132000,
    cityPlayers: 2600,
    image: require("../assets/images/Skiing.png"),
  },
  {
    id: "15",
    name: "Snowboarding",
    worldPlayers: 85000,
    cityPlayers: 1300,
    image: require("../assets/images/Snowboarding.png"),
  },
  {
    id: "16",
    name: "Surfing",
    worldPlayers: 119000,
    cityPlayers: 800,
    image: require("../assets/images/Surfing.png"),
  },
  {
    id: "17",
    name: "Swimming",
    worldPlayers: 240000,
    cityPlayers: 6200,
    image: require("../assets/images/Swimming.png"),
  },
  {
    id: "18",
    name: "Tennis",
    worldPlayers: 100000,
    cityPlayers: 3000,
    image: require("../assets/images/Tennis.png"),
  },
  {
    id: "19",
    name: "Triathlon",
    worldPlayers: 76000,
    cityPlayers: 1500,
    image: require("../assets/images/Triathlon.png"),
  },
  {
    id: "20",
    name: "Volleyball",
    worldPlayers: 220000,
    cityPlayers: 6400,
    image: require("../assets/images/Valleyball.png"),
  },
  {
    id: "21",
    name: "Weightlifting",
    worldPlayers: 110000,
    cityPlayers: 2700,
    image: require("../assets/images/Weightlifting.png"),
  },
];
