import { useState, useEffect, FC } from "react";
import { RiverInfo } from "../../gauges";
import { CardLayout } from "./cardLayout";

export interface UsgsResponse {
  value: Value;
}

interface Value {
  timeSeries: TimeSery[];
}

interface TimeSery {
  variable: Variable;
  values: Value2[];
}

interface Variable {
  unit: Unit;
}

interface Unit {
  unitCode: string;
}

interface Value2 {
  value: Value3[];
}

interface Value3 {
  value: string;
  dateTime: string;
}

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export const getGaugeInfo = async (gaugeNumber: string) => {
  const response = await fetch(
    `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gaugeNumber}&siteStatus=all&period=P7D`,
  );
  const data: UsgsResponse = await response.json();

  const x: string[] = [];
  const y: number[] = [];

  data.value.timeSeries
    .filter(({ variable }) => variable.unit.unitCode === "ft3/s")
    .forEach((item) => {
      item.values.forEach((valuesItem) => {
        valuesItem.value.forEach((valueItem) => {
          x.push(valueItem.dateTime);
          y.push(parseFloat(valueItem.value));
        });
      });
    });

  return {
    observedX: x,
    observedY: y,
  };
};

export const UsgsCard: FC<IProps> = ({ gauge, toggleGauge }) => {
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
      console.error("Error fetching USGS data:", e);
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGaugeInfo(gauge.number);
        setObservedX(data.observedX);
        setObservedY(data.observedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching USGS data:", e);
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchData();
  }, [gauge?.number]);

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
