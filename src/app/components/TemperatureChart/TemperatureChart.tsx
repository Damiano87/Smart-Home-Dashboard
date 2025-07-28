import TemperatureChartClient from "./TemperatureChartClient";
import styles from "./TemperatureChart.module.scss";
import { RoomType } from "@/types/types";
import { getTemperatureDataByRoom } from "./actions";
import "../../globals.scss";
import RoomSelector from "./RoomSelect/RoomSelect";

export default async function TemperatureChart({
  selectedRoom,
}: {
  selectedRoom: RoomType;
}) {
  const tempData = getTemperatureDataByRoom(selectedRoom);

  return (
    <div className="container">
      <div className={styles.header}>
        <h2 className="chartTitle">Temperature monitor</h2>
        <p className="chartSubtitle">Last 24 hours</p>
      </div>
      {/* render room select component */}
      <RoomSelector />
      {/* render client chart */}
      <TemperatureChartClient tempData={tempData} />
    </div>
  );
}
