import TemperatureChartClient from "./TemperatureChartClient";
import styles from "./TemperatureChart.module.scss";
import RoomSelect from "./RoomSelect/RoomSelect";
import { RoomType } from "@/types/types";
import { getTemperatureDataByRoom } from "@/lib/actions";

export default async function TemperatureChart({
  searchParams,
}: {
  searchParams?: { room?: RoomType };
}) {
  const selectedRoom = searchParams?.room ?? "all";
  const rawData = await getTemperatureDataByRoom(selectedRoom);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Monitorowanie Temperatury - Smart Home</h2>
        <p className={styles.subtitle}>
          Wykres temperatury z ostatnich 24 godzin dla wszystkich czujników w
          domu
        </p>
      </div>
      <RoomSelect selectedRoom={selectedRoom} />
      {/* render client chart */}
      <TemperatureChartClient rawData={rawData} />
    </div>
  );
}

// const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);

// const handleDataChange = (data: TemperatureData[]) => {
//   setTemperatureData(data);
//   console.log("Nowe dane temperatury:", data);
// };

/* <RoomSelect
        onDataChange={handleDataChange}
        use24hData={false}
        className="mb-6"
      /> */
