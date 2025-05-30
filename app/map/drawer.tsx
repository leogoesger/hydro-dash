import { Drawer, Typography, Button } from "@mui/material";
import { UsgsPlot, NoaaPlot } from "../components/plotLayout";
import { FC } from "react";
import { RiverInfo } from "../gauges";

interface IProps {
  riverData: RiverInfo | null;
  clearRiverData: () => void;
}

export const GaugeDrawer: FC<IProps> = ({ riverData, clearRiverData }) => {
  return (
    <Drawer open={riverData !== null} onClose={clearRiverData} anchor="right">
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
        onClick={clearRiverData}
        variant="contained"
        style={{
          margin: "1rem auto",
          zIndex: 100,
          width: "200px",
        }}
      >
        Close
      </Button>
    </Drawer>
  );
};
