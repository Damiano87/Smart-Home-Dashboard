import { renameRoom } from "@/utils/functions";
import { Home } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { Device } from "../types";

type RoomInfoProps = {
  name: string;
  devices: Device[];
  activeLights: Device[];
  onlineLights: Device[];
};

const RoomInfo = ({
  name,
  devices,
  activeLights,
  onlineLights,
}: RoomInfoProps) => {
  return (
    <div className={styles.roomInfo}>
      <Home className={styles.roomIcon} />
      <div className={styles.roomDetails}>
        <h3 className={styles.roomName}>{renameRoom(name)}</h3>
        <span className={styles.roomMeta}>
          {activeLights.length} of {onlineLights.length} lights on
          {devices.filter((d) => d.status === "offline").length > 0 && (
            <span className={styles.offlineIndicator}>
              {"  "}• {devices.filter((d) => d.status === "offline").length}{" "}
              offline
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
export default RoomInfo;
