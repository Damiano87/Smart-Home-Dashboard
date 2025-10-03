"use client";

import { Thermometer } from "lucide-react";
import ChangeTargetTempBtns from "./ChangeTargetTempBtns";
import styles from "./AirConditionerWidget.module.scss";
import { AirConditionerData } from "./actions";
import { useOptimistic } from "react";

const TemperatureSection = ({ ac }: { ac: AirConditionerData }) => {
  // optimistic update of target tempearature
  const [optimisticTemp, setOptimisticTemp] = useOptimistic(
    ac.targetTemp,
    (state, newTemp: number) => newTemp
  );

  return (
    <div className={styles.temperatureSection}>
      <div className={styles.tempDisplay}>
        <div className={styles.currentTemp}>
          <Thermometer size={16} />
          <span className={styles.tempValue}>{ac.currentTemp}°C</span>
          <span className={styles.tempLabel}>current</span>
        </div>
        <div className={styles.targetTemp}>
          <span className={styles.tempValue}>{optimisticTemp}°C</span>
          <span className={styles.tempLabel}>target</span>
        </div>
        <div className={styles.flex}>
          <ChangeTargetTempBtns
            acId={ac.id}
            setOptimisticTemp={setOptimisticTemp}
            optimisticTemp={optimisticTemp}
          />
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
              {ac.temperatureDiff > 0 ? (
                <div className={styles.flex}>
                  <span>±</span>
                  <span>{`${ac.temperatureDiff.toFixed(1)}°C`}</span>
                </div>
              ) : (
                "OK"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TemperatureSection;
