import { FC } from "react";
import { UsgsCard } from "./usgsCard";
import { NoaaCard } from "./noaaCard";
import { CdecCard } from "./cdecCard";
import { EidCard } from "./eidCard";
import { RiverInfo } from "@/app/gauges";
import { AwCard } from "./awCard";
import { SummitCard } from "./summitCard";

interface IProps {
  name: string;
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export const FlowCard: FC<IProps> = ({ name, gauge, toggleGauge }) => {
  return gauge.type === "usgs" ? (
    <UsgsCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  ) : gauge.type === "noaa" ? (
    <NoaaCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  ) : gauge.type === "eid" ? (
    <EidCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  ) : gauge.type === "aw" ? (
    <AwCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  ) : gauge.type === "summit" ? (
    <SummitCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  ) : (
    <CdecCard key={name} gauge={gauge} toggleGauge={toggleGauge} />
  );
};
