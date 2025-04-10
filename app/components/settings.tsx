import { useState, FC } from "react";
import {
  Drawer,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { RiverInfo } from "./plotLayout";
import SettingsIcon from "@mui/icons-material/Settings";
import { yellow } from "@mui/material/colors";

interface IProps {
  gauges: RiverInfo[];
  setGauge: (gaugeIdx: number) => void;
}

export const Settings: FC<IProps> = ({ gauges, setGauge }) => {
  const [open, toggleDrawer] = useState(false);
  return (
    <>
      <Button
        onClick={() => toggleDrawer(true)}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 100,
        }}
      >
        <SettingsIcon sx={{ color: yellow[700] }} fontSize="large" />
      </Button>
      <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="right">
        <FormGroup style={{ padding: "2rem" }}>
          {gauges.map((g, idx) => {
            return (
              <FormControlLabel
                key={g.number}
                control={
                  <Switch checked={g.display} onChange={() => setGauge(idx)} />
                }
                label={g.name}
              />
            );
          })}
          <Button
            onClick={() => toggleDrawer(false)}
            style={{ marginTop: "1rem" }}
          >
            Close
          </Button>
        </FormGroup>
      </Drawer>
    </>
  );
};
