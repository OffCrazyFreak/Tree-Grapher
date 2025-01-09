import { AppBar, Box, Toolbar, Container, Typography } from "@mui/material";

import HeaderActions from "./HeaderActions";

export default function Header({ treeData, updateData }) {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="false">
          <Toolbar disableGutters sx={{ gap: "1rem" }}>
            <Box
              sx={{
                flexGrow: 1,

                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5">Tree Grapher</Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  display: { xs: "none", sm: "block" },

                  marginLeft: "1rem",

                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                }}
              >
                ~ A simple tree graph maker ~
              </Typography>
            </Box>

            <HeaderActions treeData={treeData} updateData={updateData} />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
