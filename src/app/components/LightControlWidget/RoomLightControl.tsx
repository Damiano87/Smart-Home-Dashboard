"use client";

import { use, useState, useTransition } from "react";
import {
  Home,
  Power,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import { RoomWithLights } from "./types";
import {
  toggleRoomLights,
  setRoomBrightness,
  toggleIndividualLight,
} from "./actions";
import styles from "./LightControlWidget.module.scss";
import { renameRoom } from "@/utils/functions";

interface RoomLightControlProps {
  room: RoomWithLights;
}

export function RoomLightControl({ room }: RoomLightControlProps) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const room_ = use(room);
  const [brightness, setBrightness] = useState(
    room_.devices.length > 0
      ? Math.round(
          room_.devices.reduce(
            (acc, device) => acc + (device.light?.brightness || 0),
            0
          ) / room_.devices.length
        )
      : 0
  );

  const onlineLights = room_.devices.filter(
    (device) => device.status === "online"
  );
  const activeLights = onlineLights.filter((device) => device.light?.isOn);
  const isAnyLightOn = activeLights.length > 0;
  const allLightsOn =
    activeLights.length === onlineLights.length && onlineLights.length > 0;

  const handleRoomToggle = () => {
    startTransition(async () => {
      await toggleRoomLights(room_.id, !isAnyLightOn);
    });
  };

  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness);
    startTransition(async () => {
      await setRoomBrightness(room_.id, newBrightness);
    });
  };

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
            <h3 className={styles.roomName}>{renameRoom(room_.name)}</h3>
            <span className={styles.roomMeta}>
              {activeLights.length} of {onlineLights.length} lights on
              {room_.devices.filter((d) => d.status === "offline").length >
                0 && (
                <span className={styles.offlineIndicator}>
                  • {room_.devices.filter((d) => d.status === "offline").length}{" "}
                  offline
                </span>
              )}
            </span>
          </div>
        </div>

        <div className={styles.roomControls}>
          {/* Main Toggle */}
          <button
            onClick={handleRoomToggle}
            disabled={isPending || onlineLights.length === 0}
            className={`${styles.toggleButton} ${
              isAnyLightOn ? styles.active : ""
            } ${isPending ? styles.loading : ""}`}
          >
            <Power size={16} />
          </button>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
            disabled={room_.devices.length === 0}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Brightness Control */}
      {isAnyLightOn && onlineLights.length > 0 && (
        <div className={styles.brightnessControl}>
          <button
            onClick={() => handleBrightnessChange(Math.max(0, brightness - 10))}
            disabled={isPending || brightness <= 0}
            className={styles.brightnessButton}
          >
            <Minus size={14} />
          </button>

          <div className={styles.brightnessSlider}>
            <div
              className={styles.brightnessProgress}
              style={{ width: `${brightness}%` }}
            />
            <span className={styles.brightnessValue}>{brightness}%</span>
          </div>

          <button
            onClick={() =>
              handleBrightnessChange(Math.min(100, brightness + 10))
            }
            disabled={isPending || brightness >= 100}
            className={styles.brightnessButton}
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {/* Individual Lights */}
      {isExpanded && room_.devices.length > 0 && (
        <div className={styles.individualLights}>
          {room_.devices.map((device) => (
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
