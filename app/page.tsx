"use client"; // 👈 use it here
import Image from "next/image";
import { PlotLayout } from "./components/plotLayout";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div
        className="flex justify-center w-9/12 items-center"
        style={{ marginTop: "3rem" }}
      >
        <Image
          aria-hidden
          src="/claw.png"
          alt="Globe icon"
          width={150}
          height={150}
        />
        <Image
          aria-hidden
          src="/claw.png"
          alt="Globe icon"
          width={150}
          height={150}
          style={{
            transform: "scaleX(-1)",
          }}
        />
      </div>
      <PlotLayout />

      <footer className="row-start-3 flex flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/leo-qiu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          by leogesger
        </a>
      </footer>

      <Typography variant="subtitle2" style={{ color: "#535353" }}>
        Data from{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.awetstate.com/"
        >
          Wet State
        </a>
        ,{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.cacreeks.com/"
        >
          CA Creeking
        </a>{" "}
        &{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.americanwhitewater.org/"
        >
          AW
        </a>
      </Typography>
    </div>
  );
}
