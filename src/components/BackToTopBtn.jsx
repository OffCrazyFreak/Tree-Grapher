import { Box, Zoom, Fab, useScrollTrigger, Tooltip } from "@mui/material";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@mui/icons-material";

export default function App() {
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <Tooltip title="Scroll to top">
        <Fab
          size="small"
          onClick={(event) => {
            document.body.scrollIntoView();
          }}
          sx={{
            position: "fixed",
            bottom: 48,
            right: 16,

            backgroundColor: (theme) => theme.palette.primary.main,

            ":hover": {
              backgroundColor: (theme) => theme.palette.primary.light,
            },
          }}
        >
          <KeyboardArrowUpIcon
            sx={{ color: (theme) => theme.palette.primary.contrastText }}
          />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
