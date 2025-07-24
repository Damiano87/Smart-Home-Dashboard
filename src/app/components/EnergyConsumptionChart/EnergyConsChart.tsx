"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./EnergyChart.module.scss";

// Dane przykładowe - w prawdziwej aplikacji pobierałbyś to z API
const ENERGY_DATA = [
  {
    time: "00:00",
    salon: 2.1,
    kuchnia: 1.8,
    sypialnia: 0.9,
    lazienka: 1.2,
    biuro: 0.5,
    garaz: 0.3,
  },
  {
    time: "02:00",
    salon: 1.8,
    kuchnia: 1.2,
    sypialnia: 0.7,
    lazienka: 0.8,
    biuro: 0.2,
    garaz: 0.2,
  },
  {
    time: "04:00",
    salon: 1.5,
    kuchnia: 1.0,
    sypialnia: 0.6,
    lazienka: 0.6,
    biuro: 0.1,
    garaz: 0.1,
  },
  {
    time: "06:00",
    salon: 2.8,
    kuchnia: 3.2,
    sypialnia: 1.4,
    lazienka: 1.8,
    biuro: 0.8,
    garaz: 0.4,
  },
  {
    time: "08:00",
    salon: 3.5,
    kuchnia: 4.1,
    sypialnia: 1.2,
    lazienka: 2.2,
    biuro: 2.1,
    garaz: 0.6,
  },
  {
    time: "10:00",
    salon: 3.2,
    kuchnia: 3.8,
    sypialnia: 0.8,
    lazienka: 1.6,
    biuro: 2.8,
    garaz: 0.5,
  },
  {
    time: "12:00",
    salon: 4.1,
    kuchnia: 5.2,
    sypialnia: 0.9,
    lazienka: 1.9,
    biuro: 3.2,
    garaz: 0.7,
  },
  {
    time: "14:00",
    salon: 3.8,
    kuchnia: 4.8,
    sypialnia: 1.1,
    lazienka: 1.7,
    biuro: 3.5,
    garaz: 0.6,
  },
  {
    time: "16:00",
    salon: 4.5,
    kuchnia: 4.2,
    sypialnia: 1.3,
    lazienka: 2.1,
    biuro: 3.8,
    garaz: 0.8,
  },
  {
    time: "18:00",
    salon: 5.2,
    kuchnia: 6.1,
    sypialnia: 1.8,
    lazienka: 2.8,
    biuro: 2.9,
    garaz: 1.2,
  },
  {
    time: "20:00",
    salon: 6.1,
    kuchnia: 5.8,
    sypialnia: 2.4,
    lazienka: 2.6,
    biuro: 1.8,
    garaz: 0.9,
  },
  {
    time: "22:00",
    salon: 4.8,
    kuchnia: 3.2,
    sypialnia: 2.1,
    lazienka: 1.8,
    biuro: 0.9,
    garaz: 0.4,
  },
];

const ROOM_COLORS = {
  salon: "#8884d8",
  kuchnia: "#82ca9d",
  sypialnia: "#ffc658",
  lazienka: "#ff7c7c",
  biuro: "#8dd1e1",
  garaz: "#d084d0",
};

const ROOM_NAMES = {
  salon: "Salon",
  kuchnia: "Kuchnia",
  sypialnia: "Sypialnia",
  lazienka: "Łazienka",
  biuro: "Biuro",
  garaz: "Garaż",
};

const EnergyConsumptionChart = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(Object.keys(ROOM_COLORS));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, item) => sum + item.value, 0);

      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTime}>Godzina: {label}</span>
            <span className={styles.tooltipTotal}>
              Łącznie: {total.toFixed(1)} kWh
            </span>
          </div>
          <div className={styles.tooltipBody}>
            {payload.map((entry, index) => (
              <div key={index} className={styles.tooltipItem}>
                <div
                  className={styles.tooltipColor}
                  style={{ backgroundColor: entry.color }}
                />
                <span className={styles.tooltipLabel}>
                  {ROOM_NAMES[entry.dataKey]}:
                </span>
                <span className={styles.tooltipValue}>{entry.value} kWh</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className={styles.customLegend}>
        {payload.map((entry, index) => (
          <div
            key={index}
            className={`${styles.legendItem} ${
              selectedRooms.includes(entry.dataKey)
                ? styles.active
                : styles.inactive
            }`}
            onClick={() => {
              if (selectedRooms.includes(entry.dataKey)) {
                setSelectedRooms(
                  selectedRooms.filter((room) => room !== entry.dataKey)
                );
              } else {
                setSelectedRooms([...selectedRooms, entry.dataKey]);
              }
            }}
          >
            <div
              className={styles.legendColor}
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!isClient) {
    return (
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>
          Zużycie energii w czasie - podział na pokoje
        </h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>
          Zużycie energii w czasie - podział na pokoje
        </h2>
        <div className={styles.chartSubtitle}>Ostatnie 24 godziny (kWh)</div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={ENERGY_DATA}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Zużycie energii (kWh)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: "12px" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />

            {Object.entries(ROOM_COLORS).map(
              ([room, color]) =>
                selectedRooms.includes(room) && (
                  <Area
                    key={room}
                    type="monotone"
                    dataKey={room}
                    stackId="1"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.7}
                    strokeWidth={2}
                    name={ROOM_NAMES[room]}
                  />
                )
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyConsumptionChart;
