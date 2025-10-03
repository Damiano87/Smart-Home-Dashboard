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
import { use, useMemo } from "react";
import { processTemperatureData } from "@/utils/functions";
import { TempSensorData } from "@/types/types";
import "../../globals.scss";

type Temp = {
  data: TempSensorData[];
};

export default function TemperatureChartClient({
  tempData,
}: {
  tempData: Promise<Temp>;
}) {
  // use promise
  const data = use(tempData);

  // process data only when data changes
  const processedData = useMemo(() => {
    if (!data.data || data.data.length === 0) return [];
    return processTemperatureData(data.data);
  }, [data]);

  if (!data.success) {
    return (
      <div className="container">
        <div className="error">Błąd: {data.error}</div>
      </div>
    );
  }

  return (
    <div className="chartContainer">
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
            contentStyle={{ backgroundColor: "#171F12" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="salon"
            stroke="#2BABA1"
            strokeWidth={2}
            dot={{ r: 1 }}
            name="Living room"
          />
          <Line
            type="monotone"
            dataKey="sypialnia"
            stroke="#ABD006"
            strokeWidth={2}
            dot={{ r: 1 }}
            name="Bedroom"
          />
          <Line
            type="monotone"
            dataKey="kuchnia"
            stroke="#F5DC71"
            strokeWidth={2}
            dot={{ r: 1 }}
            name="Kitchen"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
