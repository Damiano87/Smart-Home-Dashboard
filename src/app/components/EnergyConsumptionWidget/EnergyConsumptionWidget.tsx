import { getEnergyConsumption } from "./actions";
import styles from "../../../styles/WidgetBase.module.scss";
import { Zap, DollarSign } from "lucide-react";

export default async function EnergyConsumptionWidget() {
  const data = await getEnergyConsumption();

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Zap className={styles.icon} />
        </div>
        <h3 className={styles.title}>Energy consumption</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.mainMetric}>
          <span className={styles.value}>{data.totalPower}</span>
          <span className={styles.unit}>kWh</span>
          <span className={styles.period}>today</span>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <DollarSign size={16} />
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricValue}>{data.totalCost} PLN</span>
              <span className={styles.metricLabel}>estimated cost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
