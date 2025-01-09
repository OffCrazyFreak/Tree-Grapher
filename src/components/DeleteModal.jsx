import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";

export default function DeleteModal({ deleteModal, setDeleteModal }) {
  function submit() {
    deleteModal.function();

    setDeleteModal({
      open: false,
      modalActionTitle: null,
      modalText: null,
      function: null,
    });
  }

  return (
    <Backdrop open={deleteModal.open}>
      <Modal
        open={deleteModal.open}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        // close on Escape key
        onClose={() => {
          setDeleteModal({
            open: false,
            modalActionTitle: null,
            modalText: null,
            function: null,
          });
        }}
      >
        <Fade in={deleteModal.open}>
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
              {deleteModal.modalActionTitle}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                minHeight: "5rem",
              }}
            >
              {deleteModal.modalText}
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
                  setDeleteModal(false);
                }}
              >
                Cancel
              </Button>

              <Button variant="contained" onClick={submit}>
                {deleteModal.modalActionTitle}
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
