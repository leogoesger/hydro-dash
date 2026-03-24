import { FC, useEffect, useState } from "react";
import { RiverInfo } from "../../gauges";
import { CardLayout } from "./cardLayout";

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export interface EidResult {
  dateTime: string;
  level: string;
  levelValue: number;
  levelUnit: string;
  flow: string;
  flowValue: number;
  flowUnit: string;
}

export const EidCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);

  useEffect(() => {
    fetch(`https://foodnome.com/api/proxy/eid?projectid=1&id=${gauge.number}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((d: EidResult[]) => {
        const x: string[] = [];
        const y: number[] = [];

        d.forEach((item) => {
          if (item.flowValue >= 0) {
            x.push(item.dateTime);
            y.push(item.flowValue);
          }
        });

        setObservedX(x.reverse());
        setObservedY(y.reverse());
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching EID data:", e);
        setIsLoading(false);
        setIsError(true);
      });
  }, [gauge?.number]);

  return (
    <CardLayout
      gauge={gauge}
      observedX={observedX}
      observedY={observedY}
      toggleGauge={toggleGauge}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
