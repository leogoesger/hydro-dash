import {
  Alert,
  Button,
  Dialog,
  Snackbar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogActions,
} from "@mui/material";
import { FC, useState } from "react";
import { RiverInfo } from "../gauges";
import { WbSunny, HourglassTop, Close } from "@mui/icons-material";

interface IProps {
  riverData: RiverInfo;
}

export const WeatherButton: FC<IProps> = ({ riverData }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<Period[]>([]);

  const fetchWeatherData = (weatherURL: string) => {
    setIsLoading(true);
    getNoaaWeather(weatherURL)
      .then((d) => {
        setWeatherData(d);
        setOpen(true);
        setIsLoading(false);
      })
      .catch(() => {
        setWeatherData([]);
        setSnackbarOpen(true);
        setIsLoading(false);
      });
  };

  return (
    <>
      {riverData.weatherUrl && (
        <Button
          onClick={() => fetchWeatherData(riverData.weatherUrl as string)}
        >
          {isLoading ? <HourglassTop /> : <WbSunny />}
        </Button>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "65%" }}
        >
          Cannot fetch weather data
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Table style={{ marginTop: "2.5rem" }}>
          <TableBody>
            {weatherData.map((period, idx) => (
              <TableRow key={idx}>
                <TableCell>{period.name}</TableCell>
                <TableCell>{period.detailedForecast}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogActions
          style={{
            justifyContent: "space-between",
            position: "fixed",
            width: "100%",
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="primary"
          >
            <Close /> <b>Close</b>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export interface NoaaWeatherResponse {
  properties: Properties;
}

interface Properties {
  periods: Period[];
}

interface Period {
  name: string;
  detailedForecast: string;
  icon: string;
}

export const getNoaaWeather = async (url: string) => {
  const response = await fetch(url);
  const data = (await response.json()) as NoaaWeatherResponse;
  if (!data || !data.properties || !data.properties.periods) {
    throw new Error("Invalid NOAA weather data");
  }
  return data.properties.periods;
};
