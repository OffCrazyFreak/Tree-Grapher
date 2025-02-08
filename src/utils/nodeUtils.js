// export function findNodeInTree(treeData, targetNode) {
//   for (const node of treeData) {
//     if (node.name === targetNode.name) {
//       return node;
//     }
//     const foundNode = findNodeInTree(node.children, targetNode.name);
//     if (foundNode) {
//       return foundNode;
//     }
//   }
//   return null;
// }

// Recursive function to delete the node and its children
export function deleteNodeRecursively(treeData, targetNodeName) {
  const result = treeData
    .map((node) =>
      node.name === targetNodeName
        ? null
        : {
            ...node,
            children: deleteNodeRecursively(node.children, targetNodeName),
          }
    )
    .filter(Boolean); // Remove null entries

  return result;
}
