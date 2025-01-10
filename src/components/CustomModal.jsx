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

import ModalContext from "../context/ModalContext";

export default function CustomModal() {
  const { modalData, setModalData } = useContext(ModalContext);

  function submit() {
    if (modalData.function) {
      modalData.function();
    }

    closeModal();
  }

  function closeModal() {
    setModalData({
      ...modalData,
      open: false,
    });

    setTimeout(() => {
      setModalData({
        open: false,
        title: null,
        message: null,
        note: null,
        cancelAction: null,
        confirmAction: null,
        function: null,
      });
    }, 500);
  }

  return (
    <Backdrop open={modalData.open}>
      <Modal
        open={modalData.open}
        closeAfterTransition
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        onClose={closeModal}
      >
        <Fade in={modalData.open}>
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
              {modalData.title}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              textAlign="justify"
              sx={{
                minHeight: "3rem",
              }}
            >
              {modalData.message}
            </Typography>

            {modalData.note && (
              <Typography variant="body1" gutterBottom textAlign="justify">
                <Box component="span" fontWeight="bold">
                  NOTE:&nbsp;
                </Box>
                {modalData.note}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              {modalData.cancelAction && (
                <Button variant="outlined" onClick={closeModal}>
                  {modalData.cancelAction}
                </Button>
              )}

              <Button
                variant="contained"
                onClick={submit}
                sx={{
                  marginLeft: "auto",
                }}
              >
                {modalData.confirmAction}
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
