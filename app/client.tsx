"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouteBotton } from "./components/routeButton";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#ffcc02",
    },
    mode: "dark",
  },
});

const versions = [
  { name: "v1.1", date: "2025-05-30", reset: false },
  { name: "v1.0", date: "2025-05-30", reset: true },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const storedVersion = localStorage.getItem("version");
    if (!storedVersion || storedVersion !== versions[0].name) {
      mapboxgl.clearStorage(); // Titleset has 12 hrs of browser cache.
      localStorage.setItem("version", versions[0].name);
      versions.forEach((v) => {
        if (v.name === storedVersion) {
          return;
        }
        if (v.reset && v.name !== storedVersion) {
          localStorage.removeItem("gauges");
          return;
        }
      });
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouteBotton />
      {children}
    </ThemeProvider>
  );
}
