"use client";

import React, { useState } from "react";
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
import { renameDeviceType } from "@/utils/functions";

type Props = {
  deviceData: { name: string; value: number }[];
};

const COLORS = ["#abd006", "#2baba1", "#d6f5f2", "#fcff66", "#18b87e"] as const;

const DeviceTypesPieChart = ({ deviceData }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>
            {renameDeviceType(payload[0].payload.name)}
          </p>
          <p className={styles.tooltipValue}>
            {`Liczba urządzeń: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className={styles.customLegend}>
        {payload.map((entry, index: number) => (
          <div key={index} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{renameDeviceType(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const onPieEnter = (_, index: number | null) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Rozkład urządzeń według typów</h2>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceData}
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
              {deviceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
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
