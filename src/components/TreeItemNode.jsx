import React from "react";
import { TreeItem } from "@mui/lab";
import { Tooltip, Typography, Box, Link } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

export default function TreeItemNode({ node, fontSize, depth = 0 }) {
  let nodeNameComponent = (
    <Typography fontSize={fontSize} whiteSpace="nowrap">
      {node.name}
    </Typography>
  );

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

  if (node.description) {
    nodeNameComponent = (
      <Tooltip
        title={node.description}
        placement="top-start"
        arrow
        enterTouchDelay={0}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nodeNameComponent}
          <InfoIcon sx={{ marginLeft: 0.2, color: "#666", fontSize }} />
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
        paddingTop: depth === 0 && fontSize,
        "& .MuiTreeItem-content": {
          width: "min-content",
          borderRadius: "1000rem",
        },
      }}
    >
      {node.children?.map((childNode) => (
        <TreeItemNode
          key={childNode.name}
          node={childNode}
          fontSize={fontSize}
          depth={depth + 1}
        />
      ))}
    </TreeItem>
  );
}
