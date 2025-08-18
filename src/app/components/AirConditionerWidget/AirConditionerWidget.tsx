import { getAirConditioners, AirConditionerData } from "./actions";
import styles from "./AirConditionerWidget.module.scss";
import {
  Snowflake,
  Flame,
  Wind,
  Timer,
  Leaf,
  Moon,
  Wifi,
  WifiOff,
  Thermometer,
  Fan,
  RotateCcw,
} from "lucide-react";
import "../../globals.scss";
import { renameRoom } from "@/utils/functions";

export default async function AirConditionerWidget() {
  const airConditioners: AirConditionerData[] = await getAirConditioners();

  console.log(airConditioners);

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cool":
        return <Snowflake size={16} />;
      case "heat":
        return <Flame size={16} />;
      case "fan":
        return <Fan size={16} />;
      case "auto":
        return <RotateCcw size={16} />;
      default:
        return <Wind size={16} />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cool":
        return styles.modeCool;
      case "heat":
        return styles.modeHeat;
      case "fan":
        return styles.modeFan;
      case "auto":
        return styles.modeAuto;
      default:
        return styles.modeOff;
    }
  };

  const getFanSpeedBars = (speed: string) => {
    const levels = { low: 1, medium: 2, high: 3, auto: 3 };
    const level = levels[speed.toLowerCase() as keyof typeof levels] || 0;
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`${styles.fanBar} ${i < level ? styles.fanBarActive : ""}`}
      />
    ));
  };

  const formatTime = (date?: Date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (airConditioners.length === 0) {
    return (
      <div className={styles.widget}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Snowflake className={styles.icon} />
          </div>
          <h3 className={styles.title}>Air conditioners</h3>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No air conditioners</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Snowflake className={styles.icon} />
        </div>
        <h3 className={styles.title}>Air conditioners</h3>
        <div className={styles.summary}>
          <span className={styles.count}>{airConditioners.length}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.acList}>
          {airConditioners.map((ac) => (
            <div key={ac.id} className={styles.acItem}>
              <div className={styles.acHeader}>
                <div className={styles.roomInfo}>
                  <span className={styles.roomName}>
                    {renameRoom(ac.roomName)}
                  </span>
                  <div className={styles.connectionStatus}>
                    {ac.isOnline ? (
                      <Wifi size={12} className={styles.statusOnline} />
                    ) : (
                      <WifiOff size={12} className={styles.statusOffline} />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.modeIndicator} ${getModeColor(ac.mode)}`}
                >
                  {getModeIcon(ac.mode)}
                  <span>{ac.mode.toUpperCase()}</span>
                </div>
              </div>

              <div className={styles.temperatureSection}>
                <div className={styles.tempDisplay}>
                  <div className={styles.currentTemp}>
                    <Thermometer size={16} />
                    <span className={styles.tempValue}>{ac.currentTemp}°C</span>
                    <span className={styles.tempLabel}>current</span>
                  </div>
                  <div className={styles.targetTemp}>
                    <span className={styles.tempValue}>{ac.targetTemp}°C</span>
                    <span className={styles.tempLabel}>target</span>
                  </div>
                </div>

                <div className={styles.tempDiff}>
                  <div
                    className={`${styles.diffIndicator} ${
                      ac.temperatureDiff <= 1
                        ? styles.diffGood
                        : ac.temperatureDiff <= 3
                        ? styles.diffMedium
                        : styles.diffHigh
                    }`}
                  >
                    {ac.temperatureDiff > 0
                      ? `± ${ac.temperatureDiff.toFixed(1)}°C`
                      : "OK"}
                  </div>
                </div>
              </div>

              <div className={styles.controlsSection}>
                <div className={styles.fanSection}>
                  <div className={styles.fanLabel}>
                    <Fan size={12} />
                    <span>Fan: {ac.fanSpeed}</span>
                  </div>
                  <div className={styles.fanIndicator}>
                    {getFanSpeedBars(ac.fanSpeed)}
                  </div>
                </div>

                <div className={styles.featuresSection}>
                  <div className={styles.features}>
                    {ac.swing && (
                      <div className={styles.feature}>
                        <RotateCcw size={12} />
                        <span>Swing</span>
                      </div>
                    )}
                    {ac.ecoMode && (
                      <div className={styles.feature}>
                        <Leaf size={12} />
                        <span>Eco</span>
                      </div>
                    )}
                    {ac.sleepMode && (
                      <div className={styles.feature}>
                        <Moon size={12} />
                        <span>Sleep</span>
                      </div>
                    )}
                  </div>

                  {(ac.timerOn || ac.timerOff) && (
                    <div className={styles.timer}>
                      <Timer size={12} />
                      <span>
                        {ac.timerOn && formatTime(ac.timerOn)} -{" "}
                        {ac.timerOff && formatTime(ac.timerOff)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
