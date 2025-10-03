"use client";

import React, { useState, useEffect, use } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TempSensorData } from "@/types/types";
import { renameRoom } from "@/utils/functions";
import "../../globals.scss";

// generate colors
const generateColor = (index: number) => {
  const colors = [
    "#2baba1",
    "#fcff66",
    "#86a305",
    "#abd006",
    "#d6f5f2",
    "#18b87e",
  ];
  return colors[index % colors.length];
};

const RoomConditionsRadar = ({
  radarData,
}: {
  radarData: Promise<TempSensorData[]>;
}) => {
  // use promise
  const data = use(radarData);

  const [normalizedData, setNormalizedData] = useState<
    Array<{ [key: string]: number | string }>
  >([]);
  const [roomsConfig, setRoomsConfig] = useState<
    Array<{ [key: string]: string }>
  >([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // get room names
    const rooms = data.map((room) => {
      return room.device.room.name;
    });

    // create room configuration dynamicaly
    const roomsConfiguration = rooms.map((room, index) => ({
      name: room.charAt(0).toUpperCase() + room.slice(1), // capitalize first letter
      dataKey: room.toLowerCase(),
      color: generateColor(index),
    }));

    // get air quality values
    const airQualities = data.map((item) => {
      return item.airQuality;
    });

    // get temperature values
    const temperatures = data
      .map((item) => item.temperature)
      .filter((temp): temp is number => temp !== null);

    // get temperature values
    const humidities = data
      .map((item) => item.humidity)
      .filter((hum): hum is number => hum !== null);
    // get co2 values
    const co2 = data
      .map((item) => item.co2)
      .filter((co2): co2 is number => co2 !== null);

    // get noise level values
    const noiseLevels = data
      .map((item) => item.noiseLevel)
      .filter((noise): noise is number => noise !== null);

    // create air quality object
    const airQualityData = Object.fromEntries(
      rooms.map((room, index) => [
        room.toLowerCase(),
        parseFloat(airQualities[index]?.toFixed(1)),
      ])
    );

    // create temperature object
    const temperatureData = Object.fromEntries(
      rooms.map((room, index) => [
        room.toLowerCase(),
        parseFloat(temperatures[index].toFixed(1)),
      ])
    );

    // create humidity object
    const humidityData = Object.fromEntries(
      rooms.map((room, index) => [
        room.toLowerCase(),
        parseFloat(humidities[index]?.toFixed(1)),
      ])
    );

    // create co2 object
    const co2Data = Object.fromEntries(
      rooms.map((room, index) => [
        room.toLowerCase(),
        parseFloat(co2[index]?.toFixed(1)),
      ])
    );

    // create noise level object
    const noiseLevelData = Object.fromEntries(
      rooms.map((room, index) => [
        room.toLowerCase(),
        parseFloat(noiseLevels[index]?.toFixed(1)),
      ])
    );

    const combinedData = [
      airQualityData,
      temperatureData,
      humidityData,
      co2Data,
      noiseLevelData,
    ];

    const metrics = [
      "Air quality",
      "Temperature",
      "Humidity",
      "Co2",
      "Noise level",
    ];

    const dataWithMetrics = combinedData.map((item, index) => ({
      ...item,
      metric: metrics[index],
    }));
    setNormalizedData(dataWithMetrics);
    setRoomsConfig(roomsConfiguration);
  }, [data]);

  return (
    <div className="container">
      <h2 className="chartTitle">Compare room conditions</h2>
      <div className="chartContainer">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={normalizedData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 12 }}
              tickSize={15}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9 }}
              tickCount={5}
            />
            {roomsConfig.map((room) => (
              <Radar
                key={room.dataKey}
                name={renameRoom(room.name)}
                dataKey={room.dataKey}
                stroke={room.color}
                fill={room.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoomConditionsRadar;
