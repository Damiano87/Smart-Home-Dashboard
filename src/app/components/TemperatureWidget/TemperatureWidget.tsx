import { getAverageTemperature, TemperatureData } from "./actions";
import styles from "../../../styles/WidgetBase.module.scss";
import { Thermometer, TrendingUp, TrendingDown, Home } from "lucide-react";

export default async function TemperatureWidget() {
  const data: TemperatureData = await getAverageTemperature();

  // adapt color
  const getTemperatureColor = (temp: number) => {
    if (temp < 18) return styles.cold;
    if (temp > 24) return styles.warm;
    return styles.optimal;
  };

  // rename if room count is 1
  const rename = (count: number) => {
    return count === 1 ? "room" : "rooms";
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Thermometer className={styles.icon} />
        </div>
        <h3 className={styles.title}>Average temperature</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.mainTemperature}>
          <span
            className={`${styles.temperature} ${getTemperatureColor(
              data.average
            )}`}
          >
            {data.average}°C
          </span>
          <div className={styles.roomInfo}>
            <Home size={14} />
            <span>
              {data.roomCount} {rename(data.roomCount)}
            </span>
          </div>
        </div>

        <div className={styles.temperatureRange}>
          <div className={styles.rangeItem}>
            <div className={styles.rangeIcon}>
              <TrendingDown size={16} />
            </div>
            <div className={styles.rangeInfo}>
              <span className={styles.rangeValue}>{data.min}°C</span>
              <span className={styles.rangeLabel}>minimum</span>
            </div>
          </div>

          <div className={styles.rangeDivider} />

          <div className={styles.rangeItem}>
            <div className={styles.rangeIcon}>
              <TrendingUp size={16} />
            </div>
            <div className={styles.rangeInfo}>
              <span className={styles.rangeValue}>{data.max}°C</span>
              <span className={styles.rangeLabel}>maximum</span>
            </div>
          </div>
        </div>

        <div className={styles.temperatureBar}>
          <div className={styles.temperatureScale}>
            <div className={styles.scaleSegment} data-temp="cold" />
            <div className={styles.scaleSegment} data-temp="optimal" />
            <div className={styles.scaleSegment} data-temp="warm" />
          </div>
          <div
            className={styles.temperatureIndicator}
            style={{
              left: `${Math.max(
                0,
                Math.min(100, ((data.average - 15) / 15) * 100)
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
