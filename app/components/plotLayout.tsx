import { useEffect, useState } from "react";
import { Settings } from "./settings";
import { RiverInfo, defaultGauges } from "../gauges";
import { Snackbar, Alert } from "@mui/material";
import { FlowCard } from "./flowCard";
import { version } from "../version";

export const PlotLayout = () => {
  const [gauges, setGauges] = useState<RiverInfo[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const storedGauges = localStorage.getItem("gauges");
    const storedVersion = localStorage.getItem("version");
    if (storedVersion !== version) {
      setGauges(defaultGauges);
      localStorage.setItem("gauges", JSON.stringify(defaultGauges));
    } else if (storedGauges) {
      setGauges(JSON.parse(storedGauges));
    } else {
      setGauges(defaultGauges);
      localStorage.setItem("gauges", JSON.stringify(defaultGauges));
    }
    localStorage.setItem("version", version);
  }, []);

  const toggleGauge = (gaugeName: string) => {
    console.log("Toggling gauge:", gaugeName);
    const newGauges = gauges.map((g) =>
      g.name === gaugeName
        ? { ...g, displayGauge: !g.displayGauge }
        : g
    );
    setGauges(newGauges);
    localStorage.setItem("gauges", JSON.stringify(newGauges));
  };

  const resetGauges = () => {
    setGauges(defaultGauges);
    localStorage.setItem("gauges", JSON.stringify(defaultGauges));
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
        <Settings
          toggleGauge={toggleGauge}
          gauges={gauges}
          resetGauges={resetGauges}
        />
        {gauges
          .filter((g) => g.displayGauge)
          .map((gauge) => (
            <FlowCard
              key={gauge.number}
              gauge={gauge}
              toggleGauge={() => {
                setSnackbarOpen(true);
                toggleGauge(gauge.name);
              }}
            />
          ))}
      </main>
    </>
  );
};

export const getEmoji = (
  observedValue: number,
  predictedValues: number[] | null,
  min: number,
  max: number,
) => {
  if (observedValue > max) {
    return "🤯";
  }
  if (observedValue > min && observedValue < max) {
    return "🟢";
  }
  if (predictedValues && predictedValues.length > 0) {
    predictedValues.forEach((value) => {
      if (value > min && value < max) {
        return "🟡";
      }
    });
  }
  return "🔴";
};

export const getFlowColor = (
  observedValue: number,
  min: number,
  max: number,
) => {
  if (observedValue > max) {
    return "#f5db17ff"; // yellow
  }
  if (observedValue > min && observedValue < max) {
    return "#17b522ff"; // green
  }
  return "#f51717ff"; // red
};
