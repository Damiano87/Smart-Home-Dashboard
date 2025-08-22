import { Power } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { useTransition } from "react";
import { toggleIndividualLight } from "../actions";
import { Device } from "../types";

const IndividualToggleBtn = ({ device }: { device: Device }) => {
  const [isPending, startTransition] = useTransition();

  // toggle individual light
  const handleIndividualToggle = (deviceId: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleIndividualLight(deviceId, !currentState);
    });
  };

  return (
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
  );
};
export default IndividualToggleBtn;
