import React, { useState, useEffect, useMemo } from "react";
import { TreeView } from "@mui/lab";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import TreeItemNode from "./TreeItemNode";
import { calculateMaxDepth, buildParentMap } from "../utils/treeUtils";

export default function ControlledTreeView({ treeData, searchResults }) {
  const [expanded, setExpanded] = useState([]);

  // Memoize the maximum depth and font size
  const maxDepth = useMemo(() => calculateMaxDepth(treeData), [treeData]);
  const fontSize = useMemo(
    () => `max(1rem, ${2 - maxDepth * 0.1}rem)`,
    [maxDepth]
  );

  // Build a parent map during initialization
  const parentMap = useMemo(() => buildParentMap(treeData), [treeData]);

  // Optimized findParentNode using parentMap
  const findParentNode = (node) => parentMap.get(node.name) || null;

  useEffect(() => {
    const expandedNodes = searchResults.map((node) => node.name);

    const parentNodes = searchResults.reduce((parents, node) => {
      let parentNode = findParentNode(node);
      while (parentNode) {
        parents.add(parentNode.name);
        parentNode = findParentNode(parentNode);
      }
      return parents;
    }, new Set());

    setExpanded([...expandedNodes, ...parentNodes]);
  }, [searchResults]);

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={(e, nodeIds) => setExpanded(nodeIds)}
      sx={{ overflowX: "auto" }}
    >
      {treeData.map((rootNode) => (
        <TreeItemNode key={rootNode.name} node={rootNode} fontSize={fontSize} />
      ))}
    </TreeView>
  );
}
