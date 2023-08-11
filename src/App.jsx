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
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AccountTree as AccountTreeIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

import SearchBar from "./components/SearchBar";
import NodeForm from "./components/NodeForm";
import ControlledTreeView from "./components/ControlledTreeView";
import TableView from "./components/TableView";

export default function App() {
  const mqSub480 = useMediaQuery("(max-width: 480px)");
  const mqSub720 = useMediaQuery("(max-width: 720px)");

  const [treeData, setTreeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [tabValue, setTabValue] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [node, setNode] = useState();

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
          console.error("Error parsing imported data:", error);
        }
      };

      fileReader.readAsText(file);
    };

    fileInput.click();
  }

  function handleEdit(node) {
    setNode(node);
    setOpenFormModal(true);
  }

  function handleDelete(node) {
    // Find the parent node that contains the node to be deleted
    const findParent = (parentNode, targetName) => {
      for (let i = 0; i < parentNode.children.length; i++) {
        if (parentNode.children[i].name === targetName) {
          if (parentNode.children[i].children.length > 0) {
            console.error("Cannot delete a node with children.");
          } else {
            parentNode.children.splice(i, 1);
          }
          return true;
        } else if (findParent(parentNode.children[i], targetName)) {
          return true;
        }
      }
      return false;
    };

    // Find and remove the node from treeData
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].name === node.name) {
        if (treeData[i].children.length > 0) {
          console.error("Cannot delete a node with children.");
        } else {
          treeData.splice(i, 1);
          setSearchResults(flattenTree(treeData));
        }
        return;
      } else if (findParent(treeData[i], node.name)) {
        setSearchResults(flattenTree(treeData));
        return;
      }
    }

    console.error("Node not found.");
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

    traverseTree(nodes, "Unknown");

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
      />

      <Container>
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
        <Typography
          variant="body2"
          align="center"
          gutterBottom={false}
          sx={{ paddingBlock: 0.5 }}
        >
          Remember to export your tree graph before deleting or exiting the
          application
        </Typography>
      </Container>

      <Container
        sx={{
          paddingBlock: 2,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: mqSub720 ? "column" : "row",
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
            onClick={handleImport}
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
            onClick={() => updateData([])}
          >
            Clear all
          </Button>
        </ButtonGroup>
      </Container>

      <Container>
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
        <Box>
          {searchResults.length === 0 ? (
            <Typography variant="h4" align="center" sx={{ marginBlock: 2 }}>
              No nodes to display
            </Typography>
          ) : tabValue === 0 ? (
            <ControlledTreeView
              treeData={treeData}
              searchResults={searchResults}
            />
          ) : (
            tabValue === 1 && (
              <TableView
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )
          )}
        </Box>
      </Container>
    </>
  );
}
