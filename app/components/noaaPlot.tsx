import { useState, useEffect, FC } from "react";
import moment from "moment";
import { RiverInfo } from "../gauges";
import { FlowPlot } from "./flowPlot";
interface NoaaData {
  validTime: string;
  primary: number;
  secondary: number;
}
interface NoaaPredictionObserved {
  data: NoaaData[];
}
export interface NoaaPrediction {
  observed: NoaaPredictionObserved;
  forecast: NoaaPredictionObserved;
}

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

export const NoaaPlot: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);
  const [forcastedX, setforcastedX] = useState<string[]>([]);
  const [forcastedY, setForcastedY] = useState<number[]>([]);

  useEffect(() => {
    fetch(`https://api.water.noaa.gov/nwps/v1/gauges/${gauge.number}/stageflow`)
      .then((res) => res.json())
      .then((d: NoaaPrediction) => {
        // We filter the observed data to only show the data that is within 5 days.
        const observedLocal = d.observed.data.filter((item) => {
          return moment(item.validTime).isAfter(moment().subtract(4, "days"));
        });
        setObservedX(
          observedLocal.map((item) =>
            moment(item.validTime).local().format("YYYY-MM-DD HH:mm:ss")
          )
        );
        setObservedY(observedLocal.map((item) => item.secondary * 1000));

        const validForcast = d.forecast.data.filter((item) =>
          moment(item.validTime).isAfter(moment())
        );

        // If the forcast is lower than the observed, we calculate the percentage difference, and allow to each one of the forcasted values.
        if (validForcast.length === 0) {
          setIsLoading(false);
          return;
        }
        const lastObservedY = observedLocal[observedLocal.length - 1].secondary;
        const correctionPerc =
          (lastObservedY - validForcast[0].secondary) /
            validForcast[0].secondary +
          1;
        setforcastedX(validForcast.map((item) => item.validTime));
        setForcastedY(
          validForcast.map((item) => item.secondary * 1000 * correctionPerc)
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [gauge.number]);

  return (
    <FlowPlot 
      gauge={gauge}
      observedX={observedX}
      observedY={observedY}
      forecastedX={forcastedX}
      forecastedY={forcastedY}
      toggleGauge={toggleGauge}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default NoaaPlot;
