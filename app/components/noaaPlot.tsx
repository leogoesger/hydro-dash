import { useState, useEffect, FC } from "react";
import Plot from "react-plotly.js";
import moment from "moment";
import { getEmoji } from "./plotLayout";
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { ExpandMore, VisibilityOff } from "@mui/icons-material";
import { RiverInfo } from "../gauges";

interface NoaaData {
  validTime: string;
  primary: number;
  secondary: number;
}
interface NoaaPredictionObserved {
  data: [NoaaData];
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
    <>
      <Accordion
        defaultExpanded={window.innerWidth > 900 || toggleGauge == null}
        style={{ margin: 0 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {isLoading
            ? "❓"
            : getEmoji(
                observedY[observedY.length - 1],
                forcastedY,
                gauge.min,
                gauge.max
              )}{" "}
          {isError
            ? "Cannot load gauge"
            : isLoading
            ? "Loading ..."
            : gauge.name}
        </AccordionSummary>
        <AccordionDetails>
          <Plot
            data={[
              {
                x: observedX,
                y: observedY,
                type: "scatter",
                hoverinfo: "x+y",
                mode: "lines",
                marker: { color: "rgba(54, 73, 245, 0.7)" },
              },
              {
                x: forcastedX,
                y: forcastedY,
                hoverinfo: "x+y",
                type: "scatter",
                mode: "lines",
                marker: { color: "rgba(221, 54, 245, 0.7)" },
              },
              {
                x: [
                  observedX[observedX.length - 1],
                  observedX[observedX.length - 1],
                ],
                y: [0, Math.max(...forcastedY)],
                type: "scatter",
                mode: "lines",
                line: {
                  shape: "spline",
                  width: 4,
                },
                hoverinfo: "skip",
                marker: {
                  color: "rgba(113, 217, 140, 0.41)",
                },
              },
            ]}
            config={{ displayModeBar: false }}
            layout={{
              font: { color: "grey" },
              paper_bgcolor: "#283439",
              plot_bgcolor: "#283439",
              yaxis: { gridcolor: "grey" },
              showlegend: false,
              margin: { t: 25, r: 15, l: 40, b: 35 },
              width: 300,
              height: 250,
              xaxis: {
                tickformat: "%m-%d",
                hoverformat: "%m-%d %H:%M",
              },
            }}
          />
        </AccordionDetails>
        <AccordionActions>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {toggleGauge != null && (
              <Button onClick={toggleGauge} color="secondary">
                <VisibilityOff />
              </Button>
            )}

            <Button onClick={() => window.open(gauge.awLink, "_blank")}>
              <b>AW</b>
            </Button>
          </div>
        </AccordionActions>
      </Accordion>
    </>
  );
};

export default NoaaPlot;
