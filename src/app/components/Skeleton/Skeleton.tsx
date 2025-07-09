import styles from "./Skeleton.module.scss";
import React from "react";

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Skeleton = ({ className = "", style }: SkeletonProps) => {
  return <div className={`${styles.skeleton} ${className}`} style={style} />;
};

export default Skeleton;
