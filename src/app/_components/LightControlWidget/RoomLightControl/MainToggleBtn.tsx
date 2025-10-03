"use client";

import { useTransition } from "react";
import { toggleRoomLights } from "../actions";
import styles from "../LightControlWidget.module.scss";
import { Power } from "lucide-react";
import { Device } from "../types";

type MainToggleProps = {
  roomId: string;
  isAnyLightOn: boolean;
  onlineLights: Device[];
};

const MainToggleBtn = ({
  roomId,
  isAnyLightOn,
  onlineLights,
}: MainToggleProps) => {
  const [isPending, startTransition] = useTransition();

  const handleRoomToggle = () => {
    startTransition(async () => {
      await toggleRoomLights(roomId, !isAnyLightOn);
    });
  };

  return (
    <button
      onClick={handleRoomToggle}
      disabled={isPending || onlineLights.length === 0}
      className={`${styles.toggleButton} ${isAnyLightOn ? styles.active : ""} ${
        isPending ? styles.loading : ""
      }`}
    >
      <Power size={16} />
    </button>
  );
};
export default MainToggleBtn;
