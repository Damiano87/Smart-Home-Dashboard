import { getLast24hTemperatureData } from "../../../lib/actions";
import TemperatureChartClient from "./TemperatureChartClient";
import styles from "./TemperatureChart.module.scss";

export default async function TemperatureChart() {
  const rawData = await getLast24hTemperatureData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Monitorowanie Temperatury - Smart Home</h2>
        <p className={styles.subtitle}>
          Wykres temperatury z ostatnich 24 godzin dla wszystkich czujników w
          domu
        </p>
      </div>
      {/* render client chart */}
      <TemperatureChartClient rawData={rawData} />
    </div>
  );
}
