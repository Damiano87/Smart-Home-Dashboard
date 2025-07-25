"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import Skeleton from "./Skeleton/Skeleton";

// map of available components
const componentMap = {
  EnergyConsumptionChart: dynamic(
    () => import("../components/EnergyConsumptionChart/EnergyConsChart"),
    {
      ssr: false,
      loading: () => <Skeleton />,
    }
  ),
  TemperatureChart: dynamic(
    () => import("../components/TemperatureChart/TemperatureChartClient"),
    {
      ssr: false,
      loading: () => <Skeleton />,
    }
  ),
  RoomSelect: dynamic(
    () => import("../components/TemperatureChart/RoomSelect/RoomSelect"),
    {
      ssr: false,
      loading: () => <Skeleton />,
    }
  ),
  RadarChart: dynamic(
    () => import("../components/RadarChart/RadarChartClient"),
    {
      ssr: false,
      loading: () => <Skeleton />,
    }
  ),
} as const;

type ComponentName = keyof typeof componentMap;

type Props = {
  data?: any;
  componentName: ComponentName;
};

const DynamicClientWrapper = ({ data, componentName }: Props) => {
  const preparedData = useMemo(() => data, [data]);

  const DynamicComponent = componentMap[componentName];

  if (!DynamicComponent) {
    console.error(`Component "${componentName}" not found in componentMap`);
    return <Skeleton />;
  }

  return <DynamicComponent data={preparedData} />;
};

export default DynamicClientWrapper;
