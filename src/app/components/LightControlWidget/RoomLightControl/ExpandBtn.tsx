"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { Device } from "../types";

const ExpandBtn = ({ devices }: { devices: Device[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={styles.expandButton}
      disabled={devices.length === 0}
    >
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
};
export default ExpandBtn;
