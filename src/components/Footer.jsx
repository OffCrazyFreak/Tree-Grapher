import { Container, Typography, IconButton, Link, Box } from "@mui/material";

import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";

import SampleTreeData from "../TreeData_Sample.json";

export default function Footer({ treeData, updateData }) {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },

        textWrap: "balance",

        backgroundColor: (theme) => theme.palette.primary.main,

        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.125,
        }}
      >
        <IconButton
          href="https://github.com/OffCrazyFreak/Tree-Grapher"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          size="small"
        >
          <GitHubIcon />
        </IconButton>

        <IconButton
          href="https://www.linkedin.com/in/jakov-jakovac/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          size="small"
        >
          <LinkedInIcon />
        </IconButton>

        <IconButton
          href="https://www.instagram.com/jakov_jakovac/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          size="small"
        >
          <InstagramIcon />
        </IconButton>
      </Box>

      <Typography
        align="center"
        onClick={() => {
          if (
            treeData.length === 0 ||
            window.confirm(
              "Importing a tree will overwrite the current tree data. Are you sure you want to do that?"
            )
          ) {
            updateData(SampleTreeData);
          }
        }}
        sx={{ cursor: "pointer" }}
      >
        ~ Import sample tree graph ~
      </Typography>

      <Typography align="center">
        &copy;&nbsp;
        <Link
          href="https://github.com/OffCrazyFreak"
          sx={{
            color: (theme) => theme.palette.primary.contrastText,

            cursor: "pointer",

            ":hover": { color: "inherit" },
          }}
        >
          Jakov Jakovac
        </Link>
        &nbsp;{new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
