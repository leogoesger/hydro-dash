import { FC, useEffect, useState } from "react";
import { RiverInfo } from "../../gauges";
import moment from "moment";
import { CardLayout } from "./cardLayout";

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

export const getGaugeInfo = async (gaugeNumber: string) => {
  const response = await fetch("https://foodnome.com/api/proxy/cdec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      station: gaugeNumber,
      start: moment().subtract(5, "days").format("YYYY-MM-DD"),
    }),
  });

  const data: CdecResult[] = await response.json();

  const x: string[] = [];
  const y: number[] = [];

  data.forEach((item) => {
    if (item.value >= 0) {
      x.push(item.obsDate);
      y.push(Math.trunc(item.value));
    }
  });

  console.log("CDEC data for station", gaugeNumber, { x, y });

  return {
    observedX: x,
    observedY: y,
  };
};

export const CdecCard: FC<IProps> = ({ gauge, toggleGauge }) => {
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
        console.error("Error fetching CDEC data:", e);
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
        console.error("Error fetching CDEC data:", e);
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
      refreshData={refreshData}
      toggleGauge={toggleGauge}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
