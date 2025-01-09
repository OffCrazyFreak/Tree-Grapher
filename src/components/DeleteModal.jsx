import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";

import { useContext } from "react";

import DeleteModalContext from "../context/DeleteModalContext";

export default function DeleteModal() {
  const { deleteModal, setDeleteModal } = useContext(DeleteModalContext);

  function submit() {
    if (deleteModal.function) {
      deleteModal.function();
    }
    closeModal();
  }

  function closeModal() {
    setDeleteModal({
      ...deleteModal,
      open: false,
    });

    setTimeout(() => {
      setDeleteModal({
        open: false,
        modalActionTitle: null,
        modalText: null,
        function: null,
      });
    }, 500);
  }

  return (
    <Backdrop open={deleteModal.open}>
      <Modal
        open={deleteModal.open}
        closeAfterTransition
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        onClose={closeModal}
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
              <Button variant="outlined" onClick={closeModal}>
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
