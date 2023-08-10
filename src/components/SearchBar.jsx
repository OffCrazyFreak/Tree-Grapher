import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({ fullWidth, data, setSearchResults }) {
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
          label="Search nodes"
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
      sx={
        fullWidth
          ? { width: "100%", maxWidth: "none" }
          : { width: "50%", maxWidth: "25rem" }
      }
    />
  );
}
