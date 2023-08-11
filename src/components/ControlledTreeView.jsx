import { TreeView, TreeItem } from "@mui/lab";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

export default function ControlledTreeView({ treeData, searchResults }) {
  const [expanded, setExpanded] = useState([]);

  const handleToggleExpand = (e, nodeIds) => {
    setExpanded(nodeIds);
  };

  useEffect(() => {
    const expandedNodes = searchResults.map((node) => node.name);
    const parentNodes = searchResults.reduce((parents, node) => {
      let parentNode = findParentNode(treeData, node);
      while (parentNode) {
        parents.add(parentNode.name);
        parentNode = findParentNode(treeData, parentNode);
      }
      return parents;
    }, new Set());

    setExpanded([...expandedNodes, ...parentNodes]);
  }, [searchResults]);

  const findParentNode = (nodes, targetNode) => {
    for (const node of nodes) {
      if (node.children.some((child) => child.name === targetNode.name)) {
        return node;
      }
      const foundParent = findParentNode(node.children, targetNode);
      if (foundParent) {
        return foundParent;
      }
    }
    return null;
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
      {nodes.children.map((node) => renderTree(node))}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggleExpand}
      sx={{ overflowX: "auto" }}
    >
      {treeData.map((rootNode) => renderTree(rootNode))}
    </TreeView>
  );
}
