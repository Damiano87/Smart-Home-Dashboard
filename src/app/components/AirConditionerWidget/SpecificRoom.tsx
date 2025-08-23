import styles from "./AirConditionerWidget.module.scss";
import { AirConditionerData } from "./actions";
import TemperatureSection from "./TemperatureSection";
import AcHeader from "./AcHeader";
import ControlSection from "./ControlSection";

const SpecificRoom = ({ ac }: { ac: AirConditionerData }) => {
  return (
    <div className={styles.acItem}>
      <AcHeader ac={ac} />
      <TemperatureSection ac={ac} />
      <ControlSection ac={ac} />
    </div>
  );
};
export default SpecificRoom;
