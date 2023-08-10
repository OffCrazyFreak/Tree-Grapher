import { useState } from "react";
import {
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
  AccountTree as AccountTreeIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import SearchBar from "./components/SearchBar";
// import TreeForm from "./components/TreeForm";
import NodeForm from "./components/NodeForm";
import TreeView from "./components/TreeView";
import TableComponent from "./components/TableComponent";

export default function App() {
  const [treeData, setTreeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [tabValue, setTabValue] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [node, setNode] = useState();

  const mqSub600 = useMediaQuery("(max-width: 600px)");

  function handleEdit(node) {
    setNode(node);
    setOpenFormModal(true);
  }

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
          setTreeData(importedData);
        } catch (error) {
          console.error("Error parsing imported data:", error);
        }
      };

      fileReader.readAsText(file);
    };

    fileInput.click();
  }

  return (
    <>
      <NodeForm
        node={node}
        openFormModal={openFormModal}
        setOpenFormModal={setOpenFormModal}
        treeData={treeData}
        setTreeData={setTreeData}
        setSearchResults={setSearchResults}
      />

      <Container
        sx={{
          paddingBlock: 2,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: mqSub600 ? "column" : "row",
          gap: 2,
        }}
      >
        <SearchBar
          fullWidth={mqSub600}
          data={treeData}
          setSearchResults={setSearchResults}
        />

        <ButtonGroup
          variant="contained"
          orientation={mqSub600 ? "vertical" : "horizontal"}
          sx={{ whiteSpace: "nowrap" }}
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
        </ButtonGroup>
      </Container>

      <Container>
        {/* <Typography variant="h4" gutterBottom>
          Tree Form
        </Typography>
        <TreeForm
          treeData={treeData}
          setTreeData={setTreeData}
          setSearchResults={setSearchResults}
        /> */}

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          // sx={{ width: "100%" }}
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
          {tabValue === 0 ? (
            <TreeView treeData={treeData} />
          ) : (
            tabValue === 1 && (
              <TableComponent
              // Pass necessary props to the TableComponent
              />
            )
          )}
        </Box>
      </Container>
    </>
  );
}
