import TemperatureChart from "./_components/TemperatureChart/TemperatureChart";
import { RoomType } from "@/types/types";
import Skeleton from "./_components/Skeleton/Skeleton";
import { Suspense } from "react";
import styles from "./page.module.scss";
import { getDeviceTypeDistribution } from "./_components/DeviceTypeChart/actions";
import DeviceTypesPieChart from "./_components/DeviceTypeChart/DeviceTypeChartClient";
import { getRadarChartData } from "./_components/RadarChart/actions";
import RoomConditionsRadar from "./_components/RadarChart/RadarChartClient";
import { getEnergyConsumptionData } from "./_components/EnergyConsumptionChart/actions";
import EnergyConsumptionChart from "./_components/EnergyConsumptionChart/EnergyConsChart";
import EnergyConsumptionWidget from "./_components/EnergyConsumptionWidget/EnergyConsumptionWidget";
import DeviceStatusWidget from "./_components/DeviceStatusWidget/DeviceStatusWidget";
import TemperatureWidget from "./_components/TemperatureWidget/TemperatureWidget";
import AirQualityWidget from "./_components/AirQualityWidget/AirQualityWidget";
import SecurityStatusWidget from "./_components/SecurityStatusWidget/SecurityStatusWidget";
import AirConditionersWidget from "./_components/AirConditionerWidget/AirConditionerWidget";
import { LightControlWidget } from "./_components/LightControlWidget/LightControlWidget";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<{ room?: RoomType }>;
}) => {
  const session = await auth();

  console.log("Session. Main component", session?.user);

  if (!session?.user) redirect("/sign-in");

  // get search params for select
  const resolvedSearchParams = await searchParams;
  const selectedRoom = resolvedSearchParams?.room ?? "all";

  // get device types from database
  const deviceData = getDeviceTypeDistribution();

  // get radar chart data
  const radarData = getRadarChartData();

  // get energy consumption data
  const energyConsumptionData = getEnergyConsumptionData();

  return (
    <div>
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
        <Suspense fallback={<Skeleton />}>
          <SecurityStatusWidget />
        </Suspense>
      </div>
      <div className={styles.acAndLight}>
        <Suspense fallback={<Skeleton />}>
          <AirConditionersWidget />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <LightControlWidget className={styles.customWidth} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
