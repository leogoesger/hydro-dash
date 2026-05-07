import { useState, useEffect, FC } from "react";
import { RiverInfo } from "../../gauges";
import { CardLayout } from "./cardLayout";

export interface AwResponse {
  value: string;
  dateTime: string;
  qualifier: string;
}

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export const getGaugeInfo = async (gaugeNumber: string, gaugeSource: string) => {
  const response = await fetch("https://foodnome.com/api/proxy/aw", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      gaugeSourceIdentifier: gaugeNumber,
      desiredMetric: "cfs",
      timePeriod: "week",
      gaugeSource: gaugeSource,
    }),
  });

  const data: AwResponse[] = await response.json();

  const x: string[] = [];
  const y: number[] = [];

  // API returns data in descending order (newest first), but we need ascending order (oldest first)
  data.forEach((item) => {
    // Convert UTC datetime to local time string (removing Z to make Plotly treat it as local time)
    const utcDate = new Date(item.dateTime);
    // Format as ISO string but remove the Z to indicate local time
    const localDateTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1);
    
    x.push(localDateTime);
    y.push(parseFloat(item.value));
  });

  // Reverse arrays so newest data is at the end
  x.reverse();
  y.reverse();

  return {
    observedX: x,
    observedY: y,
  };
};

export const AwCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await getGaugeInfo(gauge.number, gauge.gaugeSource ?? "CALCULATED");
      setObservedX(data.observedX);
      setObservedY(data.observedY);
      setIsLoading(false);
    } catch (e) {
      console.error("Error fetching AW data:", e);
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGaugeInfo(gauge.number, gauge.gaugeSource ?? "CALCULATED");
        setObservedX(data.observedX);
        setObservedY(data.observedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching AW data:", e);
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchData();
  }, [gauge?.number, gauge?.gaugeSource]);

  if (gauge == null) {
    return <div>Gauge not found</div>;
  }
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
