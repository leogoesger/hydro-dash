/* eslint-disable @typescript-eslint/no-require-imports */
"use client"; // 👈 use it here

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Drawer, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { rivers } from "./rivers";
import { RiverInfo } from "../gauges";
import { UsgsPlot, NoaaPlot } from "../components/plotLayout";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lineData = require("./lines.json");
const pointData = require("./points.json");

mapboxgl.accessToken =
  "pk.eyJ1IjoibGVvZ29lc2dlciIsImEiOiJjamU3dDEwZDkwNmJ5MnhwaHM1MjlydG8xIn0.UcVFjCvl3PTPI8jiOnPbYA";

const MapPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [riverData, setRiverData] = useState<RiverInfo | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [-115.38, 46.27],
      style: "mapbox://styles/mapbox/standard",
      zoom: 9,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    map.on("load", () => {
      map.addSource("lines", {
        type: "geojson",
        data: lineData,
      });
      map.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 4,
        },
      });

      map.loadImage("/claw.png", (error, image) => {
        if (error) throw error;

        if (image !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.addImage("claw", image as any);
        }

        map.addSource("points", {
          type: "geojson",
          data: pointData,
          cluster: true,
          clusterMaxZoom: 20, // Max zoom to cluster points on
          clusterRadius: 10,
        });
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "text-field": ["get", "title"],
            "text-justify": "auto",
            "text-variable-anchor": ["left"],
            "icon-image": "claw",
            "text-offset": [1, 0],
            "icon-size": 0.2,
          },
        });
      });
    });

    map.on("click", "points", (e) => {
      if (e.features !== undefined) {
        // Copy coordinates array.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const description = e.features[0].properties?.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        if (
          ["mercator", "equirectangular"].includes(map.getProjection().name)
        ) {
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
        }

        if (description !== undefined) {
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        }
      }
    });

    map.on("click", "lines", (e) => {
      if (e.features !== undefined) {
        const title = e.features[0].properties?.title as string;
        setRiverData(rivers[title]);
      }
    });

    map.on("mouseenter", "lines", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features !== undefined) {
        console.log(e.features[0]?.properties?.title);
      }
    });

    map.on("mouseenter", "points", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features !== undefined) {
        console.log(e.features[0]?.properties?.title);
      }
    });

    map.on("mouseleave", "lines", () => {
      map.getCanvas().style.cursor = "grab";
    });
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "grab";
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Drawer
        open={riverData !== null}
        onClose={() => setRiverData(null)}
        anchor="right"
      >
        <div style={{ padding: "1rem" }}>
          <Typography variant="h6">{riverData?.name}</Typography>
          {riverData &&
            (riverData.isUsgs ? (
              <UsgsPlot key={riverData.number} gauge={riverData} />
            ) : (
              <NoaaPlot key={riverData.number} gauge={riverData} />
            ))}
        </div>
      </Drawer>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
        }}
        ref={mapContainerRef}
      />
    </ThemeProvider>
  );
};
export default MapPage;
