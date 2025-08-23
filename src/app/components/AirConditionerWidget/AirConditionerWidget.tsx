import { getAirConditioners, AirConditionerData } from "./actions";
import styles from "./AirConditionerWidget.module.scss";
import { Snowflake } from "lucide-react";
import "../../globals.scss";
import SpecificRoom from "./SpecificRoom";

export default async function AirConditionerWidget() {
  const airConditioners: AirConditionerData[] = await getAirConditioners();

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
            <SpecificRoom key={ac.id} ac={ac} />
          ))}
        </div>
      </div>
    </div>
  );
}
