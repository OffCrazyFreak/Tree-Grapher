import React from "react";

function TreeNode({ node, level }) {
  const paddingLeft = `${level * 10}px`; // Adjust the padding based on the level

  return (
    <div style={{ paddingLeft }}>
      {level > 0 && "├── "}{" "}
      {/* Display the appropriate prefix based on the level */}
      {node.name}
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.name} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ treeData }) {
  return (
    <div>
      {treeData.map((rootNode) => (
        <TreeNode key={rootNode.name} node={rootNode} level={0} />
      ))}
    </div>
  );
}
