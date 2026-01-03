import { FC } from "react";
import { UsgsCard } from "./usgsCard";
import { NoaaCard } from "./noaaCard";
import { CdecCard } from "./cdecCard";
import { RiverInfo } from "@/app/gauges";

interface IProps {
  key: string;
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export const FlowCard: FC<IProps> = ({ key, gauge, toggleGauge }) => {
  return gauge.type === "usgs" ? (
    <UsgsCard key={key} gauge={gauge} toggleGauge={toggleGauge} />
  ) : gauge.type === "noaa" ? (
    <NoaaCard key={key} gauge={gauge} toggleGauge={toggleGauge} />
  ) : (
    <CdecCard key={key} gauge={gauge} toggleGauge={toggleGauge} />
  );
};
