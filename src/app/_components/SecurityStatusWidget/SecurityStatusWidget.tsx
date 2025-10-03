import { getSecurityStatus, SecurityStatus } from "./actions";
import styles from "../../../styles/WidgetBase.module.scss";
import { Shield, Eye, AlertTriangle, CheckCircle } from "lucide-react";

export default async function SecurityStatusWidget() {
  const data: SecurityStatus = await getSecurityStatus();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "secure":
        return {
          className: styles.statusSecure,
          text: "Secure",
          icon: CheckCircle,
        };
      case "warning":
        return {
          className: styles.statusWarning,
          text: "Warning",
          icon: AlertTriangle,
        };
      case "alert":
        return {
          className: styles.statusAlert,
          text: "Alert",
          icon: AlertTriangle,
        };
      default:
        return {
          className: styles.statusSecure,
          text: "Unknown",
          icon: Shield,
        };
    }
  };

  const statusInfo = getStatusInfo(data.status);
  const StatusIcon = statusInfo.icon;
  const activePercentage =
    data.totalMotionSensors > 0
      ? (data.motionSensorsActive / data.totalMotionSensors) * 100
      : 0;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Shield className={styles.icon} />
        </div>
        <h3 className={styles.title}>Security status</h3>
        <div className={`${styles.statusBadge} ${statusInfo.className}`}>
          <StatusIcon size={12} />
          <span> {statusInfo.text}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sensorsOverview}>
          <div className={styles.activeSensors}>
            <span className={styles.activeCount}>
              {data.motionSensorsActive}
            </span>
            <span className={styles.totalCount}>
              /{data.totalMotionSensors}
            </span>
            <span className={styles.sensorsLabel}>active sensors</span>
          </div>
          <div className={styles.activePercentage}>
            <span className={styles.percentageValue}>
              {Math.round(activePercentage)}%
            </span>
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <Eye size={16} />
            </div>
            <div className={styles.detailInfo}>
              <span className={styles.detailValue}>{data.recentEvents}</span>
              <span className={styles.detailLabel}>detections (1h)</span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <Shield size={16} />
            </div>
            <div className={styles.detailInfo}>
              <span className={styles.detailValue}>
                {data.totalMotionSensors - data.motionSensorsActive}
              </span>
              <span className={styles.detailLabel}>inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
