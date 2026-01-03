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

export const UsgsCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);

  useEffect(() => {
    fetch(
      `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gauge.number}&siteStatus=all&period=P7D`
    )
      .then((res) => res.json())
      .then((d: UsgsResponse) => {
        const x: string[] = [];
        const y: number[] = [];
        d.value.timeSeries
          .filter(({ variable }) => variable.unit.unitCode === "ft3/s")
          .forEach((item) => {
            item.values.forEach((valuesItem) => {
              valuesItem.value.forEach((valueItem) => {
                x.push(valueItem.dateTime);
                y.push(parseFloat(valueItem.value));
              });
            });
          });
        setObservedX(x);
        setObservedY(y);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [gauge?.number]);

  if (gauge == null) {
    return <div>Gauge not found</div>;
  }
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
