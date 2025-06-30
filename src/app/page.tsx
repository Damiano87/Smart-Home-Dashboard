import { SignOut } from "./components/SignOut/SignOut";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TemperatureChart from "./components/TemperatureChart/TemperatureChart";

const Page = async () => {
  // const session = await auth();

  // console.log(session);

  // if (!session) redirect("/sign-in");

  return (
    <>
      <TemperatureChart />
    </>
  );
};

export default Page;
