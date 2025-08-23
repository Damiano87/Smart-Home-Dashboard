import { renameRoom } from "@/utils/functions";
import styles from "./AirConditionerWidget.module.scss";
import {
  Snowflake,
  Flame,
  Wind,
  Wifi,
  WifiOff,
  Fan,
  RotateCcw,
} from "lucide-react";
import { AirConditionerData } from "./actions";

const AcHeader = ({ ac }: { ac: AirConditionerData }) => {
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

  return (
    <div className={styles.acHeader}>
      <div className={styles.roomInfo}>
        <span className={styles.roomName}>{renameRoom(ac.roomName)}</span>
        <div className={styles.connectionStatus}>
          {ac.isOnline ? (
            <Wifi size={12} className={styles.statusOnline} />
          ) : (
            <WifiOff size={12} className={styles.statusOffline} />
          )}
        </div>
      </div>
      <div className={`${styles.modeIndicator} ${getModeColor(ac.mode)}`}>
        {getModeIcon(ac.mode)}
        <span>{ac.mode.toUpperCase()}</span>
      </div>
    </div>
  );
};
export default AcHeader;
