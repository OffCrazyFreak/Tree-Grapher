import { TreeView, TreeItem } from "@mui/lab";
import { Link, Tooltip } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

export default function ControlledTreeView({ treeData, searchResults }) {
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    // Create a list of node names that are included in search results
    const expandedNodes = searchResults.map((node) => node.name);

    // Create a set of parent node names for the nodes in search results
    const parentNodes = searchResults.reduce((parents, node) => {
      let parentNode = findParentNode(treeData, node);
      while (parentNode) {
        parents.add(parentNode.name);
        parentNode = findParentNode(treeData, parentNode);
      }
      return parents;
    }, new Set());

    // Set the expanded state to include both expandedNodes and parentNodes
    setExpanded([...expandedNodes, ...parentNodes]);
  }, [searchResults]);

  // Recursive function to find the parent node of a given targetNode
  const findParentNode = (nodes, targetNode) => {
    for (const node of nodes) {
      // Check if any child of the current node matches the targetNode
      if (node.children.some((child) => child.name === targetNode.name)) {
        return node; // Return the current node as the parent
      }

      // Recursively search for the parent node in the children of the current node
      const foundParent = findParentNode(node.children, targetNode);
      if (foundParent) {
        return foundParent; // Return the parent found in the children
      }
    }
    return null; // Return null if no parent node is found
  };

  const renderTree = (node, depth = 0) => {
    // Add link if exists
    const link = node.link ? (
      <Link
        href={node.link}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
      >
        {node.name}
      </Link>
    ) : (
      node.name
    );

    // Add tooltip if description exists
    const label = node.description ? (
      <Tooltip title={node.description} arrow enterTouchDelay={0}>
        {link}
        <InfoIcon
          fontSize="inherit"
          sx={{ verticalAlign: "middle", paddingLeft: 0.2, color: "#444" }}
        />
      </Tooltip>
    ) : (
      link
    );

    return (
      <TreeItem
        key={node.name}
        nodeId={node.name}
        label={label}
        sx={{ paddingLeft: depth + "vw" }}
      >
        {node.children.map((childNode) => renderTree(childNode, depth + 1))}
      </TreeItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={(e, nodeIds) => {
        setExpanded(nodeIds);
      }}
      multiSelect
      sx={{ overflowX: "auto" }}
    >
      {treeData.map((rootNode) => renderTree(rootNode))}
    </TreeView>
  );
}
