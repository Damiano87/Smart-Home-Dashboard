"use client";

import { useState, useTransition } from "react";
import { Home, Power, Wifi, WifiOff } from "lucide-react";
import { RoomWithLights } from "../types";
import { toggleIndividualLight } from "../actions";
import styles from "../LightControlWidget.module.scss";
import { renameRoom } from "@/utils/functions";
import MainToggleBtn from "./MainToggleBtn";
import ExpandBtn from "./ExpandBtn";
import BrightnessControl from "./BrightnessControl";

interface RoomLightControlProps {
  room: RoomWithLights;
}

export function RoomLightControl({ room }: RoomLightControlProps) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);

  const onlineLights = room.devices.filter(
    (device) => device.status === "online"
  );
  const activeLights = onlineLights.filter((device) => device.light?.isOn);
  const isAnyLightOn = activeLights.length > 0;
  // const allLightsOn =
  //   activeLights.length === onlineLights.length && onlineLights.length > 0;

  const handleIndividualToggle = (deviceId: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleIndividualLight(deviceId, !currentState);
    });
  };

  return (
    <div className={styles.roomCard}>
      {/* Room Header */}
      <div className={styles.roomHeader}>
        <div className={styles.roomInfo}>
          <Home className={styles.roomIcon} />
          <div className={styles.roomDetails}>
            <h3 className={styles.roomName}>{renameRoom(room.name)}</h3>
            <span className={styles.roomMeta}>
              {activeLights.length} of {onlineLights.length} lights on
              {room.devices.filter((d) => d.status === "offline").length >
                0 && (
                <span className={styles.offlineIndicator}>
                  • {room.devices.filter((d) => d.status === "offline").length}{" "}
                  offline
                </span>
              )}
            </span>
          </div>
        </div>

        <div className={styles.roomControls}>
          {/* Main Toggle */}
          <MainToggleBtn
            roomId={room.id}
            isAnyLightOn={isAnyLightOn}
            onlineLights={onlineLights}
          />

          {/* Expand Button */}
          <ExpandBtn devices={room.devices} />
        </div>
      </div>

      {/* Brightness Control */}
      {isAnyLightOn && onlineLights.length > 0 && (
        <BrightnessControl room={room} />
      )}

      {/* Individual Lights */}
      {isExpanded && room.devices.length > 0 && (
        <div className={styles.individualLights}>
          {room.devices.map((device) => (
            <div key={device.id} className={styles.lightItem}>
              <div className={styles.lightInfo}>
                <span className={styles.lightName}>{device.name}</span>
                <div className={styles.lightStatus}>
                  {device.status === "online" ? (
                    <Wifi size={12} className={styles.onlineIcon} />
                  ) : (
                    <WifiOff size={12} className={styles.offlineIcon} />
                  )}
                  <span className={styles.lightBrightness}>
                    {device.light?.brightness || 0}%
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleIndividualToggle(device.id, device.light?.isOn || false)
                }
                disabled={isPending || device.status === "offline"}
                className={`${styles.lightToggle} ${
                  device.light?.isOn ? styles.active : ""
                }`}
              >
                <Power size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
