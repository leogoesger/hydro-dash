import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Settings } from "./settings";

const NoaaPlot = dynamic(() => import("./noaaPlot"), {
  ssr: false,
});

const UsgsPlot = dynamic(() => import("./usgsPlot"), {
  ssr: false,
});

export interface RiverInfo {
  number: string;
  name: string;
  description: string;
  min: number;
  max: number;
  awLink: string;
  usgsLink: string;
  isUsgs?: boolean;
  display?: boolean;
}

export const defaultGauges: RiverInfo[] = [
  {
    number: "NFEC1",
    name: "N. Feather - Rock Creek",
    description: "",
    min: 400,
    max: 2000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/196/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11403200/#period=P1Y&showMedian=true",
    display: true,
  },
  {
    number: "TRRN2",
    name: "Truckee - Reno",
    description: "",
    min: 300,
    max: 6000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/322/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/10348000/#parameterCode=00065&period=P7D&showMedian=false",
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
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/10346000/#parameterCode=00060&period=P7D&showMedian=true",
    display: true,
  },
  {
    number: "NFDC1",
    name: "N. American - Chamberlain",
    description: "",
    min: 300,
    max: 10000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/139/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11427000/#parameterCode=00060&period=P7D&showMedian=true",
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
    usgsLink: "https://water.noaa.gov/gauges/cbac1",
    display: true,
  },
  {
    number: "JNSC1",
    name: "S. Yuba - E to P",
    description: "",
    min: 400,
    max: 3000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/3232/main",
    usgsLink: "https://waterdata.usgs.gov/ca/nwis/inventory/?site_no=11417500",
    display: true,
  },
  {
    number: "GYRC1",
    name: "N. Yuba - Goodyears Bar",
    description: "",
    min: 800,
    max: 5000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/340/main",
    usgsLink: "https://waterdata.usgs.gov/monitoring-location/11413000",
    display: true,
  },
  {
    number: "SEIC1",
    name: "Klamath - Happy Camp",
    description: "",
    min: 700,
    max: 8000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/234/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11520500/#parameterCode=00060&period=P7D&showMedian=true",
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
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11475000/#parameterCode=00065&period=P7D&showMedian=false",
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
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11355010/#parameterCode=00060&period=P7D&showMedian=false",
    isUsgs: true,
    display: true,
  },
  {
    number: "SBRC1",
    name: "Cal Salmon",
    description: "",
    min: 1200,
    max: 4500,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/11391/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11522500/#parameterCode=00065&period=P7D&showMedian=false",
    display: true,
  },
  {
    number: "11527000",
    name: "Trinity",
    description: "",
    min: 500,
    max: 40000,
    awLink:
      "https://www.americanwhitewater.org/content/River/view/river-detail/316/main",
    usgsLink:
      "https://waterdata.usgs.gov/monitoring-location/11527000/#parameterCode=00065&period=P7D&showMedian=false",
    isUsgs: true,
    display: true,
  },
];

export const PlotLayout = () => {
  const [gauges, setGauges] = useState<RiverInfo[]>([]);

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

  const setGauge = (gaugeIdx: number) => {
    const newGauges = [...gauges];
    newGauges[gaugeIdx].display = !newGauges[gaugeIdx].display;
    setGauges(newGauges);
    localStorage.setItem("gauges", JSON.stringify(newGauges));
  };

  return (
    <main
      className="flex flex-row gap-8 row-start-2 items-center flex-wrap justify-center"
      style={{ marginTop: "3rem" }}
    >
      <Settings setGauge={setGauge} gauges={gauges} />
      {gauges
        .filter((g) => g.display)
        .map((gauge) =>
          gauge.isUsgs ? (
            <UsgsPlot key={gauge.number} gauge={gauge} />
          ) : (
            <NoaaPlot key={gauge.number} gauge={gauge} />
          )
        )}
    </main>
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
