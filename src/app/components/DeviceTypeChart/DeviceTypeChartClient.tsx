"use client";

import React, { use, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import styles from "./DeviceTypeChart.module.scss";
import "../../globals.scss";

type DeviceProps = { name: string; value: number }[];

// map colors for device types
const COLOR_MAP = {
  temperature_sensor: "#abd006",
  motion_sensor: "#2baba1",
  AirConditioner: "#d6f5f2",
  light: "#fcff66",
} as const;

// colors for new device types
const FALLBACK_COLORS = ["#18b87e", "#ff6b6b", "#4ecdc4", "#45b7d1"];

// rename device types
export const renameDeviceType = (name: string) => {
  if (name === "temperature_sensor") return "Temperature sensor";
  if (name === "motion_sensor") return "Motion sensor";
  if (name === "AirConditioner") return "Air conditioners";
  if (name === "light") return "Light";
  return name;
};

// function for geting data for device type
const getColorForDeviceType = (
  deviceType: string,
  fallbackIndex: number
): string => {
  if (deviceType in COLOR_MAP) {
    return COLOR_MAP[deviceType as keyof typeof COLOR_MAP];
  }
  return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
};

const DeviceTypesPieChart = ({
  deviceData,
}: {
  deviceData: Promise<DeviceProps>;
}) => {
  // use promise
  const data: DeviceProps = use(deviceData);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  type CustomizedLabelProps = {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    index?: number;
    value?: number;
    name?: string;
  };

  const renderCustomizedLabel = (props: CustomizedLabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof midAngle !== "number" ||
      typeof innerRadius !== "number" ||
      typeof outerRadius !== "number" ||
      typeof percent !== "number"
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className={styles.pieLabel}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { name: string; value: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>
            {renameDeviceType(payload[0].payload.name)}
          </p>
          <p className={styles.tooltipValue}>
            {`Device count: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({
    payload,
  }: {
    payload?: Array<{
      value: string;
      type?: string;
      color?: string;
      payload: { name: string; value: number };
    }>;
  }) => {
    if (!payload) return null;

    return (
      <div className={styles.customLegend}>
        {payload.map((entry, index: number) => (
          <div key={entry.value} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{
                backgroundColor: getColorForDeviceType(
                  entry.payload.name,
                  index
                ),
              }}
            />
            <span>{renameDeviceType(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const onPieEnter = (data: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="container">
      <h2 className="chartTitle">Types of devices</h2>
      <div className="chartContainer">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index: number) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={getColorForDeviceType(entry.name, index)}
                  className={`${styles.pieSegment} ${
                    index === activeIndex ? styles.active : ""
                  }`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeviceTypesPieChart;
