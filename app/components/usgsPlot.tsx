import { useState, useEffect, FC } from "react";
import Plot from "react-plotly.js";
import { getEmoji, RiverInfo } from "./plotLayout";
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

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
}

export const UsgsPlot: FC<IProps> = ({ gauge }) => {
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
        console.log(x, y);
        setObservedX(x);
        setObservedY(y);
      });
  }, [gauge.number]);

  return (
    <>
      <Accordion defaultExpanded style={{ margin: 0 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {getEmoji(observedY[observedY.length - 1], [], gauge.min, gauge.max)}{" "}
          {gauge.name}
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
              yaxis: { title: "Flow (cfs)", gridcolor: "grey" },
              showlegend: false,
              margin: { t: 25, r: 25, l: 65, b: 35 },
              width: 300,
              height: 250,
              xaxis: {
                tickformat: "%m-%d",
              },
            }}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={() => window.open(gauge.usgsLink, "_blank")}>
            USGS
          </Button>
          <Button onClick={() => window.open(gauge.awLink, "_blank")}>
            AW
          </Button>
        </AccordionActions>
      </Accordion>
    </>
  );
};

export default UsgsPlot;