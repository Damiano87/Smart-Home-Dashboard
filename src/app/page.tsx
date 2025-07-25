import { SignOut } from "./components/SignOut/SignOut";
import { auth } from "@/lib/auth";
import TemperatureChart from "./components/TemperatureChart/TemperatureChart";
import { RoomType } from "@/types/types";
import DeviceTypeChart from "./components/DeviceTypeChart/DeviceTypeChart";
import Skeleton from "./components/Skeleton/Skeleton";
import { Suspense } from "react";
import styles from "./page.module.scss";
import RadarChart from "./components/RadarChart/RadarChart";
import EnergyCons from "./components/EnergyConsumptionChart/EnergyCons";

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<{ room?: RoomType }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const selectedRoom = resolvedSearchParams?.room ?? "all";
  // const session = await auth();

  // console.log(session);

  // if (!session) redirect("/sign-in");

  return (
    <div className={styles.mainGrid}>
      <Suspense fallback={<Skeleton />}>
        <TemperatureChart selectedRoom={selectedRoom} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DeviceTypeChart />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <RadarChart />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <EnergyCons />
      </Suspense>
    </div>
  );
};

export default Page;
