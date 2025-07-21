"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./RoomConditionsRadar.module.scss";
import { TempSensorData } from "@/types/types";

const ROOM_CONDITIONS_DATA = [
  {
    metric: "Temperatura",
    salon: 22,
    sypialnia: 20,
    kuchnia: 25,
    maxValue: 30,
  },
  {
    metric: "Wilgotność",
    salon: 45,
    sypialnia: 40,
    kuchnia: 60,
    maxValue: 80,
  },
  {
    metric: "CO2",
    salon: 420,
    sypialnia: 380,
    kuchnia: 500,
    maxValue: 1000,
  },
  {
    metric: "Jakość powietrza",
    salon: 85,
    sypialnia: 90,
    kuchnia: 75,
    maxValue: 100,
  },
  {
    metric: "Poziom hałasu",
    salon: 35,
    sypialnia: 25,
    kuchnia: 45,
    maxValue: 70,
  },
];

// normalize data function
const normalizeData = (data) => {
  return data.map((item) => ({
    metric: item.metric,
    salon: Math.round((item.salon / item.maxValue) * 100),
    sypialnia: Math.round((item.sypialnia / item.maxValue) * 100),
    kuchnia: Math.round((item.kuchnia / item.maxValue) * 100),
  }));
};

const RoomConditionsRadar = ({
  radarData,
}: {
  radarData: TempSensorData[];
}) => {
  const [normalizedData, setNormalizedData] = useState([]);

  console.log(radarData);

  useEffect(() => {
    setNormalizedData(normalizeData(ROOM_CONDITIONS_DATA));
  }, []);

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Porównanie warunków w pokojach</h2>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={normalizedData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Salon"
              dataKey="salon"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Sypialnia"
              dataKey="sypialnia"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Kuchnia"
              dataKey="kuchnia"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoomConditionsRadar;

// Nie renderuj nic podczas SSR
//   if (!isClient) {
//     return (
//       <div className={styles.chartContainer}>
//         <h2 className={styles.chartTitle}>Porównanie warunków w pokojach</h2>
//         <div className={styles.loadingContainer}>
//           <div className={styles.spinner}></div>
//         </div>
//       </div>
//     );
//   }
