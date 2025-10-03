"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "../LightControlWidget.module.scss";
import { Device } from "../types";

type ExpandBtnProps = {
  devices: Device[];
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExpandBtn = ({ devices, isExpanded, setIsExpanded }: ExpandBtnProps) => {
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
