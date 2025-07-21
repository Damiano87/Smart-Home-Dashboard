import { getRadarChartData } from "./actions";
import RoomConditionsRadar from "./RadarChartClient";

const RadarChart = async () => {
  const radarData = await getRadarChartData();

  return <RoomConditionsRadar radarData={radarData} />;
};
export default RadarChart;
