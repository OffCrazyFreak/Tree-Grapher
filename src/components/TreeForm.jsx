import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function TreeForm({ treeData, setTreeData, setSearchResults }) {
  const [formData, setFormData] = useState({
    parent: "",
    name: "",
    link: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    function sanitizeLink(link) {
      if (link && !/^https?:\/\//i.test(link)) {
        return `http://${link}`;
      }
      return link;
    }

    const newNode = {
      name: formData.name,
      link: formData.link ? sanitizeLink(formData.link) : null,
      description: formData.description !== "" ? formData.description : null,
      children: [],
    };

    // Recursive function to find and add child node
    const findAndAddChild = (nodes) => {
      return nodes.map((node) => {
        if (node.name === formData.parent) {
          return {
            ...node,
            children: [...node.children, newNode],
          };
        } else if (node.children.length > 0) {
          return {
            ...node,
            children: findAndAddChild(node.children),
          };
        }
        return node;
      });
    };

    let updatedTreeData;

    // If no parent is selected, create a new root node
    if (!formData.parent) {
      updatedTreeData = [...treeData, newNode];
    } else {
      // Add child node to the appropriate parent
      updatedTreeData = findAndAddChild(treeData);
    }

    // Update the tree data state
    setTreeData(updatedTreeData);
    setSearchResults(updatedTreeData);

    // Reset form fields after submission
    setFormData({
      parent: "",
      name: "",
      link: "",
      description: "",
    });
  };

  // Flatten the tree structure to get all node names
  const flattenTree = (nodes) => {
    let flattenedNodes = [];
    for (const node of nodes) {
      flattenedNodes.push(node);
      if (node.children.length > 0) {
        flattenedNodes = flattenedNodes.concat(flattenTree(node.children));
      }
    }
    return flattenedNodes;
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel>Parent</InputLabel>
        <Select
          name="parent"
          value={formData.parent}
          onChange={handleInputChange}
        >
          <MenuItem value="">Unknown</MenuItem>
          {/* Map through flattened tree to display node names */}
          {flattenTree(treeData).map((node, index) => (
            <MenuItem key={index} value={node.name}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        name="link"
        label="Link"
        value={formData.link}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleInputChange}
        multiline
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Add Node
      </Button>
    </form>
  );
}
