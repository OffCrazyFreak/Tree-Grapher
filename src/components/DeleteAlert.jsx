import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";

export default function DeleteAlert({
  openDeleteAlert,
  setOpenDeleteAlert,
  deleteFunction,
}) {
  return (
    <Backdrop open={openDeleteAlert}>
      <Modal
        open={openDeleteAlert}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            deleteFunction();
          }
        }}
        // close on Escape key
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
      >
        <Fade in={openDeleteAlert}>
          <FormControl
            sx={{
              position: "absolute",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",

              maxWidth: "95%",
              width: "40rem",

              maxHeight: "95%",

              borderRadius: "1.5rem",
              padding: "1rem",

              backgroundColor: "whitesmoke",
              boxShadow: "#666 2px 2px 8px",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              Delete tree
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                minHeight: "5rem",
              }}
            >
              Are you sure you want to delete the whole tree?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDeleteAlert(false);
                }}
              >
                Cancel
              </Button>

              <Button variant="contained" onClick={deleteFunction}>
                Delete tree
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
