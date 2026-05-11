import { useState, useEffect, FC } from "react";
import moment from "moment";
import { RiverInfo } from "../../gauges";
import { CardLayout } from "./cardLayout";

interface NoaaProxyData {
  dateTime: string;
  flow: number;
  trend: string;
}

interface IProps {
  gauge: RiverInfo;
  toggleGauge?: () => void;
}

const fetchNoaaProxyData = async (gaugeId: string): Promise<NoaaProxyData[]> => {
  const response = await fetch(
    `https://foodnome.com/api/proxy/noaa?id=${gaugeId}`
  );
  const data: NoaaProxyData[] = await response.json();
  return data;
};

export const getGaugeInfo = async () => {
  // Fetch data from both gauges (SUAC1 and FOCC1)
  const [suac1Data, focc1Data] = await Promise.all([
    fetchNoaaProxyData('SUAC1'),
    fetchNoaaProxyData('FOCC1')
  ]);

  // Calculate the difference (SUAC1 - FOCC1)
  const combinedData: { dateTime: string; flow: number }[] = [];
  
  // Create a map of FOCC1 data by datetime for quick lookup
  const focc1Map = new Map<string, number>();
  focc1Data.forEach(item => {
    focc1Map.set(item.dateTime, item.flow);
  });
  
  // Calculate difference for matching timestamps
  suac1Data.forEach(suac1Item => {
    const focc1Flow = focc1Map.get(suac1Item.dateTime);
    
    if (focc1Flow !== undefined) {
      const difference = suac1Item.flow - focc1Flow;
      const parsedDate = moment(suac1Item.dateTime);
      
      combinedData.push({
        dateTime: parsedDate.local().format("YYYY-MM-DD HH:mm:ss"),
        flow: difference
      });
    }
  });

  // Separate into observed (past) and forecasted (future)
  const now = moment();
  const observedData = combinedData.filter(item => 
    moment(item.dateTime).isBefore(now) && 
    moment(item.dateTime).isAfter(moment().subtract(4, "days"))
  );
  
  const forecastedData = combinedData.filter(item => 
    moment(item.dateTime).isAfter(now)
  );

  return {
    observedX: observedData.map(item => item.dateTime),
    observedY: observedData.map(item => item.flow),
    forecastedX: forecastedData.map(item => item.dateTime),
    forecastedY: forecastedData.map(item => item.flow),
  };
};

export const SummitCard: FC<IProps> = ({ gauge, toggleGauge }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [observedX, setObservedX] = useState<string[]>([]);
  const [observedY, setObservedY] = useState<number[]>([]);
  const [forecastedX, setForecastedX] = useState<string[]>([]);
  const [forecastedY, setForecastedY] = useState<number[]>([]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await getGaugeInfo();
      setObservedX(data.observedX);
      setObservedY(data.observedY);
      setForecastedX(data.forecastedX);
      setForecastedY(data.forecastedY);
      setIsLoading(false);
    } catch (e) {
      console.error("Error fetching Summit data:", e);
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGaugeInfo();
        setObservedX(data.observedX);
        setObservedY(data.observedY);
        setForecastedX(data.forecastedX);
        setForecastedY(data.forecastedY);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching Summit data:", e);
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
