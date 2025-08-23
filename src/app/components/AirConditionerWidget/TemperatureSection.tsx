import { Thermometer } from "lucide-react";
import ChangeTargetTempBtns from "./ChangeTargetTempBtns";
import styles from "./AirConditionerWidget.module.scss";
import { AirConditionerData } from "./actions";

const TemperatureSection = ({ ac }: { ac: AirConditionerData }) => {
  return (
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
        <ChangeTargetTempBtns acId={ac.id} />
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
  );
};
export default TemperatureSection;
