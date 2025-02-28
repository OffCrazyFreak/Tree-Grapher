import React from "react";
import { TreeItem2 } from "@mui/x-tree-view";
import "@mui/lab";
import { Tooltip, Typography, Box, Link, IconButton } from "@mui/material";
import { Info as InfoIcon, Edit as EditIcon } from "@mui/icons-material";

export default function TreeItemNode({
  node,
  fontSize,
  depth = 0,
  selectedNode,
  handleEditNodeMid,
}) {
  let nodeItemComponent = (
    <Typography fontSize={fontSize} whiteSpace="nowrap">
      {node.name}
    </Typography>
  );

  if (node.link) {
    nodeItemComponent = (
      <Link
        href={node.link}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
      >
        {nodeItemComponent}
      </Link>
    );
  }

  if (node.description) {
    nodeItemComponent = (
      <Tooltip
        title={node.description}
        placement="top-start"
        arrow
        enterTouchDelay={0}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nodeItemComponent}
          <InfoIcon sx={{ marginLeft: 0.5, color: "#666", fontSize }} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <TreeItem2
      itemId={node.name}
      key={node.name}
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {nodeItemComponent}

          {/* {selectedNode === node.name && (
            // Show the icon only for the selected node
            <EditIcon
              aria-label={`Edit ${node.name}`}
              onClick={() => {
                handleEditNodeMid(node);
              }}
              sx={{
                color: (theme) => theme.palette.primary.main,
                fontSize,
              }}
            />
          )} */}
        </Box>
      }
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
          selectedNode={selectedNode}
          handleEditNodeMid={handleEditNodeMid}
        />
      ))}
    </TreeItem2>
  );
}
