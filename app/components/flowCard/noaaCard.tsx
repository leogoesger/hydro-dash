import { useState, useEffect, FC } from "react";
import moment from "moment";
import { RiverInfo } from "../../gauges";
import { CardLayout } from "./cardLayout";

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

export const getGaugeInfo = async (gaugeNumber: string) => {
  const response = await fetch(
    `https://api.water.noaa.gov/nwps/v1/gauges/${gaugeNumber}/stageflow`
  );
  const data: NoaaPrediction = await response.json();

  // We filter the observed data to only show the data that is within 5 days.
  const observedLocal = data.observed.data.filter((item) => {
    return moment(item.validTime).isAfter(moment().subtract(4, "days"));
  });

  const observedX = observedLocal.map((item) =>
    moment(item.validTime).local().format("YYYY-MM-DD HH:mm:ss")
  );
  const observedY = observedLocal.map((item) => item.secondary * 1000);

  const validForcast = data.forecast.data.filter((item) =>
    moment(item.validTime).isAfter(moment())
  );

  // If the forcast is lower than the observed, we calculate the percentage difference, and allow to each one of the forcasted values.
  if (validForcast.length === 0) {
    return {
      observedX,
      observedY,
      forecastedX: [],
      forecastedY: [],
    };
  }

  const lastObservedY = observedLocal[observedLocal.length - 1].secondary;
  const correctionPerc =
    (lastObservedY - validForcast[0].secondary) / validForcast[0].secondary + 1;

  const forecastedX = validForcast.map((item) => item.validTime);
  const forecastedY = validForcast.map(
    (item) => item.secondary * 1000 * correctionPerc
  );

  return {
    observedX,
    observedY,
    forecastedX,
    forecastedY,
  };
};

export const NoaaCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);
  const [forecastedX, setForecastedX] = useState<string[]>([]);
  const [forecastedY, setForecastedY] = useState<number[]>([]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await getGaugeInfo(gauge.number);
      setObservedX(data.observedX);
      setObservedY(data.observedY);
      setForecastedX(data.forecastedX);
      setForecastedY(data.forecastedY);
      setIsLoading(false);
    } catch (e) {
      console.error("Error fetching NOAA data:", e);
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
        setForecastedX(data.forecastedX);
        setForecastedY(data.forecastedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching NOAA data:", e);
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchData();
  }, [gauge.number]);

  return (
    <CardLayout 
      gauge={gauge}
      observedX={observedX}
      observedY={observedY}
      forecastedX={forecastedX}
      forecastedY={forecastedY}
      toggleGauge={toggleGauge}
      refreshData={refreshData}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
