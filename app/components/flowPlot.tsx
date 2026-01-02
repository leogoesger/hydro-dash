import { ExpandMore, VisibilityOff } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import { FC } from "react";
import dynamic from "next/dynamic";
import { Data } from "plotly.js";
import { CurrentFlow } from "./currentFlow";
import { WeatherButton } from "./weather";
import { RiverInfo } from "../gauges";
import { getEmoji } from "./plotLayout";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface IProps {
  gauge: RiverInfo;
  observedX: string[];
  observedY: number[];
  forecastedX?: string[];
  forecastedY?: number[];
  toggleGauge?: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

export const FlowPlot: FC<IProps> = ({
  gauge,
  observedX,
  observedY,
  forecastedX,
  forecastedY,
  toggleGauge,
  isLoading = false,
  isError = false,
}) => {
  const data: Data[] = [
    {
      x: observedX,
      y: observedY,
      type: "scatter",
      hoverinfo: "x+y",
      mode: "lines",
      marker: { color: "rgba(54, 73, 245, 0.7)" },
    },
  ];

  if (forecastedX && forecastedX.length > 0 && forecastedY && forecastedY.length > 0) {
    data.push({
      x: forecastedX,
      y: forecastedY,
      hoverinfo: "x+y",
      type: "scatter",
      mode: "lines",
      marker: { color: "rgba(221, 54, 245, 0.7)" },
    });
    data.push({
      x: [observedX[observedX.length - 1], observedX[observedX.length - 1]],
      y: [0, Math.max(...forecastedY)],
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
    });
  }
  return (
    <Accordion
      defaultExpanded={window.innerWidth > 900 || toggleGauge == null}
      style={{ margin: 0 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div>
          {isLoading
            ? "❓"
            : getEmoji(
                observedY[observedY.length - 1],
                forecastedY || null,
                gauge.min,
                gauge.max
              )}{" "}
          {isError
            ? "Cannot load gauge"
            : isLoading
            ? "Loading ..."
            : gauge.name}
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ position: "relative" }}>
        <Plot
          data={data}
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
              tickformat: "%m/%d",
              hoverformat: "%m/%d %H:%M",
            },
          }}
        />
        {observedY && observedY.length > 0 && (
          <CurrentFlow value={observedY[observedY.length - 1]} gauge={gauge} />
        )}
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

          <div>
            <WeatherButton riverData={gauge} />
            <Button onClick={() => window.open(gauge.awLink, "_blank")}>
              <b>AW</b>
            </Button>
          </div>
        </div>
      </AccordionActions>
    </Accordion>
  );
};
