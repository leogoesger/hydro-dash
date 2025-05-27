"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouteBotton } from "./components/routeButton";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#ffcc02",
    },
    mode: "dark",
  },
});

export default function ThemeClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouteBotton />
      {children}
    </ThemeProvider>
  );
}
