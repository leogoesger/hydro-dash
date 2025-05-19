import { useState, useEffect, FC } from "react";
import Plot from "react-plotly.js";
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
  toggleGauge: () => void;
}

export const UsgsPlot: FC<IProps> = ({ gauge, toggleGauge }) => {
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
  }, [gauge.number]);

  return (
    <>
      <Accordion
        defaultExpanded={window.innerWidth > 900}
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
                [],
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
            ]}
            config={{ displayModeBar: false }}
            layout={{
              font: { color: "grey" },
              paper_bgcolor: "#283439",
              plot_bgcolor: "#283439",
              yaxis: { gridcolor: "grey", position: 0 },
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
            <Button onClick={toggleGauge} color="secondary">
              <VisibilityOff />
            </Button>

            <Button onClick={() => window.open(gauge.awLink, "_blank")}>
              <b>AW</b>
            </Button>
          </div>
        </AccordionActions>
      </Accordion>
    </>
  );
};

export default UsgsPlot;
