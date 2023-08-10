import { List, ListItem, ListItemText, Link, Tooltip } from "@mui/material";

export default function TreeView({ treeData }) {
  const renderTree = (nodes, level = 0) => (
    <List>
      {nodes.map((node, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={
              <Tooltip title={node.description}>
                {node.link ? (
                  <Link
                    href={node.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {node.name}
                  </Link>
                ) : (
                  node.name
                )}
              </Tooltip>
            }
          />
          {node.children.length > 0 && (
            <ul>{renderTree(node.children, level + 1)}</ul>
          )}
        </ListItem>
      ))}
    </List>
  );

  return <div>{renderTree(treeData)}</div>;
}
