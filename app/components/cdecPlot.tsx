import { FC, useEffect, useState } from "react";
import { RiverInfo } from "../gauges";
import moment from "moment";
import { FlowPlot } from "./flowPlot";

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export interface CdecResult {
  stationId: string;
  durCode: string;
  SENSOR_NUM: number;
  sensorType: string;
  date: string;
  obsDate: string;
  value: number;
  dataFlag: string;
  units: string;
}

export const CdecPlot: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);

  useEffect(() => {
    fetch("https://foodnome.com/api/proxy/cdec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        station: gauge.number,
        start: moment().subtract(5, "days").format("YYYY-MM-DD"),
      }),
    })
      .then((res) => res.json())
      .then((d: CdecResult[]) => {
        const x: string[] = [];
        const y: number[] = [];
        console.log("AW Response:", d);

        d.forEach((item) => {
          if (item.value >= 0) {
            x.push(item.obsDate);
            y.push(item.value);
          }
        });

        setObservedX(x);
        setObservedY(y);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching AW data:", e);
        setIsLoading(false);
        setIsError(true);
      });
  }, [gauge?.number]);

  return (
    <FlowPlot
      gauge={gauge}
      observedX={observedX}
      observedY={observedY}
      toggleGauge={toggleGauge}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
