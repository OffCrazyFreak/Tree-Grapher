import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

import { ModalProvider } from "./context/ModalContext";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "rgb(179, 68, 170)" },
    secondary: purple,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>
);
