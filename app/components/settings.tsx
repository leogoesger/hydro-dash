import { useState, FC } from "react";
import {
  Drawer,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { yellow } from "@mui/material/colors";
import { RiverInfo } from "../gauges";

interface IProps {
  gauges: RiverInfo[];
  toggleGauge: (gaugeNumber: string) => void;
  resetGauges: () => void;
}

export const Settings: FC<IProps> = ({ gauges, toggleGauge, resetGauges }) => {
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
        <FormGroup style={{ padding: "0.7rem" }}>
          {gauges.map((g) => {
            return (
              <FormControlLabel
                key={g.number}
                control={
                  <Switch
                    checked={g.displayGauge}
                    onChange={() => toggleGauge(g.name)}
                  />
                }
                label={g.name}
              />
            );
          })}
        </FormGroup>
        <Button
          onClick={resetGauges}
          style={{ margin: "0 auto", zIndex: 100, width: "200px" }}
        >
          Reset
        </Button>
        <Button
          onClick={() => toggleDrawer(false)}
          variant="contained"
          style={{ margin: "1rem auto", zIndex: 100, width: "200px" }}
        >
          Close
        </Button>
      </Drawer>
    </>
  );
};
