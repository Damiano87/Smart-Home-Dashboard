import TemperatureChartClient from "./TemperatureChartClient";
import styles from "./TemperatureChart.module.scss";
import { RoomType } from "@/types/types";
import { getTemperatureDataByRoom } from "./actions";
import "../../globals.scss";
import DynamicClientWrapper from "../DynamicClientWrapper";

export default async function TemperatureChart({
  selectedRoom,
}: {
  selectedRoom: RoomType;
}) {
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
        <h2 className="chartTitle">Temperature monitor</h2>
        <p className="chartSubtitle">Last 24 hours</p>
      </div>
      {/* render room select component */}
      <DynamicClientWrapper data={rawData} componentName="RoomSelect" />
      {/* render client chart */}
      <TemperatureChartClient data={rawData.data} />
    </div>
  );
}
