"use client";

import { Minus, Plus } from "lucide-react";
import styles from "./AirConditionerWidget.module.scss";
import { changeTargetTemp } from "./actions";

const ChangeTargetTempBtns = ({ acId }: { acId: string }) => {
  return (
    <div className={styles.changeTargetContainer}>
      {/* decrement temperature btn */}
      <button
        className={styles.targetTempBtn}
        title="Decrease target temperature"
        onClick={async () => await changeTargetTemp(acId, "-")}
      >
        <Minus size={16} />
      </button>
      {/* increment temperature btn */}
      <button
        className={styles.targetTempBtn}
        title="Increase target temperature"
        onClick={async () => await changeTargetTemp(acId, "+")}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
export default ChangeTargetTempBtns;
