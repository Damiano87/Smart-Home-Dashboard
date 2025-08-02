import { getAirQuality, AirQualityData } from "./actions";
import styles from "../../../styles/WidgetBase.module.scss";
import { Wind, Droplets, Gauge } from "lucide-react";

export default async function AirQualityWidget() {
  const data: AirQualityData = await getAirQuality();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return { className: styles.badgeGood, text: "Good" };
      case "moderate":
        return { className: styles.badgeWarning, text: "Moderate" };
      case "poor":
        return { className: styles.badgeError, text: "Poor" };
      default:
        return { className: styles.badgeGood, text: "No data" };
    }
  };

  const statusBadge = getStatusBadge(data.status);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Wind className={styles.icon} />
        </div>
        <h3 className={styles.title}>Air quality</h3>
        <span className={`${styles.badge} ${statusBadge.className}`}>
          {statusBadge.text}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainMetric}>
          <span className={styles.value}>{data.averageCO2}</span>
          <span className={styles.unit}>ppm</span>
          <span className={styles.period}>CO₂</span>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <Droplets size={16} />
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricValue}>
                {data.averageHumidity}%
              </span>
              <span className={styles.metricLabel}>humidity</span>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <Gauge size={16} />
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricValue}>
                {data.averageAirQuality}
              </span>
              <span className={styles.metricLabel}>quality index</span>
            </div>
          </div>
        </div>

        <div className={styles.qualityBar}>
          <div className={styles.qualityScale}>
            <div className={styles.scaleSegment} data-quality="good" />
            <div className={styles.scaleSegment} data-quality="moderate" />
            <div className={styles.scaleSegment} data-quality="poor" />
          </div>
          <div
            className={styles.qualityIndicator}
            style={{
              left: `${
                data.status === "good"
                  ? 16.67
                  : data.status === "moderate"
                  ? 50
                  : 83.33
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
