"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./TemperatureChart.module.scss";
import { useMemo } from "react";
import { processTemperatureData } from "@/utils/functions";

export default function TemperatureChartClient({
  rawData,
}: {
  rawData: any[];
}) {
  console.log(rawData);

  // process data only when rawData changes
  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    return processTemperatureData(rawData);
  }, [rawData]);

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.3 }} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(1)}°C`}
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const deviceNames: Record<string, string> = {
                salon: "Salon",
                sypialnia: "Sypialnia",
                kuchnia: "Kuchnia",
              };
              return [`${value?.toFixed(1)}°C`, deviceNames[name] || name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="salon"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Salon"
          />
          <Line
            type="monotone"
            dataKey="sypialnia"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Sypialnia"
          />
          <Line
            type="monotone"
            dataKey="kuchnia"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Kuchnia"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
