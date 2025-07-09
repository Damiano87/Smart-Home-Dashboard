import { SignOut } from "./components/SignOut/SignOut";
import { auth } from "@/lib/auth";
import TemperatureChart from "./components/TemperatureChart/TemperatureChart";
import { RoomType } from "@/types/types";
import DeviceTypesPieChart from "./components/DeviceTypeChart/DeviceTypeChart";

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
    <>
      <TemperatureChart selectedRoom={selectedRoom} />
      <DeviceTypesPieChart />
    </>
  );
};

export default Page;
