import { FC } from "react";
import { RiverInfo } from "../gauges";
import { getFlowColor } from "./plotLayout";
import moment from "moment";

interface IProps {
  value: number;
  gauge: RiverInfo;
}

export const CurrentFlow: FC<IProps> = ({ value, gauge }) => {
  return (
    <div style={{ fontSize: "0.9rem", color: "grey", position: "absolute" }}>
      <span
        style={{
          color: getFlowColor(value, gauge.min, gauge.max),
          fontWeight: "bold",
        }}
      >
        {Math.round(value)}cfs
      </span>{" "}
      {moment(value).fromNow()}
    </div>
  );
};
