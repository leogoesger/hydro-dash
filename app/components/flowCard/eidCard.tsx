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

export const getGaugeInfo = async (gaugeNumber: string) => {
  const response = await fetch(
    `https://foodnome.com/api/proxy/eid?projectid=1&id=${gaugeNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  const data: EidResult[] = await response.json();
  
  const x: string[] = [];
  const y: number[] = [];

  data.forEach((item) => {
    if (item.flowValue >= 0) {
      x.push(item.dateTime);
      y.push(item.flowValue);
    }
  });

  return {
    observedX: x.reverse(),
    observedY: y.reverse(),
  };
};

export const EidCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);

  const refreshData = async () => {
    try {
        setIsLoading(true);
        const data = await getGaugeInfo(gauge.number);
        setObservedX(data.observedX);
        setObservedY(data.observedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching EID data:", e);
        setIsLoading(false);
        setIsError(true);
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGaugeInfo(gauge.number);
        setObservedX(data.observedX);
        setObservedY(data.observedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching EID data:", e);
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchData();
  }, [gauge?.number]);

  return (
    <CardLayout
      gauge={gauge}
      observedX={observedX}
      observedY={observedY}
      toggleGauge={toggleGauge}
      refreshData={refreshData}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
