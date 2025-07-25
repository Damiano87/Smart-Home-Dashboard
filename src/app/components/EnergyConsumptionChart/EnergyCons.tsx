import DynamicClientWrapper from "../DynamicClientWrapper";
import { getEnergyConsumptionData } from "./actions";

const EnergyCons = async () => {
  const energyConsumptionData = await getEnergyConsumptionData();

  return (
    <DynamicClientWrapper
      data={energyConsumptionData}
      componentName="EnergyConsumptionChart"
    />
  );
};
export default EnergyCons;
