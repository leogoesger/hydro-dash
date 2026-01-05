import { FC } from "react";
import { RiverInfo } from "../../gauges";
import { getFlowColor } from "../plotLayout";
import moment from "moment";

interface IProps {
  observedValue: number;
  observedDate: string;
  gauge: RiverInfo;
}

export const CurrentFlow: FC<IProps> = ({ observedDate, observedValue, gauge }) => {
  return (
    <div style={{ fontSize: "0.9rem", color: "grey", position: "absolute" }}>
      <span
        style={{
          color: getFlowColor(observedValue, gauge.min, gauge.max),
          fontWeight: "bold",
        }}
      >
        {Math.round(observedValue)}cfs
      </span>{" "}
      {moment(observedDate).fromNow()}
    </div>
  );
};
