import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";

export default function RateTooltip({ title }) {
  return (
    <Tooltip
      title={title}
      arrow
      placement="top"
      enterTouchDelay={0}
      leaveTouchDelay={2500}
    >
      <IconButton size="small" aria-label="Fee breakdown">
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
