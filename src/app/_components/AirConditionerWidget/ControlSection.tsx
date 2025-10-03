import { Timer, Leaf, Moon, Fan, RotateCcw } from "lucide-react";
import styles from "./AirConditionerWidget.module.scss";
import { AirConditionerData } from "./actions";

const ControlSection = ({ ac }: { ac: AirConditionerData }) => {
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

  return (
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
  );
};
export default ControlSection;
