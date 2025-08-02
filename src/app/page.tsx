import { SignOut } from "./components/SignOut/SignOut";
import { auth } from "@/lib/auth";
import TemperatureChart from "./components/TemperatureChart/TemperatureChart";
import { RoomType } from "@/types/types";
import Skeleton from "./components/Skeleton/Skeleton";
import { Suspense } from "react";
import styles from "./page.module.scss";
import { getDeviceTypeDistribution } from "./components/DeviceTypeChart/actions";
import DeviceTypesPieChart from "./components/DeviceTypeChart/DeviceTypeChartClient";
import { getRadarChartData } from "./components/RadarChart/actions";
import RoomConditionsRadar from "./components/RadarChart/RadarChartClient";
import { getEnergyConsumptionData } from "./components/EnergyConsumptionChart/actions";
import EnergyConsumptionChart from "./components/EnergyConsumptionChart/EnergyConsChart";
import EnergyConsumptionWidget from "./components/EnergyConsumptionWidget/EnergyConsumptionWidget";
import DeviceStatusWidget from "./components/DeviceStatusWidget/DeviceStatusWidget";
import TemperatureWidget from "./components/TemperatureWidget/TemperatureWidget";
import AirQualityWidget from "./components/AirQualityWidget/AirQualityWidget";

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<{ room?: RoomType }>;
}) => {
  // get search params for select
  const resolvedSearchParams = await searchParams;
  const selectedRoom = resolvedSearchParams?.room ?? "all";

  // get device types from database
  const deviceData = getDeviceTypeDistribution();

  // get radar chart data
  const radarData = getRadarChartData();

  // get energy consumption data
  const energyConsumptionData = getEnergyConsumptionData();

  // const session = await auth();

  // console.log(session);

  // if (!session) redirect("/sign-in");

  return (
    <div className={styles.mainGrid}>
      <Suspense fallback={<Skeleton />}>
        <TemperatureChart selectedRoom={selectedRoom} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DeviceTypesPieChart deviceData={deviceData} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <RoomConditionsRadar radarData={radarData} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <EnergyConsumptionChart consumptionData={energyConsumptionData} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <EnergyConsumptionWidget />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DeviceStatusWidget />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <TemperatureWidget />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <AirQualityWidget />
      </Suspense>
    </div>
  );
};

export default Page;
