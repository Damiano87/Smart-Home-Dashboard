"use client";

import React, { useState, useEffect, use } from "react";
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
import "../../globals.scss";
import { renameRoom } from "@/utils/functions";

type EnergyData = {
  time: string;
  [roomName: string]: string | number;
};

// room colors
const DEFAULT_ROOM_COLORS = [
  "#2baba1",
  "#fcff66",
  "#abd006",
  "#d6f5f2",
  "#18b87e",
];

const EnergyConsumptionChart = ({
  consumptionData,
}: {
  consumptionData: Promise<EnergyData[]>;
}) => {
  // use promise
  const data = use(consumptionData);

  const [chartData, setChartData] = useState<EnergyData[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [roomColors, setRoomColors] = useState<Record<string, string>>({});
  const [roomNames, setRoomNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data && data.length > 0) {
      // get rooms from data
      const rooms = new Set<string>();
      data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== "time" && typeof item[key] === "number") {
            rooms.add(key);
          }
        });
      });

      const roomsArray = Array.from(rooms);

      // map colors for rooms
      const colors: Record<string, string> = {};
      const names: Record<string, string> = {};

      roomsArray.forEach((room, index) => {
        colors[room] = DEFAULT_ROOM_COLORS[index % DEFAULT_ROOM_COLORS.length];
        // convert room names
        names[room] = renameRoom(room.charAt(0).toUpperCase() + room.slice(1));
      });

      setAvailableRooms(roomsArray);
      setSelectedRooms(roomsArray);
      setRoomColors(colors);
      setRoomNames(names);
      setChartData(data);
    } else {
      // use fallback data if real data doesn't exist
      const fallbackData = [
        { time: "00:00", salon: 2.1, kuchnia: 1.8, sypialnia: 0.9 },
        { time: "06:00", salon: 2.8, kuchnia: 3.2, sypialnia: 1.4 },
        { time: "12:00", salon: 4.1, kuchnia: 5.2, sypialnia: 0.9 },
        { time: "18:00", salon: 5.2, kuchnia: 6.1, sypialnia: 1.8 },
      ];

      const rooms = ["salon", "kuchnia", "sypialnia"];
      const colors = {
        salon: "#2baba1",
        kuchnia: "#fcff66",
        sypialnia: "#abd006",
      };
      const names = {
        salon: "Salon",
        kuchnia: "Kuchnia",
        sypialnia: "Sypialnia",
      };

      setAvailableRooms(rooms);
      setSelectedRooms(rooms);
      setRoomColors(colors);
      setRoomNames(names);
      setChartData(fallbackData);
    }
  }, [data]);

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
                  {roomNames[entry.dataKey] || entry.dataKey}:
                </span>
                <span className={styles.tooltipValue}>
                  {typeof entry.value === "number"
                    ? entry.value.toFixed(2)
                    : entry.value}{" "}
                  kWh
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <div className={styles.chartHeader}>
        <h2 className="chartTitle">Power usage over time</h2>
        <div className="chartSubtitle">Last 24 hours (kWh)</div>
      </div>

      <div className="chartContainer">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
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
            <Legend />

            {availableRooms.map(
              (room) =>
                selectedRooms.includes(room) && (
                  <Area
                    key={room}
                    type="monotone"
                    dataKey={room}
                    stackId="1"
                    stroke={roomColors[room]}
                    fill={roomColors[room]}
                    fillOpacity={0.7}
                    strokeWidth={2}
                    name={roomNames[room] || room}
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
