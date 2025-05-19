import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Settings } from "./settings";
import { RiverInfo, defaultGauges } from "../gauges";
import { Snackbar, Alert } from "@mui/material";

const NoaaPlot = dynamic(() => import("./noaaPlot"), {
  ssr: false,
});

const UsgsPlot = dynamic(() => import("./usgsPlot"), {
  ssr: false,
});

export const PlotLayout = () => {
  const [gauges, setGauges] = useState<RiverInfo[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const storedGauges = localStorage.getItem("gauges");
    if (storedGauges) {
      const storedGaugesJson = JSON.parse(storedGauges);
      if (storedGaugesJson.length != defaultGauges.length) {
        console.log("Resetting gauges");
        setGauges(defaultGauges);
        localStorage.setItem("gauges", JSON.stringify(defaultGauges));
      } else {
        console.log("Using stored gauges");
        setGauges(storedGaugesJson);
      }
    } else {
      console.log("No stored gauges");
      setGauges(defaultGauges);
      localStorage.setItem("gauges", JSON.stringify(defaultGauges));
    }
  }, []);

  const toggleGauge = (gaugeIdx: number) => {
    const newGauges = [...gauges];
    newGauges[gaugeIdx].display = !newGauges[gaugeIdx].display;
    setGauges(newGauges);
    localStorage.setItem("gauges", JSON.stringify(newGauges));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={2000}
        style={{ width: "350px" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "65%" }}
        >
          Toggle Gauge 👉
        </Alert>
      </Snackbar>
      <main
        className="flex flex-row gap-8 row-start-2 items-center flex-wrap justify-center"
        style={{ marginTop: "3rem" }}
      >
        <Settings toggleGauge={toggleGauge} gauges={gauges} />
        {gauges
          .filter((g) => g.display)
          .map((gauge, idx) =>
            gauge.isUsgs ? (
              <UsgsPlot
                key={gauge.number}
                gauge={gauge}
                toggleGauge={() => {
                  setSnackbarOpen(true);
                  toggleGauge(idx);
                }}
              />
            ) : (
              <NoaaPlot
                key={gauge.number}
                gauge={gauge}
                toggleGauge={() => {
                  setSnackbarOpen(true);
                  toggleGauge(idx);
                }}
              />
            )
          )}
      </main>
    </>
  );
};

export const getEmoji = (
  observedValue: number,
  predictedValues: number[],
  min: number,
  max: number
) => {
  if (observedValue > max) {
    return "🤯";
  }
  if (observedValue > min && observedValue < max) {
    return "🟢";
  }
  if (predictedValues.length > 0) {
    predictedValues.forEach((value) => {
      if (value > min && value < max) {
        return "🟡";
      }
    });
  }
  return "🔴";
};
