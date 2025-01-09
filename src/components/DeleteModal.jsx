import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";

export default function DeleteModal({
  openDeleteModal,
  setOpenDeleteModal,
  deleteFunction,
}) {
  function submit() {
    deleteFunction();

    setOpenDeleteModal(false);
  }

  return (
    <Backdrop open={openDeleteModal}>
      <Modal
        open={openDeleteModal}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        // close on Escape key
        onClose={() => {
          setOpenDeleteModal(false);
        }}
      >
        <Fade in={openDeleteModal}>
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
                  setOpenDeleteModal(false);
                }}
              >
                Cancel
              </Button>

              <Button variant="contained" onClick={submit}>
                Delete tree
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
