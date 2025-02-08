export function findNodeInTree(treeData, targetName) {
  for (const node of treeData) {
    if (node.name === targetName) {
      return node;
    }
    const foundNode = findNodeInTree(node.children, targetName);
    if (foundNode) {
      return foundNode;
    }
  }
  return null;
}

// Recursive function to delete the node and its children
export function deleteNodeRecursively(treeData, targetName) {
  const result = treeData
    .map((node) =>
      node.name === targetName
        ? null
        : {
            ...node,
            children: deleteNodeRecursively(node.children, targetName),
          }
    )
    .filter(Boolean); // Remove null entries

  return result;
}
