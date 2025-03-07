import {
  Autocomplete,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon, Info as InfoIcon } from "@mui/icons-material";

import { normalizeString } from "../utils/stringUtils";

export default function SearchBar({ data, setSearchResults }) {
  function handleChange(value) {
    // Normalize and lowercase the search query
    const normalizedQuery = normalizeString(value);

    // Filter data by comparing normalized names with the normalized query
    const results = data.filter((item) => {
      const normalizedName = normalizeString(item.name);

      return normalizedName.includes(normalizedQuery);
    });

    setSearchResults(results);
  }

  return (
    <Autocomplete
      freeSolo
      size="small"
      onInputChange={(e, inputValue) => {
        if (inputValue.length === 0 || inputValue.length >= 2) {
          handleChange(inputValue);
        }
      }}
      options={data.map((item) => ({
        value: item.name,
        label: item.name,
      }))}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <Tooltip
              title="In Tree View expands nodes to the desired node, its siblings, and children. In Table View shows nodes whose names contain the search query."
              arrow
              placement="top"
              enterTouchDelay={0}
              onClick={(e) => e.stopPropagation()} // Prevents Autocomplete from closing
            >
              <span>
                Search nodes
                <InfoIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", paddingLeft: 0.2 }}
                />
              </span>
            </Tooltip>
          }
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      sx={{
        maxWidth: "25rem",
      }}
    />
  );
}
