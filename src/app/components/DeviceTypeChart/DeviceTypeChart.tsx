import { getDeviceTypeDistribution } from "./actions";
import DeviceTypesPieChart from "./DeviceTypeChartClient";

const DeviceTypeChart = async () => {
  // get device types from database
  const deviceData = await getDeviceTypeDistribution();

  return <DeviceTypesPieChart deviceData={deviceData} />;
};
export default DeviceTypeChart;
