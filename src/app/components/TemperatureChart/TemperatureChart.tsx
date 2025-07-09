import TemperatureChartClient from "./TemperatureChartClient";
import styles from "./TemperatureChart.module.scss";
import RoomSelect from "./RoomSelect/RoomSelect";
import { RoomType } from "@/types/types";
import { getTemperatureDataByRoom } from "./actions";
import "../../globals.scss";

export default async function TemperatureChart({
  selectedRoom,
}: {
  selectedRoom: RoomType;
}) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const rawData = await getTemperatureDataByRoom(selectedRoom);

  if (!rawData.success) {
    return (
      <div className="container">
        <div>Błąd: {rawData.error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <h2 className={styles.title}>Monitorowanie Temperatury - Smart Home</h2>
        <p className={styles.subtitle}>
          Wykres temperatury z ostatnich 24 godzin dla wszystkich czujników w
          domu
        </p>
      </div>
      <RoomSelect />
      {/* render client chart */}
      <TemperatureChartClient rawData={rawData.data} />
    </div>
  );
}
