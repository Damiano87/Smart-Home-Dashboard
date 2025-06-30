"use client";

import { useState, useEffect } from "react";
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

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [devices, setDevices] = useState([]);

  // Symulacja danych z bazy danych zgodnie ze schematem Prisma
  useEffect(() => {
    const generateMockData = () => {
      const mockDevices = [
        { id: "1", name: "Czujnik Salon", roomName: "Salon" },
        { id: "2", name: "Czujnik Sypialnia", roomName: "Sypialnia" },
        { id: "3", name: "Czujnik Kuchnia", roomName: "Kuchnia" },
      ];

      const mockData = [];
      const now = new Date();

      // Generujemy dane z ostatnich 24 godzin
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const timeLabel = timestamp.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const dataPoint = {
          timestamp: timestamp.toISOString(),
          time: timeLabel,
          salon: 21 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5,
          sypialnia: 19 + Math.cos(i * 0.2) * 1.5 + Math.random() * 0.3,
          kuchnia: 23 + Math.sin(i * 0.4) * 3 + Math.random() * 0.7,
        };

        mockData.push(dataPoint);
      }

      setDevices(mockDevices);
      setTemperatureData(mockData);
      setLoading(false);
    };

    // Symulacja opóźnienia ładowania danych
    setTimeout(generateMockData, 1000);
  }, []);

  const formatTooltip = (value, name) => {
    const deviceNames = {
      salon: "Salon",
      sypialnia: "Sypialnia",
      kuchnia: "Kuchnia",
    };

    return [`${value?.toFixed(1)}°C`, deviceNames[name] || name];
  };

  const formatYAxis = (value) => `${value}°C`;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingHeader}></div>
          <div className={styles.loadingChart}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loadingHeader}>
        <h2 className={styles.title}>Monitorowanie Temperatury - Smart Home</h2>
        <p className={styles.subtitle}>
          Wykres temperatury z ostatnich 24 godzin dla wszystkich czujników w
          domu
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersRow}>
          <span className={styles.filtersLabel}>Filtry:</span>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className={styles.select}
          >
            <option value="all">Wszystkie pomieszczenia</option>
            <option value="salon">Tylko Salon</option>
            <option value="sypialnia">Tylko Sypialnia</option>
            <option value="kuchnia">Tylko Kuchnia</option>
          </select>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={temperatureData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.3 }} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatYAxis}
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
              }}
            />
            <Legend />

            {(selectedDevice === "all" || selectedDevice === "salon") && (
              <Line
                type="monotone"
                dataKey="salon"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                name="Salon"
              />
            )}

            {(selectedDevice === "all" || selectedDevice === "sypialnia") && (
              <Line
                type="monotone"
                dataKey="sypialnia"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                name="Sypialnia"
              />
            )}

            {(selectedDevice === "all" || selectedDevice === "kuchnia") && (
              <Line
                type="monotone"
                dataKey="kuchnia"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                name="Kuchnia"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.statsGrid}>
        <div className={{ ...statCardStyle, ...statCardBlueStyle }}>
          <div className={statCardContentStyle}>
            <span className={statCardLabelBlueStyle}>Salon</span>
            <span className={statCardValueBlueStyle}>
              {temperatureData.length > 0
                ? `${temperatureData[temperatureData.length - 1].salon.toFixed(
                    1
                  )}°C`
                : "--°C"}
            </span>
          </div>
          <p className={statCardDescriptionBlueStyle}>Ostatni odczyt</p>
        </div>

        <div className={{ ...statCardStyle, ...statCardGreenStyle }}>
          <div className={statCardContentStyle}>
            <span className={statCardLabelGreenStyle}>Sypialnia</span>
            <span className={statCardValueGreenStyle}>
              {temperatureData.length > 0
                ? `${temperatureData[
                    temperatureData.length - 1
                  ].sypialnia.toFixed(1)}°C`
                : "--°C"}
            </span>
          </div>
          <p className={statCardDescriptionGreenStyle}>Ostatni odczyt</p>
        </div>

        <div className={{ ...statCardStyle, ...statCardYellowStyle }}>
          <div className={statCardContentStyle}>
            <span className={statCardLabelYellowStyle}>Kuchnia</span>
            <span className={statCardValueYellowStyle}>
              {temperatureData.length > 0
                ? `${temperatureData[
                    temperatureData.length - 1
                  ].kuchnia.toFixed(1)}°C`
                : "--°C"}
            </span>
          </div>
          <p className={statCardDescriptionYellowStyle}>Ostatni odczyt</p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;
