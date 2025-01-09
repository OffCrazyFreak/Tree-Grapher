import {
  Box,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material/";

import { useState, useContext } from "react";

import DeleteModalContext from "../context/DeleteModalContext";

export default function HeaderActions({ treeData, updateData }) {
  const theme = useTheme();
  const mqSm = useMediaQuery(theme.breakpoints.down("md"));

  const { setDeleteModal } = useContext(DeleteModalContext);

  const deleteModalObject = {
    open: true,
    modalActionTitle: "Delete tree",
    modalText: "Are you sure you want to delete the whole tree?",
    function: handleDeleteTree,
  };

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleToggleUserMenu = (event) => {
    if (anchorElUser === null) {
      setAnchorElUser(event.currentTarget);
    } else {
      setAnchorElUser(null);
    }
  };

  function handleExportData() {
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

  function handleImportData() {
    if (
      treeData.length === 0 ||
      window.confirm(
        "Importing a tree will overwrite the current tree data. Are you sure you want to do that?"
      )
    ) {
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
  }

  function handleDeleteTree() {
    updateData([]);
  }

  return (
    <>
      {mqSm ? (
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
              onClick={() => {
                handleToggleUserMenu();
                handleImportData();
              }}
            >
              <Button variant="text" startIcon={<CloudUploadIcon />}>
                Import tree
              </Button>
            </MenuItem>

            <MenuItem
              disabled={treeData.length === 0}
              onClick={() => {
                handleToggleUserMenu();
                handleExportData();
              }}
            >
              <Button variant="text" startIcon={<CloudDownloadIcon />}>
                Export tree
              </Button>
            </MenuItem>
            <MenuItem
              disabled={treeData.length === 0}
              onClick={() => {
                handleToggleUserMenu();
                setDeleteModal(deleteModalObject);
              }}
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
                handleImportData();
              }
            }}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,

              ":hover": {
                border: 1,
                borderColor: (theme) => theme.palette.primary.contrastText,
              },
            }}
          >
            Import tree
          </Button>

          <Button
            variant="outlined"
            disabled={treeData.length === 0}
            startIcon={<CloudDownloadIcon />}
            onClick={handleExportData}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,

              ":hover": {
                border: 1,
                borderColor: (theme) => theme.palette.primary.contrastText,
              },
            }}
          >
            Export tree
          </Button>

          <Button
            variant="outlined"
            disabled={treeData.length === 0}
            startIcon={<DeleteIcon />}
            onClick={() => {
              setDeleteModal(deleteModalObject);
            }}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,

              ":hover": {
                border: 1,
                borderColor: (theme) => theme.palette.primary.contrastText,
              },
            }}
          >
            Delete tree
          </Button>
        </Box>
      )}
    </>
  );
}
