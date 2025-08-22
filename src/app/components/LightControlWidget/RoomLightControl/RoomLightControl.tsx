"use client";

import { useState } from "react";
import { RoomWithLights } from "../types";
import styles from "../LightControlWidget.module.scss";
import MainToggleBtn from "./MainToggleBtn";
import ExpandBtn from "./ExpandBtn";
import BrightnessControl from "./BrightnessControl";
import IndividualLights from "./IndividualLights";
import RoomInfo from "./RoomInfo";

interface RoomLightControlProps {
  room: RoomWithLights;
}

export function RoomLightControl({ room }: RoomLightControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onlineLights = room.devices.filter(
    (device) => device.status === "online"
  );
  const activeLights = onlineLights.filter((device) => device.light?.isOn);
  const isAnyLightOn = activeLights.length > 0;

  return (
    <div className={styles.roomCard}>
      {/* Room Header */}
      <div className={styles.roomHeader}>
        <RoomInfo
          name={room.name}
          devices={room.devices}
          activeLights={activeLights}
          onlineLights={onlineLights}
        />

        <div className={styles.roomControls}>
          {/* Main Toggle */}
          <MainToggleBtn
            roomId={room.id}
            isAnyLightOn={isAnyLightOn}
            onlineLights={onlineLights}
          />

          {/* Expand Button */}
          <ExpandBtn
            devices={room.devices}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
      </div>

      {/* Brightness Control */}
      {isAnyLightOn && onlineLights.length > 0 && (
        <BrightnessControl room={room} />
      )}

      {/* Individual Lights */}
      <IndividualLights devices={room.devices} isExpanded={isExpanded} />
    </div>
  );
}
