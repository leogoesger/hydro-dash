/* eslint-disable @typescript-eslint/no-require-imports */
"use client"; // 👈 use it here

import { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Snackbar, Alert } from "@mui/material";
import { GetGaugeMappedByName } from "./rivers";
import { fetchLatestReading, RiverInfo } from "../gauges";
import { LayerToggle } from "./layerToggle";
import { GaugeDrawer } from "./drawer";
import { getUniqueFeatures } from "./helpers";

const putinData = require("./putin.json");

mapboxgl.accessToken =
  "pk.eyJ1IjoibGVvZ29lc2dlciIsImEiOiJjamU3dDEwZDkwNmJ5MnhwaHM1MjlydG8xIn0.UcVFjCvl3PTPI8jiOnPbYA";

const MapPage = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [riverData, setRiverData] = useState<RiverInfo | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cfs, setCfs] = useState<string>("");
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
      map.addSource("lines", {
        type: "vector",
        url: "mapbox://leogoesger.azyr6eka",
      });
      map.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        "source-layer": "yak-lines-87swgb",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": ["get", "fill"],
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
          type: "vector",
          url: "mapbox://leogoesger.agewo3tk",
        });
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          "source-layer": "yak-points-0jmf4b",
          paint: {
            "text-color":
              map.getStyle()?.imports?.[0]?.data?.name === "Mapbox Standard"
                ? "black"
                : "white",
            "text-opacity": {
              stops: [
                [0, 0],
                [10, 0],
                [12, 1],
              ],
            },
          },
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

      map.addSource("pointsPutin", {
        type: "geojson",
        data: putinData,
        cluster: false,
        minzoom: 9,
      });
      map.addLayer({
        id: "putin",
        type: "circle",
        source: "pointsPutin",
        paint: {
          "circle-color": "#00cc00",
          "circle-radius": 6,
        },
      });
    });

    map.on("click", ["lines", "points"], (e) => {
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

    map.on("mouseenter", ["lines", "points"], () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", ["lines", "points"], () => {
      map.getCanvas().style.cursor = "grab";
    });

    map.on("zoomend", (e) => {
      if (e.target.getZoom() > 10) {
        const features = map.queryRenderedFeatures({
          layers: ["lines"],
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        style={{ width: "350px" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "65%" }}
        >
          {cfs}
        </Alert>
      </Snackbar>
      <GaugeDrawer
        riverData={riverData}
        clearRiverData={() => setRiverData(null)}
      />

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
