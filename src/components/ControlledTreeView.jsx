import { TreeView, TreeItem } from "@mui/lab";
import { Link, Tooltip, Typography, Box } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

export default function ControlledTreeView({
  treeData,
  searchResults,
  selectedTreeNode,
  setSelectedTreeNode,
}) {
  const [expanded, setExpanded] = useState([]);

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

  // Calculate the maximum depth of the treeData
  const calculateMaxDepth = (nodes) => {
    let maxDepth = 0;
    nodes.forEach((node) => {
      const depth = calculateDepth(node);
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    });
    return maxDepth;
  };

  // Recursive function to calculate the depth of a node
  const calculateDepth = (node, depth = 0) => {
    if (node.children.length === 0) {
      return depth;
    } else {
      return Math.max(
        ...node.children.map((childNode) =>
          calculateDepth(childNode, depth + 1)
        )
      );
    }
  };

  // Calculate the font size based on the maximum depth
  const fontSize = `max(1rem, ${2 - calculateMaxDepth(treeData) * 0.1}rem)`;

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

  const renderTree = (node, depth = 0) => {
    let nodeNameComponent = (
      <Typography fontSize={fontSize} whiteSpace="nowrap">
        {node.name}
      </Typography>
    );

    // Add link if exists
    if (node.link) {
      nodeNameComponent = (
        <Link
          href={node.link}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
        >
          {nodeNameComponent}
        </Link>
      );
    }

    // Add description if exists
    if (node.description) {
      nodeNameComponent = (
        <Tooltip
          title={node.description}
          placement="top-start"
          arrow
          enterTouchDelay={0}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {nodeNameComponent}
            <InfoIcon
              sx={{
                marginLeft: 0.2,
                color: "#666",
                fontSize: fontSize,
              }}
            />
          </Box>
        </Tooltip>
      );
    }

    return (
      <TreeItem
        key={node.name}
        nodeId={node.name}
        label={nodeNameComponent}
        sx={{
          paddingLeft: "1vw",
          paddingTop: depth === 0 && fontSize,
        }}
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
      onNodeSelect={(e, node) => {
        node === selectedTreeNode
          ? setSelectedTreeNode(null)
          : setSelectedTreeNode(node);
      }}
      selected={selectedTreeNode}
      sx={{ overflowX: "auto" }}
    >
      {treeData.map((rootNode) => renderTree(rootNode))}
    </TreeView>
  );
}
