import { Lightbulb, Power, Settings, Zap } from "lucide-react";
import { getRoomsWithLights } from "./actions";
import { RoomLightControl } from "./RoomLightControl/RoomLightControl";
import styles from "./LightControlWidget.module.scss";

interface LightControlWidgetProps {
  className?: string;
}

export async function LightControlWidget({
  className,
}: LightControlWidgetProps) {
  const rooms = await getRoomsWithLights();

  console.log(rooms);

  // Calculate statistics
  const totalLights = rooms.reduce((acc, room) => acc + room.devices.length, 0);

  const onlineLights = rooms.reduce(
    (acc, room) =>
      acc + room.devices.filter((d) => d.status === "online").length,
    0
  );
  const activeLights = rooms.reduce(
    (acc, room) => acc + room.devices.filter((d) => d.light?.isOn).length,
    0
  );

  return (
    <div className={`${styles.widget} ${className || ""}`}>
      {/* Widget Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Lightbulb className={styles.titleIcon} />
          <h2 className={styles.title}>Light Control</h2>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{activeLights}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{onlineLights}</span>
            <span className={styles.statLabel}>Online</span>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className={styles.roomsList}>
        {rooms.length === 0 ? (
          <div className={styles.emptyState}>
            <Zap className={styles.emptyIcon} />
            <p className={styles.emptyText}>No lights found</p>
          </div>
        ) : (
          rooms.map((room) => <RoomLightControl key={room.id} room={room} />)
        )}
      </div>
    </div>
  );
}
