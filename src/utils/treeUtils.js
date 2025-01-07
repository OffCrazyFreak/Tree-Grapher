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

export function buildParentMap(treeData) {
  const map = new Map();

  const buildMap = (nodes, parent = null) => {
    nodes.forEach((node) => {
      map.set(node.name, parent);
      if (node.children && node.children.length > 0) {
        buildMap(node.children, node);
      }
    });
  };

  buildMap(treeData);
  return map;
}
