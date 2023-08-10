import { useState } from "react";
import { Typography, Container, Button, Input } from "@mui/material";
import TreeForm from "./components/TreeForm";
import TreeView from "./components/TreeView";

export default function App() {
  const [treeData, setTreeData] = useState([]);

  const handleExport = () => {
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
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setTreeData(importedData);
        } catch (error) {
          console.error("Error parsing imported data:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tree Form
      </Typography>
      <TreeForm treeData={treeData} setTreeData={setTreeData} />

      <label>
        <Input
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
        <Button variant="contained" color="primary" component="span">
          Import Tree
        </Button>
      </label>

      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        disabled={treeData.length === 0} // Disable if treeData is empty
      >
        Export Tree
      </Button>

      <Typography variant="h4" gutterBottom>
        Tree View
      </Typography>
      <TreeView treeData={treeData} />
    </Container>
  );
}
