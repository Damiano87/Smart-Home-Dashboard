import { SignOut } from "./components/SignOut/SignOut";
import { auth } from "@/lib/auth";
import TemperatureChart from "./components/TemperatureChart/TemperatureChart";
import { RoomType } from "@/types/types";

const Page = async ({
  searchParams,
}: {
  searchParams?: { room?: RoomType };
}) => {
  const selectedRoom = searchParams?.room ?? "all";
  // const session = await auth();

  // console.log(session);

  // if (!session) redirect("/sign-in");

  return (
    <>
      <TemperatureChart selectedRoom={selectedRoom} />
    </>
  );
};

export default Page;
