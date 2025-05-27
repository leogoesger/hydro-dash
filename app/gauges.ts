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
  isUsgs?: boolean;
  display?: boolean;
}

export const defaultGauges: RiverInfo[] = [
  {
    number: "NFEC1",
    name: "N. Feather - Rock Creek",
    description: "Length: 3.8 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: true,
  },
  {
    number: "NFEC1",
    name: "N. Feather - Tobin",
    description: "Length: 1.3 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: false,
  },
  {
    number: "NFEC1",
    name: "N. Feather - Lobin",
    description: "Length: 2.7 miles.",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    display: false,
  },
  {
    number: "TRRN2",
    name: "Truckee - Reno",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",

    display: true,
  },
  {
    number: "FARC1",
    name: "Truckee - Farad",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",

    display: true,
  },
  {
    number: "NFDC1",
    name: "N. American - Chamberlain",
    description: "Length: 4.8 miles.",
    min: 300,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/139/main",

    display: true,
  },
  {
    number: "cbac1",
    name: "S. American - Chili Bar",
    description: "",
    min: 800,
    max: 20000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/148/main",
  },
  {
    number: "JNSC1",
    name: "S. Yuba - E to P",
    description: "",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/3232/main",
  },
  {
    number: "GYRC1",
    name: "N. Yuba - Goodyears Bar",
    description: "",
    min: 800,
    max: 5000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/340/main",
  },
  {
    number: "SEIC1",
    name: "Klamath - Happy Camp",
    description: "",
    min: 700,
    max: 8000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/234/main",

    display: true,
  },
  {
    number: "FTSC1",
    name: "Eel - Fort Seward",
    description: "",
    min: 500,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/183/main",

    display: true,
  },
  {
    number: "11355010",
    name: "Pit 1",
    description: "",
    min: 600,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/6799/main",

    isUsgs: true,
    display: true,
  },
  {
    number: "SBRC1",
    name: "Salmon - Butler",
    description: "Length: 4 miles.",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/11391/main",
    display: true,
  },
  {
    number: "SBRC1",
    name: "Salmon - Nordheimer",
    description: "Length: 6.5 miles.",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/279/main",
    display: false,
  },
  {
    number: "11527000",
    name: "Trinity - Pigeon Point",
    description: "Length: 5.5 miles.",
    min: 500,
    max: 40000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/316/main",

    isUsgs: true,
    display: true,
  },
  {
    number: "loci1",
    name: "Lochsa - Fish Creek to Split Creek",
    description: "Length: 12 miles.",
    min: 1200,
    max: 25000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/570/main",
    display: true,
  },
  {
    number: "13247500",
    name: "Payette - Upper Main",
    description: "Length: 7 miles.",
    min: 800,
    max: 12000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
    display: true,
  },
  {
    number: "13247500",
    name: "S. Payette - Staircase",
    description:
      "<b>Gauge is for Upper Main Payette, not Staircase. Estimation can by done by subtracting the NF Payette at Banks from the Main Fork at Horseshoe Bend.</b> <br>Length: 5 miles.",
    min: 800,
    max: 12000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/4360/main",
    display: false,
  },
  {
    number: "13246000",
    name: "N. Payette - The North Fork",
    description: "Length: 16 miles.",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/592/main",
    display: true,
  },
  {
    number: "14123500",
    name: "White Salmon",
    description: "Length: 4.5 miles.",
    min: 450,
    max: 2500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/592/main",
    display: true,
  },
];

export const fetchLatestReading = async (gauge: RiverInfo) => {
  const now = moment();
  if (gauge.isUsgs) {
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