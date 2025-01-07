import { Box, Zoom, Fab, useScrollTrigger } from "@mui/material";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@mui/icons-material";

export default function App() {
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <Fab
        size="small"
        aria-label="scroll back to top"
        onClick={(event) => {
          document.body.scrollIntoView();
        }}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <KeyboardArrowUpIcon color="primary" />
      </Fab>
    </Zoom>
  );
}
