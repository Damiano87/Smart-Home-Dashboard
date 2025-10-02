"use client";

import { Minus, Plus } from "lucide-react";
import styles from "./AirConditionerWidget.module.scss";
import { changeTargetTemp } from "./actions";
import { useTransition } from "react";

const ChangeTargetTempBtns = ({
  acId,
  optimisticTemp,
  setOptimisticTemp,
}: {
  acId: string;
  optimisticTemp: number;
  setOptimisticTemp: (action: number) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  // sets new tempearature optimistically and in database
  const handleTempChange = async (operator: "+" | "-") => {
    const delta = operator === "+" ? 0.1 : -0.1;
    const newTemp = Math.round((optimisticTemp + delta) * 10) / 10;

    startTransition(async () => {
      setOptimisticTemp(newTemp);
      await changeTargetTemp(acId, operator);
    });
  };

  return (
    <div className={styles.changeTargetContainer}>
      {/* decrement temperature btn */}
      <button
        className={styles.targetTempBtn}
        title="Decrease target temperature"
        onClick={async () => handleTempChange("-")}
        disabled={isPending}
      >
        <Minus size={10} />
      </button>
      {/* increment temperature btn */}
      <button
        className={styles.targetTempBtn}
        title="Increase target temperature"
        onClick={async () => handleTempChange("+")}
        disabled={isPending}
      >
        <Plus size={10} />
      </button>
    </div>
  );
};
export default ChangeTargetTempBtns;
