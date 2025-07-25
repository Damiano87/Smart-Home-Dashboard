import DynamicClientWrapper from "../DynamicClientWrapper";
import { getRadarChartData } from "./actions";

const RadarChart = async () => {
  const radarData = await getRadarChartData();

  return <DynamicClientWrapper data={radarData} componentName="RadarChart" />;
};
export default RadarChart;
