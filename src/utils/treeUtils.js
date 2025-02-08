// Returns a sorted list of node objects in format { parent, name, link, description }
export function flattenTree(nodes) {
  const nodesList = [];

  function traverseTree(nodes, parentName) {
    for (const currentNode of nodes) {
      const { name, link, description, children } = currentNode;
      nodesList.push({ parent: parentName, name, link, description });

      if (children && children.length > 0) {
        traverseTree(children, name);
      }
    }
  }

  traverseTree(nodes, "No parent (root node)");

  nodesList.sort((a, b) => a.name.localeCompare(b.name)); // Sort nodes by names

  return nodesList;
}

// Returns the maximum depth of the tree
export function calculateMaxDepth(nodes) {
  let maxDepth = 0;

  const calculateDepth = (node, depth = 0) => {
    if (!node.children || node.children.length === 0) {
      return depth;
    }
    return Math.max(
      ...node.children.map((child) => calculateDepth(child, depth + 1))
    );
  };

  nodes.forEach((node) => {
    const depth = calculateDepth(node);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  });

  return maxDepth;
}

// Returns a map of node names to their parent node in form { nodeName: parentNode }
export function buildParentMap(treeData) {
  const parentsMap = new Map();

  buildParentMapRecursively(treeData, parentsMap);

  return parentsMap;
}

function buildParentMapRecursively(nodes, parentsMap, parent = null) {
  nodes.forEach((node) => {
    parentsMap.set(node.name, parent);
    if (node.children && node.children.length > 0) {
      buildParentMapRecursively(node.children, parentsMap, node);
    }
  });
}
