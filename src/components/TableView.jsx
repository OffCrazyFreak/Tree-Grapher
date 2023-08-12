import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Link,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { useEffect, useState } from "react";

const tableColumns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "parent",
    label: "Parent",
    smHide: true,
    xsHide: true,
  },
  {
    key: "description",
    label: "Description",
    xsHide: true,
    showTooltip: true,
  },
];

export default function TableView({
  searchResults,
  setSearchResults,
  handleEdit,
  handleDelete,
}) {
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  function handleSort(column) {
    if (column.key === sortBy) {
      // if same column selected, reverse
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      setSearchResults([...searchResults].reverse());
    } else {
      // if different column selected, sort desc
      setSortDirection("desc");
      setSortBy(column.key);

      sortTable(column);
    }
  }

  function sortTable(column) {
    setSearchResults(
      searchResults.sort((a, b) => {
        if (a[column.key] === null) {
          return 1;
        } else if (b[column.key] === null) {
          return -1;
        } else {
          return a[column.key]
            .toString()
            .localeCompare(b[column.key].toString());
        }
      })
    );
  }

  function getFormatedCellValue(column, result) {
    const cellValue = <Typography>{result[column.key]}</Typography>;

    if (column.key === "name" && result.link) {
      return (
        <Link
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
        >
          {cellValue}
        </Link>
      );
    } else if (column.key === "description") {
      return (
        <Tooltip placement="bottom-start" title={cellValue}>
          {cellValue}
        </Tooltip>
      );
    } else {
      return cellValue;
    }
  }

  return (
    <Table
      stickyHeader
      size="small"
      sx={{
        paddingBottom: 2,
      }}
    >
      <TableHead>
        <TableRow>
          {tableColumns.map((column) => (
            <TableCell
              key={column.key}
              sx={{
                display: {
                  xs: column.xsHide ? "none" : "table-cell",
                  sm: column.smHide ? "none" : "table-cell",
                  md: "table-cell",
                },
                padding: 0.5,

                width: "min-content",

                whiteSpace: "nowrap",
              }}
            >
              {column.notSortable ? (
                column.label
              ) : (
                <TableSortLabel
                  active={sortBy === column.key}
                  direction={sortBy === column.key ? sortDirection : "desc"}
                  onClick={() => handleSort(column)}
                >
                  {column.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}

          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {searchResults.map((result) => (
          <TableRow key={result.name}>
            {tableColumns.map((column) => {
              return (
                <TableCell
                  key={column.key}
                  sx={{
                    display: {
                      xs: column.xsHide ? "none" : "table-cell",
                      sm: column.smHide ? "none" : "table-cell",
                      md: "table-cell",
                    },
                    padding: 0.5,

                    width: "min-content",

                    overflow: "hidden",
                    textOverflow: column.showTooltip ? "ellipsis" : "unset",
                    whiteSpace: column.showTooltip ? "nowrap" : "unset",
                    maxWidth: column.showTooltip ? "30ch" : "60ch", // required so the cell doesnt overflow
                  }}
                >
                  {getFormatedCellValue(column, result)}
                </TableCell>
              );
            })}

            <TableCell
              sx={{
                padding: 0.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,

                  padding: 0.5,
                }}
              >
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(result)}
                    sx={{
                      color: "white",
                      backgroundColor: "#1976d2",

                      borderRadius: 1,
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(result)}
                    sx={{
                      color: "white",
                      backgroundColor: "#1976d2",

                      borderRadius: 1,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
