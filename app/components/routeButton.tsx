"use client";
import { Map, Speed } from "@mui/icons-material";
import { Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export const RouteBotton = () => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Button
      variant="contained"
      startIcon={path === "/" ? <Map /> : <Speed />}
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "20px",
        zIndex: 1000,
      }}
      onClick={() => router.push(path === "/" ? "/map" : "/")} // Toggle between home and map
    >
      <b>{path === "/" ? "Map" : "Flow"}</b>
    </Button>
  );
};
