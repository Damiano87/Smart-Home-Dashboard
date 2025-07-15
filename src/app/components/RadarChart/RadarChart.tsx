import { getRadarChartData } from "./actions";
import RoomConditionsRadar from "./RadarChartClient";

const RadarChart = async () => {
  const radarData = await getRadarChartData();

  console.log(radarData.data);

  return <RoomConditionsRadar />;
};
export default RadarChart;
