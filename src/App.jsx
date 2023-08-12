import {
  CssBaseline,
  useMediaQuery,
  Typography,
  Container,
  Button,
  Tab,
  Tabs,
  Box,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AccountTree as AccountTreeIcon,
  TableChart as TableChartIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

import SearchBar from "./components/SearchBar";
import NodeForm from "./components/NodeForm";
import ControlledTreeView from "./components/ControlledTreeView";
import TableView from "./components/TableView";
import DeleteAlert from "./components/DeleteAlert";

import SampleTreeData from "./TreeData_Sample.json";

export default function App() {
  const mqSub480 = useMediaQuery("(max-width: 480px)");

  const [treeData, setTreeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [tabValue, setTabValue] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [node, setNode] = useState();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [selectedTreeNode, setSelectedTreeNode] = useState(null);

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

  function handleEditNode(node) {
    setNode(node);
    setOpenFormModal(true);
  }

  function handleDeleteNode(node) {
    // Find the node with the given name in the treeData
    const findNode = (nodes, targetName) => {
      for (const node of nodes) {
        if (node.name === targetName) {
          return node;
        }
        const foundNode = findNode(node.children, targetName);
        if (foundNode) {
          return foundNode;
        }
      }
      return null;
    };

    const nodeToDelete = findNode(treeData, node.name);

    if (!nodeToDelete) {
      alert("Node not found.");
      return;
    }

    if (nodeToDelete.children.length > 0) {
      alert("Cannot delete a node with children.");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this node?"
    );

    if (shouldDelete) {
      // Delete the node from treeData
      const deleteNode = (nodes, targetName) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].name === targetName) {
            nodes.splice(i, 1);
            return true;
          }
          if (deleteNode(nodes[i].children, targetName)) {
            return true;
          }
        }
        return false;
      };

      deleteNode(treeData, node.name);
      setSearchResults(flattenTree(treeData));

      if (node.name === selectedTreeNode) {
        setSelectedTreeNode(null);
      }
    }
  }

  function handleDeleteTree() {
    setSelectedTreeNode(null);
    updateData([]);
  }

  // Returns a sorted list of node objects in format { parent, name, link, description }
  function flattenTree(nodes) {
    const nodesList = [];

    function traverseTree(nodes, parentName) {
      for (const currentNode of nodes) {
        const { name, link, description, children } = currentNode;
        nodesList.push({ parent: parentName, name, link, description });

        if (children && children.length > 0) {
          traverseTree(children, name);
        }
      }
    }

    traverseTree(nodes, "No parent (root node)");

    nodesList.sort((a, b) => a.name.localeCompare(b.name)); // Sort nodes by names

    return nodesList;
  }

  function updateData(data) {
    setTreeData(data);
    setSearchResults(flattenTree(data));

    // Store data in localStorage
    if (data.length > 0) {
      localStorage.setItem("treeData", JSON.stringify(data));
    } else {
      localStorage.removeItem("treeData");
    }
  }

  useEffect(() => {
    // Retrieve data from localStorage
    const storedTreeData = localStorage.getItem("treeData");

    // Parse the stored JSON string back to an object
    if (storedTreeData) {
      const parsedData = JSON.parse(storedTreeData);

      // Update state with the retrieved data
      setTreeData(parsedData);
      setSearchResults(flattenTree(parsedData));
    }
  }, []);

  return (
    <>
      <CssBaseline />

      <NodeForm
        node={node}
        openFormModal={openFormModal}
        setOpenFormModal={setOpenFormModal}
        treeData={treeData}
        searchResults={searchResults}
        updateData={updateData}
        selectedTreeNode={selectedTreeNode}
      />

      <DeleteAlert
        openDeleteAlert={openDeleteAlert}
        setOpenDeleteAlert={setOpenDeleteAlert}
        deleteFunction={handleDeleteTree}
      />

      <Box sx={{ flex: "1 0 auto" }}>
        <Container maxWidth={false}>
          <Typography variant="h2" align="center" sx={{ paddingBlock: 1 }}>
            Tree Grapher
          </Typography>
          <Typography
            variant="h5"
            align="center"
            gutterBottom={false}
            sx={{ paddingBlock: 0.5 }}
          >
            - A simple tree graph maker -
          </Typography>
        </Container>

        <Container
          maxWidth={false}
          sx={{
            paddingBlock: 2,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <SearchBar
            data={flattenTree(treeData)}
            setSearchResults={setSearchResults}
          />

          <ButtonGroup
            variant="contained"
            orientation={mqSub480 ? "vertical" : "horizontal"}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => {
                setSearchResults(flattenTree(treeData));
                setNode();
                setOpenFormModal(true);
              }}
            >
              Add node
            </Button>

            <Button
              variant="contained"
              color="primary"
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
              variant="contained"
              color="primary"
              disabled={treeData.length === 0}
              startIcon={<CloudDownloadIcon />}
              onClick={handleExport}
            >
              Export tree
            </Button>

            <Button
              variant="contained"
              color="primary"
              disabled={treeData.length === 0}
              startIcon={<DeleteIcon />}
              onClick={() => {
                setOpenDeleteAlert(true);
              }}
            >
              Delete tree
            </Button>
          </ButtonGroup>
        </Container>

        <Container maxWidth={false}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            centered
          >
            <Tab
              icon={<AccountTreeIcon />}
              label="Tree View"
              sx={{ width: "50%" }}
            />
            <Tab
              icon={<TableChartIcon />}
              label="Table View"
              sx={{ width: "50%" }}
            />
          </Tabs>
          <Box paddingBlock="1rem">
            {searchResults.length === 0 ? (
              <Typography variant="h4" align="center" sx={{ marginBlock: 2 }}>
                No nodes to display
              </Typography>
            ) : tabValue === 0 ? (
              <ControlledTreeView
                treeData={treeData}
                searchResults={searchResults}
                selectedTreeNode={selectedTreeNode}
                setSelectedTreeNode={setSelectedTreeNode}
              />
            ) : (
              tabValue === 1 && (
                <TableView
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  handleEdit={handleEditNode}
                  handleDelete={handleDeleteNode}
                />
              )
            )}
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

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

        <Typography>Remember to export your tree graph</Typography>
        <Typography
          sx={{ cursor: "pointer" }}
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
        >
          Import sample tree graph
        </Typography>

        <Typography>&copy; Jakov Jakovac {new Date().getFullYear()}</Typography>
      </Container>
    </>
  );
}
