/* eslint-disable @typescript-eslint/no-require-imports */
"use client"; // 👈 use it here

import { useRef, useEffect, useState } from "react";
import mapboxgl, { GeoJSONFeature, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Drawer, Typography, Button, Snackbar, Alert } from "@mui/material";
import { GetGaugeMappedByName } from "./rivers";
import { fetchLatestReading, RiverInfo } from "../gauges";
import { UsgsPlot, NoaaPlot } from "../components/plotLayout";
import { LayerToggle } from "./layerToggle";

const getUniqueFeatures = (
  features: GeoJSONFeature[],
  comparatorProperty: string
) => {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    if (feature.properties === null) {
      continue;
    }
    const id = feature.properties[comparatorProperty];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
};

const lineDataV = require("./lines_V.json");
const lineDataIV = require("./lines_IV.json");
const lineDataIII = require("./lines_III.json");
const pointData = require("./points.json");

mapboxgl.accessToken =
  "pk.eyJ1IjoibGVvZ29lc2dlciIsImEiOiJjamU3dDEwZDkwNmJ5MnhwaHM1MjlydG8xIn0.UcVFjCvl3PTPI8jiOnPbYA";

const MapPage = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [riverData, setRiverData] = useState<RiverInfo | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cfs, setCfs] = useState<number | null>(null);
  const [style, setStyle] = useState("mapbox://styles/mapbox/standard");

  const toggleStyle = () => {
    const newStyle =
      style === "mapbox://styles/mapbox/standard"
        ? "mapbox://styles/mapbox/standard-satellite"
        : "mapbox://styles/mapbox/standard";
    setStyle(newStyle);
    if (mapRef.current) {
      mapRef.current.setStyle(newStyle);
    }
  };

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [-115.38, 46.27],
      style: "mapbox://styles/mapbox/standard",
      zoom: 5,
      maxZoom: 20,
      minZoom: 5,
    });
    const riverGauges = GetGaugeMappedByName();

    if (mapRef.current === null) {
      return;
    }
    const map = mapRef.current;
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

    map.on("style.load", () => {
      map.addSource("linesV", {
        type: "geojson",
        data: lineDataV,
      });
      map.addLayer({
        id: "linesV",
        type: "line",
        source: "linesV",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "red",
          "line-width": 5,
        },
      });

      map.addSource("linesIV", {
        type: "geojson",
        data: lineDataIV,
      });
      map.addLayer({
        id: "linesIV",
        type: "line",
        source: "linesIV",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 5,
        },
      });

      map.addSource("linesIII", {
        type: "geojson",
        data: lineDataIII,
      });
      map.addLayer({
        id: "linesIII",
        type: "line",
        source: "linesIII",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "blue",
          "line-width": 5,
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

    map.on("click", ["linesV", "linesIV", "linesIII", "points"], (e) => {
      if (e.features !== undefined) {
        const pointsFeatures = e.features.filter(
          (feature) => feature?.source === "points"
        );
        if (pointsFeatures.length > 0) {
          const coordinates =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pointsFeatures[0].geometry as any).coordinates.slice();
          const description = pointsFeatures[0].properties?.description;

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
        } else {
          const title = e.features[0].properties?.title as string;
          setRiverData(riverGauges.get(title) ?? null);
        }
      }
    });

    map.on("mouseenter", ["linesV", "linesIV", "linesIII", "points"], () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", ["linesV", "linesIV", "linesIII", "points"], () => {
      map.getCanvas().style.cursor = "grab";
    });

    map.on("zoomend", (e) => {
      if (e.target.getZoom() > 10) {
        const features = map.queryRenderedFeatures({
          layers: ["linesV", "linesIV", "linesIII"],
        });
        const uniqueFeatures = getUniqueFeatures(features, "name");
        if (uniqueFeatures.length == 1) {
          const title = uniqueFeatures[0].properties?.title as string;
          const gauge = riverGauges.get(title) as RiverInfo;
          fetchLatestReading(gauge).then((cfsData) => {
            setCfs(cfsData);
            setSnackbarOpen(true);
          });
        }
      }
    });
  }, []);

  return (
    <>
      <LayerToggle
        checked={style !== "mapbox://styles/mapbox/standard"}
        toggleStyle={toggleStyle}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={2000}
        style={{ width: "350px" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "65%" }}
        >
          {cfs} cfs
        </Alert>
      </Snackbar>
      <Drawer
        open={riverData !== null}
        onClose={() => setRiverData(null)}
        anchor="right"
      >
        <div style={{ padding: "1rem" }}>
          <Typography variant="h6">{riverData?.name}</Typography>
          <div
            dangerouslySetInnerHTML={{
              __html: riverData?.description as string,
            }}
            style={{ maxWidth: "300px" }}
          />

          <div style={{ marginTop: "1rem" }}>
            {riverData &&
              (riverData.isUsgs ? (
                <UsgsPlot key={riverData.number} gauge={riverData} />
              ) : (
                <NoaaPlot key={riverData.number} gauge={riverData} />
              ))}
          </div>
        </div>
        <Button
          onClick={() => setRiverData(null)}
          style={{
            marginTop: "1rem",
            zIndex: 100,
            width: "90%",
            margin: "0 auto",
          }}
        >
          Close
        </Button>
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
    </>
  );
};
export default MapPage;
