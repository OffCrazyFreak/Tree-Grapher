import {
  useMediaQuery,
  Autocomplete,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon, Info as InfoIcon } from "@mui/icons-material";

import { useState } from "react";

export default function SearchBar({ data, setSearchResults }) {
  const mqSub720 = useMediaQuery("(max-width: 720px)");

  const [inputFocused, setInputFocused] = useState(false);

  function handleChange(value) {
    value = value.toLowerCase();

    const results = data.filter((item) => {
      return item.name.toLowerCase().includes(value);
    });

    setSearchResults(results);
  }

  return (
    <Autocomplete
      freeSolo
      size="small"
      onFocus={() => setInputFocused(true)}
      onBlur={() => setInputFocused(false)}
      onInputChange={(e, inputValue) => {
        handleChange(inputValue);
      }}
      options={data.map((item) => ({
        value: item.id,
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
              enterTouchDelay={0}
              onClick={(e) => e.stopPropagation()} // Prevents Autocomplete from closing
            >
              Search nodes
              <InfoIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", paddingLeft: 0.2 }}
              />
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
        width: mqSub720 ? "100%" : "50%",
        maxWidth: mqSub720 ? "none" : "25rem",
      }}
    />
  );
}
