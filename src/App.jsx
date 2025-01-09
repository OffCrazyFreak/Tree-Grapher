import { CssBaseline, Typography, Button, Tab, Tabs, Box } from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  AccountTree as AccountTreeIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";

import { useState, useEffect, useMemo } from "react";

import BackToTopBtn from "./components/BackToTopBtn";

import Header from "./components/Header";
import Footer from "./components/Footer";

import SearchBar from "./components/SearchBar";
import NodeForm from "./components/NodeForm";

import ControlledTreeView from "./components/ControlledTreeView";
import TableView from "./components/TableView";

import DeleteModal from "./components/DeleteModal";

import BESTZagrebTreeData from "./TreeData_BEST_Zagreb.json";

export default function App() {
  const [treeData, setTreeData] = useState([]);
  const flattenedTree = useMemo(() => flattenTree(treeData), [treeData]);

  const [tabValue, setTabValue] = useState(0);

  const [searchResults, setSearchResults] = useState([]);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [node, setNode] = useState();

  function handleEditNode(node) {
    setNode(node);
    setOpenFormModal(true);
  }

  function handleDeleteNode(node) {
    // Check if the node has children
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

    // Ask for confirmation
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this node?"
    );

    if (shouldDelete) {
      // Recursive function to delete the node
      const deleteNode = (nodes, targetName) => {
        return nodes
          .map((node) =>
            node.name === targetName
              ? null
              : { ...node, children: deleteNode(node.children, targetName) }
          )
          .filter(Boolean); // Remove null entries
      };

      const updatedTree = deleteNode(treeData, node.name);
      setTreeData(updatedTree);

      // Update search results
      const updatedFlattenedTree = flattenTree(updatedTree);
      setSearchResults(updatedFlattenedTree);
    }
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

    const updatedFlattenedTree = flattenTree(data);
    setSearchResults(updatedFlattenedTree);

    // Store data in localStorage
    if (data.length > 0) {
      localStorage.setItem("TreeGrapher_Data", JSON.stringify(data));
    } else {
      localStorage.removeItem("TreeGrapher_Data");
    }
  }

  useEffect(() => {
    // Retrieve data from localStorage
    const storedTreeData = localStorage.getItem("TreeGrapher_Data");

    // Parse the stored JSON string back to an object
    if (storedTreeData) {
      const parsedData = JSON.parse(storedTreeData);

      // Update state with the retrieved data
      updateData(parsedData);
    } else {
      // Update state with the retrieved data
      updateData(BESTZagrebTreeData);
    }
  }, []);

  return (
    <>
      <CssBaseline />

      <BackToTopBtn />

      <DeleteModal />

      <NodeForm
        node={node}
        openFormModal={openFormModal}
        setOpenFormModal={setOpenFormModal}
        treeData={treeData}
        flattenedTree={flattenedTree}
        updateData={updateData}
      />

      <Header treeData={treeData} updateData={updateData} />

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
              data={flattenedTree}
              setSearchResults={setSearchResults}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              // setSearchResults(flattenedTree);
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
          >
            <Tab
              icon={<AccountTreeIcon />}
              iconPosition="start"
              label="Tree View"
              sx={{
                minHeight: 0,
              }}
            />
            <Tab
              icon={<TableChartIcon />}
              iconPosition="start"
              label="Table View"
              sx={{
                minHeight: 0,
              }}
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
                  // deleteModalComponent={DeleteModalComponent}
                />
              )
            )}
          </Box>
        </Box>
      </Box>

      <Footer treeData={treeData} updateData={updateData} />
    </>
  );
}
