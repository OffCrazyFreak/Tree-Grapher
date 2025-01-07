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

import BackToTopBtn from "./components/BackToTopBtn";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NodeForm from "./components/NodeForm";
import ControlledTreeView from "./components/ControlledTreeView";
import TableView from "./components/TableView";
import DeleteAlert from "./components/DeleteAlert";

import SampleTreeData from "./TreeData_Sample.json";
import BESTZagrebTreeData from "./TreeData_BEST_Zagreb.json";

export default function App() {
  const [treeData, setTreeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [tabValue, setTabValue] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [node, setNode] = useState();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [selectedTreeNode, setSelectedTreeNode] = useState(null);

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
    } else {
      // Update state with the retrieved data
      setTreeData(BESTZagrebTreeData);
      setSearchResults(flattenTree(BESTZagrebTreeData));
    }
  }, []);

  return (
    <>
      <CssBaseline />

      <BackToTopBtn />

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

      <Header
        treeData={treeData}
        updateData={updateData}
        setOpenDeleteAlert={setOpenDeleteAlert}
      />

      <Box sx={{ flex: "1 0 auto", margin: "1.5vw" }}>
        <Box
          sx={{
            paddingBlock: 2,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap-reverse",
            gap: 2,

            position: "sticky",
            top: 0,
            zIndex: "100",
            backdropFilter: "blur(6px)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              flexBasis: "15rem",
            }}
          >
            <SearchBar
              data={flattenTree(treeData)}
              setSearchResults={setSearchResults}
            />
          </Box>

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
        </Box>

        <Box>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            centered
            sx={{
              "*": {
                minHeight: 0,
              },
            }}
          >
            <Tab
              icon={<AccountTreeIcon />}
              iconPosition="start"
              label="Tree View"
            />
            <Tab
              icon={<TableChartIcon />}
              iconPosition="start"
              label="Table View"
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
        </Box>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },

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
    </>
  );
}
