import { Container, Typography, IconButton } from "@mui/material";

import { GitHub as GitHubIcon } from "@mui/icons-material";

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
      <IconButton
        href="https://github.com/OffCrazyFreak/Tree-Grapher"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        size="small"
      >
        <GitHubIcon />
      </IconButton>

      <Typography align="center">
        ~ Remember to export your tree graph ~
      </Typography>
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
        &copy; Jakov Jakovac {new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
