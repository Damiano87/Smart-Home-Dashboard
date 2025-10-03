import IndividualToggleBtn from "./IndividualToggleBtn";
import { Wifi, WifiOff } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { Device } from "../types";

type IndividualLightsProps = {
  devices: Device[];
  isExpanded: boolean;
};

const IndividualLights = ({ devices, isExpanded }: IndividualLightsProps) => {
  return (
    <div>
      {isExpanded && devices.length > 0 && (
        <div className={styles.individualLights}>
          {devices.map((device) => (
            <div key={device.id} className={styles.lightItem}>
              <div className={styles.lightInfo}>
                <span className={styles.lightName}>{device.name}</span>
                <div className={styles.lightStatus}>
                  {device.status === "online" ? (
                    <Wifi size={12} className={styles.onlineIcon} />
                  ) : (
                    <WifiOff size={12} className={styles.offlineIcon} />
                  )}
                  <span className={styles.lightBrightness}>
                    {device.light?.brightness || 0}%
                  </span>
                </div>
              </div>
              <IndividualToggleBtn device={device} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default IndividualLights;
