import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Typography,
  ButtonGroup,
  useMediaQuery,
} from "@mui/material";

import {
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  BurstModeTwoTone,
} from "@mui/icons-material/";

import { useState } from "react";

export default function Header({ treeData, updateData, setOpenDeleteAlert }) {
  const mqSub480 = useMediaQuery("(max-width: 960px)");

  const [anchorElUser, setAnchorElUser] = useState(null);

  function handleExport() {
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace(/[T]/g, "_")
      .slice(0, -5); // Remove milliseconds
    const fileName = `TreeData_${formattedDate}.json`;

    const dataToExport = JSON.stringify(treeData, null, 2);
    const blob = new Blob([dataToExport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];

      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          updateData(importedData);
        } catch (error) {
          alert("Error parsing imported data.");
        }
      };

      fileReader.readAsText(file);
    };

    fileInput.click();
  }

  const handleToggleUserMenu = (event) => {
    if (anchorElUser === null) {
      setAnchorElUser(event.currentTarget);
    } else {
      setAnchorElUser(null);
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="false">
        <Toolbar disableGutters>
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
                marginLeft: "2vw",
                fontStyle: "italic",
              }}
            >
              ~ A simple tree graph maker ~
            </Typography>
          </Box>

          {mqSub480 ? (
            <Box sx={{ flexGrow: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Tooltip title="Tree actions">
                  <MoreVertIcon
                    onClick={handleToggleUserMenu}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>

              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleToggleUserMenu}
              >
                <MenuItem
                  onClick={
                    (handleToggleUserMenu,
                    () => {
                      if (
                        treeData.length === 0 ||
                        window.confirm(
                          "Importing a tree will overwrite the current tree data. Are you sure you want to do that?"
                        )
                      ) {
                        handleImport();
                      }
                    })
                  }
                >
                  <Button variant="text" startIcon={<CloudUploadIcon />}>
                    Import tree
                  </Button>
                </MenuItem>

                <MenuItem
                  disabled={treeData.length === 0}
                  onClick={(handleToggleUserMenu, handleExport)}
                >
                  <Button variant="text" startIcon={<CloudDownloadIcon />}>
                    Export tree
                  </Button>
                </MenuItem>
                <MenuItem
                  disabled={treeData.length === 0}
                  onClick={
                    (handleToggleUserMenu,
                    () => {
                      setOpenDeleteAlert(true);
                    })
                  }
                >
                  <Button variant="text" startIcon={<DeleteIcon />}>
                    Delete tree
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 0,

                display: "flex",
                gap: "0.5rem",

                "& > *": {
                  color: "white",
                },

                "& :hover": {
                  borderColor: "white",
                },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => {
                  if (
                    treeData.length === 0 ||
                    window.confirm(
                      "Importing a tree will overwrite the current tree data. Are you sure you want to do that?"
                    )
                  ) {
                    handleImport();
                  }
                }}
              >
                Import tree
              </Button>

              <Button
                variant="outlined"
                disabled={treeData.length === 0}
                startIcon={<CloudDownloadIcon />}
                onClick={handleExport}
              >
                Export tree
              </Button>

              <Button
                variant="outlined"
                disabled={treeData.length === 0}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setOpenDeleteAlert(true);
                }}
              >
                Delete tree
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
