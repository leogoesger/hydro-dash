import { FormControlLabel, Checkbox } from "@mui/material";
import { FC } from "react";

interface IProps {
  checked: boolean;
  toggleStyle: () => void;
}

export const LayerToggle: FC<IProps> = ({ checked, toggleStyle }) => {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(77, 77, 77, 0.6)",
        zIndex: 1000,
        padding: "0px 10px",
      }}
    >
      <FormControlLabel
        control={<Checkbox checked={checked} onClick={toggleStyle} />}
        label="Satellite"
      />
    </div>
  );
};
