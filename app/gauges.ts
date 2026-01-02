import moment from "moment";
import { NoaaPrediction } from "./components/noaaPlot";
import { UsgsResponse } from "./components/usgsPlot";

export interface RiverInfo {
  number: string;
  name: string;
  description: string;
  min: number;
  max: number;
  awLink: string;
  weatherUrl?: string;
  type: string;
  display?: boolean;
}

// Readme:
// The way to get weather url is through `https://api.weather.gov/points/39.851,-120.902`, and it will return forecast url in the properties.forecast field.
export const defaultGauges: RiverInfo[] = [
  {
    number: "NFEC1",
    type: "noaa",
    name: "N. Feather - Rock Creek",
    description: "Length: 3.8 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/59,128/forecast"
  },
  {
    number: "NFEC1",
    type: "noaa",
    name: "N. Feather - Tobin",
    description: "Length: 1.3 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/59,128/forecast"
  },
  {
    number: "NFEC1",
    type: "noaa",
    name: "N. Feather - Lobin",
    description: "Length: 2.7 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/59,128/forecast"
  },
  {
    number: "TRRN2",
    type: "noaa",
    name: "Truckee - Reno",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",
    weatherUrl: "https://api.weather.gov/gridpoints/REV/38,106/forecast",
    display: true,
  },
  {
    number: "FARC1",
    type: "noaa",
    name: "Truckee - Farad",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",
    weatherUrl: "https://api.weather.gov/gridpoints/REV/38,106/forecast",
    display: true,
  },
  {
    number: "NFDC1",
    type: "noaa",
    name: "N. American - Chamberlain",
    description: "Length: 4.8 miles.",
    min: 300,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/139/main",
    weatherUrl: "https://api.weather.gov/gridpoints/STO/65,85/forecast",
    display: true,
  },
  {
    number: "cbac1",
    type: "noaa",
    name: "S. American - Chili Bar",
    description: "",
    min: 800,
    max: 20000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/148/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/60,73/forecast",
  },
  {
    number: "JNSC1",
    type: "noaa",
    name: "S. Yuba - E to P",
    description: "",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/3232/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/64,98/forecast",
  },
  {
    number: "GYRC1",
    type: "noaa",
    name: "N. Yuba - Goodyears Bar",
    description: "",
    min: 800,
    max: 5000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/340/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/75,107/forecast",
  },
  {
    number: "SEIC1",
    type: "noaa",
    name: "Klamath - Happy Camp",
    description: "",
    min: 700,
    max: 8000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/234/main",
    weatherUrl: "https://api.weather.gov/gridpoints/MFR/83,52/forecast",
    display: true,
  },
  {
    number: "FTSC1",
    type: "noaa",
    name: "Eel - Fort Seward",
    description: "",
    min: 500,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/183/main",
    weatherUrl: "https://api.weather.gov/gridpoints/EKA/74,78/forecast",
    display: true,
  },
  {
    number: "11355010",
    type: "usgs",
    name: "Pit 1",
    description: "",
    min: 600,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/6799/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/45,174/forecast"
  },
  {
    number: "SBRC1",
    type: "noaa",
    name: "Salmon - Butler",
    description: "Length: 4 miles.",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/11391/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/MFR/79,32/forecast"
  },
  {
    number: "SBRC1",
    type: "noaa",
    name: "Salmon - Nordheimer",
    description: "Length: 6.5 miles.",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/279/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/MFR/79,32/forecast",
  },
  {
    number: "11527000",
    name: "Trinity - Pigeon Point",
    description: "Length: 5.5 miles.",
    min: 500,
    max: 40000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/316/main",
    type: "usgs",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/EKA/96,99/forecast"
  },
  {
    number: "loci1",
    type: "noaa",
    name: "Lochsa - Fish Creek",
    description: "Length: 12 miles.",
    min: 1200,
    max: 25000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/570/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/MSO/56,110/forecast",
  },
  {
    number: "13247500",
    type: "noaa",
    name: "Payette - Upper Main",
    description: "Length: 7 miles.",
    min: 800,
    max: 12000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/BOI/139,104/forecast",
  },
  {
    number: "13247500",
    type: "noaa",
    name: "S. Payette - Staircase",
    description:
      "<b>Gauge is for Upper Main Payette, not Staircase. Estimation can by done by subtracting the NF Payette at Banks from the Main Fork at Horseshoe Bend.</b> <br>Length: 5 miles.",
    min: 800,
    max: 12000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/BOI/139,104/forecast",
  },
  {
    number: "13246000",
    type: "noaa",
    name: "N. Payette - The North Fork",
    description: "Length: 16 miles.",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/592/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/BOI/139,104/forecast",
  },
  {
    number: "14123500",
    type: "noaa",
    name: "White Salmon",
    description: "Length: 4.5 miles.",
    min: 450,
    max: 2500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/592/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/PDT/46,124/forecast"
  },
  {
    number: "MER",
    type: "aw",
    name: "M. Feather - Devils Canyon",
    description: "Length: 33 miles.",
    min: 700,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/193/main",
    display: true,
    weatherUrl: "https://api.weather.gov/gridpoints/STO/72,121/forecast"
  },
];

export const fetchLatestReading = async (gauge: RiverInfo) => {
  const now = moment();
  if (gauge.type === "usgs") {
    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gauge.number}&siteStatus=all&period=PT2H`
    );
    const data = await response.json() as UsgsResponse;
    const filtered = data.value.timeSeries
      .filter(({ variable }) => variable.unit.unitCode === "ft3/s")

    if (filtered.length === 0 || !filtered[0]?.values || filtered[0].values.length === 0) {
      return ":( unknown";
    }
    const d = filtered[0]?.values[0]?.value[0]
    const hrsSince = moment.duration(now.diff(d.dateTime)).asHours();
    if (hrsSince > 6) {
      return ":( stale data";
    }
    return (d?.value + " cfs" || "0 cfs");
  }
  const response = await fetch(`https://api.water.noaa.gov/nwps/v1/gauges/${gauge.number}/stageflow`)
  const data = await response.json() as NoaaPrediction;
  if (!data.observed || !data.observed.data || data.observed.data.length === 0) {
    return ":( unknown";
  }
  const d = data.observed?.data[data.observed.data.length - 1]
  const hrsSince = moment.duration(now.diff(d.validTime)).asHours();
  if (hrsSince > 6) {
    return ":( stale data";
  }

  return (d?.secondary * 1000).toString() + " cfs";
}