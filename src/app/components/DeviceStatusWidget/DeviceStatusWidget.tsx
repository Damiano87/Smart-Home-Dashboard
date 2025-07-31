import { getDeviceStatus, DeviceStatus } from "./actions";
import styles from "../../../styles/WidgetBase.module.scss";
import { Wifi, WifiOff, Smartphone } from "lucide-react";

export default async function DeviceStatusWidget() {
  const data: DeviceStatus = await getDeviceStatus();

  const onlinePercentage =
    data.total > 0 ? (data.online / data.total) * 100 : 0;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Smartphone className={styles.icon} />
        </div>
        <h3 className={styles.title}>Status Urządzeń</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.summary}>
          <div className={styles.totalDevices}>
            <span className={styles.totalValue}>{data.total}</span>
            <span className={styles.totalLabel}> urządzeń</span>
          </div>
          <div className={styles.percentage}>
            <span className={styles.percentageValue}>
              {Math.round(onlinePercentage)}%
            </span>
            <span className={styles.percentageLabel}> online</span>
          </div>
        </div>

        <div className={styles.statusBar}>
          <div
            className={styles.statusProgress}
            style={{ width: `${onlinePercentage}%` }}
          />
        </div>

        <div className={styles.statusDetails}>
          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>
              <Wifi size={16} />
            </div>
            <span className={styles.statusCount}>{data.online}</span>
            <span className={styles.statusLabel}>Online</span>
          </div>

          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>
              <WifiOff size={16} />
            </div>
            <span className={styles.statusCount}>{data.offline}</span>
            <span className={styles.statusLabel}>Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
