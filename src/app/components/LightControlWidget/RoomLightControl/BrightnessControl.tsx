"use client";

import { Minus, Plus } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { setRoomBrightness } from "../actions";
import { useState, useTransition } from "react";
import { Room } from "../types";

const BrightnessControl = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();
  const [brightness, setBrightness] = useState(
    room.devices.length > 0
      ? Math.round(
          room.devices.reduce(
            (acc, device) => acc + (device.light?.brightness || 0),
            0
          ) / room.devices.length
        )
      : 0
  );

  //   change brightness
  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness);
    startTransition(async () => {
      await setRoomBrightness(room.id, newBrightness);
    });
  };

  return (
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
        onClick={() => handleBrightnessChange(Math.min(100, brightness + 10))}
        disabled={isPending || brightness >= 100}
        className={styles.brightnessButton}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
export default BrightnessControl;
