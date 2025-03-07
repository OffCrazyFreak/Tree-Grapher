import { CssBaseline, Typography, Button, Tab, Tabs, Box } from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  AccountTree as AccountTreeIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";

import { useState, useEffect, useMemo, useContext } from "react";

import ModalContext from "./context/ModalContext";

import BackToTopBtn from "./components/BackToTopBtn";

import Header from "./components/Header";
import Footer from "./components/Footer";

import SearchBar from "./components/SearchBar";
import NodeForm from "./components/NodeForm";

import ControlledTreeView from "./components/ControlledTreeView";
import TableView from "./components/TableView";

import DeleteModal from "./components/CustomModal";

import { flattenTree } from "./utils/treeUtils";
import { deleteNodeRecursively } from "./utils/nodeUtils";

export default function App() {
  const { setModalData } = useContext(ModalContext);

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
    // check if the node has children for modal note
    const targetNodeName = node.name;
    const nodeHasChildren = flattenedTree.some(
      (node) => node.parent === targetNodeName
    );

    setModalData({
      open: true,
      title: "Delete node",
      message: "Are you sure you want to delete " + targetNodeName + "?",
      note: nodeHasChildren
        ? "This node has children which will be deleted alongside this node (including any subchildren). This cannot be undone."
        : null,
      cancelActionText: "Cancel",
      confirmActionText: "Delete node",
      modalCondition: false,
      function: () => deleteNode(treeData, targetNodeName),
    });
  }

  function deleteNode(treeData, targetNodeName) {
    const updatedTree = deleteNodeRecursively(treeData, targetNodeName);
    setTreeData(updatedTree);

    // Update search results
    const updatedFlattenedTree = flattenTree(updatedTree);
    setSearchResults(updatedFlattenedTree);
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
      try {
        const parsedData = JSON.parse(storedTreeData);

        // Update state with the retrieved data
        updateData(parsedData);
      } catch (error) {
        setModalData({
          open: true,
          title: "Error",
          message: "Error parsing imported data from local storage.",
          note: null,
          cancelActionText: null,
          confirmActionText: "OK",
          modalCondition: false,
          function: null,
        });
      }
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
                handleEditNode={handleEditNode}
                handleDeleteNode={handleDeleteNode}
              />
            ) : (
              tabValue === 1 && (
                <TableView
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  handleEditNode={handleEditNode}
                  handleDeleteNode={handleDeleteNode}
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
